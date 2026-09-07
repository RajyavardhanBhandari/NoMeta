import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('NoMeta Phase 24 security contracts', () => {
  const root = process.cwd();
  const webhook = fs.readFileSync(path.join(root, 'app/api/webhooks/razorpay/route.ts'), 'utf8');
  const cleaning = fs.readFileSync(path.join(root, 'app/api/cleaning/complete/route.ts'), 'utf8');
  const payment = fs.readFileSync(path.join(root, 'app/api/payment/verify/route.ts'), 'utf8');

  it('validates webhook amount, currency, and captured status before credit grant', () => {
    expect(webhook).toContain("currency!=='INR'");
    expect(webhook).toContain("status!=='captured'");
    expect(webhook).toContain('stored.amount_paise!==amount');
    expect(webhook).toContain('grant_payment_credit');
  });

  it('requires an authenticated user before recording a cleaning', () => {
    expect(cleaning).toContain("Authentication required");
    expect(cleaning).toContain('complete_cleaning');
  });

  it('server-verifies Razorpay signatures and fetches payment state', () => {
    expect(payment).toContain('verifyRazorpayPaymentSignature');
    expect(payment).toContain('fetchRazorpayPayment');
    expect(payment).toContain("payment.status!=='captured'");
  });
});
