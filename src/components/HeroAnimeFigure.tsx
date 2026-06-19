import Image from "next/image";

export function HeroAnimeFigure() {
  return (
    <div className="hero-anime">
      <div className="hero-anime-backdrop" aria-hidden="true" />
      <div className="hero-anime-glow" aria-hidden="true" />
      <div className="hero-anime-glow hero-anime-glow--outer" aria-hidden="true" />
      <div className="hero-anime-sparkles" aria-hidden="true">
        <span className="hero-anime-sparkle hero-anime-sparkle--1" />
        <span className="hero-anime-sparkle hero-anime-sparkle--2" />
        <span className="hero-anime-sparkle hero-anime-sparkle--3" />
        <span className="hero-anime-sparkle hero-anime-sparkle--4" />
      </div>
      <div className="hero-anime-frame" aria-hidden="true" />
      <Image
        src="/anime-hero.png"
        alt=""
        className="hero-anime-img"
        width={2787}
        height={1250}
        priority
      />
      <div className="hero-anime-tint" aria-hidden="true" />
      <div className="hero-anime-shine" aria-hidden="true" />
      <div className="hero-anime-scan" aria-hidden="true" />
    </div>
  );
}