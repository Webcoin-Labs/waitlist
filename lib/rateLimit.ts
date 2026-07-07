/**
 * In-memory rate limiter (per-process). Fine for a single-instance waitlist
 * microsite; swap for Upstash if this ever runs multi-instance.
 */
const memoryStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimitMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  entry.count += 1;
  if (entry.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - entry.count };
}

export async function rateLimitAsync(key: string, limit = MAX_PER_WINDOW, windowMs = WINDOW_MS) {
  return rateLimitMemory(key, limit, windowMs);
}

export function rateLimitKey(identifier: string, action: string): string {
  return `rl:${action}:${identifier}`;
}
