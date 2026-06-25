export function parseAnalyticsPath(path: string) {
  const normalized = path.split("?")[0]?.split("#")[0] ?? "/";
  const resourceId = normalized.match(/^\/resource\/([^/]+)/)?.[1] ?? null;

  return {
    path: normalized.slice(0, 240),
    resourceId: resourceId?.slice(0, 120) ?? null,
  };
}

export function isValidVisitorId(value: string) {
  return /^[a-zA-Z0-9_-]{8,64}$/.test(value);
}