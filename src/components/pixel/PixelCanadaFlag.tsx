type Props = {
  className?: string;
};

export function PixelCanadaFlag({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 32 16"
      className={`pixel-art ${className}`}
      aria-label="Canada flag"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="0" width="8" height="16" fill="#ff0000" />
      <rect x="24" y="0" width="8" height="16" fill="#ff0000" />
      <rect x="8" y="0" width="16" height="16" fill="#ffffff" />
      <rect x="14" y="2" width="4" height="1" fill="#ff0000" />
      <rect x="13" y="3" width="6" height="1" fill="#ff0000" />
      <rect x="12" y="4" width="8" height="1" fill="#ff0000" />
      <rect x="11" y="5" width="10" height="1" fill="#ff0000" />
      <rect x="10" y="6" width="12" height="1" fill="#ff0000" />
      <rect x="9" y="7" width="14" height="1" fill="#ff0000" />
      <rect x="10" y="8" width="12" height="1" fill="#e60026" />
      <rect x="11" y="9" width="10" height="1" fill="#e60026" />
      <rect x="12" y="10" width="8" height="1" fill="#e60026" />
      <rect x="13" y="11" width="6" height="1" fill="#e60026" />
      <rect x="14" y="12" width="4" height="1" fill="#e60026" />
      <rect x="15" y="13" width="2" height="3" fill="#e60026" />
    </svg>
  );
}