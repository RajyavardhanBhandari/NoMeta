# NoMeta

Privacy-first image metadata scanner and cleaner.

> Your photos reveal more than you think.
> Find hidden metadata. Remove it. Share safely.

## Phase 0

This repository contains the Phase 0 foundation: product requirements, brand/design direction, UX flows, technical architecture, and a minimal Next.js application shell.

## V1 scope

- Images only
- JPG/JPEG, PNG, WebP initially
- Browser-local image processing
- Metadata inspection and privacy explanations
- Standard Privacy and Maximum Privacy cleaning modes
- Verification before download
- Account-based allowance: 2 successful free cleanings per calendar day
- ₹5 per additional successful image cleaning after the free allowance
- Razorpay payments

PDF, video, audio, browser extension, API and team features are deferred.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Project structure

See `00_MASTER_BUILD_PLAN.md` and `04_TECHNICAL_ARCHITECTURE.md`.
