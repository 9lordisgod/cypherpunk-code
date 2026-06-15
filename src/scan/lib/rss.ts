import { createHash } from "crypto";
import Parser from "rss-parser";
import type { IntelArticle } from "@/scan/types";
import { RSS_PER_FEED } from "./feed-config";
import { RSS_SOURCES, type RssSource } from "./sectors";

const RSS_TIMEOUT_MS = 20_000;
const RSS_BATCH_SIZE = 4;
const RSS_RECOVERY_DELAY_MS = 400;

const parser = new Parser({
  timeout: RSS_TIMEOUT_MS,
  headers: { "User-Agent": "CypherScan/1.0 (+https://github.com/cypherscan)" },
});

function articleId(url: string, source: string, title: string): string {
  const key = `${source}::${url.trim() || title.trim() || "untitled"}`;
  const hash = createHash("sha256").update(key).digest("base64url").slice(0, 22);
  return `rss-${hash}`;
}

function isValidArticleUrl(url?: string): url is string {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeTags(categories: unknown): string[] | undefined {
  if (!Array.isArray(categories)) return undefined;
  const tags = categories
    .map((cat) => {
      if (typeof cat === "string") return cat.trim();
      if (cat && typeof cat === "object") {
        const obj = cat as Record<string, unknown>;
        if (typeof obj._ === "string") return obj._.trim();
        if (typeof obj.term === "string") return obj.term.trim();
      }
      return "";
    })
    .filter(Boolean);
  return tags.length > 0 ? tags : undefined;
}

function resolveItemUrl(item: {
  link?: string;
  guid?: string;
}): string | null {
  for (const candidate of [item.link, item.guid]) {
    if (isValidArticleUrl(candidate)) return candidate.trim();
  }
  return null;
}

export async function fetchRssFeed(
  feed: RssSource,
  limit = RSS_PER_FEED
): Promise<IntelArticle[]> {
  const perFeed = feed.limit ?? limit;

  try {
    const parsed = await parser.parseURL(feed.url);
    const articles: IntelArticle[] = [];

    for (const item of parsed.items ?? []) {
      if (articles.length >= perFeed) break;

      const url = resolveItemUrl(item);
      if (!url) continue;

      const title = (item.title ?? "").trim();
      if (!title) continue;

      articles.push({
        id: articleId(url, feed.source, title),
        title,
        url,
        source: feed.source,
        feedUrl: feed.url,
        platform: "rss",
        sector: feed.sector,
        summary: stripHtml(item.contentSnippet ?? item.content ?? "").slice(
          0,
          200
        ),
        timestamp: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        domain: tryDomain(url),
        tags: normalizeTags(item.categories),
      });
    }

    return articles;
  } catch {
    return [];
  }
}

async function fetchRssFeedWithRetry(feed: RssSource): Promise<IntelArticle[]> {
  const first = await fetchRssFeed(feed);
  if (first.length > 0) return first;
  return fetchRssFeed(feed);
}

async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const chunk = await Promise.all(batch.map(fn));
    results.push(...chunk);
  }
  return results;
}

export interface IngestBatch {
  articles: IntelArticle[];
  live: number;
  total: number;
  failed: string[];
}

export async function fetchAllRss(
  sources: RssSource[] = RSS_SOURCES
): Promise<IngestBatch> {
  const feedResults = await mapInBatches(sources, RSS_BATCH_SIZE, (source) =>
    fetchRssFeedWithRetry(source)
  );

  const articles: IntelArticle[] = [];
  const failed: string[] = [];
  let live = 0;

  const failedSources: RssSource[] = [];

  feedResults.forEach((items, index) => {
    const source = sources[index];
    if (items.length > 0) {
      live++;
      articles.push(...items);
    } else {
      failedSources.push(source);
    }
  });

  for (const source of failedSources) {
    await new Promise((r) => setTimeout(r, RSS_RECOVERY_DELAY_MS));
    const items = await fetchRssFeed(source);
    if (items.length > 0) {
      live++;
      articles.push(...items);
    } else {
      failed.push(source.source);
    }
  }

  return { articles, live, total: sources.length, failed };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function tryDomain(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}