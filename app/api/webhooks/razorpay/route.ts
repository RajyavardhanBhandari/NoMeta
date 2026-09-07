import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  try {
    if (!verifyRazorpayWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }
  // Production: parse event, enforce idempotency on provider event/payment id,
  // and grant credits only for the expected successful payment state.
  return NextResponse.json({ received: true });
}
