import { createDecipheriv, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_SECURITY_VAULT } from "./defaults";
import type { SecurityVault } from "./types";

let cached: SecurityVault | null = null;

function deriveKey(raw: string) {
  return scryptSync(raw, "cypherpunk-code-vault", 32);
}

function decryptBlob(blob: string, keyRaw: string): SecurityVault {
  const key = deriveKey(keyRaw);
  const buf = Buffer.from(blob.trim(), "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  return JSON.parse(plain) as SecurityVault;
}

export function loadSecurityVault(): SecurityVault {
  if (cached) return cached;

  const key = process.env.SECURITY_VAULT_KEY;
  const envBlob = process.env.SECURITY_VAULT_B64;

  if (key && envBlob) {
    try {
      cached = decryptBlob(envBlob, key);
      return cached;
    } catch {
      console.error("[security] Failed to decrypt SECURITY_VAULT_B64");
    }
  }

  const localEnc = join(process.cwd(), ".security", "vault.enc");
  if (key && existsSync(localEnc)) {
    try {
      cached = decryptBlob(readFileSync(localEnc, "utf8"), key);
      return cached;
    } catch {
      console.error("[security] Failed to decrypt .security/vault.enc");
    }
  }

  cached = DEFAULT_SECURITY_VAULT;
  return cached;
}

export function resetSecurityVaultCache() {
  cached = null;
}