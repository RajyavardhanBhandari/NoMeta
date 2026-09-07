export const DAILY_FREE_CLEANING_LIMIT = 2;

export type DailyUsage = {
  userId: string;
  usageDate: string;
  successfulCleanings: number;
  remainingFreeCleanings: number;
};

export type UsageDecision = {
  allowed: boolean;
  source: "free" | "paid" | "blocked";
  remainingFreeCleanings: number;
  reason?: string;
};
