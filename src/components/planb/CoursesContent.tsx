"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { CourseCard } from "@/components/planb/CourseCard";
import { PlanBAttribution } from "@/components/planb/PlanBAttribution";
import { PoweredByPlanB } from "@/components/planb/PoweredByPlanB";
import { site } from "@/lib/data";
import { bitcoinCourse } from "@/lib/planb/courses";
import type { PlanBCourseMeta } from "@/lib/planb/types";

type CoursesContentProps = {
  courses: PlanBCourseMeta[];
  featuredCourse: PlanBCourseMeta;
};

export function CoursesContent({ courses, featuredCourse }: CoursesContentProps) {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t("coursesPageTitle")} · ${site.name}`;
  }, [t]);

  const moduleBySlug = new Map(
    bitcoinCourse.modules.map((module) => [module.courseSlug, module])
  );

  return (
    <div className="courses-page">
      <section className="courses-hero scanline-overlay relative">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="courses-hero__eyebrow">{t("coursesHeroEyebrow")}</p>
              <h1 className="courses-hero__title">{bitcoinCourse.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {t("coursesHeroDescription")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/courses/${featuredCourse.slug}`}
                  className="pixel-btn pixel-btn--planb no-underline"
                >
                  {t("coursesStartJourney")} →
                </Link>
                <Link href="#modules" className="pixel-btn pixel-btn--ghost no-underline">
                  {t("coursesViewModules")}
                </Link>
              </div>
            </div>
            <div className="shrink-0">
              <PoweredByPlanB />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="pixel-panel p-5 sm:p-6">
          <h2 className="section-title text-lg">{t("coursesIndependenceTitle")}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t("coursesIndependenceText")}</p>
          <p className="mt-3 leading-relaxed text-muted">{t("coursesShareAlikeNotice")}</p>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="section-header mb-8">
          <div>
            <h2 className="section-title">{t("coursesModulesTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("coursesModulesSubtitle")}</p>
          </div>
          <p className="text-sm text-muted">
            {t("coursesModuleCount", { count: courses.length })}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const trackModule = moduleBySlug.get(course.slug);
            return (
              <CourseCard
                key={course.slug}
                course={course}
                moduleLabel={trackModule?.label}
              />
            );
          })}
        </div>
      </section>

      <section className="border-t-4 border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <PlanBAttribution course={featuredCourse} />
            <PoweredByPlanB className="justify-self-start lg:justify-self-end" />
          </div>
        </div>
      </section>
    </div>
  );
}