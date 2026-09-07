# NoMeta Production Deployment Checklist

## 1. GitHub
- Push the final repository to a private or appropriately licensed GitHub repository.
- Protect the production branch and require pull-request checks before merge.
- Never commit `.env`, `.env.local`, Razorpay secrets, database passwords, or auth secrets.

## 2. Supabase / Postgres
- Create a production project/database.
- Apply the reviewed schema and RLS policies from the usage, credits, and payment phases.
- Enable backups appropriate to the chosen Supabase plan.
- Configure Auth site URL and redirect URLs to the production NoMeta domain.
- Keep service-role credentials server-side only.
- Do not enable Storage for core V1 image processing; originals remain browser-local.

## 3. Razorpay
- Create/verify the production account and activate the required payment methods.
- Put production key ID/secret and webhook secret in Vercel environment variables.
- Configure the webhook endpoint to `/api/webhooks/razorpay` on the production domain.
- Verify webhook signatures server-side and make payment fulfillment idempotent.
- Test a real low-value payment only after the production database flow is verified.

## 4. Vercel
- Import the GitHub repository.
- Set the production framework to Next.js (automatic detection is expected).
- Add production environment variables in Vercel; do not paste secrets into source control.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- Deploy a preview first, then promote the verified commit to production.

## 5. Domain / HTTPS
- Connect the production domain in Vercel.
- Confirm HTTPS and canonical redirects.
- Confirm `robots.txt`, `sitemap.xml`, favicon, manifest, and Open Graph metadata.
- Confirm `/api/health` returns `{ ok: true }` without exposing secrets.

## 6. Smoke tests
- Landing page loads on desktop and mobile.
- JPG/PNG/WebP upload works locally.
- Scan results show expected metadata categories.
- Standard and Maximum Privacy cleaning produce downloadable files.
- Verification runs after cleaning.
- Batch ZIP works for a small batch.
- Auth redirects and logout work after Supabase integration.
- Free usage is enforced server-side.
- Paid credit fulfillment occurs only after verified payment.
- Razorpay webhook replay does not double-credit a user.
- Analytics never receives image bytes, EXIF payloads, GPS values, or filenames.

## 7. Before launch
- Replace placeholder legal contact/entity information.
- Configure production support email and monitoring.
- Review refund policy and payment disclosures.
- Run the Phase 16 automated test suite and manual QA checklist.
- Verify no development credentials or test endpoints are exposed.
