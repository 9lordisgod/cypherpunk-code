import type { Difficulty, Pricing, Resource, ResourceType, Topic } from "./types";

export interface FilterState {
  query: string;
  topics: Topic[];
  types: ResourceType[];
  difficulty: Difficulty | null;
  pricing: Pricing | null;
  minCypherpunkScore: number;
  sort: "relevance" | "score" | "title";
}

export const defaultFilters: FilterState = {
  query: "",
  topics: [],
  types: [],
  difficulty: null,
  pricing: null,
  minCypherpunkScore: 0,
  sort: "score",
};

function matchesQuery(resource: Resource, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    resource.title.toLowerCase().includes(q) ||
    resource.description.toLowerCase().includes(q) ||
    resource.provider.toLowerCase().includes(q) ||
    resource.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function filterResources(
  resources: Resource[],
  filters: FilterState
): Resource[] {
  let result = resources.filter((r) => {
    if (!matchesQuery(r, filters.query)) return false;
    if (filters.topics.length && !filters.topics.some((t) => r.topics.includes(t)))
      return false;
    if (filters.types.length && !filters.types.includes(r.type)) return false;
    if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
    if (filters.pricing && r.pricing !== filters.pricing) return false;
    if (r.cypherpunkScore < filters.minCypherpunkScore) return false;
    return true;
  });

  switch (filters.sort) {
    case "score":
      result = [...result].sort(
        (a, b) => b.cypherpunkScore - a.cypherpunkScore || a.title.localeCompare(b.title)
      );
      break;
    case "title":
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "relevance":
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        result = [...result].sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(q) ? 2 : 0;
          const bTitle = b.title.toLowerCase().includes(q) ? 2 : 0;
          return bTitle - aTitle || b.cypherpunkScore - a.cypherpunkScore;
        });
      }
      break;
  }

  return result;
}