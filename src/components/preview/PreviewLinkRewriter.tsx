"use client";

import { useEffect } from "react";

const SKIP_PREFIXES = [
  "/preview",
  "/doc/",
  "/doc",
  "/api",
  "/login",
  "/admin",
  "/account",
];

export function PreviewLinkRewriter() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        return;
      }

      if (!href.startsWith("/")) return;
      if (SKIP_PREFIXES.some((prefix) => href === prefix || href.startsWith(`${prefix}/`))) {
        return;
      }

      event.preventDefault();
      window.location.href = `/preview${href}`;
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}