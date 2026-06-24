import { site } from "@/lib/data";
import type { Resource } from "@/lib/types";
import { absoluteUrl } from "@/lib/seo/metadata";

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.tagline,
    sameAs: [site.creator.url, site.contact.x.url],
  };
}

export function buildLearningResourceJsonLd(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: resource.title,
    description: resource.description,
    url: absoluteUrl(`/resource/${resource.id}`),
    inLanguage: resource.language,
    isAccessibleForFree: resource.pricing === "free",
    learningResourceType: resource.type,
    educationalLevel: resource.difficulty,
    provider: {
      "@type": "Organization",
      name: resource.provider,
    },
    about: resource.topics.map((topic) => ({
      "@type": "Thing",
      name: topic,
    })),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCourseJsonLd(input: {
  title: string;
  description: string;
  path: string;
  level?: string;
  hours?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    educationalLevel: input.level,
    timeRequired: input.hours ? `PT${input.hours}H` : undefined,
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}