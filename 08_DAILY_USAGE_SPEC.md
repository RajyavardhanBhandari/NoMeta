# NoMeta — Phase 7: Daily Free Usage

## Rule
A registered user receives **2 successful image cleanings per calendar day** for free.

After the two free cleanings are consumed, the next successful cleaning must use a paid credit (Phase 8+).

## Counting rule
A cleaning counts only when:
1. The image is processed locally.
2. A cleaned image is produced.
3. The cleaned image passes local verification.
4. Trusted server-side code records the successful cleaning.

Failed, cancelled, invalid, or unverified attempts do not consume the allowance.

## Server-side enforcement
The browser is never trusted to report usage. The authoritative record is keyed by `(user_id, usage_date)` in Postgres/Supabase.

The database constraint caps the daily counter at 2. The increment operation is transactional and must be called only by trusted server-side code.

## Privacy
The usage table contains only account/usage state. It stores no original images, image bytes, thumbnails, GPS coordinates, EXIF fields, or metadata payloads.

## Calendar day
The reference implementation uses a UTC calendar date. If product requirements later define an India-local calendar day, move the date calculation into the trusted server/database layer with an explicit `Asia/Kolkata` policy rather than relying on the browser clock.
