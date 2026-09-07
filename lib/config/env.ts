/**
 * Returns the canonical public site URL.
 * Falls back to localhost in development so redirects work without config.
 */
export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    'http://localhost:3000'
  );
}
