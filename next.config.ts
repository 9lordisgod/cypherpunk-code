import type { NextConfig } from "next";
import removedResources from "./src/data/removed-resources.json";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: "/doc", destination: "/doc/index.html" },
    ];
  },
  async redirects() {
    const docLegacy = [
      ["how-to-study.html", "/doc/doc/how-to-study.html"],
      ["platform-guide.html", "/doc/doc/platform-guide.html"],
      ["mission.html", "/doc/doc/mission.html"],
      ["roadmap.html", "/doc/doc/roadmap.html"],
      ["overview.html", "/doc/doc/platform-guide.html"],
      ["phase-1-foundations.html", "/doc/doc/platform-guide.html"],
      ["phase-2-technical.html", "/doc/doc/platform-guide.html"],
      ["phase-3-sovereignty.html", "/doc/doc/platform-guide.html"],
      ["phase-4-privacy.html", "/doc/doc/platform-guide.html"],
      ["seeker-dapp-roadmap.html", "/doc/doc/roadmap.html"],
      ["feature-roadmap.html", "/doc/doc/roadmap.html"],
      ["monetization.html", "/doc/doc/roadmap.html"],
      ["cypherpunk-score.html", "/doc/reference/cypherpunk-score.html"],
      ["learning-paths.html", "/doc/reference/learning-paths.html"],
      ["faq.html", "/doc/reference/faq.html"],
      ["glossary.html", "/doc/reference/glossary.html"],
      ["security.html", "/doc/reference/security.html"],
    ] as const;

    return [
      { source: "/preview", destination: "/", permanent: true },
      { source: "/preview/:path*", destination: "/:path*", permanent: true },
      { source: "/courses", destination: "/catalog", permanent: true },
      { source: "/courses/:path*", destination: "/catalog", permanent: true },
      { source: "/roadmap", destination: "/doc/doc/roadmap.html", permanent: true },
      { source: "/cypherscan", destination: "/", permanent: true },
      { source: "/cypherscan/:path*", destination: "/", permanent: true },
      { source: "/scan", destination: "/", permanent: true },
      { source: "/scan/:path*", destination: "/", permanent: true },
      { source: "/admin", destination: "/catalog", permanent: true },
      { source: "/admin/:path*", destination: "/catalog", permanent: true },
      { source: "/login", destination: "/catalog", permanent: true },
      { source: "/account", destination: "/catalog", permanent: true },
      ...docLegacy.map(([file, destination]) => ({
        source: `/doc/${file}`,
        destination,
        permanent: true,
      })),
      {
        source: "/doc/solana/:path*",
        destination: "/doc/doc/roadmap.html",
        permanent: true,
      },
      ...removedResources.map((id) => ({
        source: `/resource/${id}`,
        destination: "/catalog",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;