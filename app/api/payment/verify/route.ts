import { NextResponse } from 'next/server';
import { isAllowedOrigin, jsonSecurityHeaders } from '@/lib/security';
import { readBoundedText } from '@/lib/security/request';
import { verifyRazorpayPaymentSignature } from '@/lib/payments/razorpay';

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return new NextResponse(null, { status: 403, headers: jsonSecurityHeaders() });
  try {
    const raw = await readBoundedText(request);
    const body = JSON.parse(raw);
    if (!body?.razorpay_order_id || !body?.razorpay_payment_id || !body?.razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400, headers: jsonSecurityHeaders() });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: 'Payment verification is not configured' }, { status: 503, headers: jsonSecurityHeaders() });
    const verified = verifyRazorpayPaymentSignature(
      String(body.razorpay_order_id),
      String(body.razorpay_payment_id),
      String(body.razorpay_signature),
      secret,
    );
    if (!verified) return NextResponse.json({ verified: false, error: 'Invalid payment signature' }, { status: 400, headers: jsonSecurityHeaders() });

    // Persistence must additionally validate the server-created order, amount/currency,
    // payment state, and idempotency before granting a credit.
    return NextResponse.json({ verified: true, persisted: false, message: 'Signature verified; payment persistence is not connected yet.' }, { status: 501, headers: jsonSecurityHeaders() });
  } catch (error) {
    const status = error instanceof Error && error.message === 'REQUEST_TOO_LARGE' ? 413 : 400;
    return NextResponse.json({ error: status === 413 ? 'Request too large' : 'Invalid payment verification request' }, { status, headers: jsonSecurityHeaders() });
  }
}
