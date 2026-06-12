import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.GITHUB_PAGES === "true" ? "/cypherpunk-code" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/cypherpunk-code/" : "",
};

export default nextConfig;
