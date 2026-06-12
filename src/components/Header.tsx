import Link from "next/link";
import { site } from "@/lib/data";

const nav = [
  { href: "/catalog", label: "Catalog" },
  { href: "/paths", label: "Learning Paths" },
  { href: "/about", label: "About" },
  { href: "/roadmap", label: "Roadmap" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-accent">▚</span>
          <span className="font-mono text-sm font-semibold tracking-tight sm:text-base">
            {site.name}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-foreground sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}