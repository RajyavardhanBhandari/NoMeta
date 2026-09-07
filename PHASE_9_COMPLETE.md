# Phase 9 — Payment UX + User Dashboard

Implemented the Phase 9 product-facing account and payment experience on top of the Phase 8 payment foundation.

## Included
- Account dashboard with today's free-cleaning allowance.
- Paid-credit balance card.
- Local-first privacy status card.
- Cleaning history placeholder designed to avoid storing original images or metadata payloads.
- Dashboard refreshes usage and credit state through `/api/usage` and `/api/credits`.
- Pricing page now has an interactive purchase CTA.
- Payment UX gracefully detects an unconfigured Razorpay environment instead of pretending payment is live.
- Dashboard contains the browser-side Razorpay Checkout integration boundary; server verification remains authoritative.
- No payment is marked successful or credit granted by the frontend.

## Important production status
Phase 9 is a UX/integration layer. Authentication, Supabase persistence, daily usage persistence, Razorpay order creation, transaction idempotency, and credit granting still require the production database/provider wiring specified in the earlier phases.

## Privacy boundary
No original images are uploaded by the dashboard/payment UX. Payment/account state is separate from image processing.
