"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { CourseMarkdown } from "@/components/planb/CourseMarkdown";
import { PlanBAttribution } from "@/components/planb/PlanBAttribution";
import { PoweredByPlanB } from "@/components/planb/PoweredByPlanB";
import { site } from "@/lib/data";
import type { ParsedPlanBCourse, PlanBCourseMeta } from "@/lib/planb/types";

type CourseOverviewContentProps = {
  course: PlanBCourseMeta;
  parsed: ParsedPlanBCourse;
  moduleLabel?: string;
};

export function CourseOverviewContent({
  course,
  parsed,
  moduleLabel,
}: CourseOverviewContentProps) {
  const { t } = useLanguage();
  const title = parsed.frontmatter.name || course.title;

  useEffect(() => {
    document.title = `${title} · ${site.name}`;
  }, [title, t]);

  const firstChapter = parsed.chapters[0];

  return (
    <div className="course-overview">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/courses" className="hover:text-foreground hover:underline">
            {t("coursesPageTitle")}
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {moduleLabel ? (
              <p className="text-xs" style={{ color: "var(--planb-orange)" }}>
                {moduleLabel}
              </p>
            ) : null}
            <h1 className="section-title text-2xl sm:text-3xl">{title}</h1>
            <p className="mt-3 text-lg text-muted">{parsed.frontmatter.goal || course.goal}</p>
          </div>
          <PoweredByPlanB className="shrink-0" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="course-pill">{t(`courseLevel_${course.level}`)}</span>
          <span className="course-pill">{t(`courseTopic_${course.topic}`)}</span>
          <span className="course-pill">{t("courseHours", { count: course.hours })}</span>
          <span className="course-pill">
            {t("courseChapterCount", { count: parsed.chapters.length })}
          </span>
        </div>

        {parsed.frontmatter.objectives.length > 0 ? (
          <section className="mt-8 pixel-panel p-5">
            <h2 className="text-lg font-semibold">{t("coursesObjectives")}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              {parsed.frontmatter.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {parsed.description ? (
          <section className="mt-8 text-muted">
            <CourseMarkdown content={parsed.description} />
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {firstChapter ? (
            <Link
              href={`/courses/${course.slug}/${firstChapter.slug}`}
              className="pixel-btn pixel-btn--planb no-underline"
            >
              {t("coursesStartReading")} →
            </Link>
          ) : null}
        </div>

        <section className="mt-10">
          <h2 className="section-title text-lg">{t("coursesChapterList")}</h2>
          <ol className="mt-4 space-y-2">
            {parsed.chapters.map((chapter) => (
              <li key={chapter.slug}>
                <Link
                  href={`/courses/${course.slug}/${chapter.slug}`}
                  className="course-chapter-link block rounded px-3 py-2 no-underline text-foreground"
                >
                  <span className="text-xs text-muted">{chapter.index}.</span>{" "}
                  {chapter.partTitle ? (
                    <span className="text-xs text-muted">{chapter.partTitle} · </span>
                  ) : null}
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10">
          <PlanBAttribution course={course} language={parsed.language} />
        </div>
      </div>
    </div>
  );
}