#!/usr/bin/env node
/**
 * Encrypt / decrypt the security vault (business secrets — never commit plaintext).
 *
 * Usage:
 *   node scripts/security-vault.mjs init
 *   node scripts/security-vault.mjs encrypt
 *   node scripts/security-vault.mjs decrypt
 *   node scripts/security-vault.mjs export-b64
 *
 * Requires SECURITY_VAULT_KEY env (32+ bytes). Generate:
 *   openssl rand -base64 32
 */
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const securityDir = join(root, ".security");
const templatePath = join(securityDir, "vault.template.json");
const plainPath = join(securityDir, "vault.json");
const encPath = join(securityDir, "vault.enc");

function getKey() {
  const raw = process.env.SECURITY_VAULT_KEY;
  if (!raw || raw.length < 16) {
    console.error("Set SECURITY_VAULT_KEY (openssl rand -base64 32)");
    process.exit(1);
  }
  return scryptSync(raw, "cypherpunk-code-vault", 32);
}

function encrypt(plaintext) {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(blob) {
  const key = getKey();
  const buf = Buffer.from(blob, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

const cmd = process.argv[2];

if (cmd === "init") {
  if (existsSync(plainPath)) {
    console.error("vault.json already exists");
    process.exit(1);
  }
  copyFileSync(templatePath, plainPath);
  console.log("Created .security/vault.json — edit secrets, then: encrypt");
  process.exit(0);
}

if (cmd === "encrypt") {
  if (!existsSync(plainPath)) {
    console.error("Missing .security/vault.json — run: init");
    process.exit(1);
  }
  const plain = readFileSync(plainPath, "utf8");
  JSON.parse(plain);
  const out = encrypt(plain);
  writeFileSync(encPath, out, "utf8");
  console.log("Encrypted → .security/vault.enc");
  console.log("For Vercel: node scripts/security-vault.mjs export-b64");
  process.exit(0);
}

if (cmd === "decrypt") {
  if (!existsSync(encPath)) {
    console.error("Missing .security/vault.enc");
    process.exit(1);
  }
  const plain = decrypt(readFileSync(encPath, "utf8"));
  writeFileSync(plainPath, plain, "utf8");
  console.log("Decrypted → .security/vault.json (local only, gitignored)");
  process.exit(0);
}

if (cmd === "export-b64") {
  if (!existsSync(encPath)) {
    console.error("Missing .security/vault.enc — run: encrypt");
    process.exit(1);
  }
  const blob = readFileSync(encPath, "utf8").trim();
  console.log("\nAdd to Vercel → Environment Variables:\n");
  console.log("SECURITY_VAULT_B64=" + blob);
  console.log("\n(Also set SECURITY_VAULT_KEY to the same key used for encrypt)\n");
  process.exit(0);
}

console.error("Commands: init | encrypt | decrypt | export-b64");
process.exit(1);