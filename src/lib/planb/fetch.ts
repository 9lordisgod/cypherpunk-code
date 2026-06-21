import { PLAN_B_CONTENT_RAW } from "./constants";
import { parseCourseMarkdown, rewriteAssetUrls } from "./parser";
import type { ParsedPlanBCourse, PlanBCourseMeta } from "./types";
import { getCourseBySlug } from "./courses";

const CACHE_SECONDS = 3600;

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

export async function fetchCourseContent(
  slug: string,
  language = "en"
): Promise<ParsedPlanBCourse> {
  const meta = getCourseBySlug(slug);
  if (!meta) {
    throw new Error(`Unknown course slug: ${slug}`);
  }

  const lang = meta.languages.includes(language) ? language : "en";
  const url = `${PLAN_B_CONTENT_RAW}/courses/${slug}/${lang}.md`;

  let raw: string;
  try {
    raw = await fetchText(url);
  } catch {
    if (lang !== "en") {
      raw = await fetchText(`${PLAN_B_CONTENT_RAW}/courses/${slug}/en.md`);
    } else {
      throw new Error(`Course content unavailable for ${slug}`);
    }
  }

  const parsed = parseCourseMarkdown(slug, lang, raw);
  const chapters = parsed.chapters.map((chapter) => ({
    ...chapter,
    content: rewriteAssetUrls(chapter.content, slug),
  }));

  return {
    slug,
    language: lang,
    frontmatter: parsed.frontmatter,
    description: rewriteAssetUrls(parsed.description, slug),
    chapters,
  };
}

export function getCourseAcademyUrl(meta: PlanBCourseMeta): string {
  return `https://planb.academy/courses/${meta.uuid}`;
}

export function getCourseSourceUrl(slug: string, language = "en"): string {
  return `${PLAN_B_CONTENT_RAW}/courses/${slug}/${language}.md`;
}