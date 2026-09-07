# Phase 8 — Paid Credits + Razorpay Preparation

Status: COMPLETE (integration foundation)

Implemented:
- Credit ledger types and service boundary.
- Server-side Razorpay configuration boundary.
- Razorpay payment-signature verification helper.
- Razorpay webhook-signature verification helper.
- ₹5 / 1-credit V1 pricing constants.
- Payment order API boundary.
- Payment verification API boundary.
- Razorpay webhook API boundary.
- Credit balance API boundary.
- Idempotency/security requirements documented.

Not connected yet:
- Production database.
- Live Razorpay credentials.
- Real authenticated user lookup in these endpoints.
- Production Razorpay order creation.
- Production transaction/ledger persistence.

Those require the production auth/database choice and Razorpay account credentials. No secrets are included in this build.
