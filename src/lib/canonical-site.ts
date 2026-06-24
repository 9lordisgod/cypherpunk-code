import siteData from "@/data/site.json";

const CANONICAL_ORIGIN = siteData.url.replace(/\/$/, "");
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;

const LEGACY_HOSTS = new Set([
  "cypherpunk-code.ca",
  "www.cypherpunk-code.ca",
]);

export function getCanonicalOrigin() {
  return CANONICAL_ORIGIN;
}

export function getCanonicalHost() {
  return CANONICAL_HOST;
}

export function isLegacyHost(host: string) {
  return LEGACY_HOSTS.has(host.toLowerCase());
}

export function normalizeAuthHost(host: string) {
  const normalized = host.split(":")[0].toLowerCase();
  if (isLegacyHost(normalized)) {
    return CANONICAL_HOST;
  }
  return normalized;
}

export function buildCanonicalRedirectUrl(pathname: string, search = "") {
  return `${CANONICAL_ORIGIN}${pathname}${search}`;
}

export function ensureCanonicalAuthEnv() {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  const usesLegacyDomain = authUrl.includes("cypherpunk-code.ca");

  if (!authUrl || usesLegacyDomain) {
    process.env.AUTH_URL = CANONICAL_ORIGIN;
    process.env.NEXTAUTH_URL = CANONICAL_ORIGIN;
  }
}