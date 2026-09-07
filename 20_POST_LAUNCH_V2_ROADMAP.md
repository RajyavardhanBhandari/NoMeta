# Phase 20 — Post-Launch Operations & V2 Roadmap

Phase 20 defines the post-launch operating model and the product roadmap from NoMeta V1 into V2. It does not add video/audio processing; those remain a V3 boundary.

## V1 operating priorities
- Monitor successful cleaning rate, errors, performance, free-usage consumption, paid credits and payment failures.
- Review user feedback and support requests before expanding scope.
- Keep image processing local in the browser for the core workflow.
- Do not collect or retain original images or raw EXIF/GPS payloads for analytics.
- Maintain rollback and incident-response procedures from Phase 19.

## V2 roadmap

### 1. Optional support / coffee money
Allow users to voluntarily support NoMeta after a successful experience. This is optional and must not block the core cleaning workflow.

### 2. Credit bundles
Introduce prepaid bundles after validating single-credit demand. Initial candidates:
- 10 credits — ₹39
- 25 credits — ₹79
- 100 credits — ₹199

Final prices should be configurable rather than hard-coded into the UI.

### 3. Pro / subscription
Explore a subscription tier for frequent users. Candidate benefits include higher usage allowances, advanced controls and reporting. Do not build recurring billing until usage data supports it.

### 4. Shareable privacy reports
Generate a shareable report describing detected metadata categories and cleaning results without exposing the original image or raw sensitive values.

### 5. More image formats
Evaluate reliable browser-local support for HEIC/HEIF and other useful formats. RAW support is exploratory and must not compromise the local-processing promise.

### 6. Advanced metadata controls
Potential capabilities:
- Field-level removal controls
- Before/after metadata comparison
- More detailed risk explanations
- Exportable privacy reports

### 7. Browser extension
Explore one-click metadata scanning/cleaning from supported browser workflows while preserving the same local-first principles.

### 8. Teams / business
Design team accounts, shared billing and admin controls for organizations that need recurring image-privacy workflows.

### 9. API
Design an API only after the browser product is stable. Any server-side API must have an explicit privacy/data-retention model and must not silently undermine the V1 local-processing promise.

### 10. Referral / affiliate system
Create measurable referrals for relevant ecosystem products and services. Keep recommendations clearly disclosed and secondary to NoMeta's core utility.

## The Founder Nation growth channel
NoMeta can send relevant traffic to The Founder Nation through useful, non-intrusive placements:
- Post-cleaning founder-resource CTA
- Footer ecosystem link
- Relevant educational/SEO content links
- Optional founder resources on the dashboard
- UTM-tagged links for attribution

The cross-promotion should never interfere with upload, scan, clean or download conversion.

## V3 boundary
Video metadata, audio metadata and broader media-privacy tooling are intentionally deferred until after the V2 growth and monetization layer has been validated.

## Success gates before V3
- Stable image-cleaning reliability
- Healthy payment/credit reconciliation
- Clear user demand for advanced controls
- Measurable retention and repeat usage
- Sustainable support/operational process
- Evidence that V2 features improve user value without weakening privacy
