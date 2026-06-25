import type { SecurityVault } from "./types";

/** Safe public defaults when encrypted vault is unavailable (no secrets). */
export const DEFAULT_SECURITY_VAULT: SecurityVault = {
  version: 1,
  honeypot: { field: "cp_confirm_url" },
  rateLimits: {
    "api:wallet-nonce": { windowMs: 60_000, max: 8 },
    "api:wallet": { windowMs: 300_000, max: 15 },
    "api:admin-wallet": { windowMs: 300_000, max: 10 },
    "api:feedback": { windowMs: 3_600_000, max: 4 },

    "api:admin": { windowMs: 60_000, max: 20 },
    "api:analytics": { windowMs: 60_000, max: 60 },
    "api:global": { windowMs: 60_000, max: 120 },
  },
  blockedIps: [],
  blockedUserAgents: ["scrapy", "python-requests"],
  requestPepper: "dev-only-pepper",
};