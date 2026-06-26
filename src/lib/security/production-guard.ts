export type ProductionSecurityIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

export function collectProductionSecurityIssues(): ProductionSecurityIssue[] {
  if (process.env.NODE_ENV !== "production") return [];

  const issues: ProductionSecurityIssue[] = [];

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