import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url?.includes(".turso.io") && !url?.startsWith("libsql:")) {
  console.error("Set DATABASE_URL to your Turso libsql URL.");
  console.error('Example: export DATABASE_URL="libsql://your-db-name.turso.io"');
  process.exit(1);
}
if (!authToken) {
  console.error("Set DATABASE_AUTH_TOKEN to your Turso auth token.");
  process.exit(1);
}

const client = createClient({ url, authToken });
const sql = readFileSync("prisma/turso-analytics-only.sql", "utf8");

for (const statement of sql.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) {
  await client.execute(statement);
}

console.log("Turso analytics table ready.");