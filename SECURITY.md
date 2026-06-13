# Security Policy

## Supported Versions

We aim to support the latest main branch for security updates.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Cypherpunk Code (including the Cipher Arena, wallet integration, burns, progress system, or any other component), please report it responsibly.

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

## Scope

This policy covers the code in this repository, particularly:
- On-chain devnet USDC burn logic
- Wallet signature verification for progress sync
- Client-side persistence and state handling
- API routes (including /api/arena-progress)
- Authentication and authorization flows

Out of scope: Third-party services (Helius, Solana devnet, Vercel, faucets, etc.), social engineering, or issues in dependencies unless they directly affect this codebase in a novel way.

## Thank You

Security research helps keep cypherpunk tools trustworthy. We value your efforts to make the ecosystem stronger.