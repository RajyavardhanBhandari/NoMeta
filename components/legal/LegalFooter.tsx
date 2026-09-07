import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="nm-footer">
      <div className="nm-container nm-footer__inner">
        <div>
          <strong>NoMeta</strong>
          <p className="nm-muted">Privacy-first image metadata scanning and cleaning.</p>
        </div>
        <div className="nm-footer__links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/data-and-cookies">Data &amp; cookies</Link>
          <Link href="/security">Security</Link>
          <Link href="/refunds">Payments &amp; refunds</Link>
        </div>
      </div>
    </footer>
  );
}
