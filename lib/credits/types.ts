export type CreditLedgerType = 'purchase' | 'consume' | 'refund' | 'adjustment';

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  amount: number;
  type: CreditLedgerType;
  referenceId?: string;
  createdAt: string;
}

export interface CreditBalance {
  userId: string;
  balance: number;
}
