# Phase 4 — Privacy Techniques

Bitcoin is transparent by default. Every transaction is permanently recorded on a public ledger. Privacy requires deliberate technique — this phase teaches you how.

> "Privacy is not secrecy. A private matter is something one doesn't want the whole world to know, but a secret matter is something one doesn't want anybody to know." — Hal Finney

---

## Weeks 8–12: Reclaiming fungibility

### Primary resources

| Resource | Focus |
| --- | --- |
| Bitcoin Fungibility Wiki | Privacy concepts and techniques |
| CoinJoin Developer Guide | Collaborative transaction privacy |
| Wasabi Wallet Docs | WabiSabi CoinJoin implementation |
| Samourai Wallet | Mobile privacy wallet |
| JoinMarket | Decentralized CoinJoin market |

**Platform path:** [Bitcoin Privacy Techniques](https://cypherpunk-code.com/paths#bitcoin-privacy)

---

## Week 8: Understanding the transparency problem

### Key concepts

| Concept | Explanation |
| --- | --- |
| **Pseudonymity** | Addresses are not names, but all activity is public |
| **Chain analysis** | Linking addresses to identities via heuristics |
| **Fungibility** | Every unit should be interchangeable — transparency breaks this |
| **UTXO labeling** | Your wallet knows which coins are "tainted" by history |
| **Common input ownership** | Heuristic: inputs in same tx belong to same entity |

### Study questions

1. Why is Bitcoin pseudonymous but not anonymous?
2. How do chain analysis companies cluster addresses?
3. What is the difference between privacy and fungibility?
4. Why does accepting KYC bitcoin into your wallet reduce your privacy?

### Exercise

1. Look up a known address on mempool.space
2. Trace its transaction history
3. Note how quickly you can build a picture of activity
4. Reflect: this is what chain analysis companies do at scale

---

## Week 9: CoinJoin fundamentals

### How CoinJoin works

```
Before CoinJoin:
  Alice → 1 BTC → Exchange (visible link)

After CoinJoin:
  Alice ─┐
         ├─→ Mixed transaction ─→ Alice' (1 BTC, no link)
  Bob   ─┘                      Bob'   (1 BTC, no link)
```

Multiple users collaborate to create a transaction where inputs and outputs cannot be linked.

### Implementations

| Tool | Type | Notes |
| --- | --- | --- |
| Wasabi Wallet | Desktop CoinJoin | WabiSabi protocol, coordinator-based |
| Samourai Whirlpool | Mobile CoinJoin | Stonewall + Ricochet + Whirlpool |
| JoinMarket | Market-based | Earn fees as maker or pay as taker |
| Mercury Wallet | Layer-2 statechain | Different trust model |

### Exercise

1. Read the CoinJoin developer guide
2. Understand the difference between maker and taker roles
3. Study one implementation's documentation in depth

---

## Weeks 10–12: Practical privacy workflow

### A privacy-conscious Bitcoin workflow

```
1. Acquire bitcoin (prefer non-KYC sources)
2. Receive to fresh address (never reuse)
3. Run your own node (don't leak to third-party nodes)
4. CoinJoin before consolidating
5. Use separate wallets for separate purposes
6. Route node traffic through Tor
7. Never link on-chain activity to real identity
```

### Advanced techniques

| Technique | What it does |
| --- | --- |
| **PayJoin** | Break input-output clustering heuristics |
| **Lightning** | Off-chain payments with better privacy |
| **Silent Payments** | Reusable donation addresses without linkability |
| **Coin control** | Choose which UTXOs to spend |
| **Stonewall** | Decoy transactions that look like CoinJoin |

### Parallel: Monero

For private money beyond Bitcoin's limitations, study the [Monero Privacy Path](https://cypherpunk-code.com/paths#monero-privacy) in parallel during weeks 10–12.

---

## Checkpoint — Bitcoin track complete

- [ ] I understand why Bitcoin is not private by default
- [ ] I can explain CoinJoin to someone in plain language
- [ ] I have studied at least one privacy wallet implementation
- [ ] I run my own node (preferably Tor-only)
- [ ] I practice address reuse avoidance and coin control
- [ ] I understand the tradeoffs between Bitcoin privacy tools and Monero

**Congratulations.** You have completed the Bitcoin learning track from whitepaper to privacy techniques.

### Where to go next

- [Deep Cryptography](https://cypherpunk-code.com/paths#deep-cryptography) — mathematical foundations
- [Monero Privacy Path](https://cypherpunk-code.com/paths#monero-privacy) — private money
- [Practical OpSec Path](https://cypherpunk-code.com/paths#practical-opsec) — operational security
- [Project Roadmap](../doc/roadmap.md) — onchain learning future