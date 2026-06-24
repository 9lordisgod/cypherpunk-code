# Phase 3 — Sovereignty & Full Node

Reading about Bitcoin is not enough. Sovereignty means running your own infrastructure and holding your own keys.

> "Not your keys, not your coins" is not a slogan — it is an engineering requirement.

---

## Weeks 5–7: Self-custody and node operation

### Primary resources

| Resource | Focus |
| --- | --- |
| Getting Started with Bitcoin | Wallet setup, security basics |
| Bitcoin Full Node Guide | Why and how to run a node |
| Bitcoin Core Documentation | Installation, configuration, RPC |
| Umbrel | Easy self-hosted node platform |
| mempool.space | Block explorer as learning tool |

---

## Week 5: Wallet security and self-custody

### What to do

1. **Choose a wallet** — hardware wallet recommended for mainnet
2. **Generate seed phrase** — write on paper, store securely
3. **Verify receive addresses** — on the hardware device screen
4. **Practice recovery** — restore wallet from seed on a separate device
5. **Understand multi-sig** — for significant holdings

### Security rules

| Rule | Why |
| --- | --- |
| Never photograph your seed phrase | Phone cameras sync to cloud |
| Never type seed into any website | Phishing is the #1 attack |
| Verify addresses on device | Malware can swap clipboard addresses |
| Use passphrase (25th word) | Plausible deniability + extra security |
| Test with small amounts first | Verify your setup works |

### Platform resources

- [catalog?topic=bitcoin&topic=wallets](https://cypherpunk-code.com/catalog?topic=bitcoin&topic=wallets)
- BTC Sessions tutorials (indexed in catalog)

---

## Week 6: Running a full node

### Why run a node?

| Benefit | Explanation |
| --- | --- |
| **Validation** | You verify transactions yourself — no trust required |
| **Privacy** | Your transactions are not leaked to third-party nodes |
| **Network health** | You strengthen Bitcoin's decentralization |
| **Learning** | Running a node teaches more than months of reading |

### Options

| Method | Difficulty | Best for |
| --- | --- | --- |
| Bitcoin Core (direct) | Medium | Full control, learning |
| Umbrel / Start9 | Easy | Beginners who want sovereignty |
| Raspberry Pi node | Medium | Dedicated hardware setup |
| Pruned node | Medium | Limited disk space |

### Minimum setup (Bitcoin Core)

```bash
# Install Bitcoin Core (see bitcoincore.org for your OS)
# Start with testnet first:
bitcoind -testnet -daemon

# Verify sync:
bitcoin-cli -testnet getblockchaininfo

# Check connections:
bitcoin-cli -testnet getconnectioncount
```

### Exercise

1. Install Bitcoin Core on testnet
2. Wait for initial sync (testnet is fast)
3. Send testnet coins to your wallet
4. Verify the transaction appears in your own node's mempool
5. Confirm the transaction in a block your node validates

---

## Week 7: Advanced sovereignty

### Topics

- **Electrum Personal Server** — connect lightweight wallet to your node
- **Tor-only node** — hide your node's IP address
- **Lightning node** — layer 2 for fast, cheap payments
- **Backup and redundancy** — seed storage, node backup strategies

### Platform resources

- [catalog?topic=bitcoin&topic=nodes](https://cypherpunk-code.com/catalog?topic=bitcoin&topic=nodes)
- [catalog?topic=lightning](https://cypherpunk-code.com/catalog?topic=lightning)

---

## Checkpoint

Before moving to [Phase 4](phase-4-privacy.md), confirm:

- [ ] I hold my own keys (hardware or secure software wallet)
- [ ] I have written my seed phrase on paper and stored it securely
- [ ] I am running a Bitcoin node (testnet minimum, mainnet preferred)
- [ ] I can verify a transaction using my own node
- [ ] I understand the difference between SPV and full validation

**Platform path:** [Bitcoin Sovereignty](https://cypherpunk-code.com/paths#bitcoin-sovereignty) — steps 4–6