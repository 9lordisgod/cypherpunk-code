/** Max items kept in browser memory */
export const FEED_STORE_CAP = 200;

/** Max items rendered per sector view */
export const FEED_DISPLAY_CAP = 48;

/** Auto-ingest interval while Intel tab is open */
export const FEED_REFRESH_MS = 60_000;

/** Below this fraction of sources live → STATUS: DEGRADED */
export const HEALTH_OPERATIONAL_RATIO = 0.9;

/** Drop items older than this from ingest (see feed-rules.ts for full policy) */
export const FEED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Server-side max items after sector balancing */
export const FEED_API_CAP = 200;

/** Guaranteed minimum items per sector in every ingest */
export const SECTOR_MIN_ITEMS: Record<
  "conflict" | "politics" | "security" | "freedom" | "tech",
  number
> = {
  conflict: 24,
  politics: 28,
  security: 24,
  freedom: 20,
  tech: 18,
};

/** Minimum X/Twitter posts guaranteed per balanced ingest */
export const X_MIN_ITEMS = 32;

/** Default items pulled per RSS source */
export const RSS_PER_FEED = 12;