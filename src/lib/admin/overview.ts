import type { PrismaClient } from "@prisma/client";

export type AdminOverviewPayload = {
  stats: {
    learners: number;
    feedbackCount: number;
    activeLearners7d: number;
    anonymousVisitors7d: number;
    anonymousPageViews7d: number;
    signedInPageViews7d: number;
  };
  topAnonymousPages: Array<{ path: string; views: number }>;
  topAnonymousResources: Array<{ resourceId: string; views: number }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    _count: { feedback: number };
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
    feedbackCount,
    activeLearners7d,
    recentUsers,
    recentFeedback,
    anonymousAnalytics,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "learner" } }),
    prisma.feedback.count(),
    prisma.user.count({
      where: {
        role: "learner",
        updatedAt: { gte: sevenDaysAgo },
      },
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
        _count: { select: { feedback: true } },
      },
    }),
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
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

  return {
    stats: {
      learners,
      feedbackCount,
      activeLearners7d,
      anonymousVisitors7d: anonymousVisitors7d.length,
      anonymousPageViews7d,
      signedInPageViews7d,
    },
    topAnonymousPages,
    topAnonymousResources,
    recentUsers,
    recentFeedback,
    meta: {
      database: getDatabaseMode(),
      privacyNote:
        "Wallet addresses are never stored. Anonymous trends use a first-party random ID in localStorage — no ad cookies, no cross-site tracking.",
    },
    generatedAt: new Date().toISOString(),
  };
}