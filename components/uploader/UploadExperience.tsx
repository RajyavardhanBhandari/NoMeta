'use client';

import { useState } from 'react';
import { UploadZone } from './UploadZone';
import type { UploadItem } from '../../types/upload';
import { Button } from '../ui/Button';

export function UploadExperience() {
  const [files, setFiles] = useState<UploadItem[]>([]);

  return (
    <div>
      <UploadZone onFilesChange={setFiles} />
      {files.length > 0 && (
        <div className="nm-upload-actions">
          <div><strong>{files.length} ready</strong><span>Your photos have not left this browser.</span></div>
          <Button variant="primary" onClick={() => { /* Phase 3 scanner starts here. */ }}>
            Scan {files.length === 1 ? 'photo' : 'photos'}
          </Button>
        </div>
      )}
    </div>
  );
}
