# Phase 18 — Production Preparation

Status: complete as a production-preparation code/documentation pass.

## Added
- Production-safe `/api/health` endpoint with `no-store` response headers.
- Public site URL validation helper.
- Production secret assertion helper for server-side use.
- Expanded environment template with `NEXT_PUBLIC_SITE_URL`.
- Vercel environment matrix.
- End-to-end production deployment and smoke-test checklist.

## Important boundary
This phase does not claim that Supabase, Razorpay, OAuth, or the production domain are connected. Those require the operator's real accounts and deployment environment variables.

## Commit
`chore: prepare NoMeta for production deployment`
