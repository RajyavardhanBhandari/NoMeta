import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.razorpay_order_id || !body?.razorpay_payment_id || !body?.razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
  }
  // Production: verify HMAC on the server, validate amount/currency/order state,
  // then atomically record the transaction and grant exactly one credit.
  return NextResponse.json({ verified: false, message: 'Provider verification is not connected yet.' }, { status: 501 });
}
