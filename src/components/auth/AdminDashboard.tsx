"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

type Overview = {
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
    createdAt: string;
    _count: { progress: number; feedback: number };
  }>;
  recentProgress: Array<{
    id: string;
    courseSlug: string;
    courseTitle: string | null;
    chapterTitle: string;
    completed: boolean;
    lastReadAt: string;
    user: { name: string | null; email: string | null };
  }>;
  recentFeedback: Array<{
    id: string;
    name: string;
    email: string;
    xHandle: string | null;
    message: string;
    createdAt: string;
  }>;
  meta: {
    database: "turso" | "sqlite-file" | "unset";
    privacyNote: string;
  };
  generatedAt: string;
};

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/overview", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (response.status === 403) {
        setError(t("adminForbidden"));
        setData(null);
        return;
      }

      if (!response.ok) {
        setError(t("adminLoadError"));
        setData(null);
        return;
      }

      setError("");
      setData(await response.json());
    } catch {
      setError(t("adminLoadError"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    document.title = `${t("adminTitle")} · ${site.name}`;
  }, [t]);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    const run = () => {
      void load();
    };

    const timeout = window.setTimeout(run, 0);
    const interval = window.setInterval(run, 15000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [session?.user?.role, load]);

  if (status === "loading") {
    return <p className="mx-auto max-w-6xl px-4 py-12 text-muted">{t("accountLoading")}</p>;
  }

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-muted">{t("adminSignInRequired")}</p>
        <Link href="/admin/login" className="pixel-btn pixel-btn--planb mt-4 inline-block no-underline">
          {t("adminLoginTitle")}
        </Link>
      </div>
    );
  }

  const hasActivity =
    data &&
    (data.stats.learners > 0 ||
      data.stats.progressEvents > 0 ||
      data.stats.feedbackCount > 0 ||
      data.stats.anonymousPageViews7d > 0);

  const showDbWarning =
    data?.meta.database === "sqlite-file" &&
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl">{t("adminTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("adminSubtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="pixel-btn pixel-btn--ghost text-sm"
        >
          {t("navSignOut")}
        </button>
      </div>

      {error ? <p className="mt-4 text-red-400">{error}</p> : null}
      {loading && !data ? <p className="mt-4 text-sm text-muted">{t("adminLoading")}</p> : null}

      {showDbWarning ? (
        <p className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {t("adminDbWarning")}
        </p>
      ) : null}

      {data ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={t("adminStatLearners")} value={data.stats.learners} />
            <StatCard label={t("adminStatActive")} value={data.stats.activeLearners7d} />
            <StatCard label={t("adminStatAnonVisitors")} value={data.stats.anonymousVisitors7d} />
            <StatCard label={t("adminStatAnonViews")} value={data.stats.anonymousPageViews7d} />
            <StatCard label={t("adminStatSignedViews")} value={data.stats.signedInPageViews7d} />
            <StatCard label={t("adminStatProgress")} value={data.stats.progressEvents} />
            <StatCard label={t("adminStatCompleted")} value={data.stats.completedChapters} />
            <StatCard label={t("adminStatFeedback")} value={data.stats.feedbackCount} />
          </div>
          <p className="mt-2 text-xs text-muted">
            {t("adminUpdated", { time: new Date(data.generatedAt).toLocaleString() })}
          </p>
          <p className="mt-1 text-xs text-muted">{data.meta.privacyNote}</p>

          {!hasActivity ? (
            <div className="mt-8 pixel-panel p-6">
              <h2 className="text-lg font-semibold">{t("adminEmptyTitle")}</h2>
              <p className="mt-2 text-sm text-muted">{t("adminEmptyBody")}</p>
            </div>
          ) : null}

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t("adminAnonTrendsTitle")}</h2>
            <p className="mt-1 text-sm text-muted">{t("adminAnonTrendsHint")}</p>
            {data.topAnonymousPages.length === 0 && data.topAnonymousResources.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("adminAnonNoData")}</p>
            ) : (
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">{t("adminTopPages")}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {data.topAnonymousPages.map((row) => (
                      <li key={row.path} className="flex justify-between gap-3 pixel-panel px-3 py-2">
                        <span className="truncate">{row.path}</span>
                        <span className="text-muted">{row.views}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t("adminTopResources")}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {data.topAnonymousResources.map((row) => (
                      <li key={row.resourceId} className="flex justify-between gap-3 pixel-panel px-3 py-2">
                        <span className="truncate">{row.resourceId}</span>
                        <span className="text-muted">{row.views}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t("adminTopCourses")}</h2>
            <p className="mt-1 text-sm text-muted">{t("adminTopCoursesHint")}</p>
            {data.topCourses.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("adminNoCourseData")}</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.topCourses.map((course) => (
                  <div key={course.courseSlug} className="pixel-panel p-4 text-sm">
                    <p className="font-semibold">{course.courseTitle}</p>
                    <p className="mt-2 text-xs text-muted">
                      {t("adminCourseViews")}: {course.views} · {t("adminCourseCompletions")}:{" "}
                      {course.completions}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t("adminRecentProgress")}</h2>
            {data.recentProgress.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("adminNoCourseData")}</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="admin-table w-full text-sm">
                  <thead>
                    <tr>
                      <th>{t("feedbackName")}</th>
                      <th>{t("adminCourse")}</th>
                      <th>{t("adminChapter")}</th>
                      <th>{t("adminStatus")}</th>
                      <th>{t("adminWhen")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentProgress.map((row) => (
                      <tr key={row.id}>
                        <td>{row.user.name ?? row.user.email ?? "—"}</td>
                        <td>{row.courseTitle ?? row.courseSlug}</td>
                        <td>{row.chapterTitle}</td>
                        <td>{row.completed ? t("progressCompleted") : t("adminReading")}</td>
                        <td>{new Date(row.lastReadAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t("adminLearners")}</h2>
            {data.recentUsers.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("adminEmptyTitle")}</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.recentUsers.map((user) => (
                  <div key={user.id} className="pixel-panel p-4 text-sm">
                    <p className="font-semibold">{user.name ?? "Learner"}</p>
                    <p className="text-muted">{user.email ?? user.name ?? "—"}</p>
                    <p className="mt-2 text-xs text-muted">
                      {t("adminUserStats", {
                        progress: user._count.progress,
                        feedback: user._count.feedback,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">{t("adminFeedback")}</h2>
            {data.recentFeedback.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t("adminEmptyTitle")}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {data.recentFeedback.map((item) => (
                  <div key={item.id} className="pixel-panel p-4 text-sm">
                    <p className="font-semibold">
                      {item.name} · {item.email}
                      {item.xHandle ? ` · ${item.xHandle}` : ""}
                    </p>
                    <p className="mt-2 text-muted">{item.message}</p>
                    <p className="mt-2 text-xs text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-box text-center">
      <p className="stat-number">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}