# Phase 14 — Mobile Photo-Cleaning Experience

## Goal
Make NoMeta comfortable for phone-first photo cleaning without changing the local-processing privacy model.

## Included
- Responsive navigation and action sizing
- Single-column mobile hero and workflow layouts
- Mobile-friendly upload/cleaning controls
- Larger touch targets and 16px form controls to reduce mobile browser zoom
- Responsive batch list, cards and legal pages
- Reduced-motion support
- Narrow-screen footer/navigation behavior
- No image upload or server-side image processing introduced

## QA checklist
- Test iOS Safari and Android Chrome
- Test camera/photo-library picker
- Test portrait and landscape orientation
- Test 3G/slow CPU conditions
- Test 1 image, 25 images and 50 MB boundary
- Confirm downloads work after screen rotation
- Confirm object URLs are revoked when items are removed
