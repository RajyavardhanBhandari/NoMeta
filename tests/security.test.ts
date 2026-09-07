import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { applySecurityHeaders, isAllowedOrigin, jsonSecurityHeaders, safeTimingEqual } from '@/lib/security';

describe('security boundaries', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;
  beforeEach(() => { process.env.NEXT_PUBLIC_SITE_URL = 'https://nometa.example'; });
  afterEach(() => { process.env.NEXT_PUBLIC_SITE_URL = original; });

  it('applies baseline security headers', () => {
    const headers = applySecurityHeaders(new Headers());
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('marks JSON responses as non-cacheable', () => {
    const headers = jsonSecurityHeaders();
    expect(headers.get('Cache-Control')).toBe('no-store');
  });

  it('validates configured origins', () => {
    expect(isAllowedOrigin(new Request('https://nometa.example/api', { headers: { origin: 'https://nometa.example' } }))).toBe(true);
    expect(isAllowedOrigin(new Request('https://nometa.example/api', { headers: { origin: 'https://evil.example' } }))).toBe(false);
  });

  it('compares equal-length strings safely', () => {
    expect(safeTimingEqual('abc', 'abc')).toBe(true);
    expect(safeTimingEqual('abc', 'abd')).toBe(false);
    expect(safeTimingEqual('abc', 'ab')).toBe(false);
  });
});
