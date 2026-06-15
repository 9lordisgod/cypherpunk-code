import type { SectorId, SectorMeta } from "@/scan/types";

export const SECTORS: SectorMeta[] = [
  {
    id: "all",
    label: "ALL SECTORS",
    description: "Full-spectrum global intelligence picture",
    color: "var(--text-primary)",
  },
  {
    id: "conflict",
    label: "CONFLICT",
    description: "Military operations, flashpoints, defense policy, kinetic events",
    color: "var(--accent-red)",
  },
  {
    id: "politics",
    label: "GEOPOLITICS",
    description: "Diplomacy, elections, sanctions, statecraft, international law",
    color: "var(--text-bright)",
  },
  {
    id: "security",
    label: "CYBER",
    description: "Nation-state ops, breaches, advisories, OSINT investigations",
    color: "var(--accent-amber)",
  },
  {
    id: "freedom",
    label: "FREEDOM TECH",
    description: "Surveillance, censorship, encryption, digital rights, press freedom",
    color: "var(--accent-green)",
  },
  {
    id: "tech",
    label: "TECH POLICY",
    description: "AI governance, semiconductors, critical infrastructure, regulation",
    color: "var(--accent-cyan)",
  },
];

export function getSector(id: SectorId): SectorMeta {
  return SECTORS.find((s) => s.id === id) ?? SECTORS[0];
}

export interface RssSource {
  url: string;
  source: string;
  sector: SectorId;
  /** Higher = more weight in sort when timestamps are close */
  priority?: number;
  /** Items to pull per ingest (default from feed-config) */
  limit?: number;
}

/** Verified OSINT / geopolitical RSS — no API keys */
export const RSS_SOURCES: RssSource[] = [
  // Conflict & defense
  {
    url: "https://www.defenseone.com/rss/all/",
    source: "Defense One",
    sector: "conflict",
    priority: 3,
  },
  {
    url: "https://breakingdefense.com/feed/",
    source: "Breaking Defense",
    sector: "conflict",
    priority: 3,
  },
  {
    url: "https://warontherocks.com/feed/",
    source: "War on the Rocks",
    sector: "conflict",
    priority: 2,
  },
  {
    url: "http://rss.cnn.com/rss/cnn_world.rss",
    source: "CNN World",
    sector: "conflict",
    priority: 2,
  },

  // Geopolitics
  {
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    source: "BBC World",
    sector: "politics",
    priority: 3,
  },
  {
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    source: "Al Jazeera",
    sector: "politics",
    priority: 3,
  },
  {
    url: "https://www.theguardian.com/world/rss",
    source: "Guardian World",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://foreignpolicy.com/feed/",
    source: "Foreign Policy",
    sector: "politics",
    priority: 3,
  },
  {
    url: "https://thediplomat.com/feed/",
    source: "The Diplomat",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml",
    source: "UN News",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    source: "NYT World",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    source: "NYT Politics",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://feeds.npr.org/1004/rss.xml",
    source: "NPR World",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://www.euronews.com/rss?format=xml&level=theme&name=news",
    source: "Euronews",
    sector: "politics",
    priority: 2,
  },
  {
    url: "https://rss.politico.com/politics-news.xml",
    source: "Politico",
    sector: "politics",
    priority: 2,
  },

  // Cyber & OSINT
  {
    url: "https://krebsonsecurity.com/feed/",
    source: "Krebs on Security",
    sector: "security",
    priority: 3,
  },
  {
    url: "https://www.bleepingcomputer.com/feed/",
    source: "BleepingComputer",
    sector: "security",
    priority: 2,
  },
  {
    url: "https://therecord.media/feed/",
    source: "The Record",
    sector: "security",
    priority: 3,
  },
  {
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    source: "CISA",
    sector: "security",
    priority: 3,
  },
  {
    url: "https://www.darkreading.com/rss.xml",
    source: "Dark Reading",
    sector: "security",
    priority: 2,
  },
  {
    url: "https://www.bellingcat.com/feed/",
    source: "Bellingcat",
    sector: "security",
    priority: 3,
  },
  {
    url: "https://arstechnica.com/security/feed/",
    source: "Ars Security",
    sector: "security",
    priority: 2,
  },
  {
    url: "https://threatpost.com/feed/",
    source: "Threatpost",
    sector: "security",
    priority: 2,
  },

  // Freedom tech & press
  {
    url: "https://www.eff.org/rss/updates.xml",
    source: "EFF",
    sector: "freedom",
    priority: 3,
    limit: 12,
  },
  {
    url: "https://proton.me/blog/feed",
    source: "Proton Blog",
    sector: "freedom",
    priority: 2,
    limit: 10,
  },
  {
    url: "https://www.accessnow.org/feed/",
    source: "Access Now",
    sector: "freedom",
    priority: 2,
    limit: 12,
  },
  {
    url: "https://cpj.org/feed/",
    source: "CPJ",
    sector: "freedom",
    priority: 2,
    limit: 12,
  },
  {
    url: "https://privacyinternational.org/rss.xml",
    source: "Privacy International",
    sector: "freedom",
    priority: 2,
    limit: 12,
  },

  // Tech policy
  {
    url: "https://www.technologyreview.com/feed/",
    source: "MIT Tech Review",
    sector: "tech",
    priority: 2,
    limit: 12,
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/tech-policy",
    source: "Ars Policy",
    sector: "tech",
    priority: 3,
    limit: 12,
  },
  {
    url: "https://spectrum.ieee.org/feeds/feed.rss",
    source: "IEEE Spectrum",
    sector: "tech",
    priority: 2,
    limit: 12,
  },
  {
    url: "https://www.wired.com/feed/rss",
    source: "Wired",
    sector: "tech",
    priority: 1,
    limit: 6,
  },
];

export const SECTOR_VISUAL: Record<
  Exclude<SectorId, "all">,
  { color: string; glow: string; label: string }
> = {
  conflict: { color: "#ef4444", glow: "rgba(239,68,68,0.35)", label: "CONFLICT" },
  politics: { color: "#38bdf8", glow: "rgba(56,189,248,0.35)", label: "GEOPOLITICS" },
  security: { color: "#f59e0b", glow: "rgba(245,158,11,0.35)", label: "CYBER" },
  freedom: { color: "#4ade80", glow: "rgba(74,222,128,0.35)", label: "FREEDOM" },
  tech: { color: "#a78bfa", glow: "rgba(167,139,250,0.35)", label: "POLICY" },
};

