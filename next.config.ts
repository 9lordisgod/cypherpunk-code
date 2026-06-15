import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/cypherpunk-code",
        assetPrefix: "/cypherpunk-code/",
      }
    : {}),
  images: { unoptimized: true },

  ...(!isGitHubPages
    ? {
        async redirects() {
          return [
            { source: "/scan", destination: "/cypherscan", permanent: true },
            {
              source: "/scan/scanner",
              destination: "/cypherscan/scanner",
              permanent: true,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;