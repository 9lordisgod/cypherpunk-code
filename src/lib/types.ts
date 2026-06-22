export type ResourceType =
  | "course"
  | "book"
  | "paper"
  | "guide"
  | "wiki"
  | "video"
  | "documentation"
  | "manifesto"
  | "event"
  | "podcast"
  | "tool";

export type Topic =
  | "bitcoin"
  | "monero"
  | "privacy"
  | "cryptography"
  | "opsec"
  | "cypherpunk"
  | "lightning"
  | "mining"
  | "nodes"
  | "wallets"
  | "general-crypto";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Pricing = "free" | "paid" | "freemium";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  topics: Topic[];
  difficulty: Difficulty;
  pricing: Pricing;
  provider: string;
  duration?: string;
  language: string;
  cypherpunkScore: number;
  featured?: boolean;
  tags: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  resourceIds: string[];
  topics: Topic[];
}

export interface SiteMeta {
  name: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  creator: {
    handle: string;
    url: string;
  };
  contact: {
    x: {
      handle: string;
      url: string;
    };
  };
  donations: {
    bitcoin: string;
    monero: string;
  };
}