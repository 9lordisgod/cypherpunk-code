import type { SecurityVault } from "./types";

/** Safe public defaults when encrypted vault is unavailable (no secrets). */
export const DEFAULT_SECURITY_VAULT: SecurityVault = {
  version: 1,
  honeypot: { field: "cp_confirm_url" },
  rateLimits: {
    "api:feedback": { windowMs: 3_600_000, max: 4 },
    "api:analytics": { windowMs: 60_000, max: 60 },
    "api:global": { windowMs: 60_000, max: 120 },
  },
  blockedIps: [],
  blockedUserAgents: ["scrapy", "python-requests", "curl/", "wget/"],
  blockedCatalogDomains: ["cypherpunkschool.com"],
  requestPepper: "dev-only-pepper",
};