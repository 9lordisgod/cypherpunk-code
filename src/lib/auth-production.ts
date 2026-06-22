import bcrypt from "bcryptjs";

export const isProduction = process.env.NODE_ENV === "production";

/** Dev login is never allowed in production, regardless of env var. */
export function isDevLoginAllowed(): boolean {
  return !isProduction && process.env.DEV_LOGIN_ENABLED === "true";
}

export async function verifyAdminPassword(
  password: string,
  configuredPassword: string
): Promise<boolean> {
  if (!configuredPassword) return false;

  if (configuredPassword.startsWith("$2")) {
    return bcrypt.compare(password, configuredPassword);
  }

  if (isProduction) {
    console.error("ADMIN_PASSWORD must be a bcrypt hash in production");
    return false;
  }

  return password === configuredPassword;
}