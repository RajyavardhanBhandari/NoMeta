/**
 * Production environment helpers.
 * Never expose server secrets to client components.
 */
export function getPublicSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return 'http://localhost:3000';

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    return url.origin;
  } catch {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a valid http(s) URL');
  }
}

export function assertProductionSecrets(): void {
  if (process.env.NODE_ENV !== 'production') return;

  const required = [
    'AUTH_SECRET',
    'DATABASE_URL',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
}
