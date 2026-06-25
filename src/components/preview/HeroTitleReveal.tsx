"use client";

type HeroTitleRevealProps = {
  line1: string;
  line2: string;
};

function renderLine(text: string, keyPrefix: string, startIndex: number) {
  const chars = text.split("");
  return chars.map((char, i) => {
    const index = startIndex + i;
    const isSpace = char === " ";
    return (
      <span
        key={`${keyPrefix}-${i}`}
        className={`preview-hero__letter-wrap${isSpace ? " preview-hero__letter-wrap--space" : ""}`}
        style={
          {
            "--letter-delay": `${0.18 + index * 0.038}s`,
            animationDelay: `${0.18 + index * 0.038}s`,
          } as React.CSSProperties
        }
      >
        <span
          className={`preview-hero__letter${isSpace ? " preview-hero__letter--space" : ""}`}
        >
          {isSpace ? "\u00a0" : char}
        </span>
        {!isSpace ? <span className="preview-hero__letter-glow" aria-hidden /> : null}
      </span>
    );
  });
}

export function HeroTitleReveal({ line1, line2 }: HeroTitleRevealProps) {
  const line2Offset = line1.length + 1;

  return (
    <h1 className="preview-hero__title preview-hero__title--reveal">
      <span className="preview-hero__title-line">
        {renderLine(line1, "l1", 0)}
      </span>
      <span className="preview-hero__title-line preview-hero__title-line--accent">
        {renderLine(line2, "l2", line2Offset)}
      </span>
    </h1>
  );
}