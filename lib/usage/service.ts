import { DAILY_FREE_CLEANING_LIMIT, type DailyUsage, type UsageDecision } from "./types";

/**
 * Phase 7 domain logic. Persistence is deliberately injected so the product
 * can use Supabase/Postgres without coupling image processing to a database.
 */
export interface UsageRepository {
  getDailyUsage(userId: string, usageDate: string): Promise<DailyUsage>;
  incrementSuccessfulCleaning(userId: string, usageDate: string): Promise<DailyUsage>;
}

export function utcCalendarDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function getFreeAllowance(usage: DailyUsage): UsageDecision {
  const remaining = Math.max(0, DAILY_FREE_CLEANING_LIMIT - usage.successfulCleanings);
  if (remaining > 0) {
    return { allowed: true, source: "free", remainingFreeCleanings: remaining };
  }
  return {
    allowed: false,
    source: "blocked",
    remainingFreeCleanings: 0,
    reason: "Daily free cleaning allowance exhausted.",
  };
}

/**
 * Call this only after a cleaning has succeeded AND verification has passed.
 * The SQL transaction should make the increment atomic per user/day.
 */
export async function recordVerifiedFreeCleaning(
  repository: UsageRepository,
  userId: string,
  now = new Date(),
): Promise<DailyUsage> {
  const usageDate = utcCalendarDate(now);
  const current = await repository.getDailyUsage(userId, usageDate);
  if (current.successfulCleanings >= DAILY_FREE_CLEANING_LIMIT) {
    throw new Error("FREE_DAILY_LIMIT_REACHED");
  }
  return repository.incrementSuccessfulCleaning(userId, usageDate);
}
