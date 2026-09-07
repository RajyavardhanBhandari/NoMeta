'use client';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function PricingExperience() {
  const [state, setState] = useState<'idle'|'loading'|'unavailable'|'error'>('idle');
  async function buy() {
    setState('loading');
    try {
      const response = await fetch('/api/payment/create-order', { method: 'POST' });
      const data = await response.json();
      setState(response.ok && data.configured ? 'idle' : 'unavailable');
    } catch { setState('error'); }
  }
  return <div className="nm-pricing-cta"><Button onClick={buy} disabled={state === 'loading'}>{state === 'loading' ? 'Checking payment setup…' : 'Buy 1 credit · ₹5'}</Button>{state === 'unavailable' && <p className="nm-dashboard-message">Checkout is not enabled until the server-side Razorpay environment is configured.</p>}{state === 'error' && <p className="nm-dashboard-message nm-dashboard-message--error">Could not reach the payment service.</p>}</div>;
}
