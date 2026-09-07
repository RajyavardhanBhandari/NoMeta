'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) { setMsg(error.message); setBusy(false); return; }
    window.location.href = '/dashboard';
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">Welcome back</div>
        <h1>Sign in to NoMeta.</h1>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button className="primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {msg && <p className="auth-message" role="alert">{msg}</p>}
        <p className="auth-message" style={{ marginTop: '1rem' }}>
          No account? <Link href="/auth/sign-up">Sign up</Link>
          {' · '}
          <Link href="/auth/forgot-password">Forgot password</Link>
        </p>
      </div>
    </main>
  );
}
