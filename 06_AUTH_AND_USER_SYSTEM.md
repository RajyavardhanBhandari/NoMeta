# NoMeta — Authentication & User System

## Phase 6 status
Foundation implemented. Provider persistence is intentionally an adapter boundary and must be configured before production.

## Rules
- Authentication data never contains image bytes or metadata.
- Protected routes require a valid server-side session.
- Session cookie is HTTP-only, SameSite=Lax and Secure in production.
- Google OAuth and email/password or passwordless email can be connected through the auth provider.
- Password reset tokens must be single-use and short-lived.
- Email verification should be required before consuming free allowances if the chosen provider supports it.
- User ID is the stable foreign key for usage, credits and transactions.

## Production gate
Set the selected auth provider, persistence database, email delivery and OAuth credentials before enabling account creation/payment consumption in production.
