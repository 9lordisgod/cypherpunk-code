import type { IntelArticle } from "@/scan/types";

/**
 * CypherScan ingest rules — governs what enters the feed and in what order.
 *
 * 1. VALIDITY   — must have http(s) URL + title
 * 2. FRESHNESS  — drop items older than INGEST_MAX_AGE_MS
 * 3. NOISE      — exclude low-signal / off-mission headlines
 * 4. DEDUPE     — by id, URL, normalized title
 * 5. SCORING    — recency + trusted source tier + OSINT keyword relevance
 * 6. RANKING    — top slots = highest score (breaking lane), then sector/X quotas
 */

export const INGEST_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const HOT_WINDOW_MS = 72 * 60 * 60 * 1000;
export const X_RECENCY_BOOST_MS = 6 * 60 * 60 * 1000;

/** Pure score-based slots at the top — newest, most relevant intel first */
export const BREAKING_SLOTS = 28;

export const SCORE_WEIGHTS = {
  recency: 0.55,
  source: 0.25,
  relevance: 0.2,
} as const;

/** Boost X posts when they are fresh (OSINT accounts often break news first) */
export const X_FRESH_BOOST = 0.1;

/** Terms that indicate mission-relevant OSINT / geopolitical signal */
export const SIGNAL_TERMS = [
  "osint",
  "conflict",
  "military",
  "strike",
  "missile",
  "drone",
  "invasion",
  "sanction",
  "cyber",
  "breach",
  "hack",
  "ransomware",
  "malware",
  "apt",
  "intelligence",
  "pentagon",
  "nato",
  "ukraine",
  "russia",
  "china",
  "taiwan",
  "israel",
  "gaza",
  "iran",
  "nuclear",
  "coup",
  "protest",
  "surveillance",
  "censorship",
  "encryption",
  "arrest",
  "detained",
  "airstrike",
  "troops",
  "border",
  "ceasefire",
  "evacuation",
  "advisory",
  "vulnerability",
  "exploit",
  "zero-day",
  "espionage",
  "war",
  "defense",
  "geopolit",
  "diplomat",
  "embassy",
  "artillery",
  "naval",
  "fighter",
  "bomber",
  "satellite",
];

/** Headlines matching these are dropped — not intel-grade for this index */
export const NOISE_PATTERNS: RegExp[] = [
  /\b(crypto|bitcoin|ethereum|solana|dogecoin|nft|meme coin|altcoin)\b/i,
  /\b(price prediction|trading volume|bull market|bear market)\b/i,
  /\b(horoscope|celebrity|kardashian|reality tv)\b/i,
  /\b(nfl|nba|mlb|premier league|champions league|world cup score)\b/i,
  /\b(recipe|fashion week|red carpet)\b/i,
  /\bhow to (lose weight|get rich)\b/i,
];

export interface ScoredArticle {
  article: IntelArticle;
  score: number;
}

export function articleAgeMs(article: IntelArticle, now = Date.now()): number {
  return Math.max(0, now - new Date(article.timestamp).getTime());
}

export function isWithinIngestWindow(
  article: IntelArticle,
  now = Date.now()
): boolean {
  return articleAgeMs(article, now) <= INGEST_MAX_AGE_MS;
}

export function passesNoiseFilter(article: IntelArticle): boolean {
  const text = `${article.title} ${article.summary ?? ""}`.toLowerCase();
  return !NOISE_PATTERNS.some((re) => re.test(text));
}

export function relevanceScore(article: IntelArticle): number {
  const text = `${article.title} ${article.summary ?? ""}`.toLowerCase();
  let hits = 0;
  for (const term of SIGNAL_TERMS) {
    if (text.includes(term)) hits++;
    if (hits >= 4) break;
  }
  return Math.min(1, hits / 3);
}

export function recencyScore(article: IntelArticle, now = Date.now()): number {
  const age = articleAgeMs(article, now);
  if (age <= HOT_WINDOW_MS) {
    return 1 - age / HOT_WINDOW_MS;
  }
  const beyond = age - HOT_WINDOW_MS;
  const tail = INGEST_MAX_AGE_MS - HOT_WINDOW_MS;
  return Math.max(0.05, 0.35 * (1 - beyond / tail));
}

export function sourceTierScore(
  priority: number | undefined,
  platform: IntelArticle["platform"]
): number {
  const tier = (priority ?? 1) / 3;
  return platform === "x" ? Math.min(1, tier + 0.05) : tier;
}

export function scoreArticle(
  article: IntelArticle,
  sourcePriority: number,
  now = Date.now()
): number {
  let score =
    SCORE_WEIGHTS.recency * recencyScore(article, now) +
    SCORE_WEIGHTS.source * sourceTierScore(sourcePriority, article.platform) +
    SCORE_WEIGHTS.relevance * relevanceScore(article);

  if (
    article.platform === "x" &&
    articleAgeMs(article, now) <= X_RECENCY_BOOST_MS
  ) {
    score += X_FRESH_BOOST;
  }

  return score;
}

export function rankArticles(
  articles: IntelArticle[],
  sourcePriorities: Map<string, number>
): ScoredArticle[] {
  const now = Date.now();
  return articles
    .filter(
      (a) =>
        a.url.startsWith("http") &&
        a.title.trim().length > 0 &&
        isWithinIngestWindow(a, now) &&
        passesNoiseFilter(a)
    )
    .map((article) => ({
      article,
      score: scoreArticle(
        article,
        sourcePriorities.get(article.source) ?? 1,
        now
      ),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.article.timestamp).getTime() -
        new Date(a.article.timestamp).getTime()
      );
    });
}