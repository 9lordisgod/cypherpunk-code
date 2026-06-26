import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  buildCanonicalRedirectUrl,
  shouldRedirectToCanonicalHost,
} from "@/lib/canonical-site";
import { isTopicSlug } from "@/lib/seo/topics";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-site",
  "X-DNS-Prefetch-Control": "off",
};

function buildCsp(pathname: string) {
  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = isProd
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
  const isDoc = pathname.startsWith("/doc");
  if (isDoc) {
    return [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
  }

  const connectSrc = isProd ? "connect-src 'self'" : "connect-src 'self' https:";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    connectSrc,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (shouldRedirectToCanonicalHost(host)) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(
      buildCanonicalRedirectUrl(pathname, search),
      308
    );
  }

  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/catalog") {
    const topic = searchParams.get("topic");
    const paramKeys = [...searchParams.keys()];
    if (
      topic &&
      isTopicSlug(topic) &&
      paramKeys.length === 1 &&
      paramKeys[0] === "topic"
    ) {
      return NextResponse.redirect(
        buildCanonicalRedirectUrl(`/topics/${topic}`),
        308
      );
    }
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  response.headers.set("Content-Security-Policy", buildCsp(pathname));

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-API-Protected", "1");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};