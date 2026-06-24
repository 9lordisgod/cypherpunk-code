import type { MetadataRoute } from "next";
import { site } from "@/lib/data";
import { getSitemapPaths } from "@/lib/seo/sitemap-paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getSitemapPaths();

  return paths.map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}