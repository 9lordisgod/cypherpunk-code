import type { IntelArticle } from "@/scan/types";
import { X_SOURCES, type XSource } from "./x-sources";

const FX_API = "https://api.fxtwitter.com/2/profile";
const X_BATCH_SIZE = 5;

interface FxTweet {
  id: string;
  url: string;
  text: string;
  created_at?: string;
  created_timestamp?: number;
}

interface FxTimelineResponse {
  code: number;
  results?: FxTweet[];
}

function tweetTimestamp(tweet: FxTweet): string {
  if (tweet.created_timestamp) {
    return new Date(tweet.created_timestamp * 1000).toISOString();
  }
  if (tweet.created_at) {
    const parsed = new Date(tweet.created_at);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

function isValidTweetUrl(url?: string): url is string {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === "x.com" || parsed.hostname === "twitter.com") &&
      parsed.pathname.includes("/status/")
    );
  } catch {
    return false;
  }
}

export async function fetchXTimeline(
  source: XSource
): Promise<IntelArticle[]> {
  try {
    const res = await fetch(`${FX_API}/${source.handle}/statuses`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as FxTimelineResponse;
    if (data.code !== 200 || !data.results?.length) return [];

    const articles: IntelArticle[] = [];
    const limit = source.limit ?? 6;

    for (const tweet of data.results) {
      if (articles.length >= limit) break;

      const text = tweet.text?.trim();
      if (!text) continue;

      const url = isValidTweetUrl(tweet.url)
        ? tweet.url
        : `https://x.com/${source.handle}/status/${tweet.id}`;

      if (!isValidTweetUrl(url)) continue;

      articles.push({
        id: `x-${source.handle}-${tweet.id}`,
        title: text.length > 280 ? `${text.slice(0, 277)}…` : text,
        url,
        source: source.source,
        feedUrl: `https://x.com/${source.handle}`,
        platform: "x",
        authorHandle: source.handle,
        sector: source.sector,
        summary: text.length > 200 ? text : undefined,
        timestamp: tweetTimestamp(tweet),
        domain: "x.com",
      });
    }

    return articles;
  } catch {
    return [];
  }
}

async function fetchXTimelineWithRetry(source: XSource): Promise<IntelArticle[]> {
  const first = await fetchXTimeline(source);
  if (first.length > 0) return first;
  return fetchXTimeline(source);
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

export interface XIngestBatch {
  articles: IntelArticle[];
  live: number;
  total: number;
  failed: string[];
}

export async function fetchAllXTimelines(): Promise<XIngestBatch> {
  const timelineResults = await mapInBatches(X_SOURCES, X_BATCH_SIZE, (source) =>
    fetchXTimelineWithRetry(source)
  );

  const articles: IntelArticle[] = [];
  const failed: string[] = [];
  let live = 0;

  timelineResults.forEach((items, index) => {
    const source = X_SOURCES[index];
    if (items.length > 0) {
      live++;
      articles.push(...items);
    } else {
      failed.push(source.source);
    }
  });

  return { articles, live, total: X_SOURCES.length, failed };
}