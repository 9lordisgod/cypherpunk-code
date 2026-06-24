import siteData from "@/data/site.json";

const CANONICAL_ORIGIN = siteData.url.replace(/\/$/, "");
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;
const APEX_HOST = siteData.domain.replace(/^www\./, "");

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

export function getApexHost() {
  return APEX_HOST;
}

export function isLegacyHost(host: string) {
  return LEGACY_HOSTS.has(host.toLowerCase());
}

export function shouldRedirectToCanonicalHost(host: string) {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const normalized = host.split(":")[0].toLowerCase();
  if (!normalized || normalized === "localhost" || normalized === "127.0.0.1") {
    return false;
  }

  return isLegacyHost(normalized) || normalized === APEX_HOST;
}

export function normalizeAuthHost(host: string) {
  const normalized = host.split(":")[0].toLowerCase();
  if (isLegacyHost(normalized) || normalized === APEX_HOST) {
    return CANONICAL_HOST;
  }
  return normalized;
}

export function buildCanonicalRedirectUrl(pathname: string, search = "") {
  return `${CANONICAL_ORIGIN}${pathname}${search}`;
}

export function ensureCanonicalAuthEnv() {
  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
  const usesLegacyDomain =
    authUrl.includes("cypherpunk-code.ca") ||
    authUrl.includes(`://${APEX_HOST}`);

  if (!authUrl || usesLegacyDomain) {
    process.env.AUTH_URL = CANONICAL_ORIGIN;
    process.env.NEXTAUTH_URL = CANONICAL_ORIGIN;
  }
}