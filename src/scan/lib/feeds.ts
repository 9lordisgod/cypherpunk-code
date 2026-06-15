import type { IntelArticle, SectorId } from "@/scan/types";
import {
  FEED_API_CAP,
  FEED_REFRESH_MS,
  SECTOR_MIN_ITEMS,
  X_MIN_ITEMS,
} from "./feed-config";
import { BREAKING_SLOTS, rankArticles } from "./feed-rules";
import { fetchAllFinnhub, FINNHUB_SOURCE_PRIORITIES } from "./finnhub";
import { fetchAllXTimelines } from "./twitter";
import { X_SOURCES } from "./x-sources";
import {
  getSourceHealth,
  setSourceHealth,
  type SourceHealthSnapshot,
} from "./source-health";

const globalCache = {
  articles: [] as IntelArticle[],
  fetchedAt: 0,
};

let ingestInFlight: Promise<void> | null = null;

export function hasFeedCache(): boolean {
  return globalCache.articles.length > 0;
}

function cacheAgeMs(): number {
  return globalCache.fetchedAt ? Date.now() - globalCache.fetchedAt : Infinity;
}

function buildResponse(sector: SectorId, live: boolean) {
  return {
    articles: filterSector(globalCache.articles, sector),
    fetchedAt: new Date(globalCache.fetchedAt).toISOString(),
    live,
    health: getSourceHealth(),
  };
}

const SOURCE_PRIORITY = new Map([
  ...Object.entries(FINNHUB_SOURCE_PRIORITIES).map(
    ([source, priority]) => [source, priority] as const
  ),
  ...X_SOURCES.map((s) => [s.source, s.priority ?? 0] as const),
]);

const BALANCE_SECTORS = Object.keys(SECTOR_MIN_ITEMS) as Array<
  keyof typeof SECTOR_MIN_ITEMS
>;

function dedupeRanked(
  ranked: ReturnType<typeof rankArticles>
): ReturnType<typeof rankArticles> {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return ranked.filter(({ article: a }) => {
    if (seenIds.has(a.id)) return false;

    const urlKey = a.url.toLowerCase();
    if (seenUrls.has(urlKey)) return false;

    const titleKey = a.title.toLowerCase().replace(/\s+/g, " ").trim();
    if (seenTitles.has(titleKey)) return false;

    seenIds.add(a.id);
    seenUrls.add(urlKey);
    seenTitles.add(titleKey);
    return true;
  });
}

function filterSector(
  articles: IntelArticle[],
  sector: SectorId
): IntelArticle[] {
  if (sector === "all") return articles;
  return articles.filter((a) => a.sector === sector);
}

/**
 * Rule-based ranking:
 * 1) Top BREAKING_SLOTS by intel score (recency + source + relevance)
 * 2) Sector minimum quotas from remaining pool (by score within sector)
 * 3) X minimum from remaining
 * 4) Fill to FEED_API_CAP by score
 */
export function balanceBySector(articles: IntelArticle[]): IntelArticle[] {
  const ranked = dedupeRanked(rankArticles(articles, SOURCE_PRIORITY));
  const bySector = new Map<string, typeof ranked>();

  for (const sector of BALANCE_SECTORS) {
    bySector.set(sector, []);
  }

  for (const entry of ranked) {
    const bucket = bySector.get(entry.article.sector);
    if (bucket) bucket.push(entry);
  }

  const picked: IntelArticle[] = [];
  const used = new Set<string>();

  for (const { article } of ranked) {
    if (picked.length >= BREAKING_SLOTS) break;
    if (used.has(article.id)) continue;
    picked.push(article);
    used.add(article.id);
  }

  for (const sector of BALANCE_SECTORS) {
    const quota = SECTOR_MIN_ITEMS[sector];
    let sectorCount = picked.filter((a) => a.sector === sector).length;
    for (const { article } of bySector.get(sector) ?? []) {
      if (picked.length >= FEED_API_CAP) break;
      if (sectorCount >= quota) break;
      if (used.has(article.id)) continue;
      picked.push(article);
      used.add(article.id);
      sectorCount++;
    }
  }

  let xCount = picked.filter((a) => a.platform === "x").length;
  for (const { article } of ranked) {
    if (xCount >= X_MIN_ITEMS) break;
    if (article.platform !== "x" || used.has(article.id)) continue;
    picked.push(article);
    used.add(article.id);
    xCount++;
  }

  for (const { article } of ranked) {
    if (picked.length >= FEED_API_CAP) break;
    if (used.has(article.id)) continue;
    picked.push(article);
    used.add(article.id);
  }

  const scoreMap = new Map(ranked.map((r) => [r.article.id, r.score]));

  return picked.sort((a, b) => {
    const scoreDiff = (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });
}

/** Parallel ingest — Finnhub news API + X OSINT timelines */
async function fetchAllSources(): Promise<IntelArticle[]> {
  const [news, xPosts] = await Promise.all([
    fetchAllFinnhub(),
    fetchAllXTimelines(),
  ]);

  setSourceHealth({
    news: {
      live: news.live,
      total: news.total,
      failed: news.failed,
    },
    x: {
      live: xPosts.live,
      total: xPosts.total,
      failed: xPosts.failed,
    },
    checkedAt: new Date().toISOString(),
  });

  return balanceBySector([...news.articles, ...xPosts.articles]);
}

async function runIngest(): Promise<void> {
  if (ingestInFlight) {
    await ingestInFlight;
    return;
  }

  ingestInFlight = (async () => {
    const merged = await fetchAllSources();
    globalCache.articles = merged;
    globalCache.fetchedAt = Date.now();
  })().finally(() => {
    ingestInFlight = null;
  });

  await ingestInFlight;
}

export function needsFreshIngest(): boolean {
  return !hasFeedCache() || cacheAgeMs() >= FEED_REFRESH_MS;
}

export function isIngestInFlight(): boolean {
  return ingestInFlight !== null;
}

export async function getFeed(
  sector: SectorId = "all",
  fresh = false
): Promise<{
  articles: IntelArticle[];
  fetchedAt: string;
  live: boolean;
  health: SourceHealthSnapshot | null;
  cached?: boolean;
}> {
  const cacheFresh = hasFeedCache() && cacheAgeMs() < FEED_REFRESH_MS;

  if (cacheFresh) {
    return { ...buildResponse(sector, false), cached: true };
  }

  if (ingestInFlight) {
    await ingestInFlight;
    return { ...buildResponse(sector, true), cached: false };
  }

  if (!fresh && hasFeedCache()) {
    return { ...buildResponse(sector, false), cached: true };
  }

  await runIngest();
  return { ...buildResponse(sector, true), cached: false };
}

export async function searchFeed(query: string): Promise<IntelArticle[]> {
  const { articles: all } = await getFeed("all");
  const q = query.toLowerCase();
  return all
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
    )
    .slice(0, 30);
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}