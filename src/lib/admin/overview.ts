import type { PrismaClient } from "@prisma/client";

export type AdminOverviewPayload = {
  stats: {
    learners: number;
    progressEvents: number;
    completedChapters: number;
    feedbackCount: number;
    activeLearners7d: number;
    anonymousVisitors7d: number;
    anonymousPageViews7d: number;
    signedInPageViews7d: number;
  };
  topAnonymousPages: Array<{ path: string; views: number }>;
  topAnonymousResources: Array<{ resourceId: string; views: number }>;
  topCourses: Array<{
    courseSlug: string;
    courseTitle: string;
    views: number;
    completions: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    _count: { progress: number; feedback: number };
  }>;
  recentProgress: Array<{
    id: string;
    courseSlug: string;
    courseTitle: string | null;
    chapterTitle: string;
    completed: boolean;
    lastReadAt: Date;
    user: { name: string | null; email: string | null };
  }>;
  recentFeedback: Array<{
    id: string;
    name: string;
    email: string;
    xHandle: string | null;
    message: string;
    createdAt: Date;
  }>;
  meta: {
    database: "turso" | "sqlite-file" | "unset";
    privacyNote: string;
  };
  generatedAt: string;
};

export function getDatabaseMode(): AdminOverviewPayload["meta"]["database"] {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("libsql:") || url.includes(".turso.io")) {
    return "turso";
  }
  if (url.startsWith("file:")) {
    return "sqlite-file";
  }
  return "unset";
}

async function loadAnonymousAnalytics(
  prisma: PrismaClient,
  sevenDaysAgo: Date
) {
  try {
    const [anonymousVisitors7d, anonymousPageViews7d, signedInPageViews7d, pageGroups, resourceGroups] =
      await Promise.all([
        prisma.analyticsEvent.findMany({
          where: { createdAt: { gte: sevenDaysAgo }, signedIn: false },
          distinct: ["visitorId"],
          select: { visitorId: true },
        }),
        prisma.analyticsEvent.count({
          where: { createdAt: { gte: sevenDaysAgo }, signedIn: false },
        }),
        prisma.analyticsEvent.count({
          where: { createdAt: { gte: sevenDaysAgo }, signedIn: true },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["path"],
          where: { createdAt: { gte: sevenDaysAgo }, signedIn: false },
          _count: { _all: true },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["resourceId"],
          where: {
            createdAt: { gte: sevenDaysAgo },
            signedIn: false,
            resourceId: { not: null },
          },
          _count: { _all: true },
        }),
      ]);

    return {
      anonymousVisitors7d,
      anonymousPageViews7d,
      signedInPageViews7d,
      pageGroups,
      resourceGroups,
    };
  } catch {
    return {
      anonymousVisitors7d: [],
      anonymousPageViews7d: 0,
      signedInPageViews7d: 0,
      pageGroups: [] as Array<{ path: string; _count: { _all: number } }>,
      resourceGroups: [] as Array<{ resourceId: string | null; _count: { _all: number } }>,
    };
  }
}

export async function buildAdminOverview(
  prisma: PrismaClient
): Promise<AdminOverviewPayload> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    learners,
    progressEvents,
    completedChapters,
    feedbackCount,
    activeLearners7d,
    recentUsers,
    recentProgress,
    recentFeedback,
    courseGroups,
    completedGroups,
    courseTitles,
    anonymousAnalytics,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "learner" } }),
    prisma.chapterProgress.count(),
    prisma.chapterProgress.count({ where: { completed: true } }),
    prisma.feedback.count(),
    prisma.chapterProgress.findMany({
      where: { lastReadAt: { gte: sevenDaysAgo }, user: { role: "learner" } },
      distinct: ["userId"],
      select: { userId: true },
    }),
    prisma.user.findMany({
      where: { role: "learner" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { progress: true, feedback: true } },
      },
    }),
    prisma.chapterProgress.findMany({
      where: { user: { role: "learner" } },
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
    prisma.chapterProgress.groupBy({
      by: ["courseSlug"],
      where: { user: { role: "learner" } },
      _count: { _all: true },
    }),
    prisma.chapterProgress.groupBy({
      by: ["courseSlug"],
      where: { completed: true, user: { role: "learner" } },
      _count: { _all: true },
    }),
    prisma.chapterProgress.findMany({
      where: { user: { role: "learner" } },
      distinct: ["courseSlug"],
      select: { courseSlug: true, courseTitle: true },
      orderBy: { lastReadAt: "desc" },
    }),
    loadAnonymousAnalytics(prisma, sevenDaysAgo),
  ]);

  const {
    anonymousVisitors7d,
    anonymousPageViews7d,
    signedInPageViews7d,
    pageGroups,
    resourceGroups,
  } = anonymousAnalytics;

  const completionMap = new Map(
    completedGroups.map((row) => [row.courseSlug, row._count._all])
  );
  const titleMap = new Map(
    courseTitles.map((row) => [
      row.courseSlug,
      row.courseTitle?.trim() || row.courseSlug,
    ])
  );

  const topAnonymousPages = pageGroups
    .map((row) => ({ path: row.path, views: row._count._all }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const topAnonymousResources = resourceGroups
    .filter((row) => row.resourceId)
    .map((row) => ({
      resourceId: row.resourceId as string,
      views: row._count._all,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const topCourses = courseGroups
    .map((row) => ({
      courseSlug: row.courseSlug,
      courseTitle: titleMap.get(row.courseSlug) ?? row.courseSlug,
      views: row._count._all,
      completions: completionMap.get(row.courseSlug) ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return {
    stats: {
      learners,
      progressEvents,
      completedChapters,
      feedbackCount,
      activeLearners7d: activeLearners7d.length,
      anonymousVisitors7d: anonymousVisitors7d.length,
      anonymousPageViews7d,
      signedInPageViews7d,
    },
    topAnonymousPages,
    topAnonymousResources,
    topCourses,
    recentUsers,
    recentProgress,
    recentFeedback,
    meta: {
      database: getDatabaseMode(),
      privacyNote:
        "Wallet addresses are never stored. Anonymous trends use a first-party random ID in localStorage — no ad cookies, no cross-site tracking.",
    },
    generatedAt: new Date().toISOString(),
  };
}