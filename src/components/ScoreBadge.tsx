export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9
      ? "text-accent border-accent/40 bg-accent/10"
      : score >= 7
        ? "text-accent-blue border-accent-blue/40 bg-accent-blue/10"
        : score >= 5
          ? "text-accent-orange border-accent-orange/40 bg-accent-orange/10"
          : "text-muted border-border bg-card";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs ${color}`}
      title="Cypherpunk relevance score (1-10)"
    >
      <span className="opacity-60">CP</span>
      {score}
    </span>
  );
}