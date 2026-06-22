import { NextResponse } from "next/server";
import { loadSecurityVault } from "./vault";
import { checkRateLimit, rateLimitKey } from "./rate-limit";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function guardApiRequest(
  request: Request,
  namespace: string
): NextResponse | null {
  const vault = loadSecurityVault();
  const ip = getClientIp(request);
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();

  if (vault.blockedIps.includes(ip)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  for (const blocked of vault.blockedUserAgents) {
    if (ua.includes(blocked.toLowerCase())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const globalRule = vault.rateLimits["api:global"];
  if (globalRule) {
    const global = checkRateLimit(rateLimitKey("api:global", ip), globalRule);
    if (!global.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(global.retryAfterSec) } }
      );
    }
  }

  const rule = vault.rateLimits[namespace];
  if (rule) {
    const limited = checkRateLimit(rateLimitKey(namespace, ip), rule);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
      );
    }
  }

  return null;
}

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const vault = loadSecurityVault();
  const field = vault.honeypot.field;
  const value = body[field];
  return typeof value === "string" && value.trim().length > 0;
}