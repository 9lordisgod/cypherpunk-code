# Security Policy

## Supported Versions

We aim to support the latest main branch for security updates.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Cypherpunk Code, please report it responsibly.

**Do not** open a public GitHub issue for security vulnerabilities.

**Preferred reporting method:**
- Email: (to be added by maintainers; use the contact method listed on cypherpunk-code.ca or the curator's X account in the interim)
- Or open a private security advisory on GitHub if available for this repository.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

We will acknowledge receipt within 48 hours and aim to provide a fix timeline. We appreciate responsible disclosure and will credit reporters (unless they prefer to remain anonymous).

## Operator security vault

Production rate limits, honeypot keys, and blocklists live in an **AES-256-GCM encrypted vault** (`.security/vault.enc`). Plaintext config and encryption keys are **never** committed to git.

Setup (operators only):

```bash
openssl rand -base64 32          # SECURITY_VAULT_KEY
npm run security:init
# edit .security/vault.json
npm run security:encrypt
npm run security:export          # → SECURITY_VAULT_B64 for Vercel
```

## Scope

This policy covers the code in this repository, particularly client-side persistence, API routes, and general application logic.

Out of scope: Third-party services (Vercel, external APIs, etc.), social engineering, or issues in dependencies unless they directly affect this codebase in a novel way.

## Thank You

Security research helps keep cypherpunk tools trustworthy. We value your efforts to make the ecosystem stronger.