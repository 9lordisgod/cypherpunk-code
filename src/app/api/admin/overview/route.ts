import { NextResponse } from "next/server";
import { buildAdminOverview } from "@/lib/admin/overview";
import { requireAdmin } from "@/lib/auth-utils";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:admin");
    if (blocked) return blocked;

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await buildAdminOverview(prisma);
    return NextResponse.json(payload);
  });
}