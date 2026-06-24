import { describe, expect, it } from "vitest";
import { getDatabaseMode } from "@/lib/admin/overview";

describe("admin overview helpers", () => {
  it("detects turso database URLs", () => {
    const previous = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "libsql://cypherpunk-code.turso.io";
    expect(getDatabaseMode()).toBe("turso");
    process.env.DATABASE_URL = previous;
  });

  it("detects local sqlite database URLs", () => {
    const previous = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "file:./prisma/dev.db";
    expect(getDatabaseMode()).toBe("sqlite-file");
    process.env.DATABASE_URL = previous;
  });
});