const FEED_WINDOW_MS = 30_000;
const feedBuckets = new Map<string, number>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkFeedRateLimit(ip: string): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const now = Date.now();
  const last = feedBuckets.get(ip) ?? 0;
  const elapsed = now - last;

  if (elapsed < FEED_WINDOW_MS) {
    return { allowed: false, retryAfterMs: FEED_WINDOW_MS - elapsed };
  }

  feedBuckets.set(ip, now);
  return { allowed: true, retryAfterMs: 0 };
}