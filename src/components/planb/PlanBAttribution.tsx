import {
  PLAN_B_ACADEMY_URL,
  PLAN_B_CONTENT_REPO,
  PLAN_B_LICENSE_NAME,
  PLAN_B_LICENSE_URL,
  PLAN_B_NETWORK_URL,
} from "@/lib/planb/constants";
import { getCourseAcademyUrl, getCourseSourceUrl } from "@/lib/planb/fetch";
import type { PlanBCourseMeta } from "@/lib/planb/types";

type PlanBAttributionProps = {
  course: PlanBCourseMeta;
  language?: string;
  variant?: "compact" | "full";
};

export function PlanBAttribution({
  course,
  language = "en",
  variant = "full",
}: PlanBAttributionProps) {
  const authors =
    course.contributorNames.length > 0
      ? course.contributorNames.join(", ")
      : "Plan ₿ Academy contributors";

  if (variant === "compact") {
    return (
      <p className="planb-attribution planb-attribution--compact text-xs leading-relaxed text-muted">
        <strong>{course.title}</strong> by {authors}. Source:{" "}
        <a href={getCourseAcademyUrl(course)} target="_blank" rel="noopener noreferrer">
          Plan ₿ Academy
        </a>
        . Licensed under{" "}
        <a href={PLAN_B_LICENSE_URL} target="_blank" rel="noopener noreferrer">
          {PLAN_B_LICENSE_NAME}
        </a>
        .
      </p>
    );
  }

  return (
    <aside className="planb-attribution pixel-panel p-4 sm:p-5" aria-label="Content attribution">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Open-source attribution (TASL)
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-muted">Title</dt>
          <dd>{course.title}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Author</dt>
          <dd>{authors}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Source</dt>
          <dd className="space-y-1">
            <a
              href={getCourseAcademyUrl(course)}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline"
              style={{ color: "var(--planb-orange)" }}
            >
              {PLAN_B_ACADEMY_URL}/courses/{course.uuid}
            </a>
            <a
              href={getCourseSourceUrl(course.slug, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted hover:text-foreground hover:underline"
            >
              {PLAN_B_CONTENT_REPO} (dev branch)
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">License</dt>
          <dd>
            <a
              href={PLAN_B_LICENSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--planb-orange)" }}
            >
              Creative Commons Attribution-ShareAlike 4.0 ({PLAN_B_LICENSE_NAME})
            </a>
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Course materials are sourced from{" "}
        <a href={PLAN_B_NETWORK_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Plan ₿ Network
        </a>
        . {course.title} is presented by Cypherpunk Code under independent branding — not
        affiliated with or endorsed by Plan ₿ Academy.
      </p>
    </aside>
  );
}