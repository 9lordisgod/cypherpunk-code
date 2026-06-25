"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  shape: 0 | 1 | 2;
};

const ORANGE = "249, 115, 22";
const LINK_DISTANCE = 140;

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];
    let scrollY = 0;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const density = width < 768 ? 52000 : 24000;
      const count = Math.min(width < 768 ? 36 : 72, Math.floor((width * height) / density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * (0.05 + Math.random() * 0.08),
        vy: (Math.random() - 0.5) * (0.05 + Math.random() * 0.08),
        radius: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.28 + 0.06,
        shape: Math.floor(Math.random() * 3) as 0 | 1 | 2,
      }));
    };

    const drawShape = (x: number, y: number, size: number, shape: 0 | 1 | 2) => {
      if (shape === 0) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      const s = size * 2.2;
      ctx.beginPath();
      if (shape === 1) {
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s, y);
      } else {
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y + s * 0.35);
        ctx.lineTo(x - s, y + s * 0.35);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawLinks = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;

          const fade = 1 - dist / LINK_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ORANGE}, ${fade * 0.12})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollShift = scrollY * 0.05;
      const scrollDrift = scrollY * 0.00015;

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.x += p.vx * (0.5 + p.z);
          p.y += p.vy * (0.5 + p.z) + scrollDrift;

          if (p.x < -24) p.x = width + 24;
          if (p.x > width + 24) p.x = -24;
          if (p.y < -24) p.y = height + 24;
          if (p.y > height + 24) p.y = -24;
        }

        const depth = 0.45 + p.z * 0.9;
        const y = p.y - scrollShift * depth * 0.2;
        const size = p.radius * depth;

        ctx.fillStyle = `rgba(${ORANGE}, ${p.opacity * depth})`;
        drawShape(p.x, y, size, p.shape);

        ctx.beginPath();
        ctx.arc(p.x, y, size * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ORANGE}, ${p.opacity * 0.12})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) drawLinks();

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    resize();
    initParticles();
    draw();

    const onResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="preview-particles"
      aria-hidden="true"
    />
  );
}