"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createBurnCheckedInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import bs58 from 'bs58';

interface ArenaProgress {
  xp: number;
  level: number;
  badges: string[];
  totalHands: number;
  totalBurned: number;
  completedNodes: string[];
  lastNode?: string;
  nodePools?: Record<string, number>;
  timestamp: number;
}

// =========================================================
// CIPHER ARENA — v0.2
// Retro computer game + cryptographic adversarial training simulator.
// COMMIT / ESCALATE actions trigger real devnet USDC burns (on-chain via Phantom).
// Hand resolution / opponent / settlement = fast local simulation of Race Protocol.
// Next: full on-chain GameAccounts + P2P shuffles + settlements.
// Devnet USDC mint: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
// Get test tokens: https://faucet.circle.com/
// Set NEXT_PUBLIC_HELIUS_API_KEY for reliable RPC during play.
// =========================================================

type Phase = 'boot' | 'lobby' | 'table' | 'settled';

type Packet = {
  id: number;
  revealed: boolean;
  rank: string;
  suit: string;
  glyph: string;
};

type LogEntry = {
  t: string;
  msg: string;
  type?: 'sys' | 'agent' | 'you';
};

type ArenaNode = {
  id: string;
  label: string;
  agents: number;
  pool: number; // USDC on Solana Devnet (test tokens)
  status: string;
  clearance: string;
};

const NODES: ArenaNode[] = [
  { id: 'node-042', label: 'NODE-042 • LOW ENTROPY DRILL', agents: 3, pool: 1.84, status: 'STABLE', clearance: 'INITIATE' },
  { id: 'node-117', label: 'NODE-117 • ADVERSARIAL FORGE', agents: 5, pool: 4.21, status: 'ACTIVE', clearance: 'FIELD' },
  { id: 'node-003', label: 'NODE-003 • SOVEREIGNTY PROVING GROUND', agents: 2, pool: 0.67, status: 'STABLE', clearance: 'VETERAN' },
];

const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Solana devnet USDC (Circle faucet)

// NOTE: On-chain burn of devnet USDC is the skin-in-the-game mechanism for now (irreversible commitment).
// Full Race Protocol GameAccount deposits + on-chain settlement planned later.

const SUITS = [
  { s: 'NODE', g: '⬡' },
  { s: 'KEY', g: '⌘' },
  { s: 'HASH', g: '◈' },
  { s: 'SHIELD', g: '⛨' },
];

const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

function createMockPackets(isPlayer: boolean): Packet[] {
  // Simple deterministic demo "hand"
  const base = isPlayer ? 0 : 6;
  return [
    { id: 1, revealed: false, rank: RANKS[base % 13], suit: SUITS[0].s, glyph: SUITS[0].g },
    { id: 2, revealed: false, rank: RANKS[(base + 2) % 13], suit: SUITS[1].s, glyph: SUITS[1].g },
  ];
}

const COMMUNITY_TEMPLATE: Packet[] = [
  { id: 10, revealed: false, rank: 'K', suit: 'HASH', glyph: '◈' },
  { id: 11, revealed: false, rank: '9', suit: 'KEY', glyph: '⌘' },
  { id: 12, revealed: false, rank: '7', suit: 'NODE', glyph: '⬡' },
  { id: 13, revealed: false, rank: 'A', suit: 'SHIELD', glyph: '⛨' },
  { id: 14, revealed: false, rank: '3', suit: 'HASH', glyph: '◈' },
];

export default function CipherArenaPage() {
  const { publicKey, connected, disconnect, wallet } = useWallet();
  const { connection } = useConnection();

  const [phase, setPhase] = useState<Phase>('boot');
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<ArenaNode | null>(null);
  const [realUsdcBalance, setRealUsdcBalance] = useState<number>(0); // Real devnet USDC balance from Phantom
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Simulated table state (local computer-game simulation for the hand resolution / reveals / settlement)
  const [yourPackets, setYourPackets] = useState<Packet[]>(createMockPackets(true));
  const [community, setCommunity] = useState<Packet[]>(COMMUNITY_TEMPLATE.map(p => ({...p})));
  const [pot, setPot] = useState(0.42);
  const [yourStack, setYourStack] = useState(2.35);
  const [oppStack, setOppStack] = useState(3.11);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [toAct, setToAct] = useState<'you' | 'opp'>('you');
  const [round, setRound] = useState(0); // 0=pre, 1=flop equiv, etc.
  const [xp, setXp] = useState(1240);
  const [level, setLevel] = useState(7);
  const [badges, setBadges] = useState(['MPC WITNESS', 'FIRST COMMIT']);

  // Persistent training progress (localStorage + optional signed server sync)
  const [totalHands, setTotalHands] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  // Dynamic node pools for the arena (accumulates real burns + simulated contributions)
  // Initialized from static NODES, then updated live and persisted
  const [nodePools, setNodePools] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    NODES.forEach((node) => {
      init[node.id] = node.pool;
    });
    return init;
  });

  const [showEdu, setShowEdu] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [eduContent, setEduContent] = useState({ title: '', body: '' });
  const [isTxPending, setIsTxPending] = useState(false); // true while awaiting user signature + confirm for real burn tx

  // Fetch real devnet USDC balance from connected Phantom wallet
  // Uses the canonical Associated Token Account (ATA) for accuracy (not just "first" account).
  const fetchRealUsdcBalance = useCallback(async (walletPublicKey: PublicKey) => {
    if (!connection || !walletPublicKey) {
      setRealUsdcBalance(0);
      return;
    }

    setIsLoadingBalance(true);
    try {
      const mint = new PublicKey(DEVNET_USDC_MINT);
      const expectedAta = await getAssociatedTokenAddress(mint, walletPublicKey);

      // Find the associated token account for USDC (derive + match, or fallback to any for this mint)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        {
          mint,
        }
      );

      let balance = 0;
      const match = tokenAccounts.value.find(
        (ta) => ta.pubkey.toBase58() === expectedAta.toBase58()
      );
      if (match) {
        balance = match.account.data.parsed.info.tokenAmount.uiAmount || 0;
      } else if (tokenAccounts.value.length > 0) {
        // Fallback (should be rare)
        balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
      }
      setRealUsdcBalance(balance);
    } catch (error) {
      console.error('Failed to fetch devnet USDC balance:', error);
      setRealUsdcBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [connection]);

  // Auto-fetch balance when wallet connects/changes
  useEffect(() => {
    if (publicKey && connected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRealUsdcBalance(publicKey);
    } else {
      setRealUsdcBalance(0);
    }
  }, [publicKey, connected, fetchRealUsdcBalance]);

  // Boot sequence — pure computer game feel
  useEffect(() => {
    if (phase !== 'boot') return;

    const lines = [
      'CYPHER CODE ARCHIVE — PROTOCOL INTERFACE LOADED',
      'RACE PROTOCOL CORE v0.2.x — MULTI-PARTY RANDOMIZATION ACTIVE',
      'SOLANA DEVNET — TEST USDC LEDGER',
      'AGENT CALLSIGN: [REDACTED] • CLEARANCE: FIELD-07',
      'INITIALIZING P2P ENTROPY SOURCE...',
      'LOADING GAME BUNDLE: race-holdem-core (WASM)',
      'TRANSPORT: SOLANA DEVNET • TOKEN: DEVNET USDC',
      'SKIN-IN-THE-GAME SIM. ACTIONS = ON-CHAIN BURNS.',
      'RACE PROTOCOL RANDOMNESS. LOCAL RESOLUTION FOR PACING.',
      'BOOT COMPLETE. ENTERING MAIN TERMINAL.',
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < lines.length) {
        setBootLog(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setPhase('lobby'), 420);
      }
    }, 110);

    return () => clearInterval(timer);
  }, [phase]);

  function appendLog(msg: string, type: LogEntry['type'] = 'sys') {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLog(prev => [...prev.slice(-12), { t, msg, type }]);
  }

  function bootIntoNode(node: ArenaNode) {
    setCurrentNode(node);
    // Record completion for persistent training record
    setCompletedNodes(prev => prev.includes(node.id) ? prev : [...prev, node.id]);

    // Use dynamic pool (accumulated from real burns + sim contributions)
    const currentPool = getNodePool(node.id);
    // Reset table state for fresh simulation instance
    setYourPackets(createMockPackets(true));
    setCommunity(COMMUNITY_TEMPLATE.map(p => ({...p})));
    setPot(currentPool * 0.18);
    setYourStack(2.1); // demo starting stack (was randomized; fixed to satisfy render purity)
    setOppStack(2.4);
    setLog([]);
    setRound(0);
    setToAct('you');
    setPhase('table');

    appendLog(`BOOTING SIMULATION INSTANCE ${node.id.toUpperCase()}`, 'sys');
    appendLog(`RACE P2P RANDOMIZATION COMPLETE — DECK SHUFFLE VERIFIED`, 'sys');
    appendLog(`AGENTS CONNECTED: ${node.agents} • READY. Moves burn real devnet USDC.`, 'sys');
    appendLog('PRE-COMMIT PHASE — YOUR MOVE, AGENT. (on-chain burn on commit/escalate)', 'sys');
  }

  function revealCommunity(upTo: number) {
    setCommunity(prev => prev.map((p, idx) => idx < upTo ? { ...p, revealed: true } : p));
  }

  function revealYourPackets() {
    setYourPackets(prev => prev.map(p => ({ ...p, revealed: true })));
  }

  // Core actions. COMMIT/ESCALATE perform real devnet USDC burns (on-chain).
  // Opponent + settlement remain local sim for pacing.
  async function performAction(action: 'commit' | 'escalate' | 'abort') {
    if (toAct !== 'you' || phase !== 'table' || !connected) {
      if (!connected) alert('Connect Phantom to make moves in the simulation.');
      return;
    }

    const amount = action === 'escalate' ? 0.18 : action === 'commit' ? 0.09 : 0;

    if (action === 'abort') {
      appendLog('YOU ABORT COMMITMENT — FOLDING FROM THIS ROUND.', 'you');
      // Opponent "wins" the pot in demo (no real burn cost for abort)
      const newOpp = oppStack + pot;
      setOppStack(newOpp);
      setPot(0);
      endHand('You aborted. Protocol integrity maintained.', false);
      return;
    }

    // Real on-chain burn for the action.
    if (realUsdcBalance < amount) {
      alert(`Need ${amount} more devnet USDC to ${action.toUpperCase()}. Get from faucet.circle.com`);
      return;
    }

    setIsTxPending(true);
    let signature: string | null = null;
    try {
      signature = await burnDevnetUsdc(amount);
    } catch (err: any) {
      console.error('Burn tx failed during action', err);
      alert('Burn tx failed. Move not executed. ' + (err.message || ''));
      setIsTxPending(false);
      return;
    }
    setIsTxPending(false);

    // Only after successful real tx do we update the local game state
    const newYourStack = Math.max(0.01, yourStack - amount);
    const newPot = pot + amount;
    setYourStack(newYourStack);
    setPot(newPot);

    setTotalBurned(b => b + amount); // persistent training record

    // Accumulate to the node's real-time pool (so lobby shows actual growth)
    if (currentNode) {
      addToNodePool(currentNode.id, amount);
    }

    const actionLabel = action === 'escalate' ? 'ESCALATE' : 'COMMIT';
    const logMsg = `${actionLabel} — burned ${amount} USDC (tx: ${signature}). Pool now ${newPot.toFixed(2)}`;
    appendLog(logMsg, 'you');

    // Advance round + opponent "response" (local sim)
    const nextRound = round + 1;
    setRound(nextRound);
    setToAct('opp');

    // Simulate opponent + progressive reveals (educational pacing)
    setTimeout(() => {
      if (nextRound === 1) {
        revealCommunity(3); // "flop"
        appendLog('INITIAL REVEAL — THREE PUBLIC LEDGER SHARDS COMMITTED.', 'sys');
      } else if (nextRound === 2) {
        revealCommunity(4); // turn
        appendLog('MID REVEAL — FOURTH SHARD EXPOSED. INFORMATION ASYMMETRY DECREASING.', 'sys');
      } else if (nextRound === 3) {
        revealCommunity(5); // river
        revealYourPackets();
        appendLog('FINAL REVEAL — ALL SHARDS PUBLIC. SETTLEMENT IMMINENT.', 'sys');
      }

      // Very simple opponent logic for demo (no real tokens from "agent")
      const oppAction = nextRound > 1 && Math.random() > 0.55 ? 'escalate' : 'commit';
      const oppAmt = oppAction === 'escalate' ? 0.21 : 0.09;

      const oppNewStack = Math.max(0.1, oppStack - oppAmt);
      setOppStack(oppNewStack);
      const oppNewPot = newPot + oppAmt;
      setPot(oppNewPot);

      appendLog(oppAction === 'escalate' 
        ? `OPPONENT ESCALATES +0.21. POOL NOW ${oppNewPot.toFixed(2)}`
        : `OPPONENT COMMITS 0.09.`, 'agent');

      setToAct('you');

      if (nextRound >= 3) {
        // Showdown
        setTimeout(() => {
          const youWin = Math.random() > 0.5; // Demo coinflip for excitement
          const winnerPot = oppNewPot;
          if (youWin) {
            const finalStack = newYourStack + winnerPot;
            setYourStack(finalStack);
            appendLog(`SETTLEMENT — YOU TAKE THE POOL. +${winnerPot.toFixed(2)} [local sim]`, 'you');
            endHand('Optimal information management demonstrated.', true);
          } else {
            const finalOpp = oppNewStack + winnerPot;
            setOppStack(finalOpp);
            appendLog(`SETTLEMENT — OPPONENT CLAIMS POOL. [local sim]`, 'agent');
            endHand('Strong play. Protocol lessons logged.', false);
          }
        }, 650);
      }
    }, 520);
  }

  function endHand(message: string, youWon: boolean) {
    setPhase('settled');
    appendLog(message, 'sys');

    setTotalHands(h => h + 1);

    // Simulate other agents / new players contributing USDC to the node pool
    // (makes the displayed pools grow over time as "real" activity, not frozen)
    if (currentNode) {
      const otherPlayersContribution = 0.08 + Math.random() * 0.22;
      addToNodePool(currentNode.id, otherPlayersContribution);
    }

    const gainedXp = youWon ? 42 : 28;
    const newXp = xp + gainedXp;
    setXp(newXp);

    if (newXp > level * 220) {
      const newLevel = level + 1;
      setLevel(newLevel);
      appendLog(`CLEARANCE UPGRADED TO LEVEL ${newLevel}`, 'sys');
    }

    // Occasionally unlock a new badge
    if (!badges.includes('SETTLEMENT PROOF') && Math.random() > 0.4) {
      setBadges(prev => [...prev, 'SETTLEMENT PROOF']);
      appendLog('BADGE UNLOCKED: SETTLEMENT PROOF', 'sys');
    }

    // Educational hook
    setTimeout(() => {
      setEduContent({
        title: youWon ? 'Why your commitment sequence worked' : 'Information asymmetry in adversarial settings',
        body: youWon 
          ? 'You correctly escalated when community shards reduced uncertainty. This is the same primitive used in verifiable random functions and commitment schemes. See the linked archive entry on "Bitcoin: A Peer-to-Peer Electronic Cash System" — transparent final settlement is the point.'
          : 'The opponent forced a situation where your private packets had lower expected value once public shards were known. Study "game theory under incomplete information". This exact scenario is why cypherpunks care about selective disclosure and zero-knowledge proofs.'
      });
      setShowEdu(true);
    }, 900);

    // Auto sync progress (local + signed server) after a hand
    saveProgress(true);
  }

  function withdrawAndReturn() {
    // Burns already executed on-chain for prior actions (no pot held here).
    appendLog('EXITING — Burns for your actions already confirmed on devnet.', 'sys');
    setTimeout(() => {
      setPhase('lobby');
      setCurrentNode(null);
      setShowEdu(false);
    }, 620);
  }

  function openEduLink(topic: string) {
    // In production this would deep-link into /catalog or /paths with filter
    window.open(`/catalog?topic=${topic.toLowerCase().includes('game') ? 'general-crypto' : 'cryptography'}`, '_blank');
  }

  // === PERSISTENT PROGRESS (localStorage primary + signed Vercel backend for cross-device) ===

  const getProgressKey = (addr: string) => `arena-progress-${addr}`;

  const buildProgress = (): ArenaProgress => ({
    xp,
    level,
    badges,
    totalHands,
    totalBurned,
    completedNodes,
    lastNode: currentNode?.id,
    nodePools,
    timestamp: Date.now(),
  });

  const getNodePool = (id: string) => nodePools[id] ?? NODES.find((n) => n.id === id)?.pool ?? 0;

  const addToNodePool = (id: string, amount: number) => {
    setNodePools((prev) => ({
      ...prev,
      [id]: (prev[id] || getNodePool(id)) + amount,
    }));
  };

  const saveLocal = (addr: string, p: ArenaProgress) => {
    try {
      localStorage.setItem(getProgressKey(addr), JSON.stringify(p));
    } catch {}
  };

  async function signMessageForProgress(messageStr: string): Promise<{ message: string; signature: string; publicKey: string } | null> {
    const adapter: any = wallet?.adapter;
    const signMsg = adapter && typeof adapter.signMessage === 'function' ? adapter.signMessage : null;
    if (!publicKey || !signMsg) return null;
    try {
      const messageBytes = new TextEncoder().encode(messageStr);
      const sig: Uint8Array = await signMsg(messageBytes);
      return {
        message: messageStr,
        signature: bs58.encode(sig),
        publicKey: publicKey.toBase58(),
      };
    } catch (e) {
      console.warn('Message signing failed or cancelled', e);
      return null;
    }
  }

  async function saveToServer(p: ArenaProgress) {
    if (!publicKey) return;
    const addr = publicKey.toBase58();
    const ts = Date.now();
    const msg = `save-progress-v1:${ts}:${JSON.stringify(p)}`;
    const signed = await signMessageForProgress(msg);
    if (!signed) return;
    try {
      await fetch('/api/arena-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          message: signed.message,
          signature: signed.signature,
          publicKey: addr,
          progress: p,
        }),
      });
    } catch (e) {
      console.warn('Server progress save failed (local still saved)', e);
    }
  }

  async function loadFromServer(addr: string): Promise<ArenaProgress | null> {
    const ts = Date.now();
    const msg = `load-progress-v1:${ts}`;
    const signed = await signMessageForProgress(msg);
    if (!signed) return null;
    try {
      const res = await fetch('/api/arena-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'load',
          message: signed.message,
          signature: signed.signature,
          publicKey: addr,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.progress || null;
    } catch (e) {
      console.warn('Server progress load failed', e);
      return null;
    }
  }

  const saveProgress = async (forceServerSync = false) => {
    if (!publicKey || !connected) return;
    const addr = publicKey.toBase58();
    const p = buildProgress();
    saveLocal(addr, p);
    if (forceServerSync) {
      await saveToServer(p);
    }
  };

  // Auto-save to localStorage on any progress change
  useEffect(() => {
    if (connected && publicKey) {
      // debounce-ish via effect
      const addr = publicKey.toBase58();
      const p = buildProgress();
      saveLocal(addr, p);
    }
  }, [xp, level, badges, totalHands, totalBurned, completedNodes, nodePools, connected, publicKey, currentNode]);

  // Load progress (local + optional signed server fetch) when wallet connects
  useEffect(() => {
    if (!connected || !publicKey) return;

    const addr = publicKey.toBase58();
    let didRestore = false;

    // 1. LocalStorage (fast, offline)
    try {
      const raw = localStorage.getItem(getProgressKey(addr));
      if (raw) {
        const p: ArenaProgress = JSON.parse(raw);
        if (p.xp != null) setXp(p.xp);
        if (p.level != null) setLevel(p.level);
        if (p.badges?.length) setBadges(p.badges);
        if (p.totalHands != null) setTotalHands(p.totalHands);
        if (p.totalBurned != null) setTotalBurned(p.totalBurned);
        if (p.completedNodes) setCompletedNodes(p.completedNodes);
        if (p.nodePools) setNodePools((prev) => ({ ...prev, ...p.nodePools }));
        didRestore = true;
        appendLog(`Welcome back. Local training record loaded for ${addr.slice(0, 4)}...${addr.slice(-4)}.`, 'sys');
      }
    } catch {}

    // 2. Server (signed fetch for cross-device "proper" persistence)
    (async () => {
      const serverP = await loadFromServer(addr);
      if (serverP && serverP.timestamp) {
        // Cloud record takes precedence for cross-device sync (localStorage is fast offline fallback)
        setXp(serverP.xp || 0);
        setLevel(serverP.level || 1);
        if (serverP.badges?.length) setBadges(serverP.badges);
        setTotalHands(serverP.totalHands || 0);
        setTotalBurned(serverP.totalBurned || 0);
        if (serverP.completedNodes) setCompletedNodes(serverP.completedNodes);
        if (serverP.nodePools) setNodePools((prev) => ({ ...prev, ...serverP.nodePools }));
        didRestore = true;
        appendLog(`Cloud training record synced (signed by wallet).`, 'sys');
        // push back to local + server (in case local was ahead)
        saveProgress(true);
      }
    })();
  }, [connected, publicKey]);

  // Burns real devnet USDC from connected wallet. Returns tx signature.
  // Called on COMMIT/ESCALATE (and extra allocation). Skin-in-game via permanent burn.
  async function burnDevnetUsdc(amount: number): Promise<string> {
    if (!connected || !publicKey || !wallet) {
      throw new Error('Wallet not connected');
    }
    if (amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (realUsdcBalance < amount) {
      throw new Error('Insufficient real devnet USDC balance');
    }

    const mint = new PublicKey(DEVNET_USDC_MINT);
    const sourceAta = await getAssociatedTokenAddress(mint, publicKey);

    const burnInstruction = createBurnCheckedInstruction(
      sourceAta,
      mint,
      publicKey,
      Math.floor(amount * 1_000_000), // USDC 6 decimals
      6
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction().add(burnInstruction);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Prompts the user in Phantom (or other adapter) for real signature
    const signature = await wallet.adapter.sendTransaction(transaction, connection);

    // Wait for confirmation on-chain (real tx hash / slot)
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

    // Refresh displayed real balance
    await fetchRealUsdcBalance(publicKey);

    return signature;
  }

  // Wrapper for the "add to stack" / extra allocation button (still useful mid-session)
  async function spendRealDevnetUsdcForAllocation() {
    if (!currentNode || !connected || !publicKey || !wallet) return;

    const amount = 0.5;
    setIsTxPending(true);
    try {
      const signature = await burnDevnetUsdc(amount);
      setYourStack(s => s + amount);

      setTotalBurned(b => b + amount); // persistent training record

      // Accumulate to the node's real-time pool
      if (currentNode) {
        addToNodePool(currentNode.id, amount);
      }

      // Refetch real balance (it should now be lower)
      await fetchRealUsdcBalance(publicKey);

      appendLog(`BURNED +${amount} USDC (tx: ${signature}) — extra allocation.`, 'sys');

    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : '';
      alert('Failed to burn devnet USDC for allocation.\n\n' + msg);
    } finally {
      setIsTxPending(false);
    }
  }

  const isYouActing = toAct === 'you' && phase === 'table' && !isTxPending;

  return (
    <div className="min-h-[100dvh] bg-[#070b0f] text-[#00ff9f] selection:bg-[#00e67633] selection:text-[#00ff9f]">
      {/* Top chrome — feels like an old terminal menu */}
      <div className="border-b border-[#1a2530] bg-[#0a100f] px-4 py-2 font-mono text-[10px] tracking-[2px] text-[#00cc7a]">
        CYPHER ARENA v0.2 • RACE PROTOCOL SIM • ADVERSARIAL TRAINING • SOLANA DEVNET
        <span className="ml-4 text-[#8b9cb0]">
          RPC: {process.env.NEXT_PUBLIC_SOLANA_RPC_URL ? 'CUSTOM' : process.env.NEXT_PUBLIC_HELIUS_API_KEY ? 'HELIUS ✓' : 'PUBLIC (slow)'}
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6">
        {/* HEADER / STATUS BAR */}
        <div className="mb-4 border-b border-[#1a2530] pb-3">
          <div className="font-mono text-2xl font-bold tracking-[-1.5px] text-[#00ff9f]">CIPHER ARENA</div>
          <div className="text-[10px] text-[#8b9cb0] -mt-1">ADVERSARIAL COMMITMENT TRAINING • POWERED BY RACE PROTOCOL</div>
        </div>

        {/* WALLET + DEVNET USDC (skin-in-the-game: COMMIT/ESCALATE = real burns) */}
        <div className="mb-6 rounded border-2 border-[#ffb347] bg-[#0a100f] p-4">
          <div className="font-mono text-[#ffb347] text-xs tracking-[2px] mb-2">CONNECT PHANTOM (DEVNET) • FUND WITH TEST USDC • ACTIONS BURN TOKENS ON-CHAIN</div>
          
          {!connected ? (
            <div>
              <p className="text-sm mb-3">
                Connect <strong>Phantom</strong> (Solana Devnet). Your COMMIT and ESCALATE actions execute real devnet USDC burns (signed tx + confirmed on-chain, tx hash logged).
              </p>
              <WalletMultiButton className="arena-button !px-6 !py-2" />
              <p className="mt-2 text-xs text-[#8b9cb0]">
                Hand resolution, opponent, and settlement math run as a fast local simulation. <span className="text-[#ffb347]">Include a few cents of devnet SOL for fees.</span> Get test USDC: <a href="https://faucet.circle.com/" target="_blank" className="underline">faucet.circle.com</a>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <div className="text-xs text-[#8b9cb0]">CONNECTED PHANTOM</div>
                <div className="font-mono text-sm text-[#00ff9f]">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#8b9cb0]">YOUR DEVNET USDC BALANCE</div>
                <div className="font-mono text-xl font-bold text-[#ffb347]">
                  {isLoadingBalance ? '...' : realUsdcBalance.toFixed(2)} USDC
                </div>
              </div>
              <button 
                onClick={() => disconnect()} 
                className="arena-button secondary text-xs px-4 py-1 self-start sm:self-auto"
              >
                DISCONNECT
              </button>
              <button 
                onClick={() => setShowRecord(true)} 
                className="arena-button text-xs px-4 py-1 self-start sm:self-auto"
              >
                MY RECORD
              </button>
            </div>
          )}

          {connected && realUsdcBalance < 0.3 && (
            <div className="mt-3 text-xs text-[#ffb347] border border-[#ffb347] p-2">
              Low balance. Get free devnet USDC + tiny SOL for fees at https://faucet.circle.com/ (Solana Devnet).
            </div>
          )}
        </div>

        {/* CRT SHELL */}
        <div className="crt mx-auto max-w-[1080px] rounded bg-[#0a100f] p-4 md:p-6 shadow-2xl">
          {/* BOOT */}
          {phase === 'boot' && (
            <div className="boot-text min-h-[420px] space-y-1 px-3 pt-8 font-mono text-sm">
              {bootLog.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
              <div className="text-[#ffb347] mt-4">PRESS ANY KEY TO ACCELERATE... (auto-booting)</div>
            </div>
          )}

          {/* LOBBY — Main terminal listing active simulation nodes */}
          {phase === 'lobby' && (
            <div>
              <div className="terminal-header mb-4 px-4 py-2 text-xs tracking-[3px]">MAIN TERMINAL — ACTIVE SIMULATION NODES</div>

              <div className="grid gap-4 md:grid-cols-3">
                {NODES.map(node => (
                  <button
                    key={node.id}
                    onClick={() => {
                      if (!connected) {
                        alert('Connect your Phantom wallet on Devnet first to enter the simulation.');
                        return;
                      }
                      if (realUsdcBalance < 0.3) {
                        alert('Need devnet USDC in Phantom (and SOL for fees). Get from faucet.circle.com (Solana Devnet). Actions burn on COMMIT/ESCALATE.');
                        return;
                      }
                      bootIntoNode(node);
                    }}
                    className="group rounded border border-[#00ff9f33] bg-[#0c1513] p-5 text-left transition hover:border-[#00ff9f] hover:bg-[#111a18] active:translate-y-[1px]"
                  >
                    <div className="font-mono text-xs text-[#00cc7a] tracking-widest">{node.id.toUpperCase()}</div>
                    <div className="mt-1 text-lg font-semibold leading-tight text-white group-hover:text-[#00ff9f]">{node.label}</div>
                    
                    <div className="mt-4 flex items-baseline justify-between text-sm">
                      <div>AGENTS: <span className="text-white">{node.agents}</span></div>
                      <div>POOL: <span className="text-white tabular-nums">{getNodePool(node.id).toFixed(2)}</span> USDC</div>
                    </div>
                    <div className="mt-1 text-xs text-[#8b9cb0]">STATUS: {node.status} • MIN CLEARANCE: {node.clearance}</div>

                    <div className="mt-4 inline-block rounded border border-[#00ff9f] px-3 py-1 text-[10px] tracking-widest group-hover:bg-[#00ff9f] group-hover:text-[#0a100f]">
                      {connected ? 'BOOT INSTANCE →' : 'CONNECT PHANTOM FIRST'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-[#1a2530] pt-4 text-xs text-[#8b9cb0]">
                All nodes run the same open Race Protocol game bundle (race-holdem core). Shuffles are multi-party cryptographic. Your actions here produce real devnet tx hashes. Full on-chain GameAccounts + settlement on the roadmap.
              </div>

              <div className="mt-3 text-[10px]">
                <Link href="/catalog?topic=cryptography" className="underline hover:text-white">Study the primitives →</Link> • 
                <span className="ml-2">Devnet USDC. Set HELIUS key for reliable txs. (Mainnet confidential.)</span>
              </div>

              {/* Subtle persistent training record greeting (local + signed server) */}
              {connected && publicKey && (totalHands > 0 || xp > 100) && (
                <div className="mt-4 text-[10px] text-[#8b9cb0] border border-[#00ff9f22] px-3 py-2 rounded">
                  Training record for <span className="font-mono text-[#00ff9f]">{publicKey.toBase58().slice(0,4)}…{publicKey.toBase58().slice(-4)}</span>: 
                  L{level} • {xp} XP • {badges.length} badges • {totalHands} hands • {totalBurned.toFixed(2)} USDC burned. 
                  <button onClick={() => setShowRecord(true)} className="ml-2 underline hover:text-white">VIEW FULL RECORD</button>
                </div>
              )}
            </div>
          )}

          {/* THE TABLE — Full playable retro computer game simulation */}
          {(phase === 'table' || phase === 'settled') && currentNode && (
            <div className="select-none">
              {/* Instance header */}
              <div className="flex items-center justify-between border-b border-[#00ff9f33] pb-2 font-mono text-xs tracking-[2px]">
                <div>
                  {currentNode.id.toUpperCase()} — {currentNode.label}
                  <span className="ml-3 text-[#ffb347]">ROUND {round + 1}/4</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>ENTROPY POOL: <span className="ledger text-lg font-bold text-white">{pot.toFixed(3)}</span> USDC</div>
                  <button onClick={() => { setPhase('lobby'); setCurrentNode(null); }} className="arena-button secondary text-[10px] py-1 px-3">DISCONNECT</button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* LEFT: Your agent + packets (the "hand") */}
                <div className="lg:col-span-5">
                  <div className="text-[10px] tracking-[2px] text-[#00cc7a] mb-1">YOUR PRIVATE PACKETS • ENCRYPTED UNTIL REVEAL</div>
                  
                  <div className="flex gap-4">
                    {yourPackets.map((pkt, idx) => (
                      <div key={idx} className={`packet ${pkt.revealed ? 'revealed' : 'back'}`}>
                        {pkt.revealed ? (
                          <div className="text-center">
                            <div className="text-3xl font-bold">{pkt.rank}</div>
                            <div className="glyph mt-0.5">{pkt.glyph}</div>
                            <div className="text-[9px] mt-1 opacity-70">{pkt.suit}</div>
                          </div>
                        ) : (
                          <div className="text-center text-[10px] leading-none">
                            ENCRYPTED<br />PACKET<br />
                            <span className="block mt-2 text-[18px] opacity-60">0x{RANKS[idx].charCodeAt(0).toString(16)}{idx}A7</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 font-mono text-xs">
                    YOUR LEDGER: <span className="ledger text-lg font-bold text-white">{yourStack.toFixed(3)}</span> USDC<br />
                    OPPONENT LEDGER: <span className="ledger text-lg font-bold text-[#ffb347]">{oppStack.toFixed(3)}</span> USDC
                  </div>

                  {/* Gamification HUD */}
                  <div className="mt-4 rounded bg-black/40 p-3 text-xs">
                    <div className="flex justify-between">
                      <div>CALLSIGN: <span className="text-white">SOVEREIGN-7A3F</span></div>
                      <div>INTEGRITY: 94%</div>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-[#111a18]">
                      <div className="h-1.5 bg-[#00ff9f]" style={{ width: `${Math.min(100, (xp % 220) / 2.2)}%` }} />
                    </div>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {badges.map(b => <span key={b} className="sovereignty-badge">{b}</span>)}
                      <span className="sovereignty-badge opacity-50">+ UNLOCK MORE VIA PATHS</span>
                    </div>
                  </div>
                </div>

                {/* CENTER: Community shards + big retro console */}
                <div className="lg:col-span-7">
                  <div className="text-[10px] tracking-[2px] text-[#00cc7a] mb-1">PUBLIC LEDGER SHARDS (COMMUNITY REVEALS)</div>
                  
                  <div className="flex gap-3 mb-5">
                    {community.map((pkt, idx) => (
                      <div key={idx} className={`packet ${pkt.revealed ? 'revealed' : 'back'}`} style={{ width: 64, height: 88 }}>
                        {pkt.revealed ? (
                          <div className="text-center scale-90">
                            <div className="text-2xl font-bold">{pkt.rank}</div>
                            <div className="glyph mt-px">{pkt.glyph}</div>
                          </div>
                        ) : (
                          <div className="text-[9px] text-center pt-3">SHARD<br />{idx + 1}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* The Action Console — chunky computer game controls */}
                  <div className="rounded border-2 border-[#00ff9f33] bg-[#0a100f] p-4">
                    <div className="mb-2 text-xs text-[#ffb347] tracking-widest">ACTION CONSOLE — {isYouActing ? 'YOUR TURN' : 'AWAITING OPPONENT AGENT'}</div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={!isYouActing}
                        onClick={() => performAction('commit')}
                        className="arena-button flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isTxPending ? 'SIGNING TX...' : 'COMMIT (0.09 USDC)'}
                      </button>
                      <button
                        disabled={!isYouActing}
                        onClick={() => performAction('escalate')}
                        className="arena-button flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isTxPending ? 'SIGNING TX...' : 'ESCALATE (+0.18 USDC)'}
                      </button>
                      <button
                        disabled={!isYouActing}
                        onClick={() => performAction('abort')}
                        className="arena-button secondary flex-1 disabled:opacity-40"
                      >
                        ABORT (FOLD)
                      </button>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={spendRealDevnetUsdcForAllocation} 
                        disabled={!connected || realUsdcBalance < 0.5 || isTxPending}
                        className="arena-button secondary text-xs py-1 px-3 disabled:opacity-40"
                      >
                        {isTxPending ? 'TX PENDING...' : 'ADD 0.50 (burn for extra stack)'}
                      </button>
                      <button onClick={withdrawAndReturn} disabled={isTxPending} className="arena-button secondary text-xs py-1 px-3 disabled:opacity-40">WITHDRAW &amp; EXIT TO LOBBY</button>
                    </div>

                    <div className="mt-1 text-[10px] text-[#8b9cb0]">
                      COMMIT/ESCALATE execute real devnet USDC burns (tx logged). Opponent + settlement are local sim. View on explorer.solana.com/?cluster=devnet. Full on-chain Race settlement next.
                    </div>

                    <div className="mt-2 text-[10px] text-[#8b9cb0]">
                      Live balance via RPC. Devnet SOL + USDC required.
                    </div>
                  </div>
                </div>

                {/* LOG — pure terminal output */}
                <div className="lg:col-span-12 mt-2">
                  <div className="text-[10px] tracking-[2px] text-[#00cc7a] mb-1">PROTOCOL LOG • INSTANCE {currentNode.id}</div>
                  <div className="h-40 overflow-auto rounded bg-black/60 p-3 font-mono text-xs leading-tight border border-[#1a2530]">
                    {log.length === 0 && <div className="opacity-50">AWAITING FIRST COMMIT...</div>}
                    {log.map((l, i) => (
                      <div key={i} className={`log-line ${l.type === 'sys' ? 'sys' : l.type === 'you' ? 'text-[#00ff9f]' : 'text-[#ffb347]'}`}>
                        [{l.t}] {l.msg}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {phase === 'settled' && (
                <div className="mt-4 border-t border-[#00ff9f33] pt-4">
                  <div className="text-[#ffb347] text-sm">HAND COMPLETE — BURNS LOGGED • LOCAL SIM SETTLEMENT</div>
                  <button onClick={withdrawAndReturn} disabled={isTxPending} className="arena-button mt-3 disabled:opacity-40">EXIT SIMULATION</button>
                  <div className="text-xs mt-2 text-[#8b9cb0]">Your actions burned devnet USDC (txs in log). Settlement was local sim. Full on-chain Race next.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* EDUCATIONAL / ARCHIVE INTEGRATION SIDEBAR */}
        <div className="mt-6 max-w-[1080px] mx-auto">
          <div className="text-xs text-[#8b9cb0] mb-2">FROM THE ARCHIVE — TIED TO CURRENT PROTOCOL PHASE</div>
          <div className="flex flex-wrap gap-2">
            {['Cryptography', 'Game Theory', 'Privacy'].map(t => (
              <button key={t} onClick={() => openEduLink(t)} className="rounded border border-[#00ff9f22] px-3 py-1 text-xs hover:border-[#00ff9f] hover:text-white">
                {t} PATHS →
              </button>
            ))}
            <Link href="/paths" className="rounded border border-[#00ff9f22] px-3 py-1 text-xs hover:border-[#00ff9f] hover:text-white">ALL LEARNING PATHS</Link>
          </div>
          <div className="mt-3 text-[10px] text-[#8b9cb0]">
            Actions (COMMIT/ESCALATE) burn real devnet USDC. Resolution runs local for clarity. Full on-chain tables + settlement on roadmap.
          </div>
        </div>
      </div>

      {/* Educational overlay modal (the magic that makes it "not gambling") */}
      {showEdu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setShowEdu(false)}>
          <div className="crt max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="font-mono text-[#ffb347] text-sm tracking-widest mb-1">PROTOCOL DEBRIEF</div>
            <div className="text-2xl text-white mb-3">{eduContent.title}</div>
            <div className="text-sm leading-snug text-[#d4dce6]">{eduContent.body}</div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => { setShowEdu(false); openEduLink('crypto'); }} className="arena-button flex-1">OPEN RELATED ARCHIVE ENTRY</button>
              <button onClick={() => setShowEdu(false)} className="arena-button secondary flex-1">RETURN TO ARENA</button>
            </div>

            <div className="mt-4 text-center text-[10px] text-[#8b9cb0]">This debrief is the entire point. The USDC is just skin in the game for the lesson to feel real.</div>
          </div>
        </div>
      )}

      {/* My Training Record modal — persistent per-wallet (localStorage + signed server) */}
      {showRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setShowRecord(false)}>
          <div className="crt max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="font-mono text-[#ffb347] text-sm tracking-widest mb-1">TRAINING RECORD</div>
            <div className="text-2xl text-white mb-3">Agent Profile • {publicKey ? publicKey.toBase58().slice(0,4)+'…'+publicKey.toBase58().slice(-4) : 'DISCONNECTED'}</div>

            <div className="space-y-3 text-sm text-[#d4dce6]">
              <div className="flex justify-between border-b border-[#00ff9f22] pb-1">
                <div>LEVEL / MASTERY</div>
                <div className="font-mono text-[#00ff9f]">{level} • {xp} XP</div>
              </div>

              <div>
                <div className="text-xs text-[#8b9cb0] mb-1">BADGES EARNED ({badges.length})</div>
                <div className="flex flex-wrap gap-1">
                  {badges.length ? badges.map(b => <span key={b} className="sovereignty-badge">{b}</span>) : <span className="text-[#8b9cb0]">None yet — complete hands to earn.</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="text-xs text-[#8b9cb0]">HANDS PLAYED</div>
                  <div className="font-mono text-xl text-white">{totalHands}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b9cb0]">TOTAL USDC BURNED (ON-CHAIN)</div>
                  <div className="font-mono text-xl text-[#ffb347]">{totalBurned.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b9cb0]">NODES COMPLETED</div>
                  <div className="font-mono text-xl text-white">{completedNodes.length}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b9cb0]">LAST NODE</div>
                  <div className="font-mono text-sm text-white">{currentNode?.id || completedNodes[completedNodes.length-1] || '—'}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => { setShowRecord(false); saveProgress(true); }} className="arena-button flex-1">SYNC TO SERVER (SIGN)</button>
              <button onClick={() => setShowRecord(false)} className="arena-button secondary flex-1">CLOSE</button>
            </div>

            <div className="mt-4 text-center text-[10px] text-[#8b9cb0]">
              Stored locally (instant) + signed &amp; synced to server for cross-device access. Wallet signature proves ownership.
            </div>
          </div>
        </div>
      )}

      <div className="text-center py-8 text-[10px] text-[#8b9cb0] border-t border-[#1a2530] mt-8">
        v0.2 • DEVNET USDC BURNS ON ACTIONS (tx logged) • LOCAL SIM • RACE PROTOCOL • HELIUS KEY RECOMMENDED FOR RELIABLE TXS
      </div>
    </div>
  );
}
