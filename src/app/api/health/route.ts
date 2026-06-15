import { NextResponse } from "next/server";
import { getSourceHealth } from "@/scan/lib/source-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = getSourceHealth();
  if (!health) {
    return NextResponse.json(
      { status: "pending", message: "Awaiting first ingest cycle" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(health, {
    headers: { "Cache-Control": "no-store" },
  });
}