const STORAGE_KEY = "cypherscan_xai_api_key";
const RATE_LIMIT_KEY = "cypherscan_rate_limit";
const MAX_REQUESTS_PER_HOUR = 20;

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}${"•".repeat(12)}${key.slice(-4)}`;
}

interface RateLimitEntry {
  timestamps: number[];
}

export function checkRateLimit(): { allowed: boolean; remaining: number; resetIn: number } {
  if (typeof window === "undefined")
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR, resetIn: 0 };

  const now = Date.now();
  const hourAgo = now - 3600000;
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const entry: RateLimitEntry = stored
    ? JSON.parse(stored)
    : { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => t > hourAgo);
  const remaining = MAX_REQUESTS_PER_HOUR - entry.timestamps.length;
  const oldest = entry.timestamps[0];
  const resetIn = oldest ? Math.max(0, oldest + 3600000 - now) : 0;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    resetIn,
  };
}

export function recordRequest(): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const hourAgo = now - 3600000;
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const entry: RateLimitEntry = stored
    ? JSON.parse(stored)
    : { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => t > hourAgo);
  entry.timestamps.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(entry));
}

