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
            { source: "/cypherscan", destination: "/", permanent: true },
            { source: "/cypherscan/:path*", destination: "/", permanent: true },
            { source: "/scan", destination: "/", permanent: true },
            { source: "/scan/:path*", destination: "/", permanent: true },
          ];
        },
      }
    : {}),
};

export default nextConfig;