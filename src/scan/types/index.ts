export type SectorId =
  | "all"
  | "tech"
  | "politics"
  | "conflict"
  | "freedom"
  | "security";

export interface IntelArticle {
  id: string;
  title: string;
  /** Primary article URL from the publisher (RSS item link) */
  url: string;
  source: string;
  /** RSS endpoint or X profile URL this item was ingested from */
  feedUrl: string;
  /** finnhub = Finnhub news API, x = X/Twitter post */
  platform?: "finnhub" | "x";
  /** X handle when platform is x */
  authorHandle?: string;
  sector: SectorId;
  summary?: string;
  timestamp: string;
  domain?: string;
  country?: string;
  image?: string;
  tags?: string[];
}

export interface SectorMeta {
  id: SectorId;
  label: string;
  description: string;
  color: string;
}