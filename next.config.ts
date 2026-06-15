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
  serverExternalPackages: ["rss-parser"],
};

export default nextConfig;