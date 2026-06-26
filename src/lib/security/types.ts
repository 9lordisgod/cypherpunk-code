export type RateLimitRule = {
  windowMs: number;
  max: number;
};

export type SecurityVault = {
  version: number;
  honeypot: { field: string };
  rateLimits: Record<string, RateLimitRule>;
  blockedIps: string[];
  blockedUserAgents: string[];
  blockedCatalogDomains: string[];
  requestPepper: string;
};