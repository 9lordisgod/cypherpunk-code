"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { CourseMarkdown } from "@/components/planb/CourseMarkdown";
import { PlanBAttribution } from "@/components/planb/PlanBAttribution";
import { PoweredByPlanB } from "@/components/planb/PoweredByPlanB";
import { PreviewBanner } from "@/components/planb/PreviewBanner";
import { site } from "@/lib/data";
import type { PlanBChapter, PlanBCourseMeta } from "@/lib/planb/types";

type CourseChapterContentProps = {
  course: PlanBCourseMeta;
  courseTitle: string;
  chapter: PlanBChapter;
  chapters: PlanBChapter[];
  language: string;
  moduleLabel?: string;
};

export function CourseChapterContent({
  course,
  courseTitle,
  chapter,
  chapters,
  language,
  moduleLabel,
}: CourseChapterContentProps) {
  const { t } = useLanguage();
  const chapterIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const next =
    chapterIndex >= 0 && chapterIndex < chapters.length - 1
      ? chapters[chapterIndex + 1]
      : null;

  useEffect(() => {
    document.title = `${chapter.title} · ${courseTitle} · ${site.name}`;
  }, [chapter.title, courseTitle, t]);

  return (
    <div className="course-chapter">
      <PreviewBanner />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/courses" className="hover:text-foreground hover:underline">
            {t("coursesPageTitle")}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/courses/${course.slug}`}
            className="hover:text-foreground hover:underline"
          >
            {courseTitle}
          </Link>
          <span className="mx-2">/</span>
          <span>{chapter.title}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {moduleLabel ? (
              <p className="text-xs" style={{ color: "var(--planb-orange)" }}>
                {moduleLabel}
              </p>
            ) : null}
            {chapter.partTitle ? (
              <p className="text-sm text-muted">{chapter.partTitle}</p>
            ) : null}
            <h1 className="section-title text-2xl sm:text-3xl">{chapter.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {t("courseChapterProgress", {
                current: chapter.index,
                total: chapters.length,
              })}
            </p>
          </div>
          <PoweredByPlanB className="shrink-0" />
        </div>

        <article className="mt-8">
          <CourseMarkdown content={chapter.content} />
        </article>

        <nav className="course-chapter-nav mt-10 grid gap-3 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/courses/${course.slug}/${previous.slug}`}
              className="pixel-card block p-4 no-underline text-foreground"
            >
              <span className="text-xs text-muted">{t("coursesPreviousChapter")}</span>
              <p className="mt-1 font-semibold">{previous.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className="pixel-card block p-4 no-underline text-foreground sm:text-right"
            >
              <span className="text-xs text-muted">{t("coursesNextChapter")}</span>
              <p className="mt-1 font-semibold">{next.title}</p>
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="pixel-card block p-4 no-underline text-foreground sm:text-right"
            >
              <span className="text-xs text-muted">{t("coursesBackToCourse")}</span>
              <p className="mt-1 font-semibold">{courseTitle}</p>
            </Link>
          )}
        </nav>

        <div className="mt-10">
          <PlanBAttribution course={course} language={language} variant="compact" />
        </div>
      </div>
    </div>
  );
}