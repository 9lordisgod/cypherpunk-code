# Phase 2 — Technical Deep Dive

With philosophy and the whitepaper under your belt, it is time to understand Bitcoin's internals.

---

## Weeks 3–4: Core technical concepts

### Primary resources

| Resource | Format | Focus |
| --- | --- | --- |
| Learn Me A Bitcoin | Interactive guide | Blocks, transactions, keys, scripts |
| Mastering Bitcoin (Ch. 1–7) | Book | Keys, addresses, wallets, transactions, scripting |
| Princeton Bitcoin Course | Video course | Cryptography, consensus, mining, anonymity |

### Topic map

Study these topics in order:

```
Keys & Addresses
    ↓
Wallets (HD, seed phrases, derivation paths)
    ↓
Transactions (inputs, outputs, fees)
    ↓
Scripts & Scripting Language (P2PKH, P2SH, SegWit)
    ↓
Blocks & Blockchain Structure
    ↓
Mining & Proof-of-Work
    ↓
Consensus Rules & Forks
    ↓
Network Protocol (P2P, mempool)
```

---

## Week 3: Keys, wallets, and transactions

### Learn Me A Bitcoin — focus areas

- Private keys and public keys
- Addresses (Legacy, SegWit, Taproot)
- How transactions are constructed
- The mempool and fee market

### Mastering Bitcoin — chapters

- Chapter 4: Keys, Addresses, Wallets
- Chapter 5: Transactions
- Chapter 6: Advanced Transactions and Scripting

### Exercise

1. Generate a test wallet (testnet only)
2. Write down the seed phrase on paper (never digital)
3. Construct a mental model: "I want to send 0.001 BTC" — trace every step from wallet to confirmation

---

## Week 4: Scripts, blocks, and consensus

### Learn Me A Bitcoin — focus areas

- Script and locking/unlocking scripts
- Block structure and merkle trees
- Difficulty adjustment
- Soft forks vs hard forks

### Princeton course — focus weeks

- Week 3: Mechanics of Bitcoin (transactions, scripts)
- Week 4: How to store and use bitcoins (wallets, exchanges vs self-custody)
- Week 5: Bitcoin mining
- Week 6: Bitcoin and anonymity

### Exercise

1. Look up a recent block on mempool.space
2. Identify: block height, number of transactions, total fees, miner
3. Pick one transaction and trace its inputs and outputs

---

## Optional deep dives

| Topic | Resource | When |
| --- | --- | --- |
| Lightning Network | Mastering Lightning | After Phase 3 |
| Taproot | Bitcoin Optech Topics | After scripting basics |
| Mempool policy | Bitcoin Core docs | After node setup |

---

## Checkpoint

Before moving to [Phase 3](phase-3-sovereignty.md), confirm:

- [ ] I can explain how a Bitcoin transaction is constructed
- [ ] I understand HD wallets and seed phrases
- [ ] I know the difference between P2PKH, P2SH, and SegWit addresses
- [ ] I can read a block explorer and understand what I see
- [ ] I have completed at least 3 weeks of the Princeton course (or equivalent reading)

**Platform path:** [Bitcoin Sovereignty](https://cypherpunk-code.ca/paths#bitcoin-sovereignty) — steps 1–3