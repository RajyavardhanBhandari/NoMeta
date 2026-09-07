'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { UploadItem } from '../../types/upload';
import type { MetadataResult } from '../../types/metadata';
import { scanImage } from '../../lib/metadata/scanner';
import { cleanImage, verifyCleanedImage, type CleaningMode } from '../../lib/metadata/cleaner';
import { createLocalZip } from '../../lib/uploads/zip';
import { Button } from '../ui/Button';

export type BatchStage = 'queued' | 'scanning' | 'scanned' | 'cleaning' | 'verified' | 'error';
type BatchItem = UploadItem & { stage: BatchStage; result?: MetadataResult; cleanedBlob?: Blob; downloadUrl?: string; error?: string };

function outputName(name: string) { const dot = name.lastIndexOf('.'); return `cleaned-${dot > 0 ? name.slice(0, dot) : name}${dot > 0 ? name.slice(dot) : ''}`; }

async function recordSuccessfulCleaning(item: BatchItem, mode: CleaningMode) {
  const response = await fetch('/api/cleaning/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referenceId: item.id, mode, format: item.file.type, fileSize: item.file.size }) });
  let data: { error?: string } = {}; try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in before cleaning a photo. Your original file stays on this device.' : data.error || 'NoMeta could not confirm your cleaning allowance. Please try again.');
}

function triggerDownload(url: string, filename: string) { const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.rel = 'noopener'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); }

export function BatchExperience({ files, onReset }: { files: UploadItem[]; onReset?: () => void }) {
  const [items, setItems] = useState<BatchItem[]>(() => files.map(f => ({ ...f, stage: 'queued' })));
  const [mode, setMode] = useState<CleaningMode>('standard');
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const urlsRef = useRef<string[]>([]);
  const startedRef = useRef(false);
  useEffect(() => () => { urlsRef.current.forEach(URL.revokeObjectURL); abortRef.current?.abort(); }, []);

  const update = (id: string, patch: Partial<BatchItem>) => setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  const scanned = items.filter(i => i.result).length;
  const completed = items.filter(i => i.stage === 'verified').length;
  const failed = items.filter(i => i.stage === 'error').length;
  const scanning = items.filter(i => i.stage === 'scanning').length;
  const cleaning = items.filter(i => i.stage === 'cleaning').length;
  const metadataCount = items.reduce((n, i) => n + (i.result?.entries.length ?? 0), 0);
  const cleaned = items.filter(i => i.cleanedBlob);
  const allScanned = items.length > 0 && items.every(i => ['scanned', 'cleaning', 'verified', 'error'].includes(i.stage));
  const readyToClean = items.filter(i => i.stage === 'scanned').length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;

  const runScan = async (retryOnly = false) => {
    if (busy) return;
    setBusy(true); abortRef.current = new AbortController();
    try {
      const targets = items.filter(i => retryOnly ? i.stage === 'error' : i.stage === 'queued');
      for (const item of targets) {
        if (abortRef.current.signal.aborted) break;
        update(item.id, { stage: 'scanning', error: undefined });
        try { update(item.id, { stage: 'scanned', result: await scanImage(item.file) }); }
        catch (e) { update(item.id, { stage: 'error', error: e instanceof Error ? e.message : 'Unable to scan this image.' }); }
      }
    } finally { setBusy(false); abortRef.current = null; }
  };

  useEffect(() => {
    if (startedRef.current || !items.length) return;
    startedRef.current = true; void runScan();
    // Initial files are fixed for this mounted workspace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runClean = async () => {
    if (busy || readyToClean === 0) return;
    setBusy(true); abortRef.current = new AbortController();
    try {
      for (const item of items.filter(i => i.stage === 'scanned')) {
        if (abortRef.current.signal.aborted) break;
        if (!item.result) continue;
        update(item.id, { stage: 'cleaning', error: undefined });
        try {
          const blob = await cleanImage(item.file, mode);
          const check = await verifyCleanedImage(blob);
          if (!check.verified) throw new Error(`${check.remainingMetadata} supported metadata item(s) remain after cleaning.`);
          await recordSuccessfulCleaning(item, mode);
          const url = URL.createObjectURL(blob); urlsRef.current.push(url);
          update(item.id, { stage: 'verified', cleanedBlob: blob, downloadUrl: url });
        } catch (e) { update(item.id, { stage: 'error', error: e instanceof Error ? e.message : 'Cleaning failed.' }); }
      }
    } finally { setBusy(false); abortRef.current = null; }
  };

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
    if (cleaning > 0) return `Cleaning ${cleaning} photo${cleaning === 1 ? '' : 's'}…`;
    if (scanning > 0) return `Scanning ${scanning} photo${scanning === 1 ? '' : 's'}…`;
    if (allScanned && readyToClean > 0) return `${readyToClean} photo${readyToClean === 1 ? '' : 's'} ready to clean`;
    if (failed > 0) return `${failed} photo${failed === 1 ? '' : 's'} need attention`;
    return 'Preparing your photos…';
  }, [items.length, completed, cleaning, scanning, allScanned, readyToClean, failed]);

  return <section className="nm-batch" aria-live="polite">
    <div className="nm-batch__header">
      <div><span className="nm-eyebrow">Private photo workspace</span><h2>{statusText}</h2><p>{items.length} photo{items.length === 1 ? '' : 's'} · Everything runs locally in this browser.</p></div>
      <div className="nm-batch__actions">
        {busy ? <Button variant="secondary" onClick={cancel}>Stop</Button> : null}
        {!busy && readyToClean > 0 ? <Button variant="primary" onClick={runClean}>Clean {readyToClean > 1 ? `${readyToClean} photos` : 'photo'}</Button> : null}
        {!busy && failed > 0 ? <Button variant="secondary" onClick={() => runScan(true)}>Retry failed</Button> : null}
        {!busy && completed > 0 ? <Button variant="secondary" onClick={downloadAll} disabled={zipBusy}>{zipBusy ? 'Preparing ZIP…' : completed > 1 ? 'Download all' : 'Download photo'}</Button> : null}
      </div>
    </div>

    <div className="nm-batch__progress" aria-label={`${progress}% complete`}><div className="nm-batch__progress-top"><span>{completed === items.length ? 'Complete' : busy ? 'Working securely on your device' : 'Workflow progress'}</span><strong>{progress}%</strong></div><div className="nm-batch__progress-track"><span style={{ width: `${Math.max(progress, scanning > 0 || cleaning > 0 ? 8 : 0)}%` }} /></div></div>
    <div className="nm-batch__summary"><span><strong>{items.length}</strong> selected</span><span><strong>{scanned}</strong> scanned</span><span><strong>{completed}</strong> ready</span><span><strong>{metadataCount}</strong> metadata found</span></div>

    <div className="nm-batch__mode"><span>Choose protection</span><div role="radiogroup" aria-label="Cleaning mode">
      <button type="button" onClick={() => setMode('standard')} className={mode === 'standard' ? 'is-selected' : ''} disabled={busy} aria-checked={mode === 'standard'} role="radio"><strong>Standard Clean</strong><small>Remove privacy-sensitive metadata without changing the image pixels.</small></button>
      <button type="button" onClick={() => setMode('maximum')} className={mode === 'maximum' ? 'is-selected' : ''} disabled={busy} aria-checked={mode === 'maximum'} role="radio"><strong>Maximum Privacy</strong><small>Use the most aggressive supported metadata removal in this version.</small></button>
    </div></div>

    <div className="nm-batch__list">{items.map((item, index) => <article className="nm-batch-item" key={item.id}>
      <img src={item.previewUrl} alt="" />
      <div className="nm-batch-item__body"><strong title={item.file.name}>{item.file.name}</strong><span>{formatBytes(item.file.size)} · {item.result ? `${item.result.entries.length} metadata item${item.result.entries.length === 1 ? '' : 's'} found` : 'Waiting to scan'}</span>{item.error ? <small className="nm-batch-item__error">{item.error}</small> : null}</div>
      <div className={`nm-batch-status nm-batch-status--${item.stage}`}><i aria-hidden="true" />{label(item.stage, index + 1, items.length)}</div>
      {item.downloadUrl ? <button type="button" className="nm-button nm-button--secondary nm-batch-download" onClick={() => downloadOne(item)}>Download</button> : null}
    </article>)}</div>

    {completed > 0 ? <div className="nm-batch__success"><div className="nm-batch__success-icon" aria-hidden="true">✓</div><div><strong>Your clean copy{completed > 1 ? 'ies are' : ' is'} ready.</strong><span>Download individual photos above or get everything as one ZIP. ZIP creation stays on your device.</span></div></div> : null}
    {onReset ? <button type="button" className="nm-text-button" onClick={() => { if (!busy) onReset(); }}>Choose different photos</button> : null}
    <p className="nm-batch__privacy">🔒 Your original photos are processed in your browser and are not uploaded or stored by NoMeta. Only account, usage and billing information is sent to the server.</p>
  </section>;
}

function label(stage: BatchStage, n: number, total: number) { if (stage === 'queued') return 'Queued'; if (stage === 'scanning') return `Scanning ${n}/${total}`; if (stage === 'scanned') return 'Scanned'; if (stage === 'cleaning') return 'Cleaning'; if (stage === 'verified') return '✓ Ready'; return 'Needs attention'; }
function formatBytes(bytes: number) { if (!bytes) return '0 B'; const units = ['B', 'KB', 'MB', 'GB']; const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`; }
