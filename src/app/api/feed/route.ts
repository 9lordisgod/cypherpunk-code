import { NextRequest, NextResponse } from "next/server";
import { getFeed, searchFeed } from "@/scan/lib/feeds";
import type { SectorId } from "@/scan/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

    const { articles, fetchedAt, live, health, cached } = await getFeed(sector);

    return NextResponse.json(
      {
        articles,
        fetchedAt,
        count: articles.length,
        live,
        health,
        cached: cached ?? false,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch feed" },
      { status: 502 }
    );
  }
}