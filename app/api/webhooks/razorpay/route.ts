import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';
import { jsonSecurityHeaders } from '@/lib/security';

const MAX_WEBHOOK_BYTES = 64_000;

export async function POST(request: Request) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook body too large' }, { status: 413, headers: jsonSecurityHeaders() });
  }
  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook body too large' }, { status: 413, headers: jsonSecurityHeaders() });
  }
  const signature = request.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503, headers: jsonSecurityHeaders() });
  try {
    if (!verifyRazorpayWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400, headers: jsonSecurityHeaders() });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400, headers: jsonSecurityHeaders() });
  }
  // Production: parse event, enforce idempotency on provider event/payment id,
  // validate expected amount/currency/order, and grant credits only once.
  return NextResponse.json({ received: true, persisted: false }, { headers: jsonSecurityHeaders() });
}
