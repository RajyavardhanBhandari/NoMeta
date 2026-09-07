import { describe, expect, it } from 'vitest';
import { PRODUCTS, getProduct } from '../../lib/payments/catalog';

describe('NoMeta payment catalog', () => {
  it('keeps the ₹5 single-credit price at one credit', () => {
    expect(PRODUCTS.single_credit.amountInr).toBe(5);
    expect(PRODUCTS.single_credit.credits).toBe(1);
  });

  it('supports the planned non-expiring bundles', () => {
    expect(PRODUCTS.bundle_10).toMatchObject({ amountInr: 39, credits: 10 });
    expect(PRODUCTS.bundle_25).toMatchObject({ amountInr: 79, credits: 25 });
    expect(PRODUCTS.bundle_100).toMatchObject({ amountInr: 199, credits: 100 });
  });

  it('rejects unknown products', () => {
    expect(getProduct('not-a-product')).toBeNull();
    expect(getProduct(null)).toBeNull();
  });
});
