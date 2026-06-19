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

export interface FilterTextHelpers {
  getSearchText: (resource: Resource) => string;
  getTitle: (resource: Resource) => string;
}

const defaultHelpers: FilterTextHelpers = {
  getSearchText: (r) => `${r.title} ${r.description} ${r.provider}`.toLowerCase(),
  getTitle: (r) => r.title,
};

export const defaultFilters: FilterState = {
  query: "",
  topics: [],
  types: [],
  difficulty: null,
  pricing: null,
  minCypherpunkScore: 0,
  sort: "score",
};

function matchesQuery(
  resource: Resource,
  query: string,
  getSearchText: FilterTextHelpers["getSearchText"]
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    getSearchText(resource).includes(q) ||
    resource.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function filterResources(
  resources: Resource[],
  filters: FilterState,
  helpers: FilterTextHelpers = defaultHelpers
): Resource[] {
  const { getSearchText, getTitle } = helpers;
  let result = resources.filter((r) => {
    if (!matchesQuery(r, filters.query, getSearchText)) return false;
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
        (a, b) =>
          b.cypherpunkScore - a.cypherpunkScore ||
          getTitle(a).localeCompare(getTitle(b))
      );
      break;
    case "title":
      result = [...result].sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
      break;
    case "relevance":
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        result = [...result].sort((a, b) => {
          const aTitle = getSearchText(a).includes(q) ? 2 : 0;
          const bTitle = getSearchText(b).includes(q) ? 2 : 0;
          return bTitle - aTitle || b.cypherpunkScore - a.cypherpunkScore;
        });
      }
      break;
  }

  return result;
}