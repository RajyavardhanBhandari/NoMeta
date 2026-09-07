# Phase 11 — SEO & Search Optimization

## Implemented
- Next.js metadata base and canonical URL support
- Open Graph and Twitter metadata
- robots.txt via `app/robots.ts`
- XML sitemap via `app/sitemap.ts`
- Search-safe route policy: public product/legal pages indexable; API, auth and dashboard routes disallowed
- Web app manifest
- `NEXT_PUBLIC_SITE_URL` support for deployment

## SEO principles
NoMeta should target useful intent such as photo metadata, EXIF privacy, removing GPS metadata from photos, and metadata cleaning. Avoid doorway pages, keyword stuffing, fake comparison pages, or claims that cannot be substantiated.

## Founder Nation traffic strategy
Cross-promotion should be contextual and measured in a later analytics phase. NoMeta remains the primary product experience; Founder Nation links should appear only where genuinely useful to users.

## Deployment
Set `NEXT_PUBLIC_SITE_URL` to the production origin before launch. Replace the placeholder `https://nometa.app` fallback if a different production domain is selected.
