import resourcesData from "@/data/resources.json";
import pathsData from "@/data/paths.json";
import siteData from "@/data/site.json";
import { assertCatalogUrl } from "@/lib/security/link-policy";
import type { LearningPath, Resource, SiteMeta } from "./types";

function validateCatalog(data: Resource[]): Resource[] {
  for (const resource of data) {
    assertCatalogUrl(resource.url);
  }
  return data;
}

export const resources: Resource[] = validateCatalog(resourcesData as Resource[]);
export const learningPaths: LearningPath[] = pathsData as LearningPath[];
function resolveSiteMeta(): SiteMeta {
  const base = siteData as SiteMeta;
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!publicUrl) return base;
  try {
    const host = new URL(publicUrl).host;
    return { ...base, url: publicUrl, domain: host };
  } catch {
    return base;
  }
}

export const site: SiteMeta = resolveSiteMeta();

export function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

export function getResourcesByIds(ids: string[]): Resource[] {
  return ids
    .map((id) => getResourceById(id))
    .filter((r): r is Resource => r !== undefined);
}

export function getFeaturedResources(): Resource[] {
  return resources.filter((r) => r.featured);
}

export function getTopicCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const resource of resources) {
    for (const topic of resource.topics) {
      counts[topic] = (counts[topic] ?? 0) + 1;
    }
  }
  return counts;
}

export function getTypeCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const resource of resources) {
    counts[resource.type] = (counts[resource.type] ?? 0) + 1;
  }
  return counts;
}