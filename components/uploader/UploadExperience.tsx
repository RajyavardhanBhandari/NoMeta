'use client';

import { useState } from 'react';
import { UploadZone } from './UploadZone';
import type { UploadItem } from '../../types/upload';
import { BatchExperience } from '../cleaner/BatchExperience';

export function UploadExperience() {
  const [files, setFiles] = useState<UploadItem[]>([]);

  return (
    <div>
      <UploadZone onFilesChange={setFiles} />
      {files.length > 0 ? (
        <div className="nm-clean-workspace">
          <BatchExperience files={files} />
        </div>
      ) : (
        <div className="nm-upload-actions" aria-label="How NoMeta works">
          <div>
            <strong>Simple: choose a photo → scan → clean → download.</strong>
            <span>No upload. No confusing settings. You stay in control of the original file.</span>
          </div>
        </div>
      )}
    </div>
  );
}
