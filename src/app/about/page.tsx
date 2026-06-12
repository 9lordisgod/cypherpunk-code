import { resources, site } from "@/lib/data";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  const freeCount = resources.filter((r) => r.pricing === "free").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">About {site.name}</h1>
      <p className="mt-4 text-lg text-muted">{site.tagline}</p>

      <div className="prose-cypher mt-10 space-y-6 text-foreground">
        <section>
          <h2 className="text-xl font-semibold">What is this?</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {site.name} is an open education catalog for the cypherpunk and
            cryptocurrency community. It indexes courses, papers, guides,
            documentation, manifestos, podcasts, and events — with an editorial
            &ldquo;Cypherpunk Score&rdquo; that filters out trading noise and
            surfaces resources about privacy, sovereignty, and cryptography.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Who built it?</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Curated and maintained by{" "}
            <a
              href={site.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @{site.creator.handle}
            </a>
            . The initial database was seeded from public sources including
            Cypherpunk School, the Nakamoto Institute, Monero Project, MIT
            OpenCourseWare, Princeton, Class Central, and community guides.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cypherpunk Score</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Every resource is rated 1–10 for cypherpunk relevance. A score of 10
            means foundational philosophy or hands-on privacy tooling. A score of
            3 means an aggregator with mixed quality (trading courses included).
            Use the catalog filter to set your minimum threshold.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Database stats</h2>
          <ul className="mt-2 space-y-1 text-muted">
            <li>{resources.length} curated resources</li>
            <li>{freeCount} free resources</li>
            <li>Covers Bitcoin, Monero, OpSec, cryptography, and cypherpunk history</li>
            <li>No user tracking, no accounts required to browse</li>
          </ul>
        </section>

        <section id="donate">
          <h2 className="text-xl font-semibold">Support the project</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Donations in Bitcoin or Monero help keep {site.name} free and
            open. No payment processors, no KYC.
          </p>
          <div className="mt-4 space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-orange">
                Bitcoin
              </p>
              <p className="mt-1 break-all font-mono text-sm">
                <a
                  href={`bitcoin:${site.donations.bitcoin}`}
                  className="text-accent hover:underline"
                >
                  {site.donations.bitcoin}
                </a>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-orange">
                Monero
              </p>
              <p className="mt-1 break-all font-mono text-sm">
                {site.donations.monero}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contribute</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Found a resource worth adding? Have a correction? Reach out via{" "}
            <a
              href={site.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @{site.creator.handle}
            </a>
            . Future versions will include a submission form and community
            curation workflow.
          </p>
        </section>
      </div>
    </div>
  );
}