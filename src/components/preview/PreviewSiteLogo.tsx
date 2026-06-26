import Image from "next/image";

type PreviewSiteLogoProps = {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
};

const sizes = {
  sm: 44,
  md: 56,
  lg: 64,
  xl: 80,
  hero: 128,
} as const;

export function PreviewSiteLogo({
  size = "md",
  className = "",
}: PreviewSiteLogoProps) {
  const px = sizes[size];

  return (
    <Image
      src="/logo-brand.png"
      alt="Cypherpunk Code"
      width={px}
      height={px}
      className={`preview-logo preview-logo--${size} ${className}`.trim()}
      priority={size === "hero" || size === "xl" || size === "lg"}
      unoptimized
    />
  );
}