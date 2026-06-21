"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

import { site } from "@/lib/data";

type ProgressRow = {
  courseSlug: string;
  courseTitle: string | null;
  chapterSlug: string;
  chapterTitle: string;
  completed: boolean;
  lastReadAt: string;
};

export function AccountContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const { openWalletConnect } = useWalletConnect();
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  useEffect(() => {
    document.title = `${t("accountTitle")} · ${site.name}`;
  }, [t]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => setProgress(data.progress ?? []))
      .catch(() => setProgress([]));
  }, [session?.user]);

  if (status === "loading") {
    return <p className="mx-auto max-w-3xl px-4 py-12 text-muted">{t("accountLoading")}</p>;
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-muted">{t("accountSignInRequired")}</p>
        <button
          type="button"
          onClick={openWalletConnect}
          className="pixel-btn pixel-btn--planb mt-4 text-sm"
        >
          {t("navLogin")}
        </button>
      </div>
    );
  }

  const byCourse = progress.reduce<Record<string, ProgressRow[]>>((acc, row) => {
    acc[row.courseSlug] = acc[row.courseSlug] ?? [];
    acc[row.courseSlug].push(row);
    return acc;
  }, {});

  for (const slug of Object.keys(byCourse)) {
    byCourse[slug].sort(
      (a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime()
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="section-title text-2xl">{t("accountTitle")}</h1>
      <p className="mt-2 text-muted">
        {t("accountWelcome", {
          name: session.user.name ?? session.user.email ?? "Learner",
        })}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">{t("accountContinue")}</h2>
        {progress.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t("accountNoProgress")}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {Object.entries(byCourse).map(([courseSlug, rows]) => {
              const latest = rows[0];
              const completedCount = rows.filter((r) => r.completed).length;
              return (
                <div key={courseSlug} className="pixel-panel p-4">
                  <h3 className="font-semibold">{latest.courseTitle ?? courseSlug}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {t("accountLastChapter", { title: latest.chapterTitle })}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {t("accountCompletedCount", { count: completedCount, total: rows.length })}
                  </p>
                  <Link
                    href={`/courses/${courseSlug}/${latest.chapterSlug}`}
                    className="pixel-btn pixel-btn--planb mt-3 inline-block text-sm no-underline"
                  >
                    {t("accountResume")} →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <Link href="/courses" className="mt-4 inline-block text-sm hover:underline" style={{ color: "var(--planb-orange)" }}>
          {t("coursesPageTitle")} →
        </Link>
      </section>

    </div>
  );
}