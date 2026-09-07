# NoMeta Phase 24 — QA Runbook

Phase 24 is a validation/hardening phase. Run it after applying Phase 23 and the Phase 24 migration.

## Automated checks

```bash
npm run typecheck
npm test
npm run build
```

All three should pass before production rollout.

## Supabase checks

1. Apply `supabase/migrations/202609070002_phase24_qa_hardening.sql` after the Phase 23 migration.
2. Confirm the `profiles` trigger creates a profile for a new user.
3. Confirm authenticated users can read only their own usage, credits, history, and payment orders.
4. Confirm browser roles cannot execute `grant_payment_credit` directly.
5. Confirm `complete_cleaning` can be called only by authenticated users.

## Authentication checks

- Sign up with email/password.
- Confirm email and sign in.
- Sign in with Google.
- Sign out and confirm the dashboard is protected.
- Confirm a second account cannot read the first account's history or credits.

## Entitlement checks

- Successful cleaning #1 consumes free allowance 1/2.
- Successful cleaning #2 consumes free allowance 2/2.
- Successful cleaning #3 requires a paid credit.
- A failed/unverified cleaning does not consume an entitlement.
- Replaying the same cleaning reference is idempotent.
- Paid credits remain available across calendar days.

## Razorpay Test Mode checks

- Create ₹5 order.
- Create a bundle order.
- Complete a successful test payment.
- Verify payment server-side.
- Confirm exactly the purchased credits are granted.
- Replay verification and confirm no duplicate credit.
- Replay the same webhook and confirm idempotency.
- Test a wrong signature.
- Test a wrong amount/currency webhook.
- Test a non-captured payment.

## Privacy checks

Use browser DevTools Network while cleaning an image.

- No original image request should be sent to NoMeta's application API.
- No EXIF/GPS payload should be sent to analytics.
- No original image or raw metadata should appear in Supabase.
- The downloaded cleaned image should pass the local verification step.

## Mobile checks

Test at least one recent iPhone and Android device:

- camera photo upload
- gallery photo upload
- single cleaning
- batch cleaning
- download/share
- large image

## Release gate

Do not switch Razorpay to live mode until the automated checks and the manual checks above pass in the production-like Vercel environment.
