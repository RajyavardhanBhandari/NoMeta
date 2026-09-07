# NoMeta — Product Requirements

## V1
NoMeta is a privacy-first web app for inspecting and removing metadata from images.

### Supported formats
- JPG / JPEG
- PNG
- WebP
- HEIC/HEIF only after reliable browser implementation and testing

### Core workflow
Landing → Upload → Scan → Understand → Clean → Verify → Download

### Privacy requirement
Core image processing should happen locally in the browser. Original images must not be uploaded or persisted for the cleaning workflow.

### Commercial model
Registered users receive 2 successful image cleanings per calendar day. Additional successful image cleanings cost ₹5 each through verified Razorpay payments/credits.

## V1 exclusions
Video, audio, PDF, browser extension, API, team features and enterprise controls are explicitly deferred.
