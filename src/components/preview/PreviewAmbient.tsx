"use client";

import { useEffect } from "react";

export function PreviewAmbient() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".preview-theme");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let frame = 0;
    let scrollY = window.scrollY;

    const update = () => {
      const progress = Math.min(
        scrollY /
          Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          ),
        1
      );
      root.style.setProperty("--preview-scroll-y", `${scrollY}px`);
      root.style.setProperty("--preview-scroll-progress", `${progress}`);
      frame = 0;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="preview-ambient" aria-hidden="true">
      <div className="preview-ambient__glow" />
      <div className="preview-ambient__glow preview-ambient__glow--secondary" />
      <div className="preview-ambient__vignette" />
      <div className="preview-ambient__scanlines" />
      <div className="preview-ambient__flow" />
    </div>
  );
}