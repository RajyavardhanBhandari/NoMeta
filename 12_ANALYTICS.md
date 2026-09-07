# Phase 12 — Privacy-Safe Product Analytics

## Goal
Measure product adoption and funnel performance without collecting image contents, EXIF payloads, GPS values, thumbnails, filenames, contact details, or user identity in the analytics event envelope.

## Event model
Allowlisted events:
- `page_view`
- `upload_started`
- `scan_completed`
- `cleaning_started`
- `cleaning_completed`
- `cleaning_failed`
- `download_clicked`
- `pricing_viewed`
- `checkout_started`
- `payment_verified`
- `payment_failed`
- `founder_nation_clicked`

Properties must be coarse product facts only, such as format, batch size, mode, or result category. Never send raw metadata or personal identifiers.

## Current implementation
- `lib/analytics/events.ts` contains the event allowlist and blocked property names.
- `lib/analytics/client.ts` sends small first-party events to `/api/analytics`.
- `components/analytics/PageViewTracker.tsx` records a basic page view.
- `/api/analytics` validates the event name, bounds payload size, sanitizes blocked property names, and intentionally does not persist raw request data yet.

## Production persistence
Connect the sanitized envelope to a privacy-safe analytics store in a later production step. Prefer aggregate/event data with short retention. Do not enable request/IP logging for this route if avoidable.

## Founder Nation attribution
The event `founder_nation_clicked` is reserved for future cross-promotion links. When those links are added, use campaign parameters that identify the source as NoMeta without identifying individual visitors.

## Trust rules
1. Analytics must never be required for image scanning or cleaning.
2. An analytics outage must not affect the product workflow.
3. No image bytes leave the browser for analytics.
4. No EXIF/GPS payload is sent to analytics.
5. No filename, email, phone, address, user ID, session ID or IP is intentionally included in event properties.
