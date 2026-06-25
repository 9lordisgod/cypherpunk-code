import Image from "next/image";

type PreviewSiteLogoProps = {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
};

const sizes = {
  sm: 40,
  md: 48,
  lg: 64,
  hero: 120,
} as const;

export function PreviewSiteLogo({
  size = "md",
  className = "",
}: PreviewSiteLogoProps) {
  const px = sizes[size];

  return (
    <Image
      src="/logo-brand.png"
      alt="Cypherpunk Education & Crypto Wikipedia"
      width={px}
      height={px}
      className={`preview-logo preview-logo--${size} ${className}`.trim()}
      priority={size === "hero" || size === "lg"}
      unoptimized
    />
  );
}