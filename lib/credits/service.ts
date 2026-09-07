import type { CreditLedgerEntry, CreditBalance } from './types';

/**
 * Persistence adapter boundary. Replace the in-memory adapter with a DB
 * transaction in production. Keeping this boundary prevents payment logic
 * from becoming coupled to a particular database vendor.
 */
export interface CreditStore {
  getBalance(userId: string): Promise<CreditBalance>;
  append(entry: Omit<CreditLedgerEntry, 'id' | 'createdAt'>): Promise<CreditLedgerEntry>;
}

export async function grantCredits(store: CreditStore, userId: string, credits: number, referenceId: string) {
  if (!Number.isInteger(credits) || credits <= 0) throw new Error('Invalid credit amount');
  return store.append({ userId, amount: credits, type: 'purchase', referenceId });
}

export async function consumeCredit(store: CreditStore, userId: string, referenceId: string) {
  const balance = await store.getBalance(userId);
  if (balance.balance < 1) throw new Error('INSUFFICIENT_CREDITS');
  return store.append({ userId, amount: -1, type: 'consume', referenceId });
}
