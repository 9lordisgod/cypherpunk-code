type IllusProps = { className?: string };

const ORANGE = "#f97316";
const ORANGE_SOFT = "rgba(249, 115, 22, 0.35)";
const ORANGE_FAINT = "rgba(249, 115, 22, 0.12)";
const GRAY = "#e5e7eb";
const MUTED = "#9ca3af";

export function HeroIllustration({ className = "" }: IllusProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ORANGE_FAINT} />
          <stop offset="100%" stopColor="rgba(249,115,22,0.02)" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="440" height="340" rx="16" fill="url(#hero-glow)" />
      <g opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={60 + i * 48}
            y1="60"
            x2={60 + i * 48}
            y2="360"
            stroke={GRAY}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1="60"
            y1={80 + i * 44}
            x2="460"
            y2={80 + i * 44}
            stroke={GRAY}
            strokeWidth="1"
          />
        ))}
      </g>
      <circle cx="160" cy="180" r="6" fill={ORANGE} opacity="0.9" />
      <circle cx="280" cy="120" r="5" fill={ORANGE} opacity="0.7" />
      <circle cx="360" cy="220" r="7" fill={ORANGE} />
      <circle cx="220" cy="280" r="5" fill={ORANGE} opacity="0.6" />
      <circle cx="400" cy="300" r="4" fill={MUTED} />
      <path
        d="M160 180 L280 120 L360 220 M160 180 L220 280 L360 220 M280 120 L400 300"
        stroke={ORANGE_SOFT}
        strokeWidth="1.5"
      />
      <rect x="120" y="140" width="48" height="48" rx="4" stroke={ORANGE} strokeWidth="1.5" opacity="0.5" />
      <rect x="320" y="160" width="64" height="32" rx="4" stroke={ORANGE} strokeWidth="1.5" opacity="0.35" />
      <path d="M80 320 Q200 260 320 320 T460 280" stroke={ORANGE} strokeWidth="1" opacity="0.25" />
      <circle className="preview-illus-pulse" cx="160" cy="180" r="14" stroke={ORANGE} strokeWidth="1" opacity="0.3" />
      <circle className="preview-illus-pulse preview-illus-pulse--delay" cx="360" cy="220" r="18" stroke={ORANGE} strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

export function FoundationIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 280 280" fill="none" aria-hidden="true">
      <path
        d="M140 36 L220 76 V156 C220 196 140 236 140 236 C140 236 60 196 60 156 V76 Z"
        stroke={ORANGE}
        strokeWidth="2"
        fill={ORANGE_FAINT}
      />
      <path
        d="M100 120 L140 96 L180 120 V168 C180 188 140 204 140 204 C140 204 100 188 100 168 Z"
        stroke={ORANGE}
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="140" cy="148" r="16" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="136" y="132" width="8" height="32" rx="2" fill={ORANGE} />
      <rect x="124" y="148" width="32" height="8" rx="2" fill={ORANGE} opacity="0.7" />
      {[
        [88, 88], [192, 88], [88, 200], [192, 200],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="6" height="6" fill={ORANGE} opacity="0.35" />
      ))}
    </svg>
  );
}

export function CryptographyIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 280 200" fill="none" aria-hidden="true">
      <rect x="100" y="60" width="80" height="64" rx="8" stroke={ORANGE} strokeWidth="2" fill="#fff" />
      <path d="M116 60 V48 C116 36 164 36 164 48 V60" stroke={ORANGE} strokeWidth="2" />
      <circle cx="140" cy="92" r="10" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="137" y="92" width="6" height="14" rx="1" fill={ORANGE} />
      <text x="40" y="160" fill={MUTED} fontFamily="monospace" fontSize="11" opacity="0.7">
        01001101
      </text>
      <text x="160" y="160" fill={ORANGE} fontFamily="monospace" fontSize="11" opacity="0.5">
        11010010
      </text>
      <text x="90" y="180" fill={MUTED} fontFamily="monospace" fontSize="10" opacity="0.4">
        SHA-256
      </text>
      <circle cx="220" cy="80" r="4" fill={ORANGE} opacity="0.6" className="preview-illus-pulse" />
      <circle cx="60" cy="100" r="3" fill={ORANGE} opacity="0.4" />
    </svg>
  );
}

export function ProtocolsIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <circle cx="160" cy="110" r="12" fill={ORANGE} opacity="0.9" />
      <circle cx="60" cy="60" r="8" stroke={ORANGE} strokeWidth="1.5" fill="#fff" />
      <circle cx="260" cy="60" r="8" stroke={ORANGE} strokeWidth="1.5" fill="#fff" />
      <circle cx="60" cy="160" r="8" stroke={ORANGE} strokeWidth="1.5" fill="#fff" />
      <circle cx="260" cy="160" r="8" stroke={ORANGE} strokeWidth="1.5" fill="#fff" />
      <circle cx="30" cy="110" r="5" fill={MUTED} opacity="0.5" />
      <circle cx="290" cy="110" r="5" fill={MUTED} opacity="0.5" />
      <path
        d="M68 66 L152 104 M252 66 L168 104 M68 154 L152 116 M252 154 L168 116 M38 110 L148 110 M172 110 L282 110"
        stroke={ORANGE_SOFT}
        strokeWidth="1.5"
      />
      <rect x="150" y="104" width="20" height="12" rx="2" fill={ORANGE_FAINT} stroke={ORANGE} strokeWidth="1" />
    </svg>
  );
}

export function ImplementationIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 360 200" fill="none" aria-hidden="true">
      <path d="M80 140 L120 100 L160 120 L200 80 L240 110 L280 90" stroke={ORANGE} strokeWidth="1.5" opacity="0.5" />
      <rect x="100" y="120" width="40" height="40" rx="4" stroke={GRAY} strokeWidth="1" fill="#fff" />
      <rect x="160" y="100" width="40" height="56" rx="4" stroke={ORANGE} strokeWidth="1.5" fill={ORANGE_FAINT} />
      <rect x="220" y="110" width="40" height="46" rx="4" stroke={GRAY} strokeWidth="1" fill="#fff" />
      <path d="M120 140 H200 M140 120 V160 M180 100 V156" stroke={ORANGE} strokeWidth="1" opacity="0.4" />
      <circle cx="180" cy="128" r="6" fill={ORANGE} opacity="0.7" />
      <path d="M60 160 H300" stroke={GRAY} strokeWidth="1" />
      <rect x="130" y="148" width="12" height="12" fill={ORANGE} opacity="0.3" />
      <rect x="210" y="152" width="8" height="8" fill={ORANGE} opacity="0.2" />
    </svg>
  );
}

export function DividerNodesIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 200 48" fill="none" aria-hidden="true">
      <line x1="0" y1="24" x2="70" y2="24" stroke={GRAY} strokeWidth="1" />
      <line x1="130" y1="24" x2="200" y2="24" stroke={GRAY} strokeWidth="1" />
      <circle cx="100" cy="24" r="5" fill={ORANGE} opacity="0.8" />
      <circle cx="82" cy="24" r="2.5" fill={ORANGE} opacity="0.35" />
      <circle cx="118" cy="24" r="2.5" fill={ORANGE} opacity="0.35" />
    </svg>
  );
}

export function DividerGridIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 200 48" fill="none" aria-hidden="true">
      <line x1="0" y1="24" x2="60" y2="24" stroke={GRAY} strokeWidth="1" />
      <line x1="140" y1="24" x2="200" y2="24" stroke={GRAY} strokeWidth="1" />
      <g opacity="0.45">
        {Array.from({ length: 4 }).map((_, i) =>
          Array.from({ length: 4 }).map((_, j) => (
            <rect
              key={`${i}-${j}`}
              x={82 + i * 9}
              y={14 + j * 9}
              width="5"
              height="5"
              fill={i === 1 && j === 1 ? ORANGE : GRAY}
              opacity={i === 1 && j === 1 ? 0.7 : 0.5}
            />
          ))
        )}
      </g>
    </svg>
  );
}

export function DividerEncryptionIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 200 48" fill="none" aria-hidden="true">
      <line x1="0" y1="24" x2="72" y2="24" stroke={GRAY} strokeWidth="1" />
      <line x1="128" y1="24" x2="200" y2="24" stroke={GRAY} strokeWidth="1" />
      <path d="M92 18 L108 18 L108 30 L92 30 Z M94 18 V14 H106 V18" stroke={ORANGE} strokeWidth="1.2" fill={ORANGE_FAINT} />
      <text x="96" y="27" fill={ORANGE} fontFamily="monospace" fontSize="7" opacity="0.6">
        0x
      </text>
    </svg>
  );
}

export function DividerSovereigntyIllustration({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 200 48" fill="none" aria-hidden="true">
      <line x1="0" y1="24" x2="68" y2="24" stroke={GRAY} strokeWidth="1" />
      <line x1="132" y1="24" x2="200" y2="24" stroke={GRAY} strokeWidth="1" />
      <circle cx="100" cy="24" r="10" stroke={ORANGE} strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="24" r="3" fill={ORANGE} opacity="0.6" />
    </svg>
  );
}

export function SidebarPrivacyIcon({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 6 L26 11 V18 C26 23 16 28 16 28 C16 28 6 23 6 18 V11 Z" stroke={ORANGE} strokeWidth="1.2" fill={ORANGE_FAINT} />
    </svg>
  );
}

export function SidebarKeyIcon({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12" cy="14" r="6" stroke={ORANGE} strokeWidth="1.2" />
      <path d="M16 16 L26 22 V26 H22 V22" stroke={ORANGE} strokeWidth="1.2" />
    </svg>
  );
}

export function SidebarNodeIcon({ className = "" }: IllusProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="4" fill={ORANGE} opacity="0.8" />
      <circle cx="6" cy="10" r="2" stroke={ORANGE} strokeWidth="1" />
      <circle cx="26" cy="10" r="2" stroke={ORANGE} strokeWidth="1" />
      <circle cx="6" cy="22" r="2" stroke={ORANGE} strokeWidth="1" />
      <path d="M8 11 L13 14 M24 11 L19 14 M8 21 L13 18" stroke={ORANGE} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}