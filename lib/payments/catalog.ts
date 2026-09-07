export type ProductId =
  | 'single_credit'
  | 'bundle_10'
  | 'bundle_25'
  | 'bundle_100';

export interface Product {
  id: ProductId;
  label: string;
  amountInr: number;
  credits: number;
}

export const PRODUCTS: Record<ProductId, Product> = {
  single_credit: { id: 'single_credit', label: '1 cleaning credit',   amountInr: 5,   credits: 1   },
  bundle_10:     { id: 'bundle_10',     label: '10 cleaning credits',  amountInr: 39,  credits: 10  },
  bundle_25:     { id: 'bundle_25',     label: '25 cleaning credits',  amountInr: 79,  credits: 25  },
  bundle_100:    { id: 'bundle_100',    label: '100 cleaning credits', amountInr: 199, credits: 100 },
};

export function getProduct(id: string | null | undefined): Product | null {
  if (!id) return null;
  return PRODUCTS[id as ProductId] ?? null;
}

export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS);
}
