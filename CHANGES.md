# Phase 24 Changes

## New
- `supabase/migrations/202609070002_phase24_qa_hardening.sql`
- `tests/phase24/catalog.test.ts`
- `tests/phase24/security-contract.test.ts`
- `tests/phase24/sql-contract.test.ts`
- `deployment/PHASE_24_QA_RUNBOOK.md`
- `PHASE_24_COMPLETE.md`

## Modified
- `app/api/webhooks/razorpay/route.ts` — validates captured status, INR currency, and exact stored amount before granting credits.

## Notes
- Phase 24 is incremental and should be applied on top of Phase 23.
- Razorpay remains in Test Mode until Phase 24 manual QA passes.
