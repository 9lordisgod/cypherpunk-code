import { NextResponse } from "next/server";
import { isValidVisitorId, parseAnalyticsPath } from "@/lib/analytics/parse-path";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";

const SKIP_PREFIXES = ["/api", "/_next"];

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:analytics");
    if (blocked) return blocked;

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const visitorId = body.visitorId?.toString().trim() ?? "";
    const rawPath = body.path?.toString().trim() ?? "/";

    if (!isValidVisitorId(visitorId)) {
      return NextResponse.json({ error: "Invalid visitor id" }, { status: 400 });
    }

    const parsed = parseAnalyticsPath(rawPath);
    if (SKIP_PREFIXES.some((prefix) => parsed.path.startsWith(prefix))) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await prisma.analyticsEvent.create({
      data: {
        visitorId,
        path: parsed.path,
        resourceId: parsed.resourceId,
        signedIn: false,
      },
    });

    return NextResponse.json({ ok: true });
  });
}