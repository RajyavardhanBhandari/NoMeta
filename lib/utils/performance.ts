export function revokeObjectUrl(url?: string | null): void {
  if (!url || typeof URL === "undefined") return;
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => resolve(), { timeout: 50 });
      return;
    }
    window.setTimeout(resolve, 0);
  });
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency = 2,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(Math.max(1, concurrency), items.length || 1) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
      await yieldToBrowser();
    }
  });
  await Promise.all(runners);
  return results;
}
