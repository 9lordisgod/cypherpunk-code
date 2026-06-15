import type { SectorId } from "@/scan/types";

export interface XSource {
  handle: string;
  source: string;
  sector: SectorId;
  priority?: number;
  limit?: number;
}

/** OSINT / intel accounts on X — FxTwitter public API */
export const X_SOURCES: XSource[] = [
  { handle: "sentdefender", source: "SentDefender", sector: "conflict", priority: 3, limit: 10 },
  { handle: "conflict_radar", source: "Conflict Radar", sector: "conflict", priority: 3, limit: 10 },
  { handle: "WarMonitor3", source: "War Monitor", sector: "conflict", priority: 2, limit: 8 },
  { handle: "DefMon3", source: "DefMon", sector: "conflict", priority: 2, limit: 8 },
  { handle: "wartranslated", source: "War Translated", sector: "conflict", priority: 2, limit: 8 },
  { handle: "IntelCrab", source: "Intel Crab", sector: "security", priority: 3, limit: 10 },
  { handle: "OSINTtechnical", source: "OSINT Technical", sector: "security", priority: 2, limit: 8 },
  { handle: "cyberknow20", source: "CyberKnow", sector: "security", priority: 2, limit: 8 },
  { handle: "vxunderground", source: "VX Underground", sector: "security", priority: 2, limit: 8 },
  { handle: "bellingcat", source: "Bellingcat", sector: "security", priority: 2, limit: 8 },
  { handle: "EliotHiggins", source: "Eliot Higgins", sector: "security", priority: 2, limit: 6 },
  { handle: "GeoConfirmed", source: "GeoConfirmed", sector: "politics", priority: 2, limit: 8 },
  { handle: "Politico", source: "Politico", sector: "politics", priority: 2, limit: 6 },
  { handle: "AccessNow", source: "Access Now", sector: "freedom", priority: 2, limit: 8 },
  { handle: "EFF", source: "EFF", sector: "freedom", priority: 2, limit: 8 },
  { handle: "torproject", source: "Tor Project", sector: "freedom", priority: 2, limit: 6 },
  { handle: "privacyint", source: "Privacy Intl", sector: "freedom", priority: 2, limit: 6 },
];