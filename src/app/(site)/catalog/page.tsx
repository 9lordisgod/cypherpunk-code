import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { resources } from "@/lib/data";

export const metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resource Catalog</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Search and filter {resources.length} curated resources. Use the CP Score
          slider to cut trading fluff and surface cypherpunk signal.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="rounded-lg border border-border bg-card p-12 text-center text-muted">
            Loading catalog...
          </div>
        }
      >
        <CatalogClient resources={resources} />
      </Suspense>
    </div>
  );
}