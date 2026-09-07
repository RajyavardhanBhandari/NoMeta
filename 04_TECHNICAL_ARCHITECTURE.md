# NoMeta — Technical Architecture

## Application
Next.js + React + TypeScript.

## UI layers
`app/` route composition → `components/` presentation and interaction → `lib/` domain logic.

## Metadata engine boundary
Future implementation should live behind a stable interface under:

```text
lib/metadata/
  scanner.ts
  cleaner.ts
  exif.ts
  xmp.ts
  iptc.ts
  types.ts
```

Future media types can expand to `lib/metadata/image`, `pdf`, `video`, `audio` without coupling the UI to a file format.

## Server responsibilities
Authentication, daily allowance, credits, payment orders, webhook verification and analytics. Do not move the original image into these systems merely to simplify implementation.

## Security principles
Server-side authorization for usage, verified payment signatures/webhooks, idempotency for payment/credit grants, secure secrets, rate limits and input validation.
