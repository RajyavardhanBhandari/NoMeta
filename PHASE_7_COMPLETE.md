# Phase 7 — Server-Side Daily Usage

Status: COMPLETE (server-side usage foundation)

Implemented:
- Daily usage domain types and 2-cleaning free allowance.
- Server-side usage decision logic.
- Verified-success-only usage recording boundary.
- Protected `/api/usage` route that fails closed until real auth/database persistence is connected.
- Supabase/Postgres migration for per-user, per-day usage.
- Atomic database function with a hard daily cap of 2.
- RLS read policy; no client-side write policy.
- Privacy-preserving usage schema with no image/metadata storage.
- Daily usage specification and integration rules.

Production dependency:
Phase 6 authentication and a Supabase server adapter must be connected before usage can be activated in production. The current API deliberately does not accept a client-supplied user ID.

Next phase:
Phase 8 — paid credits and Razorpay payment foundation.
