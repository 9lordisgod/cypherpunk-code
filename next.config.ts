import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  transpilePackages: [
    "@solana/wallet-adapter-base",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-phantom",
    "@solana/wallet-adapter-solflare",
  ],
  async redirects() {
    const docLegacy = [
      ["how-to-study.html", "/doc/doc/how-to-study.html"],
      ["platform-guide.html", "/doc/doc/platform-guide.html"],
      ["mission.html", "/doc/doc/mission.html"],
      ["roadmap.html", "/doc/doc/roadmap.html"],
      ["overview.html", "/doc/bitcoin/overview.html"],
      ["phase-1-foundations.html", "/doc/bitcoin/phase-1-foundations.html"],
      ["phase-2-technical.html", "/doc/bitcoin/phase-2-technical.html"],
      ["phase-3-sovereignty.html", "/doc/bitcoin/phase-3-sovereignty.html"],
      ["phase-4-privacy.html", "/doc/bitcoin/phase-4-privacy.html"],
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
      { source: "/roadmap", destination: "/doc/doc/roadmap.html", permanent: true },
      { source: "/cypherscan", destination: "/", permanent: true },
      { source: "/cypherscan/:path*", destination: "/", permanent: true },
      { source: "/scan", destination: "/", permanent: true },
      { source: "/scan/:path*", destination: "/", permanent: true },
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
    ];
  },
};

export default nextConfig;