import { afterEach, describe, expect, it } from "vitest";
import {
  getAdminEmail,
  verifyAdminCredentials,
} from "@/lib/auth/admin-credentials";

describe("admin credentials", () => {
  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD_HASH;
  });

  it("verifies matching email and password", async () => {
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.ADMIN_PASSWORD = "test-password";

    expect(await verifyAdminCredentials("admin@example.com", "test-password")).toBe(
      true
    );
    expect(await verifyAdminCredentials("admin@example.com", "wrong")).toBe(false);
    expect(await verifyAdminCredentials("other@example.com", "test-password")).toBe(
      false
    );
  });

  it("returns null email when unset", () => {
    expect(getAdminEmail()).toBeNull();
  });
});