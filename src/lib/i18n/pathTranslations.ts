import type { TranslationStrings } from "./translations";

const PATH_KEYS: Record<string, { title: keyof TranslationStrings; desc: keyof TranslationStrings }> = {
  "cypherpunk-foundations": {
    title: "pathCypherpunkFoundationsTitle",
    desc: "pathCypherpunkFoundationsDesc",
  },
  "bitcoin-sovereignty": {
    title: "pathBitcoinSovereigntyTitle",
    desc: "pathBitcoinSovereigntyDesc",
  },
  "monero-privacy": {
    title: "pathMoneroPrivacyTitle",
    desc: "pathMoneroPrivacyDesc",
  },
  "practical-opsec": {
    title: "pathPracticalOpsecTitle",
    desc: "pathPracticalOpsecDesc",
  },
  "bitcoin-privacy": {
    title: "pathBitcoinPrivacyTitle",
    desc: "pathBitcoinPrivacyDesc",
  },
  "deep-cryptography": {
    title: "pathDeepCryptographyTitle",
    desc: "pathDeepCryptographyDesc",
  },
};

export function getPathTitleKey(pathId: string): keyof TranslationStrings | null {
  return PATH_KEYS[pathId]?.title ?? null;
}

export function getPathDescKey(pathId: string): keyof TranslationStrings | null {
  return PATH_KEYS[pathId]?.desc ?? null;
}