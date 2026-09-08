import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/lib/supabase/server';

export async function Nav() {
  let user = null;
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  return (
    <header className="nm-nav-wrap">
      <nav className="nm-nav nm-container">
        <Logo />
        <div className="nm-nav__links">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div className="nm-nav__actions">
          <ThemeToggle />
          {user ? (
            <Link className="nm-nav__dashboard" href="/dashboard">Dashboard</Link>
          ) : (
            <Link className="nm-nav__login" href="/auth/sign-in">Log in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
