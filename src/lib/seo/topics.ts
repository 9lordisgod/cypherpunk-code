import type { Topic } from "@/lib/types";

export type TopicSeo = {
  slug: Topic;
  label: string;
  title: string;
  description: string;
  keywords: string[];
};

export const TOPIC_SEO: Record<Topic, TopicSeo> = {
  bitcoin: {
    slug: "bitcoin",
    label: "Bitcoin",
    title: "Bitcoin Learning Resources",
    description:
      "Curated free courses, guides, papers, and tools for learning Bitcoin — fundamentals, sovereignty, full nodes, and privacy. No trading noise.",
    keywords: [
      "bitcoin course",
      "learn bitcoin",
      "bitcoin education",
      "bitcoin sovereignty",
      "bitcoin full node",
    ],
  },
  monero: {
    slug: "monero",
    label: "Monero",
    title: "Monero Privacy Learning Resources",
    description:
      "Curated Monero guides, Moneropedia entries, wallet setup, Tor routing, and node resources for private digital cash.",
    keywords: ["monero guide", "monero privacy", "learn monero", "private cryptocurrency"],
  },
  privacy: {
    slug: "privacy",
    label: "Privacy",
    title: "Digital Privacy Learning Resources",
    description:
      "Curated privacy courses, guides, and tools — threat modeling, surveillance self-defense, and practical digital privacy.",
    keywords: ["digital privacy", "privacy course", "online privacy guide", "privacy education"],
  },
  cryptography: {
    slug: "cryptography",
    label: "Cryptography",
    title: "Cryptography Learning Resources",
    description:
      "Curated cryptography courses, papers, and references — from applied crypto to modern protocols and engineering.",
    keywords: ["cryptography course", "learn cryptography", "applied cryptography", "crypto education"],
  },
  opsec: {
    slug: "opsec",
    label: "OpSec",
    title: "Operational Security (OpSec) Resources",
    description:
      "Curated operational security resources — GPG, Tor, Tails, compartmentalization, and threat modeling for everyday users.",
    keywords: ["opsec guide", "operational security", "digital opsec", "privacy opsec"],
  },
  cypherpunk: {
    slug: "cypherpunk",
    label: "Cypherpunk",
    title: "Cypherpunk Philosophy & History Resources",
    description:
      "Curated cypherpunk manifestos, history, mailing list archives, and philosophy — understand code, privacy, and sovereignty.",
    keywords: [
      "cypherpunk",
      "cypherpunk manifesto",
      "cypherpunk philosophy",
      "crypto anarchism",
    ],
  },
  lightning: {
    slug: "lightning",
    label: "Lightning",
    title: "Bitcoin Lightning Network Resources",
    description:
      "Curated Lightning Network courses, documentation, and guides for fast, low-fee Bitcoin payments on layer two.",
    keywords: ["lightning network", "bitcoin lightning", "lightning course", "LN education"],
  },
  mining: {
    slug: "mining",
    label: "Mining",
    title: "Bitcoin & Cryptocurrency Mining Resources",
    description:
      "Curated mining guides and references — proof-of-work, decentralization, RandomX, and network security fundamentals.",
    keywords: ["bitcoin mining", "crypto mining guide", "proof of work", "mining education"],
  },
  nodes: {
    slug: "nodes",
    label: "Nodes",
    title: "Full Node & Network Infrastructure Resources",
    description:
      "Curated guides for running Bitcoin and Monero nodes — verification, sovereignty, and participating in decentralized networks.",
    keywords: ["bitcoin full node", "run bitcoin node", "monero node", "self-hosted node"],
  },
  wallets: {
    slug: "wallets",
    label: "Wallets",
    title: "Cryptocurrency Wallet Resources",
    description:
      "Curated wallet guides and documentation — self-custody, hardware wallets, privacy wallets, and safe key management.",
    keywords: ["bitcoin wallet guide", "self custody", "crypto wallet security", "privacy wallet"],
  },
  "general-crypto": {
    slug: "general-crypto",
    label: "General Crypto",
    title: "Cryptocurrency & Blockchain Education Resources",
    description:
      "Curated general cryptocurrency and blockchain courses — technical foundations without trading hype or speculation noise.",
    keywords: [
      "cryptocurrency course",
      "blockchain education",
      "crypto fundamentals",
      "free crypto course",
    ],
  },
};

export const ALL_TOPICS = Object.keys(TOPIC_SEO) as Topic[];

export function isTopicSlug(value: string): value is Topic {
  return value in TOPIC_SEO;
}

export function getTopicSeo(slug: string): TopicSeo | undefined {
  return isTopicSlug(slug) ? TOPIC_SEO[slug] : undefined;
}