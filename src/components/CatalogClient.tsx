"use client";

import { useMemo, useState } from "react";
import { difficultyLabels, pricingLabels, topicLabels, typeLabels } from "@/lib/labels";
import { defaultFilters, filterResources, type FilterState } from "@/lib/filters";
import type { Resource } from "@/lib/types";
import { ResourceCard } from "./ResourceCard";

const allTopics = Object.keys(topicLabels) as (keyof typeof topicLabels)[];
const allTypes = Object.keys(typeLabels) as (keyof typeof typeLabels)[];

export function CatalogClient({ resources }: { resources: Resource[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filtered = useMemo(
    () => filterResources(resources, filters),
    [resources, filters]
  );

  function toggleTopic(topic: (typeof allTopics)[number]) {
    setFilters((f) => ({
      ...f,
      topics: f.topics.includes(topic)
        ? f.topics.filter((t) => t !== topic)
        : [...f.topics, topic],
    }));
  }

  function toggleType(type: (typeof allTypes)[number]) {
    setFilters((f) => ({
      ...f,
      types: f.types.includes(type)
        ? f.types.filter((t) => t !== type)
        : [...f.types, type],
    }));
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-card p-5">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
              Search
            </label>
            <input
              type="search"
              placeholder="bitcoin, tor, gpg..."
              value={filters.query}
              onChange={(e) =>
                setFilters((f) => ({ ...f, query: e.target.value, sort: "relevance" }))
              }
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted">
              Min CP Score: {filters.minCypherpunkScore}
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={filters.minCypherpunkScore}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  minCypherpunkScore: Number(e.target.value),
                }))
              }
              className="w-full accent-accent"
            />
            <p className="mt-1 text-xs text-muted">
              Filters trading noise. 7+ = high signal.
            </p>
          </div>

          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
              Topics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
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
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
              Type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
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
              <label className="mb-1 block text-xs text-muted">Difficulty</label>
              <select
                value={filters.difficulty ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    difficulty: e.target.value
                      ? (e.target.value as FilterState["difficulty"])
                      : null,
                  }))
                }
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs"
              >
                <option value="">All</option>
                {Object.entries(difficultyLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Pricing</label>
              <select
                value={filters.pricing ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    pricing: e.target.value
                      ? (e.target.value as FilterState["pricing"])
                      : null,
                  }))
                }
                className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs"
              >
                <option value="">All</option>
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
            onClick={() => setFilters(defaultFilters)}
            className="w-full rounded border border-border py-2 text-xs text-muted hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-mono text-foreground">{filtered.length}</span> resources
          </p>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sort: e.target.value as FilterState["sort"],
              }))
            }
            className="rounded border border-border bg-card px-3 py-1.5 text-xs"
          >
            <option value="score">CP Score</option>
            <option value="title">Title A–Z</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted">No resources match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}