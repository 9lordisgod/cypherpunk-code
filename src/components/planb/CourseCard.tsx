"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { PlanBCourseMeta } from "@/lib/planb/types";

type CourseCardProps = {
  course: PlanBCourseMeta;
  moduleLabel?: string;
};

export function CourseCard({ course, moduleLabel }: CourseCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="pixel-card course-card block p-5 no-underline text-foreground"
    >
      {moduleLabel ? (
        <p className="course-card__module text-xs" style={{ color: "var(--planb-orange)" }}>
          {moduleLabel}
        </p>
      ) : null}
      <h3 className="course-card__title">{course.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-muted">{course.goal}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="course-pill">{t(`courseLevel_${course.level}`)}</span>
        <span className="course-pill">{t(`courseTopic_${course.topic}`)}</span>
        <span className="course-pill">
          {t("courseHours", { count: course.hours })}
        </span>
      </div>
    </Link>
  );
}