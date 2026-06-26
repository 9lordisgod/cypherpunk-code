import { isProductionEnv } from "@/lib/auth-production";

export type ProductionSecurityIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

export function collectProductionSecurityIssues(): ProductionSecurityIssue[] {
  if (!isProductionEnv()) return [];

  const issues: ProductionSecurityIssue[] = [];

  if (!process.env.ADMIN_EMAIL?.trim()) {
    issues.push({
      code: "ADMIN_EMAIL_UNSET",
      message: "ADMIN_EMAIL must be set in production for operator sign-in.",
      severity: "error",
    });
  }

  const hasPassword =
    Boolean(process.env.ADMIN_PASSWORD?.trim()) ||
    Boolean(process.env.ADMIN_PASSWORD_HASH?.trim());

  if (!hasPassword) {
    issues.push({
      code: "ADMIN_PASSWORD_UNSET",
      message:
        "ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set in production.",
      severity: "error",
    });
  }

  if (!process.env.AUTH_SECRET?.trim()) {
    issues.push({
      code: "AUTH_SECRET_UNSET",
      message: "AUTH_SECRET must be set in production.",
      severity: "error",
    });
  }

  if (process.env.DEV_LOGIN_ENABLED === "true") {
    issues.push({
      code: "DEV_LOGIN_ENABLED",
      message: "DEV_LOGIN_ENABLED must not be true in production.",
      severity: "error",
    });
  }

  const hasVaultKey = Boolean(process.env.SECURITY_VAULT_KEY?.trim());
  const hasVaultBlob = Boolean(process.env.SECURITY_VAULT_B64?.trim());
  if (!hasVaultKey || !hasVaultBlob) {
    issues.push({
      code: "SECURITY_VAULT_DEFAULT",
      message:
        "SECURITY_VAULT_KEY and SECURITY_VAULT_B64 should be configured in production.",
      severity: "warn",
    });
  }

  return issues;
}

export function assertProductionSecurityConfig(): void {
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const issues = collectProductionSecurityIssues();
  const errors = issues.filter((i) => i.severity === "error");

  for (const issue of issues) {
    const log = issue.severity === "error" ? console.error : console.warn;
    log(`[security] ${issue.code}: ${issue.message}`);
  }

  if (errors.length > 0) {
    throw new Error(
      `Production security misconfiguration (${errors.map((e) => e.code).join(", ")})`
    );
  }
}