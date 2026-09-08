'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';

const PRODUCTS = [
  { id: 'single_credit', credits: 1, price: 5, label: '1 credit' },
  { id: 'bundle_10', credits: 10, price: 39, label: '10 credits' },
  { id: 'bundle_25', credits: 25, price: 79, label: '25 credits' },
  { id: 'bundle_100', credits: 100, price: 199, label: '100 credits' },
] as const;

type ProductId = (typeof PRODUCTS)[number]['id'];
type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccess) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
};
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('RAZORPAY_SCRIPT_FAILED')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpay = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('RAZORPAY_SCRIPT_FAILED'));
    document.body.appendChild(script);
  });
}

export function PricingExperience() {
  const [selected, setSelected] = useState<ProductId>('bundle_10');
  const [state, setState] = useState<'idle' | 'loading' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadRazorpay().catch(() => undefined);
  }, []);

  async function buy() {
    setState('loading');
    setMessage('');
    const product = PRODUCTS.find((item) => item.id === selected);
    if (!product) return;

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product: selected }),
      });
      const data = await response.json();
      if (response.status === 401) {
        window.location.href = `/auth/sign-in?next=${encodeURIComponent('/pricing')}`;
        return;
      }
      if (!response.ok || !data.configured || !data.orderId || !data.keyId) {
        throw new Error(data?.error || 'PAYMENT_NOT_CONFIGURED');
      }

      await loadRazorpay();
      if (!window.Razorpay) throw new Error('RAZORPAY_UNAVAILABLE');

      const checkout = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'NoMeta',
        description: `${product.credits} image cleaning credit${product.credits === 1 ? '' : 's'}`,
        order_id: data.orderId,
        theme: { color: '#7c3aed' },
        modal: { ondismiss: () => setState('idle') },
        handler: async (payment) => {
          setState('verifying');
          try {
            const verification = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify(payment),
            });
            const result = await verification.json();
            if (!verification.ok || !result.verified || !result.credited) {
              throw new Error(result?.error || 'PAYMENT_VERIFICATION_FAILED');
            }
            setState('success');
            setMessage(`${product.credits} credit${product.credits === 1 ? '' : 's'} added to your account.`);
          } catch (error) {
            setState('error');
            setMessage(error instanceof Error ? error.message : 'Payment verification failed.');
          }
        },
      });
      checkout.open();
    } catch (error) {
      setState('error');
      setMessage(
        error instanceof Error && error.message === 'PAYMENT_NOT_CONFIGURED'
          ? 'Checkout is not enabled until the Razorpay server environment is configured.'
          : 'Could not start Razorpay checkout. Please try again.',
      );
    }
  }

  return (
    <div className="nm-pricing-cta">
      <div className="nm-pricing-options" aria-label="Credit packages">
        {PRODUCTS.map((product) => (
          <button
            key={product.id}
            type="button"
            className={selected === product.id ? 'nm-pricing-option is-selected' : 'nm-pricing-option'}
            onClick={() => setSelected(product.id)}
            aria-pressed={selected === product.id}
          >
            <strong>{product.label}</strong>
            <span>₹{product.price}</span>
          </button>
        ))}
      </div>
      <Button onClick={buy} disabled={state === 'loading' || state === 'verifying'}>
        {state === 'loading' ? 'Starting checkout…' : state === 'verifying' ? 'Verifying payment…' : `Buy ${PRODUCTS.find((p) => p.id === selected)?.label} · ₹${PRODUCTS.find((p) => p.id === selected)?.price}`}
      </Button>
      {state === 'success' && <p className="nm-dashboard-message">✓ {message}</p>}
      {state === 'error' && <p className="nm-dashboard-message nm-dashboard-message--error">{message}</p>}
      <p className="nm-dashboard-message">Payments are processed securely by Razorpay. Your NoMeta images are never uploaded for payment processing.</p>
    </div>
  );
}
