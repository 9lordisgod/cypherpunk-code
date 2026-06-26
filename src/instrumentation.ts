export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertProductionSecurityConfig } = await import(
      "@/lib/security/production-guard"
    );
    assertProductionSecurityConfig();
  }
}