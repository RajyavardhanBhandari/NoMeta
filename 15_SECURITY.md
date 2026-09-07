# Phase 15 — Security Hardening

## Included
- Security response headers at the Next.js boundary
- `poweredByHeader` disabled
- API responses marked `no-store`
- Origin validation for analytics POSTs
- Safer constant-time comparison for Razorpay signatures, including unequal-length handling
- HSTS in production
- Explicit browser capability restrictions via Permissions-Policy
- Cross-origin isolation/resource policy headers
- No raw image, EXIF, GPS or payment secrets in client analytics

## Production requirements
- Configure HTTPS and `NEXT_PUBLIC_SITE_URL`
- Keep Razorpay secret/webhook secret and Supabase service-role credentials server-side only
- Add provider/database-backed rate limiting before launch
- Verify authenticated ownership for every account/credit mutation
- Keep webhook idempotency in the database
- Run dependency and secret scanning in CI
- Do not place service-role keys in `NEXT_PUBLIC_*` variables
