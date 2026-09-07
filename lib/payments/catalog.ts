export const PRODUCTS={single_credit:{credits:1,amountInr:5,label:'1 image cleaning credit'},bundle_10:{credits:10,amountInr:39,label:'10 image cleaning credits'},bundle_25:{credits:25,amountInr:79,label:'25 image cleaning credits'},bundle_100:{credits:100,amountInr:199,label:'100 image cleaning credits'}} as const;
export type ProductId=keyof typeof PRODUCTS;
export function getProduct(id:unknown){return typeof id==='string'&&id in PRODUCTS?PRODUCTS[id as ProductId]:null;}
