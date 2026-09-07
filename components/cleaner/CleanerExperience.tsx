'use client';
import { useMemo, useState } from 'react';
import type { UploadItem } from '../../types/upload';
import type { MetadataResult } from '../../types/metadata';
import { cleanImage, verifyCleanedImage, type CleaningMode } from '../../lib/metadata/cleaner';

export function CleanerExperience({ files, results }: { files: UploadItem[]; results: MetadataResult[] }) {
  const [mode, setMode] = useState<CleaningMode>('standard');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [downloads, setDownloads] = useState<string[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);
  const names = useMemo(() => new Set(files.map(f => f.file.name)), [files]);

  const run = async () => {
    if (!files.length) return;
    setBusy(true); setError(''); setVerified(null); setDownloads([]);
    try {
      const urls: string[] = [];
      for (let i=0;i<files.length;i++) {
        setStatus(`Cleaning ${i+1} of ${files.length}…`);
        const blob = await cleanImage(files[i].file, mode);
        const check = await verifyCleanedImage(blob);
        if (!check.verified) throw new Error(`${files[i].file.name}: ${check.remainingMetadata} metadata item(s) remain after cleaning.`);
        const referenceId = `${Date.now().toString(36)}-${crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`;
        const entitlement = await fetch('/api/cleaning/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referenceId, mode, format: files[i].file.type.split('/')[1] || null, fileSize: files[i].file.size }) });
        if (!entitlement.ok) { const data = await entitlement.json().catch(() => ({})); throw new Error(data.error || 'No cleaning entitlement available. Sign in or buy a credit.'); }
        urls.push(URL.createObjectURL(blob));
      }
      setDownloads(urls); setVerified(true); setStatus('Verified clean.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Cleaning failed.'); setStatus(''); }
    finally { setBusy(false); }
  };

  if (!files.length || !results.length) return null;
  return <section className="nm-cleaner">
    <div className="nm-cleaner__head"><div><span className="nm-eyebrow">Local cleaning</span><h2>Remove the hidden data.</h2><p>Your original files remain untouched. NoMeta creates a new cleaned copy in your browser.</p></div></div>
    <div className="nm-cleaner__modes">
      <button className={`nm-mode ${mode==='standard'?'is-selected':''}`} onClick={()=>setMode('standard')} disabled={busy}><strong>Standard Clean</strong><span>Remove known privacy-sensitive metadata while preserving useful image structure.</span></button>
      <button className={`nm-mode ${mode==='maximum'?'is-selected':''}`} onClick={()=>setMode('maximum')} disabled={busy}><strong>Maximum Privacy</strong><span>More aggressive removal of known non-essential metadata. Pixels are not re-encoded.</span></button>
    </div>
    <button className="nm-button nm-button--primary" onClick={run} disabled={busy}>{busy ? status || 'Cleaning…' : 'Clean & verify'}</button>
    {status && !busy && <div className="nm-success">✓ {status}</div>}
    {error && <div className="nm-error">{error}</div>}
    {downloads.length > 0 && <div className="nm-downloads"><strong>Cleaned files</strong>{downloads.map((url,i)=><a key={url} className="nm-button nm-button--secondary" href={url} download={`${files[i].file.name.replace(/\.[^.]+$/,'')}-cleaned.${files[i].file.name.split('.').pop()}`}>Download {files[i].file.name}</a>)}</div>}
    <small>Verification rescans each generated file locally. A verified result means NoMeta's supported scanner found no remaining supported metadata fields.</small>
  </section>;
}
