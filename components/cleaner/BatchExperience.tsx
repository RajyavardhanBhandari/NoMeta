'use client';

import { useMemo, useRef, useState } from 'react';
import type { UploadItem } from '../../types/upload';
import type { MetadataResult } from '../../types/metadata';
import { scanImage } from '../../lib/metadata/scanner';
import { cleanImage, verifyCleanedImage, type CleaningMode } from '../../lib/metadata/cleaner';
import { createLocalZip } from '../../lib/uploads/zip';
import { validateImageFile, formatFileSize } from '../../lib/uploads/validate';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export type BatchStage = 'queued' | 'scanning' | 'scanned' | 'cleaning' | 'awaiting_entitlement' | 'verified' | 'error';
type BatchItem = UploadItem & { stage: BatchStage; result?: MetadataResult; cleanedBlob?: Blob; downloadUrl?: string; cleanedMode?: CleaningMode; error?: string };
const MAX_FILES = 25;

function outputName(name: string) { const dot = name.lastIndexOf('.'); return `cleaned-${dot > 0 ? name.slice(0, dot) : name}${dot > 0 ? name.slice(dot) : ''}`; }
function makeId() { return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

async function recordSuccessfulCleaning(item: BatchItem, mode: CleaningMode) {
  const response = await fetch('/api/cleaning/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referenceId: item.id, mode, format: item.file.type, fileSize: item.file.size }) });
  let data: { error?: string } = {}; try { data = await response.json(); } catch {}
  if (!response.ok) {
    if (response.status === 401) throw new Error('Sign in to unlock your download. Your cleaned image is still on this device.');
    throw new Error(data.error || 'NoMeta could not confirm your cleaning allowance. Please try again.');
  }
}

function triggerDownload(url: string, filename: string) { const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.rel = 'noopener'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); }
function stageProgress(stage: BatchStage) { if (stage === 'queued') return 0; if (stage === 'scanning') return 35; if (stage === 'scanned') return 55; if (stage === 'cleaning') return 78; if (stage === 'awaiting_entitlement') return 92; if (stage === 'verified') return 100; return 0; }

export function BatchExperience({ files, onReset }: { files: UploadItem[]; onReset?: () => void }) {
  const [items, setItems] = useState<BatchItem[]>(() => files.map(f => ({ ...f, stage: 'queued' })));
  const [mode, setMode] = useState<CleaningMode>('standard');
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [addError, setAddError] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>(files.map(f => f.previewUrl));

  const update = (id: string, patch: Partial<BatchItem>) => setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  const scanned = items.filter(i => i.result).length;
  const completed = items.filter(i => i.stage === 'verified').length;
  const failed = items.filter(i => i.stage === 'error').length;
  const awaiting = items.filter(i => i.stage === 'awaiting_entitlement').length;
  const scanning = items.filter(i => i.stage === 'scanning').length;
  const cleaning = items.filter(i => i.stage === 'cleaning').length;
  const metadataCount = items.reduce((n, i) => n + (i.result?.entries.length ?? 0), 0);
  const cleaned = items.filter(i => i.stage === 'verified' && i.cleanedBlob && i.downloadUrl);
  const queued = items.filter(i => i.stage === 'queued').length;
  const scannedReady = items.filter(i => i.stage === 'scanned').length;
  const progress = items.length ? Math.round(items.reduce((sum, item) => sum + stageProgress(item.stage), 0) / items.length) : 0;

  const addFiles = (incoming: FileList | File[]) => {
    const existingKeys = new Set(items.map(item => `${item.file.name}-${item.file.size}-${item.file.lastModified}`));
    const next = [...items];
    let rejected = '';
    for (const file of Array.from(incoming)) {
      const result = validateImageFile(file);
      if (!result.valid) { rejected = `${file.name}: ${result.error}`; continue; }
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (existingKeys.has(key)) continue;
      if (next.length >= MAX_FILES) { rejected = `You can add up to ${MAX_FILES} images at once.`; break; }
      const previewUrl = URL.createObjectURL(file);
      urlsRef.current.push(previewUrl);
      next.push({ id: makeId(), file, previewUrl, status: 'ready', stage: 'queued' });
      existingKeys.add(key);
    }
    setItems(next);
    setAddError(rejected);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeItem = (id: string) => {
    if (busy) return;
    const item = items.find(i => i.id === id);
    if (item) { URL.revokeObjectURL(item.previewUrl); if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl); }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const confirmEntitlement = async (item: BatchItem) => {
    const entitlementMode = item.cleanedMode || mode;
    try { await recordSuccessfulCleaning(item, entitlementMode); update(item.id, { stage: 'verified', error: undefined }); return true; }
    catch (e) { update(item.id, { stage: 'awaiting_entitlement', error: e instanceof Error ? e.message : 'Unable to confirm your cleaning allowance.' }); return false; }
  };

  const runWorkflow = async () => {
    if (busy || (!queued && !scannedReady)) return;
    setBusy(true); abortRef.current = new AbortController();
    try {
      const targets = items.filter(i => i.stage === 'queued' || i.stage === 'scanned');
      for (const original of targets) {
        if (abortRef.current.signal.aborted) break;
        let item = original;
        if (item.stage === 'queued') {
          update(item.id, { stage: 'scanning', error: undefined });
          try {
            const result = await scanImage(item.file);
            item = { ...item, stage: 'scanned', result, error: undefined };
            update(item.id, { stage: 'scanned', result, error: undefined });
          } catch (e) {
            update(item.id, { stage: 'error', error: e instanceof Error ? e.message : 'Unable to scan this image.' });
            continue;
          }
        }
        if (!item.result || abortRef.current.signal.aborted) continue;
        update(item.id, { stage: 'cleaning', error: undefined });
        try {
          const blob = await cleanImage(item.file, mode);
          const check = await verifyCleanedImage(blob);
          if (!check.verified) throw new Error(`${check.remainingMetadata} supported metadata item(s) remain after cleaning.`);
          const url = URL.createObjectURL(blob);
          urlsRef.current.push(url);
          const prepared: BatchItem = { ...item, stage: 'awaiting_entitlement', cleanedBlob: blob, downloadUrl: url, cleanedMode: mode, error: undefined };
          update(item.id, prepared);
          await confirmEntitlement(prepared);
        } catch (e) { update(item.id, { stage: 'error', error: e instanceof Error ? e.message : 'Cleaning failed.' }); }
      }
    } finally { setBusy(false); abortRef.current = null; }
  };

  const retryEntitlement = async (item: BatchItem) => { if (busy || !item.cleanedBlob || !item.downloadUrl) return; setBusy(true); try { await confirmEntitlement(item); } finally { setBusy(false); } };
  const retryFailed = () => { if (busy) return; setItems(prev => prev.map(item => item.stage === 'error' ? { ...item, stage: 'queued', error: undefined } : item)); window.setTimeout(() => void runWorkflow(), 0); };
  const cancel = () => { abortRef.current?.abort(); setBusy(false); };
  const downloadOne = (item: BatchItem) => { if (item.downloadUrl) triggerDownload(item.downloadUrl, outputName(item.file.name)); };
  const downloadAll = async () => {
    if (!cleaned.length || zipBusy) return;
    if (cleaned.length === 1) { downloadOne(cleaned[0]); return; }
    setZipBusy(true);
    try { const zip = await createLocalZip(cleaned.map(i => ({ name: outputName(i.file.name), blob: i.cleanedBlob! }))); const url = URL.createObjectURL(zip); triggerDownload(url, `nometa-cleaned-${new Date().toISOString().slice(0, 10)}.zip`); window.setTimeout(() => URL.revokeObjectURL(url), 1500); }
    catch { /* Individual downloads remain available if ZIP creation fails. */ }
    finally { setZipBusy(false); }
  };

  const statusText = useMemo(() => {
    if (!items.length) return 'No photos selected';
    if (completed === items.length) return `${completed} ${completed === 1 ? 'photo is' : 'photos are'} ready to download`;
    if (cleaning > 0) return `Cleaning ${cleaning} photo${cleaning === 1 ? '' : 's'}...`;
    if (awaiting > 0) return `Confirming ${awaiting} cleaned photo${awaiting === 1 ? '' : 's'}...`;
    if (scanning > 0) return `Scanning ${scanning} photo${scanning === 1 ? '' : 's'}...`;
    if (queued > 0 || scannedReady > 0) return `${queued + scannedReady} photo${queued + scannedReady === 1 ? '' : 's'} ready when you are`;
    if (failed > 0) return `${failed} photo${failed === 1 ? '' : 's'} need attention`;
    return 'Your private photo workspace';
  }, [items.length, completed, cleaning, awaiting, scanning, queued, scannedReady, failed]);

  return <section className="nm-batch" aria-live="polite">
    <input ref={inputRef} className="nm-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => e.target.files && addFiles(e.target.files)} />
    <div className="nm-batch__header">
      <div><span className="nm-eyebrow">Private photo workspace</span><h2>{statusText}</h2><p>{items.length} photo{items.length === 1 ? '' : 's'} · Nothing is uploaded during image processing.</p></div>
      <div className="nm-batch__actions">
        {!busy ? <Button variant="secondary" onClick={() => inputRef.current?.click()} icon="plus">Add photos</Button> : null}
        {busy ? <Button variant="secondary" onClick={cancel}>Stop</Button> : null}
        {!busy && (queued > 0 || scannedReady > 0) ? <Button variant="primary" onClick={runWorkflow}>{scannedReady > 0 && queued === 0 ? `Clean ${scannedReady > 1 ? `${scannedReady} photos` : 'photo'}` : `Scan & clean ${queued > 1 ? `${queued} photos` : 'photo'}`}</Button> : null}
        {!busy && failed > 0 ? <Button variant="secondary" onClick={retryFailed}>Retry failed</Button> : null}
        {!busy && completed > 0 ? <Button variant="primary" onClick={downloadAll} disabled={zipBusy}>{zipBusy ? 'Preparing download...' : completed > 1 ? 'Download all' : 'Download photo'}</Button> : null}
      </div>
    </div>

    <div className="nm-batch__progress" aria-label={`${progress}% complete`}>
      <div className="nm-batch__progress-top"><span>{progress === 100 ? 'Complete' : busy ? 'Working securely on your device' : 'Workflow progress'}</span><strong>{progress}%</strong></div>
      <div className="nm-batch__progress-track"><span style={{ width: `${progress}%` }} /></div>
      <small className="nm-batch__progress-help">{scanning > 0 ? 'Reading the photo and checking supported metadata' : cleaning > 0 ? 'Creating and verifying your clean copy' : completed > 0 ? 'Your clean copy has been verified' : progress === 0 ? 'Nothing starts until you press Scan & clean' : 'Almost there'}</small>
    </div>

    <div className="nm-batch__summary"><span><strong>{items.length}</strong> selected</span><span><strong>{scanned}</strong> scanned</span><span><strong>{completed}</strong> ready</span><span><strong>{metadataCount}</strong> metadata found</span></div>

    <div className="nm-batch__mode"><span>Choose protection</span><div role="radiogroup" aria-label="Cleaning mode">
      <button type="button" onClick={() => setMode('standard')} className={mode === 'standard' ? 'is-selected' : ''} disabled={busy} aria-checked={mode === 'standard'} role="radio"><strong>Standard Clean</strong><small>Remove privacy-sensitive metadata while keeping the image pixels intact.</small></button>
      <button type="button" onClick={() => setMode('maximum')} className={mode === 'maximum' ? 'is-selected' : ''} disabled={busy} aria-checked={mode === 'maximum'} role="radio"><strong>Maximum Privacy</strong><small>Use the most aggressive supported metadata removal in this version.</small></button>
    </div></div>

    {addError ? <div className="nm-batch__notice" role="alert"><Icon name="alert" /><span>{addError}</span></div> : null}
    <div className="nm-batch__list">{items.map((item, index) => <article className="nm-batch-item" key={item.id}>
      <img src={item.previewUrl} alt="" />
      <div className="nm-batch-item__body"><strong title={item.file.name}>{item.file.name}</strong><span>{formatFileSize(item.file.size)} · {item.result ? `${item.result.entries.length} metadata item${item.result.entries.length === 1 ? '' : 's'} found` : 'Waiting to scan'}</span>{item.error ? <small className="nm-batch-item__error">{item.error}</small> : null}</div>
      <div className={`nm-batch-status nm-batch-status--${item.stage}`}><i aria-hidden="true" />{label(item.stage, index + 1, items.length)}</div>
      {!busy && ['queued', 'error'].includes(item.stage) ? <button className="nm-file-card__remove nm-batch-item__remove" type="button" aria-label={`Remove ${item.file.name}`} onClick={() => removeItem(item.id)}>×</button> : null}
      {item.stage === 'awaiting_entitlement' ? <div className="nm-batch-item__actions"><button type="button" className="nm-button nm-button--secondary nm-batch-download" onClick={() => retryEntitlement(item)} disabled={busy}>Retry confirmation</button></div> : null}
      {item.stage === 'verified' && item.downloadUrl ? <div className="nm-batch-item__actions"><button type="button" className="nm-button nm-button--secondary nm-batch-download" onClick={() => downloadOne(item)}>Download</button></div> : null}
    </article>)}</div>

    {awaiting > 0 ? <div className="nm-batch__notice"><strong>Your clean copy is safe on this device.</strong><span>{items.find(i => i.stage === 'awaiting_entitlement')?.error || 'NoMeta is confirming your account allowance.'}</span></div> : null}
    {completed > 0 ? <div className="nm-batch__success"><div className="nm-batch__success-icon" aria-hidden="true">✓</div><div><strong>Your clean copy{completed > 1 ? 'ies are' : ' is'} ready.</strong><span>Download your verified clean photo{completed > 1 ? 's' : ''}. ZIP creation also stays on your device.</span></div><Button variant="primary" onClick={downloadAll} disabled={zipBusy}>{zipBusy ? 'Preparing download...' : completed > 1 ? 'Download all clean photos' : 'Download clean photo'}</Button></div> : null}
    {onReset ? <button type="button" className="nm-text-button" onClick={() => { if (!busy) onReset(); }}>Choose different photos</button> : null}
    <p className="nm-batch__privacy">🔒 Your original photos are processed in your browser and are not uploaded or stored by NoMeta. Only account, usage and billing information is sent to the server.</p>
  </section>;
}

function label(stage: BatchStage, n: number, total: number) { if (stage === 'queued') return 'Ready'; if (stage === 'scanning') return `Scanning ${n}/${total}`; if (stage === 'scanned') return 'Scanned'; if (stage === 'cleaning') return 'Cleaning'; if (stage === 'awaiting_entitlement') return 'Confirming'; if (stage === 'verified') return 'Ready'; return 'Needs attention'; }
