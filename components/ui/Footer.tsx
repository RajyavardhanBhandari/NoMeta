import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="nm-footer" style={{ borderTop: '1px solid var(--nm-border, rgba(127,127,127,.2))', marginTop: 72 }}>
      <div className="nm-container" style={{ padding: '48px 24px 28px', display: 'grid', gap: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 420 }}><Logo /><p style={{ marginTop: 14, opacity: .72 }}>NoMeta helps you find and remove hidden metadata from photos before you share them. Image processing happens locally in your browser.</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(120px,1fr))', gap: '10px 36px' }}>
            <Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/about">About us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/clean">Clean a photo</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--nm-border, rgba(127,127,127,.16))', paddingTop: 20, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 13, opacity: .68 }}>
          <span>© {new Date().getFullYear()} NoMeta. A product of The Founder Nation × WebGravity Consulting Pvt. Ltd.</span>
          <span><a href="https://thefoundernation.com" target="_blank" rel="noreferrer">The Founder Nation</a> · <a href="https://www.thewebgravity.com" target="_blank" rel="noreferrer">WebGravity</a></span>
        </div>
      </div>
    </footer>
  );
}
