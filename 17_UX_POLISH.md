# Phase 17 — UX Polish & Error Handling

## Delivered
- Application-level React error boundary with recovery and restart actions.
- Clear failure copy that reinforces that originals remain local.
- Consistent disabled/loading button behavior.
- Strong keyboard focus treatment for links, controls and inputs.
- Mobile error-state layout and full-width recovery actions.
- Reduced-motion handling for users who request less animation.
- Fixed the uploader's alert icon dependency.
- Kept payment, metadata and image processing behavior unchanged.

## UX principles
- Never imply a failed operation uploaded an image.
- Give users a recovery action and a safe restart path.
- Avoid trapping users in a dead-end state.
- Preserve the local-first privacy promise in error messaging.

## QA checklist
- [ ] Upload invalid file and recover.
- [ ] Cancel/retry a batch.
- [ ] Download a verified cleaned image.
- [ ] Exercise payment unavailable/failure states.
- [ ] Verify keyboard navigation and focus visibility.
- [ ] Verify mobile at 320px, 375px and 430px widths.
- [ ] Verify reduced-motion behavior.
