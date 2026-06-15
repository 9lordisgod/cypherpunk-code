import { NextRequest, NextResponse } from "next/server";
import {
  getFeed,
  hasFeedCache,
  isIngestInFlight,
  needsFreshIngest,
  searchFeed,
} from "@/scan/lib/feeds";
import { checkFeedRateLimit, getClientIp } from "@/scan/lib/rate-limit";
import type { SectorId } from "@/scan/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_SECTORS = new Set([
  "all",
  "tech",
  "politics",
  "conflict",
  "freedom",
  "security",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");
  const sector = (searchParams.get("sector") ?? "all") as SectorId;
  const fresh = searchParams.get("fresh") === "1";

  if (!VALID_SECTORS.has(sector)) {
    return NextResponse.json({ error: "Invalid sector" }, { status: 400 });
  }

  try {
    if (query) {
      const articles = await searchFeed(query);
      return NextResponse.json({
        articles,
        fetchedAt: new Date().toISOString(),
        count: articles.length,
      });
    }

    const ip = getClientIp(request);

    if (fresh && needsFreshIngest() && !isIngestInFlight()) {
      const rate = checkFeedRateLimit(ip);
      if (!rate.allowed) {
        if (hasFeedCache()) {
          const cached = await getFeed(sector, false);
          return NextResponse.json(
            {
              ...cached,
              count: cached.articles.length,
              rateLimited: true,
            },
            { headers: { "Cache-Control": "no-store" } }
          );
        }

        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Max 1 fresh ingest per 30 seconds per client",
            retryAfterMs: rate.retryAfterMs,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)),
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }

    const { articles, fetchedAt, live, health, cached } = await getFeed(
      sector,
      fresh
    );
    return NextResponse.json(
      {
        articles,
        fetchedAt,
        count: articles.length,
        live,
        health,
        cached: cached ?? false,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch feed" },
      { status: 502 }
    );
  }
}