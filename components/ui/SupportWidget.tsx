'use client';

import { useState } from 'react';

const SUPPORT_URL = 'https://rzp.io/rzp/fhtye5b3';

export function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="nm-support-widget">
      {open && (
        <div className="nm-support-card" role="dialog" aria-label="Support NoMeta">
          <button className="nm-support-close" type="button" onClick={() => setOpen(false)} aria-label="Close support panel">×</button>
          <span className="nm-eyebrow">Support NoMeta</span>
          <h3>Help us keep NoMeta private.</h3>
          <p>NoMeta is built to keep photo cleaning local and accessible. If you find it useful, you can support the project with a contribution of any amount.</p>
          <a className="nm-support-button" href={SUPPORT_URL} target="_blank" rel="noreferrer">☕ Support NoMeta</a>
          <small>Choose any amount you would like to contribute. Contributions help with development, hosting and maintenance.</small>
        </div>
      )}
      <button className="nm-support-fab" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Support NoMeta">☕ <span>Support NoMeta</span></button>
    </div>
  );
}
