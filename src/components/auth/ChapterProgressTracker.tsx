"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";

type ChapterProgressTrackerProps = {
  courseSlug: string;
  courseTitle: string;
  chapterSlug: string;
  chapterTitle: string;
};

export function ChapterProgressTracker({
  courseSlug,
  courseTitle,
  chapterSlug,
  chapterTitle,
}: ChapterProgressTrackerProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const { openWalletConnect } = useWalletConnect();
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user || session.user.role === "admin") return;

    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug,
        courseTitle,
        chapterSlug,
        chapterTitle,
        completed: false,
      }),
    })
      .then(() => setSaved(true))
      .catch(() => setSaved(false));
  }, [session?.user, session?.user?.role, courseSlug, courseTitle, chapterSlug, chapterTitle]);

  if (!session?.user || session.user.role === "admin") {
    return (
      <p className="mt-4 text-sm text-muted">
        {t("progressLoginHint")}{" "}
        <button
          type="button"
          onClick={openWalletConnect}
          className="border-0 bg-transparent p-0 hover:underline"
          style={{ color: "var(--planb-orange)" }}
        >
          {t("navLogin")}
        </button>
      </p>
    );
  }

  const markComplete = async () => {
    setLoading(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          courseTitle,
          chapterSlug,
          chapterTitle,
          completed: true,
        }),
      });
      setCompleted(true);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pixel-panel p-4">
      <p className="text-sm text-muted">
        {saved ? t("progressSaved") : t("progressSaving")}
      </p>
      <button
        type="button"
        onClick={markComplete}
        disabled={loading || completed}
        className="pixel-btn pixel-btn--planb mt-3 text-sm disabled:opacity-60"
      >
        {completed ? t("progressCompleted") : t("progressMarkComplete")}
      </button>
    </div>
  );
}