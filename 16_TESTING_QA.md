# Phase 16 — Testing & Quality Assurance

Phase 16 establishes an automated regression suite for the highest-risk NoMeta logic.

## Coverage
- JPEG, PNG and WebP metadata scanning fixtures
- Metadata cleaning and post-clean verification
- Upload type, size and empty-file validation
- Security headers and JSON cache policy
- Configured origin validation
- Razorpay timing-safe comparison helper

## Run
```bash
npm install
npm test
```

Optional watch mode:
```bash
npm run test:watch
```

## Important
The suite is intentionally fixture-based and does not upload images anywhere. The production Supabase and Razorpay integrations require environment-backed integration tests before launch.
