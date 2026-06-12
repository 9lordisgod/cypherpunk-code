import Link from "next/link";
import { site } from "@/lib/data";

type Variant = "compact" | "full";

export function ArchiveNotice({ variant = "compact" }: { variant?: Variant }) {
  if (variant === "compact") {
    return (
      <p className="text-sm text-muted">
        An open archive of cypherpunk education — catalog updated continuously.
        Content concerns?{" "}
        <a
          href={site.creator.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Contact @{site.creator.handle}
        </a>
        .
      </p>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">
        Archive &amp; maintenance policy
      </p>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
        <p>
          {site.name} is an <strong className="text-foreground">archive database</strong> of
          cypherpunk information and education — courses, papers, guides, and
          documentation gathered from public sources. It is a reference index for
          learners, not a commercial product or trading platform.
        </p>
        <p>
          The catalog and database are maintained and expanded on an ongoing basis.
          New resources, corrections, and metadata updates are applied as they
          become available.
        </p>
        <p>
          If you are a rights holder or contributor and are not satisfied with how
          your material is listed, contact{" "}
          <a
            href={site.creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            @{site.creator.handle}
          </a>{" "}
          — affected content will be reviewed and can be{" "}
          <strong className="text-foreground">removed promptly</strong>.
        </p>
      </div>
      <Link
        href="/about#policy"
        className="mt-4 inline-block text-xs text-accent hover:underline"
      >
        Read full policy →
      </Link>
    </section>
  );
}