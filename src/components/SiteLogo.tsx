import Image from "next/image";

type SiteLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "site-logo site-logo--sm",
  md: "site-logo site-logo--md",
  lg: "site-logo site-logo--lg",
} as const;

export function SiteLogo({ size = "md", className = "" }: SiteLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Cypherpunk Education & Crypto Wikipedia"
      width={512}
      height={512}
      className={`${sizeClasses[size]} ${className}`.trim()}
      priority={size === "lg"}
    />
  );
}