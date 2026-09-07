'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { formatFileSize, validateImageFile } from '../../lib/uploads/validate';
import type { UploadItem } from '../../types/upload';

const MAX_FILES = 25;

function makeId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function UploadZone({ onFilesChange }: { onFilesChange?: (files: UploadItem[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const update = useCallback((next: UploadItem[]) => {
    setItems(next);
    onFilesChange?.(next);
  }, [onFilesChange]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const files = Array.from(incoming);
    const existingKeys = new Set(items.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`));
    const accepted: UploadItem[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const result = validateImageFile(file);
      if (!result.valid) {
        errors.push(`${file.name}: ${result.error}`);
        continue;
      }

      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (existingKeys.has(key)) continue;
      if (items.length + accepted.length >= MAX_FILES) break;

      accepted.push({ id: makeId(), file, previewUrl: URL.createObjectURL(file), status: 'ready' });
      existingKeys.add(key);
    }

    const next = [...items, ...accepted];
    update(next);
    setGlobalError(errors[0] ?? (files.length + items.length > MAX_FILES ? `You can add up to ${MAX_FILES} images at once.` : ''));
  }, [items, update]);

  const remove = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    update(items.filter((entry) => entry.id !== id));
  };

  const clear = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    update([]);
    setGlobalError('');
  };

  useEffect(() => () => items.forEach((item) => URL.revokeObjectURL(item.previewUrl)), [items]);

  return (
    <section aria-label="Photo upload">
      <div
        className={`nm-upload-zone ${dragging ? 'is-dragging' : ''} ${items.length ? 'has-files' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          className="nm-visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.currentTarget.value = ''; }}
        />

        <div className="nm-upload-zone__icon"><Icon name="upload" /></div>
        <h2>{items.length ? 'Add more photos' : 'Drop your photos here'}</h2>
        <p>or choose from your device. JPG, PNG and WebP.</p>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>Choose photos</Button>
        <span className="nm-upload-zone__limit">Up to {MAX_FILES} images · 50 MB each</span>
      </div>

      {globalError && <div className="nm-upload-error" role="alert"><Icon name="alert" />{globalError}</div>}

      {items.length > 0 && (
        <div className="nm-upload-list" aria-live="polite">
          <div className="nm-upload-list__head">
            <div><strong>{items.length} {items.length === 1 ? 'photo' : 'photos'} selected</strong><span>Ready to scan locally</span></div>
            <button className="nm-text-button" type="button" onClick={clear}>Clear all</button>
          </div>
          <div className="nm-upload-grid">
            {items.map((item) => (
              <article className="nm-file-card" key={item.id}>
                <img src={item.previewUrl} alt="" />
                <div className="nm-file-card__body">
                  <strong title={item.file.name}>{item.file.name}</strong>
                  <span>{formatFileSize(item.file.size)}</span>
                </div>
                <button className="nm-file-card__remove" type="button" aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)}>×</button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
