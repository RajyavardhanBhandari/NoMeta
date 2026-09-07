'use client';

import { useState } from 'react';
import { UploadZone } from './UploadZone';
import type { UploadItem } from '../../types/upload';
import { Button } from '../ui/Button';
import { BatchExperience } from '../cleaner/BatchExperience';

export function UploadExperience() {
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [start, setStart] = useState(false);

  return <div>
    <UploadZone onFilesChange={(next) => { setFiles(next); setStart(false); }} />
    {files.length > 0 && !start && <div className="nm-upload-actions">
      <div><strong>{files.length} ready</strong><span>Your photos have not left this browser.</span></div>
      <Button variant="primary" onClick={() => setStart(true)}>Start local scan</Button>
    </div>}
    {start && <BatchExperience files={files} />}
  </div>;
}
