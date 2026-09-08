# NoMeta Phase 25 — Production Release Runbook

## Release gate

NoMeta v1 is release-ready only when every required check below is explicitly marked PASS. A green Vercel build proves the application builds; it does not prove live Supabase, Razorpay, browser, or production-domain behavior.

## 1. Build and automated QA

Run against the release commit:

```bash
npm run typecheck
npm test
npm run build
```

Required: all three PASS.

## 2. Browser cleaning QA

Use real test images containing known metadata and confirm:

- JPEG/ JPG: EXIF, GPS, XMP, IPTC/Photoshop, comments and supported provenance are removed.
- PNG: tEXt, zTXt, iTXt, eXIf and supported provenance are removed.
- WebP: EXIF and XMP and supported provenance are removed.
- Cleaned output is rescanned locally.
- Download is enabled only after verification passes.
- Original file remains untouched.
- Multiple images work.
- Add-more-photos works.
- Maximum Privacy is automatic; no protection-mode selector is shown.
- A failed cleaning does not consume an entitlement.

## 3. Privacy boundary QA

With browser DevTools Network enabled while cleaning an image:

- No image binary, FormData, Blob, ArrayBuffer, base64 image payload, or image URL is sent to the NoMeta API.
- Only entitlement/account/history information is sent after successful local verification.
- Supabase contains no original image or raw metadata payload.
- Browser object URLs are revoked when no longer needed.

## 4. Authentication QA

Test both configured authentication paths:

- Google OAuth sign-in.
- Email/password sign-up and sign-in.
- OAuth callback returns to the intended protected page.
- Unauthenticated users cannot access protected account APIs.
- Sign-out invalidates the authenticated session.

## 5. Entitlement QA

For a fresh test account:

1. Successful clean #1 → free entitlement consumed.
2. Successful clean #2 → free entitlement consumed.
3. Successful clean #3 with zero credits → paid entitlement required.
4. Failed local clean → no usage consumed.
5. Replaying the same completion reference → idempotent; no second charge.
6. A user cannot complete cleaning on behalf of another user.
7. Usage and credit decisions are made server-side.

## 6. Razorpay Test Mode QA

Use Razorpay Test Mode only until the entire payment matrix passes.

- Create order server-side.
- Confirm amount and currency server-side.
- Verify payment signature server-side.
- Verify payment belongs to the authenticated user/order.
- Confirm captured/paid status server-side.
- Grant exactly one credit for one successful payment.
- Replay the same webhook/event → no duplicate credit.
- Failed/aborted payment → zero credit.
- Tampered amount/currency/order/payment IDs → rejected.
- `grant_payment_credit` remains unavailable to browser users.

Test products:

- ₹5 → 1 credit.
- ₹39 → 10 credits.
- ₹79 → 25 credits.
- ₹199 → 100 credits.

## 7. Dashboard and history QA

Confirm the dashboard shows:

- remaining daily free cleanings;
- paid credits;
- buy-credit CTA;
- successful cleaning history.

History must not contain:

- original images;
- raw EXIF/GPS values;
- uploaded image payloads.

## 8. SEO and trust QA

Confirm production responses for:

- `/`
- `/clean`
- `/pricing`
- `/about`
- `/privacy`
- `/terms`
- metadata education/SEO pages
- `/robots.txt`
- `/sitemap.xml`

Check canonical URLs, page titles/descriptions, Open Graph metadata and structured data. Structured data must match visible page content.

## 9. Mobile and visual QA

Test current Chrome/Safari mobile-sized viewport and desktop:

- light mode;
- dark mode;
- upload state;
- queued batch state;
- scanning/cleaning state;
- verified state;
- error state;
- payment state;
- dashboard;
- footer/navigation;
- About page.

No clipped buttons, invisible text, horizontal overflow, or inaccessible controls.

## 10. Production configuration

Before launch:

- `NEXT_PUBLIC_SITE_URL` points to the final production domain.
- Supabase Site URL and redirect URLs use the final production domain.
- Google OAuth authorized origin/redirect configuration matches production.
- Razorpay production credentials are configured only in Vercel server-side environment variables.
- No secret is committed to Git.
- Supabase production migrations are applied.
- RLS is enabled on all user-facing tables.
- Payment grant RPC remains restricted to server/service-role execution.

## 11. Launch sequence

1. Complete Sections 1–9 and record PASS/FAIL.
2. Fix every FAIL before launch.
3. Configure final custom domain.
4. Verify DNS and HTTPS.
5. Re-run auth and `/clean` on the custom domain.
6. Switch Razorpay from Test Mode to production credentials.
7. Perform one controlled production payment.
8. Verify one credit is granted and one successful cleaning consumes it.
9. Monitor Vercel, Supabase and Razorpay for the first launch window.

## Release rule

Do not mark NoMeta v1 as launched merely because Vercel is green. Launch requires successful live verification of the privacy boundary, entitlement logic, authentication, payment verification and final domain configuration.
