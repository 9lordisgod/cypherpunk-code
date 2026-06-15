import type { Difficulty, Pricing, ResourceType, Topic } from "./types";

export const topicLabels: Record<Topic, string> = {
  bitcoin: "Bitcoin",
  monero: "Monero",
  privacy: "Privacy",
  cryptography: "Cryptography",
  opsec: "OpSec",
  cypherpunk: "Cypherpunk",
  lightning: "Lightning",
  mining: "Mining",
  nodes: "Nodes",
  wallets: "Wallets",
  "general-crypto": "General Crypto",
};

export const typeLabels: Record<ResourceType, string> = {
  course: "Course",
  book: "Book",
  paper: "Paper",
  guide: "Guide",
  wiki: "Wiki",
  video: "Video",
  documentation: "Docs",
  manifesto: "Manifesto",
  event: "Event",
  podcast: "Podcast",
  tool: "Tool",
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const pricingLabels: Record<Pricing, string> = {
  free: "Free",
  paid: "Paid",
  freemium: "Freemium",
};