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

type SearchParamsLike = {
  get: (key: string) => string | null;
  getAll: (key: string) => string[];
};

export function parseFiltersFromSearchParams(
  searchParams: SearchParamsLike | null,
  allTopics: readonly string[],
  allTypes: readonly string[]
): FilterState {
  if (!searchParams) return defaultFilters;

  const initial: FilterState = { ...defaultFilters };

  const q = searchParams.get("q") || searchParams.get("query") || "";
  if (q) initial.query = q;

  const topicParams = [
    ...searchParams.getAll("topic"),
    ...searchParams.getAll("topics"),
  ];
  const topicsFromParam = topicParams
    .flatMap((t) => t.split(","))
    .map((t) => t.trim() as Topic)
    .filter((t) => allTopics.includes(t));
  if (topicsFromParam.length) initial.topics = topicsFromParam;

  const typeParams = [
    ...searchParams.getAll("type"),
    ...searchParams.getAll("types"),
  ];
  const typesFromParam = typeParams
    .flatMap((t) => t.split(","))
    .map((t) => t.trim() as ResourceType)
    .filter((t) => allTypes.includes(t));
  if (typesFromParam.length) initial.types = typesFromParam;

  const diff = searchParams.get("difficulty") as Difficulty | null;
  if (diff && ["beginner", "intermediate", "advanced"].includes(diff)) {
    initial.difficulty = diff;
  }

  const price = searchParams.get("pricing") as Pricing | null;
  if (price && ["free", "paid", "freemium"].includes(price)) {
    initial.pricing = price;
  }

  const minS =
    searchParams.get("minScore") || searchParams.get("minCypherpunkScore");
  if (minS) {
    const n = parseInt(minS, 10);
    if (!isNaN(n) && n >= 0 && n <= 10) initial.minCypherpunkScore = n;
  }

  const s = searchParams.get("sort") as FilterState["sort"] | null;
  if (s && ["relevance", "score", "title"].includes(s)) {
    initial.sort = s;
  }

  const hasAny =
    q ||
    topicsFromParam.length ||
    typesFromParam.length ||
    diff ||
    price ||
    minS ||
    s;
  return hasAny ? initial : defaultFilters;
}

export function filtersToQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  const q = filters.query.trim();

  if (q) params.set("q", q);
  filters.topics.forEach((topic) => params.append("topic", topic));
  filters.types.forEach((type) => params.append("type", type));
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.pricing) params.set("pricing", filters.pricing);
  if (filters.minCypherpunkScore > 0) {
    params.set("minScore", String(filters.minCypherpunkScore));
  }
  if (filters.sort !== defaultFilters.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
}

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