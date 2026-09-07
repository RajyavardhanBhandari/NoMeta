'use client';
import { useState } from 'react';
import type { MetadataResult, MetadataCategory, RiskLevel } from '../../types/metadata';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MetadataRow } from '../privacy/MetadataRow';

const labels: Record<MetadataCategory,string>={location:'Location',device:'Device',time:'Time',identity:'Identity',software:'Software',technical:'Technical',provenance:'Provenance',other:'Other'};
const riskLabel: Record<RiskLevel,string>={high:'High privacy risk',medium:'Privacy risk',low:'Low risk',info:'No major risk'};

export function ScanResults({ result }: { result: MetadataResult }) {
  const [showTechnical,setShowTechnical]=useState(false);
  const visible=result.entries.filter(e=>showTechnical||e.category!=='technical');
  return <div className="nm-scanner-results">
    <Card style={{padding:24}}>
      <div className="nm-result-head"><div><span className="nm-eyebrow">Scan complete</span><h2>{result.fileName}</h2><p>{result.entries.length} metadata {result.entries.length===1?'item':'items'} detected.</p></div><div className={`nm-score nm-score--${result.riskLevel}`}><strong>{result.privacyScore}</strong><span>/ 100</span><small>{riskLabel[result.riskLevel]}</small></div></div>
      {result.warnings.map((w,i)=><div className="nm-warning" key={i}>{w}</div>)}
      {result.entries.length>0 ? <div className="nm-metadata-list">{visible.map(e=><div key={e.id} className="nm-metadata-item"><MetadataRow label={e.label} value={e.value} tone={e.risk==='high'?'danger':e.risk==='medium'?'warning':'neutral'}/><div className="nm-meta-explain"><Badge>{labels[e.category]}</Badge><span>{e.explanation}</span></div></div>)}</div> : <div className="nm-empty-result"><strong>No supported metadata detected.</strong><span>The image may already have little or no embedded metadata.</span></div>}
      {result.entries.some(e=>e.category==='technical') && <button className="nm-text-button" onClick={()=>setShowTechnical(v=>!v)}>{showTechnical?'Hide':'Show'} technical metadata</button>}
    </Card>
  </div>;
}
