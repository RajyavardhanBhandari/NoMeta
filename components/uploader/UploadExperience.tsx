'use client';

import { useState } from 'react';
import { UploadZone } from './UploadZone';
import type { UploadItem } from '../../types/upload';
import { BatchExperience } from '../cleaner/BatchExperience';

export function UploadExperience() {
  const [files, setFiles] = useState<UploadItem[]>([]);

  return files.length === 0 ? (
    <div>
      <UploadZone onFilesChange={setFiles} />
      <div className="nm-upload-actions" aria-label="How NoMeta works">
        <div><strong>Choose a photo → scan → clean → download.</strong><span>No upload. No confusing settings. Your original file stays on your device.</span></div>
      </div>
    </div>
  ) : (
    <div className="nm-clean-workspace">
      <BatchExperience files={files} onReset={() => setFiles([])} />
    </div>
  );
}
