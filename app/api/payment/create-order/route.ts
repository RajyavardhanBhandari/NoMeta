import { NextResponse } from 'next/server';
import { SINGLE_CLEANING_PRICE_INR } from '@/lib/payments/razorpay';

export async function POST() {
  // Production: authenticate user, create a Razorpay order server-side,
  // persist the order idempotently, and return only the public checkout data.
  return NextResponse.json({
    configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    amount: SINGLE_CLEANING_PRICE_INR * 100,
    currency: 'INR',
    credits: 1,
    message: 'Razorpay order creation is ready for provider credentials and database wiring.',
  });
}
