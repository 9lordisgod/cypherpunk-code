import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function getAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const plain = process.env.ADMIN_PASSWORD;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (hash) {
    return bcrypt.compare(password, hash);
  }

  if (!plain) return false;
  return safeEqual(password, plain);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  if (email.trim().toLowerCase() !== adminEmail) return false;
  return verifyAdminPassword(password);
}