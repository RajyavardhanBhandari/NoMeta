# NoMeta — Phase 19 Launch Runbook

Phase 19 packages NoMeta v1 for the production release. It does not claim that a live Vercel/Supabase/Razorpay deployment has occurred; the operator must complete the environment and provider steps below.

## Release identity
- Product: NoMeta
- Release: v1.0.0
- Git commit: `feat: launch NoMeta v1`

## Pre-launch gates
1. `npm ci` completes from a clean checkout.
2. `npm run typecheck` passes.
3. `npm test` passes.
4. `npm run build` passes.
5. All production environment variables are configured in Vercel.
6. Supabase production project, auth redirects, database schema and RLS policies are verified.
7. Razorpay production keys and webhook endpoint are configured and signatures are verified server-side.
8. Production site URL, sitemap and robots configuration are verified.
9. Privacy Policy and Terms are reviewed with final legal/contact details.

## Critical smoke tests
- Open landing page on desktop and mobile.
- Upload a supported JPG, PNG and WebP.
- Scan metadata locally.
- Clean and verify locally.
- Download the cleaned image.
- Confirm original file is not uploaded by the core workflow.
- Confirm free usage is enforced server-side after successful cleaning only.
- Confirm paid-credit purchase cannot be credited from an unverified client callback.
- Confirm duplicate payment/webhook delivery is idempotent.
- Confirm authenticated dashboard loads only for an authenticated user.
- Confirm API responses do not cache private account/payment data.
- Confirm error and retry states remain usable.

## Vercel release sequence
1. Connect the GitHub repository to Vercel.
2. Add production environment variables.
3. Deploy a production candidate.
4. Run the smoke-test list above against the candidate URL.
5. Promote only after all gates pass.
6. Record the deployment URL, commit SHA and timestamp internally.

## Rollback
- Redeploy the last known-good Vercel deployment.
- Do not manually mutate payment or credit records to compensate for a failed UI deployment.
- Investigate failed payment/webhook cases using provider dashboards and server logs.

## Version tag
After all launch gates pass:

```bash
git tag -a v1.0.0 -m "NoMeta v1.0.0"
git push origin v1.0.0
```

## Post-release observation
For the first launch window, watch:
- application errors
- failed clean/verification operations
- auth failures
- usage-limit errors
- payment verification failures
- webhook failures
- unusual request volume
- analytics event validation failures

Never log image bytes, EXIF payloads, GPS coordinates, or original files.
