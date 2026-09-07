'use client';
import { useState } from 'react';
import type { UploadItem } from '../../types/upload';
import type { MetadataResult } from '../../types/metadata';
import { scanImage } from '../../lib/metadata/scanner';
import { ScanResults } from './ScanResults';

export function ScannerExperience({ files }: { files: UploadItem[] }) {
  const [results,setResults]=useState<MetadataResult[]>([]); const [current,setCurrent]=useState(0); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const run=async()=>{setBusy(true);setError('');try{const r:MetadataResult[]=[];for(const item of files){r.push(await scanImage(item.file));setCurrent(r.length)}setResults(r);}catch(e){setError(e instanceof Error?e.message:'Unable to scan this image.');}finally{setBusy(false)}};
  if(!results.length) return <div className="nm-scan-launch"><button className="nm-button nm-button--primary" onClick={run} disabled={busy}>{busy?`Scanning ${current}/${files.length}…`:`Scan ${files.length} ${files.length===1?'photo':'photos'}`}</button>{busy&&<div className="nm-scan-progress"><div style={{width:`${Math.max(8,(current/files.length)*100)}%`}}/></div>}{error&&<div className="nm-error">{error}</div>}<p>Processing happens locally in your browser. Your image is not uploaded for this scan.</p></div>;
  return <div>{results.map(r=><ScanResults key={r.fileName+r.scannedAt} result={r}/>)}</div>;
}
