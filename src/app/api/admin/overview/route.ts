import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, progress, feedback, recentUsers, recentProgress, recentFeedback] =
    await Promise.all([
      prisma.user.count({ where: { role: "learner" } }),
      prisma.chapterProgress.count(),
      prisma.feedback.count(),
      prisma.user.findMany({
        where: { role: "learner" },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: { select: { progress: true, feedback: true } },
        },
      }),
      prisma.chapterProgress.findMany({
        orderBy: { lastReadAt: "desc" },
        take: 50,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

  const completedChapters = await prisma.chapterProgress.count({
    where: { completed: true },
  });

  return NextResponse.json({
    stats: {
      learners: users,
      progressEvents: progress,
      completedChapters,
      feedbackCount: feedback,
    },
    recentUsers,
    recentProgress,
    recentFeedback,
    generatedAt: new Date().toISOString(),
  });
}