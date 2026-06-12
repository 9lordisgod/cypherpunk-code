import Link from "next/link";
import { site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm font-semibold">{site.name}</p>
            <p className="mt-0.5 font-mono text-xs text-accent">{site.domain}</p>
            <p className="mt-1 max-w-sm text-sm text-muted">{site.tagline}</p>
            <p className="mt-4 text-xs text-muted">
              Curated by{" "}
              <a
                href={site.creator.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                @{site.creator.handle}
              </a>
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                Explore
              </p>
              <ul className="space-y-1">
                <li>
                  <Link href="/catalog" className="text-muted hover:text-foreground">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/paths" className="text-muted hover:text-foreground">
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted hover:text-foreground">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                Support
              </p>
              <ul className="space-y-1">
                <li>
                  <Link href="/about#donate" className="text-muted hover:text-foreground">
                    Donate BTC/XMR
                  </Link>
                </li>
                <li>
                  <Link href="/model" className="text-muted hover:text-foreground">
                    Business Model
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          Open catalog · No tracking · Privacy is a human right
        </p>
      </div>
    </footer>
  );
}