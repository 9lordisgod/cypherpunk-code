import Link from "next/link";
import { site } from "@/lib/data";

export const metadata = {
  title: "Business Model",
};

const models = [
  {
    id: "donations",
    name: "Donations (BTC/XMR)",
    verdict: "Recommended — Phase 1",
    score: 9,
    pros: [
      "Aligns with cypherpunk values: no KYC, no payment processors",
      "Zero friction for users — catalog stays fully open",
      "Monero donations match the privacy audience",
      "Low operational cost for a curated index site",
    ],
    cons: [
      "Unpredictable revenue — feast or famine",
      "Hard to scale team or pay contributors reliably",
      "Requires audience trust and visibility first",
    ],
  },
  {
    id: "saas",
    name: "SaaS Subscription",
    verdict: "Not recommended for core catalog",
    score: 3,
    pros: [
      "Predictable recurring revenue",
      "Could fund faster development and data refresh",
      "Premium features (bookmarks, paths, alerts) have value",
    ],
    cons: [
      "Paywalling education contradicts cypherpunk ethos",
      "Requires accounts, payment rails, likely Stripe (KYC-adjacent)",
      "Competes with free resources you're indexing",
      "High churn in niche privacy audience",
    ],
  },
  {
    id: "freemium",
    name: "Freemium + Premium Tier",
    verdict: "Viable — Phase 2",
    score: 7,
    pros: [
      "Keep catalog free; charge for power-user features",
      "Premium: custom learning paths, progress tracking, export, API",
      "Optional annual plan paid in BTC/XMR (no fiat required)",
      "Doesn't gate foundational education",
    ],
    cons: [
      "Premium features must be genuinely useful, not artificial scarcity",
      "Still needs payment infrastructure for fiat users",
      "Development overhead for features nobody asked for yet",
    ],
  },
  {
    id: "affiliate",
    name: "Affiliate / Sponsored Listings",
    verdict: "Use sparingly",
    score: 4,
    pros: [
      "Passive revenue from hardware wallet referrals, VPS hosts, etc.",
      "Can fund hosting without charging users",
    ],
    cons: [
      "Credibility risk if sponsored entries blend with curated ones",
      "Privacy community is skeptical of affiliate links",
      "Must be radically transparent or it erodes trust",
    ],
  },
  {
    id: "grants",
    name: "Grants & Community Funding",
    verdict: "Recommended — parallel track",
    score: 8,
    pros: [
      "Monero CCS model proves community funding works for privacy OSS",
      "Human Rights Foundation, Spiral, community grants fit the mission",
      "No user-facing paywall required",
      "Builds legitimacy in the ecosystem",
    ],
    cons: [
      "Application effort and uncertainty",
      "May come with reporting requirements",
      "Not a long-term sole revenue source",
    ],
  },
];

export default function ModelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Business Model Proposal</h1>
      <p className="mt-4 text-lg text-muted">
        Analysis for {site.name} — which model fits a cypherpunk education
        catalog best?
      </p>

      <section className="mt-10 rounded-lg border border-accent/30 bg-accent/5 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          Recommendation
        </p>
        <h2 className="mt-2 text-xl font-bold">
          Hybrid: Open Catalog + Crypto Donations + Grants
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          Launch as a <strong className="text-foreground">fully free, open catalog</strong> funded
          by Bitcoin and Monero donations. Pursue ecosystem grants in parallel
          (Monero CCS, HRF, Spiral). Introduce an{" "}
          <strong className="text-foreground">optional freemium tier</strong> only after
          you have traffic and know what power users actually want — never
          paywall the index itself.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Avoid traditional SaaS as the primary model. A subscription paywall on
          cypherpunk education is philosophically misaligned and commercially
          weak in this niche.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Phased rollout</h2>
        <div className="mt-6 space-y-4">
          {[
            {
              phase: "Phase 1 (Now)",
              items: [
                "Free catalog, no accounts",
                "BTC/XMR donation addresses on About page",
                "Build audience via @CHxmrBrother and community shares",
              ],
            },
            {
              phase: "Phase 2 (3–6 months)",
              items: [
                "Submit Monero CCS or community funding proposal",
                "Add resource submission form (community curation)",
                "Transparent sponsored section for vetted partners only",
              ],
            },
            {
              phase: "Phase 3 (6–12 months)",
              items: [
                "Optional premium: saved paths, progress, email-free sync via nostr",
                "Accept payment in BTC/XMR only — no Stripe required",
                "API access for developers (paid tier)",
              ],
            },
          ].map((p) => (
            <div
              key={p.phase}
              className="rounded-lg border border-border bg-card p-5"
            >
              <h3 className="font-mono text-sm text-accent">{p.phase}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Model comparison</h2>
        <div className="mt-6 space-y-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">
                    Fit: {model.score}/10
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      model.score >= 7
                        ? "bg-accent/10 text-accent"
                        : model.score >= 5
                          ? "bg-accent-orange/10 text-accent-orange"
                          : "bg-border text-muted"
                    }`}
                  >
                    {model.verdict}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-accent">Pros</p>
                  <ul className="space-y-1 text-sm text-muted">
                    {model.pros.map((p) => (
                      <li key={p}>+ {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-accent-orange">
                    Cons
                  </p>
                  <ul className="space-y-1 text-sm text-muted">
                    {model.cons.map((c) => (
                      <li key={c}>− {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Why not SaaS-first?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          SaaS works when you own unique, hard-to-replicate value and users have
          no free alternative. {site.name} is an index of mostly free public
          resources — paywalling it would push users back to Google. The
          cypherpunk audience specifically rejects surveillance capitalism and
          account-gated knowledge. Your moat is{" "}
          <em className="text-foreground">curation quality and trust</em>, not
          access control. Monetize the curation labor via donations and grants,
          then optionally sell workflow tools (saved paths, API) to power users
          who choose to pay.
        </p>
        <Link
          href="/about#donate"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Set up donation addresses →
        </Link>
      </section>
    </div>
  );
}