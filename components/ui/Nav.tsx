import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  return (
    <header className="nm-nav-wrap">
      <nav className="nm-nav nm-container">
        <Logo />
        <div className="nm-nav__links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div className="nm-nav__actions">
          <Link className="nm-nav__dashboard" href="/dashboard">Dashboard</Link>
          <Link className="nm-nav__login" href="/auth/sign-in">Log in</Link>
          <ThemeToggle />
          <Button href="/auth/sign-up" variant="secondary">Sign up</Button>
        </div>
      </nav>
    </header>
  );
}
