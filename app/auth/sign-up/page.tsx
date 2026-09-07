'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await createClient().auth.signUp({ email, password });
    setMsg(error ? error.message : 'Check your email to confirm your account.');
    setBusy(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">Get started</div>
        <h1>Create your account.</h1>
        <p className="muted">Free daily cleaning allowance included.</p>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={12} value={password} onChange={e => setPassword(e.target.value)} />
          <button className="primary-button" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        </form>
        {msg && <p className="auth-message" role="status">{msg}</p>}
        <p className="auth-message" style={{ marginTop: '1rem' }}>
          Already have an account? <Link href="/auth/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
