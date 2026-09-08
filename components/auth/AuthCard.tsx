"use client";
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthCard({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const s = createClient();
    const result = mode === 'sign-in'
      ? await s.auth.signInWithPassword({ email, password })
      : await s.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (result.error) { setMessage(result.error.message); setBusy(false); return; }
    if (mode === 'sign-up' && !result.data.session) { setMessage('Account created. Check your email to confirm your address.'); setBusy(false); return; }
    window.location.href = search.get('next')?.startsWith('/') ? search.get('next')! : '/dashboard';
  }

  async function google() {
    setBusy(true);
    setMessage('');
    const s = createClient();
    const next = search.get('next')?.startsWith('/') ? search.get('next')! : '/dashboard';
    const { error } = await s.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setMessage(error.message); setBusy(false); }
  }

  return (
    <div className="auth-card">
      <div className="eyebrow">NoMeta account</div>
      <h1>{mode === 'sign-in' ? 'Welcome back.' : 'Create your account.'}</h1>
      <p className="muted">Your account manages your daily allowance and credits. Your photos are processed locally.</p>
      <form onSubmit={submit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" minLength={12} required autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 12 characters" />
        <button className="primary-button" disabled={busy}>{busy ? 'Working...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
        <div className="auth-divider"><span>or</span></div>
        <button type="button" className="secondary-button google-button" disabled={busy} onClick={google}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.21Z"/>
            <path fill="#34A853" d="M12 21.84c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.49-4.03H3.27v2.52A9.74 9.74 0 0 0 12 21.84Z"/>
            <path fill="#FBBC05" d="M6.51 13.93A5.86 5.86 0 0 1 6.2 12c0-.67.12-1.32.31-1.93V7.55H3.27A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.45l3.24-2.52Z"/>
            <path fill="#EA4335" d="M12 6.04c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.15 14.62 2.16 12 2.16a9.74 9.74 0 0 0-8.73 5.39l3.24 2.52C7.29 7.76 9.45 6.04 12 6.04Z"/>
          </svg>
          Continue with Google
        </button>
      </form>
      {message && <p className="auth-message" role="alert">{message}</p>}
    </div>
  );
}
