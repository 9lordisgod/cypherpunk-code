import type { RateLimitRule } from "./types";

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  rule: RateLimitRule
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { ok: true };
  }

  if (bucket.count >= rule.max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

export function rateLimitKey(namespace: string, ip: string) {
  return `${namespace}:${ip}`;
}