import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { resources } from "@/lib/data";
import { getCoursesForBitcoinTrack } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";
import { ALL_TOPICS } from "@/lib/seo/topics";

export type SitemapPath = {
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
};

function walkDocHtmlFiles(dir: string, baseDir: string, paths: string[] = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkDocHtmlFiles(full, baseDir, paths);
      continue;
    }
    if (!entry.endsWith(".html")) {
      continue;
    }
    const relative = full.slice(baseDir.length).replace(/\\/g, "/");
    paths.push(`/doc${relative}`);
  }
  return paths;
}

function getDocPaths(): string[] {
  const docDir = join(process.cwd(), "public", "doc");
  try {
    return walkDocHtmlFiles(docDir, docDir);
  } catch {
    return [];
  }
}

export async function getSitemapPaths(): Promise<SitemapPath[]> {
  const paths: SitemapPath[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/catalog", priority: 0.9, changeFrequency: "weekly" },
    { path: "/paths", priority: 0.9, changeFrequency: "weekly" },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  ];

  for (const topic of ALL_TOPICS) {
    paths.push({
      path: `/topics/${topic}`,
      priority: 0.85,
      changeFrequency: "weekly",
    });
  }

  for (const resource of resources) {
    paths.push({
      path: `/resource/${resource.id}`,
      priority: resource.featured ? 0.8 : 0.7,
      changeFrequency: "monthly",
    });
  }

  for (const course of getCoursesForBitcoinTrack()) {
    paths.push({
      path: `/courses/${course.slug}`,
      priority: 0.85,
      changeFrequency: "weekly",
    });

    try {
      const parsed = await fetchCourseContent(course.slug);
      for (const chapter of parsed.chapters) {
        paths.push({
          path: `/courses/${course.slug}/${chapter.slug}`,
          priority: 0.65,
          changeFrequency: "monthly",
        });
      }
    } catch (error) {
      console.warn(`Sitemap: skipping chapters for ${course.slug}:`, error);
    }
  }

  for (const docPath of getDocPaths()) {
    paths.push({
      path: docPath,
      priority: docPath === "/doc/index.html" ? 0.8 : 0.6,
      changeFrequency: "monthly",
    });
  }

  return paths;
}