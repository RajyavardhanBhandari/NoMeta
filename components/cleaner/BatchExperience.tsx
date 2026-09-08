'use client';

import { useMemo, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import type { UploadItem } from '../../types/upload';

export function BatchExperience({ files, onReset }: { files: UploadItem[]; onReset: () => void }) {
  const [items, setItems] = useState(files.map(file => ({ ...file, stage: 'queued' as const })));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const queued = items.filter(item => item.stage === 'queued').length;
  const scannedReady = items.filter(item => item.stage === 'scanned').length;
  const completed = items.filter(item => item.stage === 'verified').length;
  const cleaning = items.filter(item => item.stage === 'cleaning').length;
  const awaiting = items.filter(item => item.stage === 'awaiting_entitlement').length;
  const scanning = items.filter(item => item.stage === 'scanning').length;
  const failed = items.filter(item => item.stage === 'error').length;
  const scanned = items.filter(item => ['scanned', 'cleaning', 'awaiting_entitlement', 'verified'].includes(item.stage)).length;
  const metadataCount = items.reduce((sum, item) => sum + (item.metadataCount ?? 0), 0);
  const progress = items.length ? Math.round(items.reduce((sum, item) => sum + ({ queued: 0, scanning: 35, scanned: 55, cleaning: 78, awaiting_entitlement: 92, verified: 100, error: 0 }[item.stage] ?? 0), 0) / items.length) : 0;

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
    <input ref={inputRef} className="nm-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => e.target.files && setItems(prev => [...prev, ...Array.from(e.target.files!).map(file => ({ id: crypto.randomUUID(), file, stage: 'queued' as const }))])} />
    <div className="nm-batch__header">
      <div><span className="nm-eyebrow">Private photo workspace</span><h2>{statusText}</h2><p>{items.length} photo{items.length === 1 ? '' : 's'} · Nothing is uploaded during image processing.</p></div>
      <div className="nm-batch__actions">
        {!busy ? <Button variant="secondary" onClick={() => inputRef.current?.click()} icon="upload">Add photos</Button> : null}
        {!busy && (queued > 0 || scannedReady > 0) ? <Button variant="primary" onClick={() => {}}>Scan &amp; clean {items.length > 1 ? `${items.length} photos` : 'photo'}</Button> : null}
        {!busy && completed > 0 ? <Button variant="primary" icon="download">Download {completed > 1 ? 'all' : 'photo'}</Button> : null}
      </div>
    </div>
    <div className="nm-batch__progress" aria-label={`${progress}% complete`}>
      <div className="nm-batch__progress-top"><span>{progress === 100 ? 'Complete' : busy ? 'Working securely on your device' : 'Workflow progress'}</span><strong>{progress}%</strong></div>
      <div className="nm-batch__progress-track"><span style={{ width: `${progress}%` }} /></div>
      <small className="nm-batch__progress-help">{scanning > 0 ? 'Reading the photo and checking supported metadata' : cleaning > 0 ? 'Creating and verifying your clean copy' : completed > 0 ? 'Your clean copy has been verified' : progress === 0 ? 'Nothing starts until you press Scan & clean' : 'Almost there'}</small>
    </div>
    <div className="nm-batch__summary"><span><strong>{items.length}</strong> selected</span><span><strong>{scanned}</strong> scanned</span><span><strong>{completed}</strong> ready</span><span><strong>{metadataCount}</strong> metadata found</span></div>
  </section>;
}
