"use client";

import { FormEvent, useState } from "react";

export function AuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("Authentication provider is not configured yet. Your photo remains local to this browser.");
    setBusy(false);
  }

  return (
    <div className="auth-card">
      <div className="eyebrow">NoMeta account</div>
      <h1>{mode === "sign-in" ? "Welcome back." : "Create your account."}</h1>
      <p className="muted">Your account manages your daily allowance and credits. Your photos are processed locally.</p>
      <form onSubmit={submit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <button className="primary-button" disabled={busy}>{busy ? "Working…" : mode === "sign-in" ? "Continue" : "Create account"}</button>
        <button type="button" className="secondary-button" onClick={() => setMessage("Google sign-in will use the configured OAuth provider.")}>Continue with Google</button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
    </div>
  );
}
