# NoMeta

Privacy-first image metadata scanner and cleaner.

> Your photos reveal more than you think.

NoMeta V1 helps people inspect and remove privacy-sensitive metadata from JPG/JPEG, PNG and WebP images. The core image workflow is designed to run locally in the browser.

## Current status
- Phase 0 — Foundation: complete
- Phase 1 — Design system & UI foundation: complete
- Phase 2 — Upload experience: next

## Run locally

```bash
npm install
npm run dev
```

Then open the local Next.js development URL.

## Validate

```bash
npm run typecheck
npm run build
```

## Project structure

```text
app/             Routes and global styling
components/      Reusable UI and privacy components
lib/             Domain logic boundaries
hooks/           React hooks
public/          Static assets
design/          Design documentation
 tests/           Automated test space
```

## Product rules
- 2 successful free image cleanings per registered user per calendar day.
- Additional successful image cleanings: ₹5 each.
- Razorpay will be used for verified payments.
- Original images are not intended to be uploaded or stored for the core cleaning workflow.
- Video/audio/PDF/API/extension features are deferred beyond V1.

## Build status
- Phase 0 — Foundation: complete
- Phase 1 — Design system: complete
- Phase 2 — Upload experience: complete
- Phase 3 — Metadata scanner: next


## Phase 8 — Payments
The project now contains the server-side payment/credit boundaries for ₹5 per additional cleaning, Razorpay signature verification, webhook verification, and an immutable credit-ledger design. Live payment processing remains disabled until production auth/database and Razorpay credentials are configured.

## Phase 9
Payment UX and the user dashboard are scaffolded on top of the Phase 8 server boundaries. Provider/database credentials are intentionally not included in the project.

## Phase 10
Privacy, terms, data/cookie disclosure, security/trust, and payment/refund pages are included. These are V1 policy drafts and must be finalized to match the production legal entity, jurisdiction, contacts, retention periods, and deployed implementation before launch.


## Phase 12
Privacy-safe first-party analytics foundation is included. Events are allowlisted and blocked from carrying image, EXIF, GPS, or identity fields. Production persistence remains a deployment task.
