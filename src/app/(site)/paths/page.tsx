import Link from "next/link";
import { ScoreBadge } from "@/components/ScoreBadge";
import { getResourcesByIds, learningPaths } from "@/lib/data";
import { topicLabels } from "@/lib/labels";

export const metadata = {
  title: "Learning Paths",
};

export default function PathsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Curated sequences from beginner to advanced. Each path orders resources
          for progressive understanding — like a wiki table of contents with
          editorial judgment.
        </p>
      </div>

      <div className="space-y-12">
        {learningPaths.map((path) => {
          const pathResources = getResourcesByIds(path.resourceIds);
          return (
            <section
              key={path.id}
              id={path.id}
              className="scroll-mt-24 rounded-lg border border-border bg-card p-6 sm:p-8"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{path.title}</h2>
                <p className="mt-2 text-sm text-muted">{path.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {path.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded border border-border px-2 py-0.5 text-xs text-muted"
                    >
                      {topicLabels[topic]}
                    </span>
                  ))}
                </div>
              </div>

              <ol className="space-y-3">
                {pathResources.map((resource, i) => (
                  <li key={resource.id}>
                    <Link
                      href={`/resource/${resource.id}`}
                      className="group flex items-start gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent/30"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-muted group-hover:border-accent/40 group-hover:text-accent">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium group-hover:text-accent">
                            {resource.title}
                          </h3>
                          <ScoreBadge score={resource.cypherpunkScore} />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                          {resource.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}