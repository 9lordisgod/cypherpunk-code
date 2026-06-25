"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".preview-reveal",
  ".preview-section",
  ".preview-card",
  ".preview-path-item",
  ".preview-page",
  ".preview-doc-layout",
  ".preview-lab-card",
].join(", ");

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function PreviewMotion() {
  useEffect(() => {
    const root = document.querySelector(".preview-theme");
    if (!root) return;

    const revealAll = () => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add("preview-inview");
      });
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    root.classList.add("preview-hero-ready");

    if (prefersReducedMotion) {
      revealAll();
      return;
    }

    root.classList.add("preview-motion-on");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("preview-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );

    const observeAll = () => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains("preview-inview")) return;
        if (isInViewport(el)) {
          el.classList.add("preview-inview");
          return;
        }
        observer.observe(el);
      });
    };

    observeAll();

    const mutation = new MutationObserver(observeAll);
    mutation.observe(root, { childList: true, subtree: true });

    const fallback = window.setTimeout(revealAll, 800);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}