# Vercel Environment Matrix

| Variable | Preview | Production | Client exposed |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Preview URL | Canonical HTTPS URL | Yes |
| `AUTH_SECRET` | Preview secret | Production secret | No |
| `DATABASE_URL` | Preview DB | Production DB | No |
| `RAZORPAY_KEY_ID` | Test key ID | Production key ID | No* |
| `RAZORPAY_KEY_SECRET` | Test secret | Production secret | No |
| `RAZORPAY_WEBHOOK_SECRET` | Test webhook secret | Production webhook secret | No |
| `AUTH_GOOGLE_CLIENT_ID` | Optional preview | Production OAuth client | No |
| `AUTH_GOOGLE_CLIENT_SECRET` | Optional preview | Production OAuth secret | No |
| `NEXT_PUBLIC_ANALYTICS_ID` | Optional | Optional | Yes |

\* If Razorpay Checkout later requires a browser-safe public key, expose only the documented public key—not the secret—and keep the server-side secret private.
