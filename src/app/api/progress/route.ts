import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-utils";
import { handleApiRoute } from "@/lib/api-handler";
import { guardApiRequest } from "@/lib/security/guard";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:progress");
    if (blocked) return blocked;

    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.chapterProgress.findMany({
      where: { userId: user.id },
      orderBy: { lastReadAt: "desc" },
    });

    return NextResponse.json({ progress });
  });
}

export async function POST(request: Request) {
  return handleApiRoute(async () => {
    const blocked = guardApiRequest(request, "api:progress");
    if (blocked) return blocked;

    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const courseSlug = body.courseSlug?.toString().slice(0, 120);
    const chapterSlug = body.chapterSlug?.toString().slice(0, 120);
    const chapterTitle = body.chapterTitle?.toString().slice(0, 200) ?? "";
    const courseTitle = body.courseTitle?.toString().slice(0, 200) ?? "";
    const completed = Boolean(body.completed);

    if (!courseSlug || !chapterSlug) {
      return NextResponse.json({ error: "Missing course or chapter" }, { status: 400 });
    }

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_courseSlug_chapterSlug: {
          userId: user.id,
          courseSlug,
          chapterSlug,
        },
      },
      create: {
        userId: user.id,
        courseSlug,
        chapterSlug,
        chapterTitle,
        courseTitle,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        chapterTitle,
        courseTitle,
        lastReadAt: new Date(),
        ...(completed ? { completed: true, completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ progress });
  });
}