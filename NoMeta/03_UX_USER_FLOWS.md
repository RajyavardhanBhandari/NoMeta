# NoMeta — UX User Flows

## Primary
1. User lands on NoMeta.
2. User understands local-first privacy promise.
3. User selects Scan a photo.
4. User chooses an image.
5. Scanner presents metadata grouped by privacy relevance.
6. User selects Standard Clean or Maximum Privacy.
7. Browser creates a cleaned copy.
8. NoMeta verifies the output where technically practical.
9. User downloads the cleaned image.

## Billing interruption
- Free allowance is checked only when a successful cleaning is about to occur.
- If no free allowance remains, user is shown ₹5 paid cleaning/credit flow.
- Payment is server-verified before credit is granted.

## Failure principles
Never silently fail. Explain unsupported formats, corrupt files, memory/browser limitations, cleaning failures and payment failures in plain language.
