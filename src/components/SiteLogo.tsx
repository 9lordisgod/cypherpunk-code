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
    <img
      src="/logo.png"
      alt="Cypherpunk Code"
      className={`${sizeClasses[size]} ${className}`.trim()}
    />
  );
}