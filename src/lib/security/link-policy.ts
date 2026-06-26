/** Domains blocked from the public catalog — fake, dead, or unverified resources. */
export const BLOCKED_CATALOG_DOMAINS = [
  "cypherpunkschool.com",
  "www.cypherpunkschool.com",
] as const;

const BLOCKED_SET = new Set<string>(BLOCKED_CATALOG_DOMAINS);

export function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isBlockedCatalogUrl(url: string): boolean {
  const host = getHostname(url);
  if (!host) return true;
  return BLOCKED_SET.has(host);
}

export function assertCatalogUrl(url: string): void {
  if (isBlockedCatalogUrl(url)) {
    throw new Error(`Blocked catalog URL: ${url}`);
  }
}