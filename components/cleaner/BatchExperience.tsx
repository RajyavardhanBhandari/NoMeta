'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { UploadItem } from '../../types/upload';
import type { MetadataResult } from '../../types/metadata';
import { scanImage } from '../../lib/metadata/scanner';
import { cleanImage, verifyCleanedImage, type CleaningMode } from '../../lib/metadata/cleaner';
import { createLocalZip } from '../../lib/uploads/zip';
import { Button } from '../ui/Button';

export type BatchStage = 'queued' | 'scanning' | 'scanned' | 'cleaning' | 'verified' | 'error';
export type BatchItem = UploadItem & { stage: BatchStage; result?: MetadataResult; cleanedBlob?: Blob; downloadUrl?: string; error?: string };

function outputName(name: string) {
  const dot = name.lastIndexOf('.');
  return `cleaned-${dot > 0 ? name.slice(0, dot) : name}${dot > 0 ? name.slice(dot) : ''}`;
}

async function recordSuccessfulCleaning(item: BatchItem, mode: CleaningMode) {
  const response = await fetch('/api/cleaning/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referenceId: item.id,
      mode,
      format: item.file.type,
      fileSize: item.file.size,
    }),
  });
  let data: { error?: string } = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.error || 'Unable to record this cleaning. Your image was not uploaded.');
}

export function BatchExperience({ files }: { files: UploadItem[] }) {
  const [items, setItems] = useState<BatchItem[]>(() => files.map(f => ({ ...f, stage: 'queued' })));
  const [mode, setMode] = useState<CleaningMode>('standard');
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => () => { urlsRef.current.forEach(URL.revokeObjectURL); abortRef.current?.abort(); }, []);

  const update = (id: string, patch: Partial<BatchItem>) => setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  const completed = items.filter(i => i.stage === 'verified').length;
  const failed = items.filter(i => i.stage === 'error').length;
  const metadataCount = items.reduce((n, i) => n + (i.result?.entries.length ?? 0), 0);
  const removedCount = metadataCount;
  const cleaned = items.filter(i => i.cleanedBlob);
  const allScanned = items.length > 0 && items.every(i => ['scanned','cleaning','verified'].includes(i.stage));

  const runScan = async (retryOnly = false) => {
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

  const runClean = async () => {
    setBusy(true); abortRef.current = new AbortController();
    try {
      const targets = items.filter(i => i.stage === 'scanned' || i.stage === 'error');
      for (const item of targets) {
        if (abortRef.current.signal.aborted) break;
        if (!item.result) continue;
        update(item.id, { stage: 'cleaning', error: undefined });
        try {
          const blob = await cleanImage(item.file, mode);
          const check = await verifyCleanedImage(blob);
          if (!check.verified) throw new Error(`${check.remainingMetadata} supported metadata item(s) remain after cleaning.`);
          await recordSuccessfulCleaning(item, mode);
          const url = URL.createObjectURL(blob);
          urlsRef.current.push(url);
          update(item.id, { stage: 'verified', cleanedBlob: blob, downloadUrl: url });
        } catch (e) { update(item.id, { stage: 'error', error: e instanceof Error ? e.message : 'Cleaning failed.' }); }
      }
    } finally { setBusy(false); abortRef.current = null; }
  };

  const cancel = () => { abortRef.current?.abort(); setBusy(false); };

  const downloadAll = async () => {
    if (!cleaned.length) return;
    setZipBusy(true);
    try {
      const zip = await createLocalZip(cleaned.map(i => ({ name: outputName(i.file.name), blob: i.cleanedBlob! })));
      const url = URL.createObjectURL(zip);
      const a = document.createElement('a'); a.href = url; a.download = `nometa-cleaned-${Date.now()}.zip`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally { setZipBusy(false); }
  };

  const summary = useMemo(() => {
    if (!items.length) return 'No images selected';
    if (completed === items.length) return `${completed} photos verified clean`;
    if (busy) return `Processing ${items.filter(i => ['scanning','cleaning'].includes(i.stage)).length} photo(s)…`;
    return `${completed} verified · ${failed} failed · ${items.length - completed - failed} pending`;
  }, [items, completed, failed, busy]);

  return <section className="nm-batch" aria-live="polite">
    <div className="nm-batch__header">
      <div><span className="nm-eyebrow">Batch workspace</span><h2>{summary}</h2><p>{items.length} image{items.length === 1 ? '' : 's'} · Processing stays in this browser.</p></div>
      <div className="nm-batch__actions">
        {busy ? <Button variant="secondary" onClick={cancel}>Cancel</Button> : null}
        {!busy && !allScanned ? <Button variant="primary" onClick={() => runScan()}>Scan pending</Button> : null}
        {!busy && allScanned && completed < items.length ? <Button variant="primary" onClick={runClean}>Clean & verify</Button> : null}
        {!busy && completed > 0 ? <Button variant="secondary" onClick={downloadAll} disabled={zipBusy}>{zipBusy ? 'Building ZIP…' : `Download ${completed} as ZIP`}</Button> : null}
      </div>
    </div>
    <div className="nm-batch__summary">
      <span><strong>{items.length}</strong> selected</span><span><strong>{items.filter(i => i.result).length}</strong> scanned</span><span><strong>{completed}</strong> verified</span><span><strong>{metadataCount}</strong> metadata found</span><span><strong>{removedCount}</strong> removable items</span>
    </div>
    <div className="nm-batch__mode">
      <span>Cleaning mode</span>
      <div role="radiogroup" aria-label="Cleaning mode">
        <button onClick={() => setMode('standard')} className={mode === 'standard' ? 'is-selected' : ''} disabled={busy}><strong>Standard</strong><small>Privacy-sensitive fields</small></button>
        <button onClick={() => setMode('maximum')} className={mode === 'maximum' ? 'is-selected' : ''} disabled={busy}><strong>Maximum Privacy</strong><small>More aggressive removal</small></button>
      </div>
    </div>
    <div className="nm-batch__list">
      {items.map((item, index) => <article className="nm-batch-item" key={item.id}>
        <img src={item.previewUrl} alt="" />
        <div className="nm-batch-item__body"><strong title={item.file.name}>{item.file.name}</strong><span>{formatBytes(item.file.size)} · {item.result ? `${item.result.entries.length} metadata item${item.result.entries.length === 1 ? '' : 's'}` : 'Waiting'}</span>{item.error ? <small className="nm-batch-item__error">{item.error}</small> : null}</div>
        <div className={`nm-batch-status nm-batch-status--${item.stage}`}><i aria-hidden="true" />{label(item.stage, index + 1, items.length)}</div>
        {item.downloadUrl ? <a className="nm-button nm-button--secondary nm-batch-download" href={item.downloadUrl} download={outputName(item.file.name)}>Download</a> : null}
      </article>)}
    </div>
    {failed > 0 && !busy ? <button className="nm-text-button" onClick={() => runScan(true)}>Retry failed scans</button> : null}
    <p className="nm-batch__privacy">🔒 Originals never leave your device. ZIP creation also happens locally. NoMeta does not upload the images for this workflow.</p>
  </section>;
}

function label(stage: BatchStage, n: number, total: number) {
  if (stage === 'queued') return 'Queued'; if (stage === 'scanning') return `Scanning ${n}/${total}`; if (stage === 'scanned') return 'Scanned'; if (stage === 'cleaning') return 'Cleaning'; if (stage === 'verified') return '✓ Verified'; return 'Needs attention';
}
function formatBytes(bytes: number) { if (!bytes) return '0 B'; const units = ['B','KB','MB','GB']; const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1); return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`; }
