"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import {
  filterResources,
  filtersToQueryString,
  parseFiltersFromSearchParams,
  type FilterState,
} from "@/lib/filters";
import { useResourceText } from "@/lib/i18n/useResourceText";
import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";
import type { Resource } from "@/lib/types";
import { ResourceCard } from "./ResourceCard";

export function CatalogClient({ resources }: { resources: Resource[] }) {
  const { t } = useLanguage();
  const { topicLabels, typeLabels, difficultyLabels, pricingLabels } =
    useTranslatedLabels();
  const { getSearchableText, getResourceTitle } = useResourceText();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterHelpers = useMemo(
    () => ({
      getSearchText: (r: Resource) => getSearchableText(r.id, r),
      getTitle: (r: Resource) => getResourceTitle(r.id, r.title),
    }),
    [getSearchableText, getResourceTitle]
  );
  const allTopics = Object.keys(topicLabels) as (keyof typeof topicLabels)[];
  const allTypes = Object.keys(typeLabels) as (keyof typeof typeLabels)[];

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams, allTopics, allTypes),
    [searchParams, allTopics, allTypes]
  );

  const updateFilters = useCallback(
    (updater: (prev: FilterState) => FilterState) => {
      const next = updater(filters);
      const qs = filtersToQueryString(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router]
  );

  const filtered = useMemo(
    () => filterResources(resources, filters, filterHelpers),
    [resources, filters, filterHelpers]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query.trim()) count += 1;
    if (filters.minCypherpunkScore > 0) count += 1;
    count += filters.topics.length;
    count += filters.types.length;
    if (filters.difficulty) count += 1;
    if (filters.pricing) count += 1;
    return count;
  }, [filters]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleTopic(topic: (typeof allTopics)[number]) {
    updateFilters((f) => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter((t) => t !== topic)
        : [...f.topics, topic],
    }));
  }

  function toggleType(type: (typeof allTypes)[number]) {
    updateFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
  }

  return (
    <div className="catalog-layout">
      <button
        type="button"
        className="catalog-filters-toggle lg:hidden"
        aria-expanded={filtersOpen}
        aria-controls="catalog-filters-panel"
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <span className="catalog-filters-toggle__label">{t("catalogFilters")}</span>
        {activeFilterCount > 0 ? (
          <span className="catalog-filters-toggle__badge">
            {t("catalogFiltersActive", { count: activeFilterCount })}
          </span>
        ) : null}
        <span
          className={`catalog-filters-toggle__chevron${filtersOpen ? " catalog-filters-toggle__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>

      <aside
        id="catalog-filters-panel"
        className={`catalog-filters${filtersOpen ? " catalog-filters--open" : ""}`}
      >
        <div className="catalog-filters__panel space-y-6 rounded-lg border border-border bg-card p-5 lg:sticky lg:top-20">
          <div>
            <label
              htmlFor="catalog-search"
              className="mb-2 block text-xs uppercase tracking-wider text-muted"
            >
              {t("catalogSearch")}
            </label>
            <input
              id="catalog-search"
              type="search"
              placeholder={t("catalogSearchPlaceholder")}
              value={filters.query}
              onChange={(e) =>
                updateFilters((f) => ({
                  ...f,
                  query: e.target.value,
                  sort: "relevance",
                }))
              }
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            />
          </div>

          <div>
            <label
              htmlFor="catalog-min-score"
              className="mb-2 block text-xs uppercase tracking-wider text-muted"
            >
              {t("catalogMinCpScore", { score: filters.minCypherpunkScore })}
            </label>
            <input
              id="catalog-min-score"
              type="range"
              min={0}
              max={10}
              value={filters.minCypherpunkScore}
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={filters.minCypherpunkScore}
              aria-valuetext={String(filters.minCypherpunkScore)}
              onChange={(e) =>
                updateFilters((f) => ({
                  ...f,
                  minCypherpunkScore: Number(e.target.value),
                }))
              }
              className="w-full accent-accent"
            />
            <p className="mt-1 text-xs text-muted">{t("catalogCpScoreHint")}</p>
          </div>

          <div>
            <p
              id="catalog-topics-label"
              className="mb-2 text-xs uppercase tracking-wider text-muted"
            >
              {t("catalogTopics")}
            </p>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-labelledby="catalog-topics-label"
            >
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  aria-pressed={filters.topics.includes(topic)}
                  className={`rounded border px-2 py-1 text-xs transition-colors ${
                    filters.topics.includes(topic)
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border text-muted hover:border-border hover:text-foreground"
                  }`}
                >
                  {topicLabels[topic]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              id="catalog-types-label"
              className="mb-2 text-xs uppercase tracking-wider text-muted"
            >
              {t("catalogType")}
            </p>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-labelledby="catalog-types-label"
            >
              {allTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  aria-pressed={filters.types.includes(type)}
                  className={`rounded border px-2 py-1 text-xs transition-colors ${
                    filters.types.includes(type)
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {typeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="catalog-difficulty"
                className="mb-1 block text-xs text-muted"
              >
                {t("catalogDifficulty")}
              </label>
              <select
                id="catalog-difficulty"
                value={filters.difficulty ?? ""}
                onChange={(e) =>
                  updateFilters((f) => ({
                    ...f,
                    difficulty: e.target.value
                      ? (e.target.value as FilterState["difficulty"])
                      : null,
                  }))
                }
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <option value="">{t("filterAll")}</option>
                {Object.entries(difficultyLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="catalog-pricing"
                className="mb-1 block text-xs text-muted"
              >
                {t("catalogPricing")}
              </label>
              <select
                id="catalog-pricing"
                value={filters.pricing ?? ""}
                onChange={(e) =>
                  updateFilters((f) => ({
                    ...f,
                    pricing: e.target.value
                      ? (e.target.value as FilterState["pricing"])
                      : null,
                  }))
                }
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <option value="">{t("filterAll")}</option>
                {Object.entries(pricingLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="w-full rounded border border-border py-2 text-xs text-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {t("clearFilters")}
          </button>
        </div>
      </aside>

      <div className="catalog-results">
        <div className="catalog-results__toolbar mb-4">
          <p className="text-sm text-muted">
            {t("resourcesCount", { count: filtered.length })}
          </p>
          <select
            id="catalog-sort"
            aria-label={t("catalogSortScore")}
            value={filters.sort}
            onChange={(e) =>
              updateFilters((f) => ({
                ...f,
                sort: e.target.value as FilterState["sort"],
              }))
            }
            className="rounded border border-border bg-card px-3 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <option value="score">{t("catalogSortScore")}</option>
            <option value="title">{t("catalogSortTitle")}</option>
            <option value="relevance">{t("catalogSortRelevance")}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted">{t("catalogNoResults")}</p>
          </div>
        ) : (
          <div className="catalog-results__grid">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}