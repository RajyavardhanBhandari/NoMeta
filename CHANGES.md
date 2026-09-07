# Phase 22 Changes

## New
- `lib/security/request.ts`
- `PHASE_22_COMPLETE.md`
- `CHANGES.md`

## Modified
- `app/api/analytics/route.ts`
- `app/api/payment/create-order/route.ts`
- `app/api/payment/verify/route.ts`
- `app/api/webhooks/razorpay/route.ts`

## Unchanged
All other NoMeta files from Phase 21 remain unchanged.

## Phase 23
- Added real Supabase Auth SSR/browser integration with email/password and Google OAuth.
- Added production Supabase schema/RLS for profiles, daily usage, credits, cleaning history, payment orders and webhook events.
- Added atomic server-side entitlement logic: 2 free successful cleanings/day, then paid credits.
- Added non-expiring credit bundles: 1/10/25/100 credits at ₹5/₹39/₹79/₹199.
- Added Razorpay Test Mode order creation, payment lookup, signature verification and webhook idempotency.
- Added privacy-first history and admin operational foundation.
- Kept originals and raw metadata out of persistence.
