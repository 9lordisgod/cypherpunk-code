import { createHash } from "crypto";
import type { IntelArticle, SectorId } from "@/scan/types";

const FINNHUB_BASE = "https://finnhub.io/api/v1/news";
const FETCH_TIMEOUT_MS = 15_000;

export const FINNHUB_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "crypto", label: "Crypto" },
] as const;

export type FinnhubCategory = (typeof FINNHUB_CATEGORIES)[number]["id"];

interface FinnhubNewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image?: string;
  related?: string;
  source: string;
  summary: string;
  url: string;
}

/** Publisher weight in ranking — higher = more trusted for breaking lane */
export const FINNHUB_SOURCE_PRIORITIES: Record<string, number> = {
  Reuters: 4,
  BBC: 4,
  "Associated Press": 4,
  AP: 4,
  Bloomberg: 3,
  "Financial Times": 3,
  "The Guardian": 3,
  Guardian: 3,
  CNBC: 2,
  CNN: 2,
  NPR: 2,
  Politico: 2,
  "Al Jazeera": 3,
  CoinDesk: 2,
  Cointelegraph: 2,
  "The Block": 2,
};

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY?.trim();
  if (!key) {
    throw new Error("FINNHUB_API_KEY is not configured");
  }
  return key;
}

function articleId(id: number, url: string): string {
  const hash = createHash("sha256")
    .update(`finnhub::${id}::${url}`)
    .digest("base64url")
    .slice(0, 22);
  return `finnhub-${hash}`;
}

function classifySector(
  headline: string,
  summary: string,
  category: FinnhubCategory
): SectorId {
  const text = `${headline} ${summary}`.toLowerCase();

  if (
    /military|war\b|strike|missile|troops|airstrike|invasion|nato|pentagon|artillery|ceasefire|drone\b|conflict/.test(
      text
    )
  ) {
    return "conflict";
  }
  if (
    /cyber|breach|hack|ransomware|malware|vulnerability|exploit|zero-day|apt\b|phishing/.test(
      text
    )
  ) {
    return "security";
  }
  if (
    /surveillance|censorship|encryption|privacy|vpn|whistleblower|bitcoin|crypto|monero|sanction|detained|protest/.test(
      text
    )
  ) {
    return "freedom";
  }
  if (
    /semiconductor|chip\b|regulation|infrastructure|openai|artificial intelligence|\bai\b|tech policy/.test(
      text
    )
  ) {
    return "tech";
  }
  if (category === "crypto") return "freedom";
  return "politics";
}

function toIntelArticle(
  item: FinnhubNewsItem,
  category: FinnhubCategory
): IntelArticle | null {
  const url = item.url?.trim();
  const title = item.headline?.trim();
  if (!url || !title) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  } catch {
    return null;
  }

  const timestamp = new Date(item.datetime * 1000).toISOString();

  return {
    id: articleId(item.id, url),
    title,
    url,
    source: item.source?.trim() || "Finnhub",
    feedUrl: `finnhub://news?category=${category}`,
    platform: "finnhub",
    sector: classifySector(title, item.summary ?? "", category),
    summary: (item.summary ?? "").slice(0, 200),
    timestamp,
    domain: tryDomain(url),
    image: item.image,
    tags: item.category ? [item.category] : undefined,
  };
}

async function fetchCategory(
  category: FinnhubCategory
): Promise<{ articles: IntelArticle[]; ok: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      category,
      token: getApiKey(),
    });
    const res = await fetch(`${FINNHUB_BASE}?${params}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return { articles: [], ok: false };

    const data = (await res.json()) as FinnhubNewsItem[];
    if (!Array.isArray(data)) return { articles: [], ok: false };

    const articles: IntelArticle[] = [];
    for (const item of data) {
      const mapped = toIntelArticle(item, category);
      if (mapped) articles.push(mapped);
    }

    return { articles, ok: articles.length > 0 };
  } catch {
    return { articles: [], ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export interface IngestBatch {
  articles: IntelArticle[];
  live: number;
  total: number;
  failed: string[];
}

export async function fetchAllFinnhub(): Promise<IngestBatch> {
  const results = await Promise.all(
    FINNHUB_CATEGORIES.map(async (cat) => {
      const result = await fetchCategory(cat.id);
      return { category: cat.id, ...result };
    })
  );

  const seenUrls = new Set<string>();
  const articles: IntelArticle[] = [];
  const failed: string[] = [];
  let live = 0;

  for (const { category, articles: items, ok } of results) {
    if (ok) {
      live++;
      for (const article of items) {
        const key = article.url.toLowerCase();
        if (seenUrls.has(key)) continue;
        seenUrls.add(key);
        articles.push(article);
      }
    } else {
      failed.push(category);
    }
  }

  return {
    articles,
    live,
    total: FINNHUB_CATEGORIES.length,
    failed,
  };
}

function tryDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}