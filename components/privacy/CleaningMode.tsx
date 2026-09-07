'use client';
import { useState } from 'react';
import { Icon } from '../ui/Icon';

export function CleaningMode() {
  const [mode, setMode] = useState<'standard'|'maximum'>('standard');
  return <div className="nm-mode-grid">
    <button className={`nm-mode ${mode === 'standard' ? 'is-active' : ''}`} onClick={() => setMode('standard')}><span className="nm-mode__icon"><Icon name="check" size={18}/></span><span><strong>Standard Clean</strong><small>Remove privacy-sensitive metadata while preserving useful image information where possible.</small></span></button>
    <button className={`nm-mode ${mode === 'maximum' ? 'is-active' : ''}`} onClick={() => setMode('maximum')}><span className="nm-mode__icon"><Icon name="shield" size={18}/></span><span><strong>Maximum Privacy</strong><small>Remove as much non-essential metadata as technically possible.</small></span></button>
  </div>;
}
