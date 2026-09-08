'use client';

import { useMemo, useRef, useState } from 'react';
import type { MetadataCategory, MetadataResult } from '../../types/metadata';
import type { UploadItem } from '../../types/upload';
import { scanImage } from '../../lib/metadata/scanner';
import { cleanImage, verifyCleanedImage, type CleaningMode } from '../../lib/metadata/cleaner';
import { validateImageFile, formatFileSize } from '../../lib/uploads/validate';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

const MAX_FILES = 25;
const CLEANING_MODE: CleaningMode = 'maximum';

type Stage = 'ready' | 'scanning' | 'scanned' | 'cleaning' | 'verified' | 'error';
type Item = UploadItem & { stage: Stage; result?: MetadataResult; cleanedBlob?: Blob; downloadUrl?: string; error?: string };

const categoryMeta: Record<MetadataCategory, { icon: string; title: string; found: string; remove: string; group: 'sensitive' | 'technical' }> = {
  location: { icon: 'location', title: 'Location', found: 'Your photo contains location information.', remove: 'GPS / location metadata', group: 'sensitive' },
  device: { icon: 'camera', title: 'Camera information', found: 'Camera or device information is embedded.', remove: 'Camera and device metadata', group: 'sensitive' },
  time: { icon: 'clock', title: 'Capture time', found: 'Original capture time is present.', remove: 'Capture timestamps', group: 'sensitive' },
  identity: { icon: 'user', title: 'Author / identity', found: 'Author or ownership information is embedded.', remove: 'Author and identity metadata', group: 'sensitive' },
  software: { icon: 'spark', title: 'Editing software', found: 'The file identifies software or an editing workflow.', remove: 'Software metadata', group: 'technical' },
  technical: { icon: 'settings', title: 'Technical information', found: 'Technical image settings are embedded.', remove: 'Technical metadata', group: 'technical' },
  provenance: { icon: 'shield', title: 'Provenance information', found: 'Provenance-related information is embedded.', remove: 'Supported provenance metadata', group: 'technical' },
  other: { icon: 'scan', title: 'Other information', found: 'Additional embedded information was found.', remove: 'Supported additional metadata', group: 'technical' },
};

function makeId() { return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function outputName(name: string, blob?: Blob) { const dot = name.lastIndexOf('.'); const stem = dot > 0 ? name.slice(0, dot) : name; const ext = blob?.type === 'image/jpeg' ? '.jpg' : dot > 0 ? name.slice(dot) : '.jpg'; return `cleaned-${stem}${ext}`; }
function triggerDownload(url: string, filename: string) { const a = document.createElement('a'); a.href = url; a.download = filename; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
function riskLabel(result?: MetadataResult) { if (!result || result.entries.length === 0) return 'Minimal'; if (result.riskLevel === 'high') return 'High'; if (result.riskLevel === 'medium') return 'Moderate'; return 'Low'; }

export function PrivacyScannerExperience() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const scanned = items.filter(i => i.result);
  const ready = items.filter(i => i.stage === 'ready');
  const verified = items.filter(i => i.stage === 'verified');
  const totalSensitive = scanned.reduce((sum, item) => sum + (item.result?.entries.filter(e => e.sensitive).length ?? 0), 0);
  const totalEntries = scanned.reduce((sum, item) => sum + (item.result?.entries.length ?? 0), 0);
  const categories = useMemo(() => {
    const found = new Set<MetadataCategory>();
    scanned.forEach(item => item.result?.entries.forEach(entry => found.add(entry.category)));
    return Array.from(found);
  }, [scanned]);
  const primary = items[0];
  const primaryResult = primary?.result;

  const addFiles = (incoming: FileList | File[]) => {
    setError('');
    const next = [...items];
    const existing = new Set(items.map(item => `${item.file.name}-${item.file.size}-${item.file.lastModified}`));
    for (const file of Array.from(incoming)) {
      const validation = validateImageFile(file);
      if (!validation.valid) { setError(`${file.name}: ${validation.error}`); continue; }
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (existing.has(key)) continue;
      if (next.length >= MAX_FILES) { setError(`You can add up to ${MAX_FILES} images at once.`); break; }
      const previewUrl = URL.createObjectURL(file);
      next.push({ id: makeId(), file, previewUrl, status: 'ready', stage: 'ready' });
      existing.add(key);
    }
    setItems(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  const scanAll = async () => {
    if (busy || !items.length) return;
    setBusy(true); setError('');
    try {
      for (const item of items) {
        if (item.result) continue;
        setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'scanning', error: undefined } : x));
        try {
          const result = await scanImage(item.file);
          setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'scanned', result } : x));
        } catch (e) {
          setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'error', error: e instanceof Error ? e.message : 'Could not scan this photo.' } : x));
        }
      }
    } finally { setBusy(false); }
  };

  const confirmEntitlement = async (item: Item, blob: Blob, url: string) => {
    const response = await fetch('/api/cleaning/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referenceId: item.id, mode: CLEANING_MODE, format: item.file.type, fileSize: item.file.size }) });
    let data: { error?: string } = {}; try { data = await response.json(); } catch {}
    if (!response.ok) {
      if (response.status === 401) throw new Error('Sign in to unlock your download. Your cleaned image is still on this device.');
      throw new Error(data.error || 'NoMeta could not confirm your cleaning allowance.');
    }
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'verified', cleanedBlob: blob, downloadUrl: url } : x));
  };

  const cleanAll = async () => {
    if (busy || !scanned.length) return;
    setBusy(true); setError('');
    try {
      for (const item of scanned) {
        if (item.stage === 'verified') continue;
        setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'cleaning', error: undefined } : x));
        try {
          const blob = await cleanImage(item.file, CLEANING_MODE);
          const check = await verifyCleanedImage(blob);
          if (!check.verified) throw new Error(`${check.remainingMetadata} supported metadata item(s) remain after cleaning.`);
          const url = URL.createObjectURL(blob);
          try { await confirmEntitlement(item, blob, url); } catch (e) {
            URL.revokeObjectURL(url);
            setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'error', error: e instanceof Error ? e.message : 'Could not confirm this cleaning.' } : x));
          }
        } catch (e) {
          setItems(prev => prev.map(x => x.id === item.id ? { ...x, stage: 'error', error: e instanceof Error ? e.message : 'Cleaning failed.' } : x));
        }
      }
    } finally { setBusy(false); }
  };

  const reset = () => { if (busy) return; items.forEach(item => { URL.revokeObjectURL(item.previewUrl); if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl); }); setItems([]); setError(''); setExpanded(null); };
  const remove = (id: string) => { if (busy) return; const item = items.find(x => x.id === id); if (item) { URL.revokeObjectURL(item.previewUrl); if (item.downloadUrl) URL.revokeObjectURL(item.downloadUrl); } setItems(prev => prev.filter(x => x.id !== id)); };

  const downloadAll = () => verified.forEach(item => item.downloadUrl && triggerDownload(item.downloadUrl, outputName(item.file.name, item.cleanedBlob)));

  if (!items.length) return <section className="nm-scanner-hero" aria-label="NoMeta Privacy Scanner">
    <div className="nm-scanner-hero__icon"><Icon name="scan" /></div>
    <span className="nm-eyebrow">NoMeta Privacy Scanner</span>
    <h2>Drop a photo to see what it reveals.</h2>
    <p>Scan hidden metadata first. Your photo stays in your browser while NoMeta checks it.</p>
    <input ref={inputRef} className="nm-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple onChange={e => e.target.files && addFiles(e.target.files)} />
    <div className="nm-scanner-hero__actions"><Button variant="primary" icon="upload" onClick={() => inputRef.current?.click()}>Choose a photo</Button><span>JPG · PNG · WebP · HEIC · HEIF · up to 50 MB</span></div>
    <div className="nm-scanner-privacy"><Icon name="lock" /><span><strong>Private by design.</strong> Scanning happens locally in your browser.</span></div>
  </section>;

  if (!scanned.length || ready.length) return <section className="nm-scanner-workspace" aria-live="polite">
    <div className="nm-scanner-loading"><div className="nm-scanner-spinner" /><div><span className="nm-eyebrow">Privacy scan</span><h2>{busy ? 'Checking what your photo reveals…' : 'Ready to scan'}</h2><p>{items.length} photo{items.length === 1 ? '' : 's'} selected · nothing is uploaded.</p></div></div>
    <div className="nm-scanner-file-grid">{items.map(item => <article className="nm-scanner-file" key={item.id}><div className="nm-scanner-file__thumb">{item.file.type.startsWith('image/') && !/\.hei[cf]$/i.test(item.file.name) ? <img src={item.previewUrl} alt="" /> : <span>HEIC</span>}</div><div><strong>{item.file.name}</strong><small>{formatFileSize(item.file.size)}</small></div><span className={`nm-scanner-file__status nm-scanner-file__status--${item.stage}`}>{item.stage === 'scanning' ? 'Scanning…' : item.stage === 'error' ? 'Needs attention' : 'Ready'}</span><button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)}>×</button></article>)}</div>
    {error ? <div className="nm-scanner-error" role="alert">{error}</div> : null}
    <div className="nm-scanner-actions"><Button variant="secondary" onClick={() => inputRef.current?.click()} icon="plus" disabled={busy}>Add photos</Button><Button variant="primary" onClick={scanAll} disabled={busy}>{busy ? 'Scanning…' : 'Scan for hidden information'}</Button></div>
  </section>;

  const categoriesForDisplay = categories.filter(category => (primaryResult?.counts[category] ?? 0) > 0);
  return <section className="nm-scanner-workspace" aria-live="polite">
    <div className="nm-scanner-result-head">
      <div className="nm-scanner-preview">{primary && !/\.hei[cf]$/i.test(primary.file.name) ? <img src={primary.previewUrl} alt="" /> : <span>HEIC</span>}</div>
      <div><span className="nm-eyebrow">Your photo</span><h2>Privacy exposure</h2><div className="nm-scanner-risk"><span className={`nm-scanner-risk__dot nm-scanner-risk__dot--${riskLabel(primaryResult).toLowerCase()}`} />{riskLabel(primaryResult)}</div><p>{items.length > 1 ? `${items.length} photos scanned · ` : ''}{totalEntries} pieces of embedded information found.</p></div>
    </div>

    <div className="nm-scanner-panel">
      <div className="nm-scanner-panel__head"><div><span className="nm-eyebrow">Detected</span><h3>What your photo carries</h3></div><span className="nm-scanner-count">{totalSensitive} privacy-sensitive</span></div>
      <div className="nm-scanner-category-grid">{categoriesForDisplay.map(category => { const meta = categoryMeta[category]; return <button type="button" className={`nm-scanner-category nm-scanner-category--${meta.group}`} key={category} onClick={() => setExpanded(expanded === category ? null : category)}><span className="nm-scanner-category__icon"><Icon name={meta.icon} /></span><span><strong>{meta.title}</strong><small>Found · {meta.found}</small></span><span className="nm-scanner-category__chevron">{expanded === category ? '−' : '+'}</span>{expanded === category ? <span className="nm-scanner-category__detail">{primaryResult?.entries.filter(e => e.category === category).slice(0, 4).map(e => <em key={e.id}>{e.label}</em>)}</span> : null}</button>; })}</div>
      {primaryResult?.warnings.length ? <div className="nm-scanner-warning">{primaryResult.warnings[0]}</div> : null}
    </div>

    <div className="nm-scanner-clean-card">
      <div><span className="nm-eyebrow">Maximum privacy</span><h3>NoMeta will remove</h3><div className="nm-scanner-remove-list">{categoriesForDisplay.map(category => <span key={category}><b>✓</b>{categoryMeta[category].remove}</span>)}</div></div>
      <Button variant="primary" onClick={cleanAll} disabled={busy}>{busy ? 'Cleaning & verifying…' : 'Clean & verify'}</Button>
    </div>

    {verified.length > 0 ? <div className="nm-scanner-success"><div className="nm-scanner-success__mark">✓</div><div><span className="nm-eyebrow">Ready to share</span><h3>{totalSensitive || totalEntries} privacy-sensitive metadata {totalSensitive || totalEntries === 1 ? 'category' : 'categories'} removed.</h3><p>The cleaned copy was verified locally. Your original remains unchanged.</p></div><Button variant="primary" icon="download" onClick={downloadAll}>Download {verified.length > 1 ? 'all' : 'cleaned photo'}</Button></div> : null}
    {items.some(i => i.error) ? <div className="nm-scanner-error" role="alert">{items.find(i => i.error)?.error}</div> : null}
    <div className="nm-scanner-bottom"><Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>Add another photo</Button><button className="nm-text-button" type="button" onClick={reset} disabled={busy}>Start over</button></div>
  </section>;
}
