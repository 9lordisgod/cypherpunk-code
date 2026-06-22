import { describe, expect, it } from "vitest";
import resources from "@/data/resources.json";
import fr from "@/data/i18n/resources.fr.json";
import ja from "@/data/i18n/resources.ja.json";
import zh from "@/data/i18n/resources.zh-CN.json";
import type { Resource } from "@/lib/types";

const catalog = resources as Resource[];
const locales = [
  { name: "fr", data: fr as Record<string, unknown> },
  { name: "ja", data: ja as Record<string, unknown> },
  { name: "zh-CN", data: zh as Record<string, unknown> },
];

describe("resource translation parity", () => {
  for (const locale of locales) {
    it(`covers every catalog resource in ${locale.name}`, () => {
      const missing = catalog
        .map((resource) => resource.id)
        .filter((id) => !(id in locale.data));

      expect(missing, `missing in ${locale.name}: ${missing.join(", ")}`).toEqual([]);
    });
  }
});