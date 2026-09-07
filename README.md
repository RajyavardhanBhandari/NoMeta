# NoMeta

Privacy-first image metadata scanner and cleaner.

## Current build
- Local JPG/JPEG, PNG and WebP processing.
- Metadata scanning and privacy-risk classification.
- Local cleaning and verification.
- Batch cleaning and ZIP export.
- Authentication UI/session boundary foundation.
- **Phase 7: server-side daily free usage foundation (2 successful cleanings/day).**

## Privacy architecture
Image files remain in the browser for the core workflow. Server-side account and usage state contains no image bytes or metadata payloads.

## Stack target
Next.js + TypeScript, GitHub, Vercel, Supabase Auth/Postgres, Razorpay.

## Important
Authentication, database persistence and payments are foundation boundaries until their production providers are configured. Never commit secrets; use deployment environment variables.
