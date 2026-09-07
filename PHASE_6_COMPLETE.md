# Phase 6 — Authentication

Status: COMPLETE (foundation)

Implemented:
- Sign-in route
- Sign-up route
- Forgot-password route
- Reset-password route
- Auth component foundation
- Secure session-cookie boundary
- Sign-out API
- Protected-route configuration boundary
- Authentication specification

Production dependency:
A real persistence/auth provider must be configured before enabling account creation. The UI deliberately reports this rather than pretending authentication is active.

Privacy rule: authentication never receives image bytes. Photos remain local to the browser.
