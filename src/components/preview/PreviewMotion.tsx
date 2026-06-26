"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".preview-reveal",
  ".preview-section",
  ".preview-card",
  ".preview-path-item",
  ".preview-doc-layout",
  ".preview-lab-card",
  ".preview-stagger-group",
  ".preview-visual-divider",
  ".preview-section__cta-center",
  ".preview-explore",
  ".preview-stats",
].join(", ");

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
}

function markInView(el: Element) {
  el.classList.add("preview-inview");
  el.querySelectorAll(".preview-stagger-group").forEach((group) =>
    group.classList.add("preview-inview")
  );
}

function revealAll(root: Element) {
  root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
    markInView(el);
  });
  root.querySelectorAll(".preview-page").forEach((el) => {
    el.classList.add("preview-inview");
  });
}

export function PreviewMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector(".preview-theme");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    root.classList.add("preview-hero-ready");

    if (prefersReducedMotion) {
      revealAll(root);
      return;
    }

    root.classList.add("preview-motion-on");

    const parallaxEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-parallax]")
    );

    let parallaxFrame = 0;
    const updateParallax = () => {
      const vh = window.innerHeight;
      for (const el of parallaxEls) {
        const speed = Number(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      parallaxFrame = 0;
    };

    const onScrollParallax = () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    window.addEventListener("resize", onScrollParallax, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            markInView(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );

    const observeAll = () => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains("preview-inview")) return;
        if (isInViewport(el)) {
          markInView(el);
          return;
        }
        observer.observe(el);
      });
    };

    observeAll();
    revealAll(root);

    const mutation = new MutationObserver(observeAll);
    mutation.observe(root, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => revealAll(root), 400);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener("scroll", onScrollParallax);
      window.removeEventListener("resize", onScrollParallax);
      cancelAnimationFrame(parallaxFrame);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector(".preview-theme");
    if (!root) return;

    revealAll(root);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}