'use client';

import { useState } from 'react';

const SUPPORT_URL = 'https://rzp.io/rzp/fhtye5b3';

export function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="nm-support-widget">
      {open && (
        <div className="nm-support-card" role="dialog" aria-modal="false" aria-label="Support NoMeta">
          <button className="nm-support-close" type="button" onClick={() => setOpen(false)} aria-label="Close support panel">×</button>
          <span className="nm-eyebrow">Support NoMeta</span>
          <h3>Help keep private photo cleaning independent.</h3>
          <p>NoMeta is built to keep the core photo-cleaning workflow local and accessible. If it saves you time or helps you share more safely, you can help fund the product with a contribution of any amount.</p>
          <div className="nm-support-reasons" aria-label="How support helps">
            <span>✓ Local-first development</span>
            <span>✓ Hosting &amp; maintenance</span>
            <span>✓ Keeping the core tool accessible</span>
          </div>
          <a className="nm-support-button" href={SUPPORT_URL} target="_blank" rel="noreferrer">☕ Support NoMeta</a>
          <small>Choose any amount you would like to contribute. You can close this panel anytime.</small>
        </div>
      )}
      <button className="nm-support-fab" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Support NoMeta">
        <span className="nm-support-fab__icon">☕</span>
        <span className="nm-support-fab__copy"><strong>Support NoMeta</strong><small>Keep it independent</small></span>
        <span className="nm-support-fab__arrow">↗</span>
      </button>
    </div>
  );
}
