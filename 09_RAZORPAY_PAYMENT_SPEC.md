# NoMeta — Razorpay Payment Specification

## V1 product
- Price: ₹5 per additional image cleaning.
- 1 successful paid cleaning consumes 1 credit.
- Credits are server-side and persist independently of daily free usage.

## Trust boundary
The browser may request checkout, but never decides that payment succeeded and never grants itself credits.

## Required server flow
1. Authenticate user.
2. Create a Razorpay order server-side for ₹500 paise / INR.
3. Persist order ID with an internal transaction record.
4. Open Razorpay Checkout using the public key.
5. Receive payment identifiers from Checkout.
6. Verify the payment signature server-side.
7. Validate order ID, payment ID, amount, currency and expected state.
8. Atomically mark transaction paid and append +1 to the credit ledger.
9. Treat duplicate callbacks/webhooks as no-ops via idempotency keys.
10. Only then resume a paid cleaning.

## Webhooks
Use `x-razorpay-signature` with the raw request body and the webhook secret. Persist the provider event/payment identifier so replayed events cannot mint additional credits.

## Failure behavior
- Checkout cancelled: no credit.
- Signature invalid: no credit.
- Wrong amount/currency: no credit.
- Duplicate payment event: no extra credit.
- Cleaning fails after a paid credit is reserved: release/refund the internal credit according to the cleaning transaction state.

## Required environment variables
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

No credentials are committed to the repository.
