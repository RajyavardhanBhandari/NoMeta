import crypto from 'node:crypto';
import { safeTimingEqual } from '@/lib/security';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

export function getRazorpayConfig(): RazorpayConfig {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!keyId || !keySecret || !webhookSecret) throw new Error('Razorpay environment is not configured');
  return { keyId, keySecret, webhookSecret };
}

export function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return safeTimingEqual(expected, signature);
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeTimingEqual(expected, signature);
}

export const SINGLE_CLEANING_PRICE_INR = 5;
export const SINGLE_CLEANING_CREDITS = 1;
