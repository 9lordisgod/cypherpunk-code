import { existsSync } from "node:fs";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: existsSync(".env.local") ? ".env.local" : ".env" });

function prismaCliUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  // Prisma CLI (db push/migrate) does not accept libsql:// — runtime uses the adapter instead.
  if (url.startsWith("libsql:") || url.includes(".turso.io")) {
    return "file:./prisma/dev.db";
  }
  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: prismaCliUrl(),
  },
});