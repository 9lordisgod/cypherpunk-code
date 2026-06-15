import Link from "next/link";
import { site } from "@/lib/data";

const nav: Array<{ href: string; label: string; badge?: string }> = [
  { href: "/catalog", label: "Catalog" },
  { href: "/cypherscan", label: "Cypherscan" },
  { href: "/paths", label: "Learning Paths" },
  { href: "/about", label: "About" },
  { href: "/roadmap", label: "Roadmap" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Cypherpunk Code logo"
            className="h-5 w-5"
          />
          <span className="font-mono text-sm font-semibold tracking-tight sm:text-base">
            {site.name}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-1 rounded px-2 py-1 text-xs text-muted transition-colors hover:text-foreground sm:px-3 sm:text-sm"
            >
              {item.label}
              {item.badge && (
                <span className="rounded bg-accent/20 px-1 font-mono text-[9px] text-accent group-hover:bg-accent/30">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}