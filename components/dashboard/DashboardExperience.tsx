'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface UsageState { configured: boolean; limit: number; used: number; remaining: number; message?: string }
interface CreditState { configured: boolean; credits: number; message?: string }

type RazorpayWindow = Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } };

export function DashboardExperience() {
  const [usage, setUsage] = useState<UsageState>({ configured: false, limit: 2, used: 0, remaining: 2 });
  const [credits, setCredits] = useState<CreditState>({ configured: false, credits: 0 });
  const [loading, setLoading] = useState(true);
  const [purchaseState, setPurchaseState] = useState<'idle' | 'loading' | 'unavailable' | 'error'>('idle');

  async function refresh() {
    setLoading(true);
    try {
      const [usageResponse, creditResponse] = await Promise.all([fetch('/api/usage'), fetch('/api/credits')]);
      if (usageResponse.ok) setUsage(await usageResponse.json());
      if (creditResponse.ok) setCredits(await creditResponse.json());
    } finally { setLoading(false); }
  }

  useEffect(() => { void refresh(); }, []);

  async function buyOneCredit() {
    setPurchaseState('loading');
    try {
      const response = await fetch('/api/payment/create-order', { method: 'POST' });
      const data = await response.json();
      if (!response.ok || !data.configured) { setPurchaseState('unavailable'); return; }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const Razorpay = (window as RazorpayWindow).Razorpay;
        if (!Razorpay) { setPurchaseState('error'); return; }
        const checkout = new Razorpay({
          key: data.keyId, amount: data.amount, currency: data.currency,
          name: 'NoMeta', description: '1 image cleaning credit', order_id: data.orderId,
          handler: async (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verify = await fetch('/api/payment/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payment) });
            if (verify.ok) await refresh();
          },
          modal: { ondismiss: () => setPurchaseState('idle') },
        });
        checkout.open(); setPurchaseState('idle');
      };
      script.onerror = () => setPurchaseState('error');
      document.body.appendChild(script);
    } catch { setPurchaseState('error'); }
  }

  return <div className="nm-dashboard">
    <div className="nm-dashboard__grid">
      <Card className="nm-dashboard-card nm-dashboard-card--primary">
        <span className="nm-eyebrow">Today</span><div className="nm-dashboard-stat">{loading ? '—' : usage.remaining}</div>
        <h3>free cleanings remaining</h3><p>{usage.used} of {usage.limit} successful free cleanings used today.</p>
        <Button href="/clean" style={{ marginTop: 18 }}>Clean a photo</Button>
      </Card>
      <Card className="nm-dashboard-card">
        <span className="nm-eyebrow">Paid credits</span><div className="nm-dashboard-stat">{loading ? '—' : credits.credits}</div>
        <h3>available credits</h3><p>1 credit covers 1 successful paid image cleaning.</p>
        <Button onClick={buyOneCredit} variant="secondary" disabled={purchaseState === 'loading'} style={{ marginTop: 18 }}>{purchaseState === 'loading' ? 'Preparing checkout…' : 'Buy 1 credit · ₹5'}</Button>
        {purchaseState === 'unavailable' && <p className="nm-dashboard-message">Payments are not configured yet. Add the Razorpay server credentials before enabling checkout.</p>}
        {purchaseState === 'error' && <p className="nm-dashboard-message nm-dashboard-message--error">Checkout could not be opened. No credit was added.</p>}
      </Card>
      <Card className="nm-dashboard-card">
        <span className="nm-eyebrow">Privacy</span><div className="nm-dashboard-stat nm-dashboard-stat--word">Local-first</div>
        <h3>your originals stay in your browser</h3><p>No original images are uploaded to power the core cleaning workflow.</p>
        <Button href="/privacy" variant="ghost" style={{ marginTop: 18 }}>Read privacy details</Button>
      </Card>
    </div>
    <Card className="nm-dashboard-history">
      <div className="nm-dashboard-history__head"><div><span className="nm-eyebrow">Activity</span><h2>Cleaning history</h2></div><span className="nm-badge nm-badge--neutral"><i className="nm-badge__dot" />No originals stored</span></div>
      <div className="nm-dashboard-empty"><strong>Nothing to show yet</strong><span>When history persistence is connected, this area will show successful cleaning events without storing your photos or metadata payloads.</span></div>
    </Card>
  </div>;
}
