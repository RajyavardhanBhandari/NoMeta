# NoMeta — Metadata Engine Specification

## Phase 3

The scanner runs in the browser against the selected File/ArrayBuffer. The server is not part of the image-processing path.

### V1 formats
- JPEG/JPG
- PNG
- WebP

### Extraction targets
- EXIF
- GPS
- XMP
- IPTC / Photoshop-related segments where detectable
- PNG textual metadata chunks
- WebP EXIF/XMP chunks

### Normalized categories
Location, Device, Time, Identity, Software, Technical, Provenance, Other.

### Privacy interpretation
Each detected field is mapped to a risk level and a human-readable explanation. The score is an informational exposure indicator, not a security certification.

### Constraints
- Never upload the image for scanning.
- Never persist the original image in the backend.
- Do not claim complete metadata detection until the cleaner/verification corpus is tested across real-world samples.
- Parser failures must fail safely and visibly.

### Next phase
Phase 4 will implement metadata cleaning and local verification against the same normalized result model.
