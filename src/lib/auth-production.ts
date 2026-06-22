export const isProduction = process.env.NODE_ENV === "production";

/** Dev login is never allowed in production, regardless of env var. */
export function isDevLoginAllowed(): boolean {
  return !isProduction && process.env.DEV_LOGIN_ENABLED === "true";
}