import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './Button';

export function Nav() {
  return <header className="nm-nav-wrap"><nav className="nm-nav nm-container"><Logo /><div className="nm-nav__links"><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/privacy">Privacy</Link></div><div className="nm-nav__actions"><Link className="nm-nav__dashboard" href="/dashboard">Dashboard</Link><Button href="/clean" variant="primary">Scan a photo</Button></div></nav></header>;
}
