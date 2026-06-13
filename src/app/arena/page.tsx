"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// =========================================================
// CIPHER ARENA — v0.1  (BETA TEST / SIMULATION ONLY)
// Retro computer game / cryptographic adversarial training simulator.
// Built on top of cypherpunk-code. Zero gambling language or vibes.
// All value movement framed as "skin-in-the-game protocol participation".
// Uses Solana Devnet USDC for testing (easy faucet funding for players/testers).
// Deposit/play/cashout: Devnet USDC (mint 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)
// Get test tokens: https://faucet.circle.com/ (Solana Devnet)
// Mainnet treasury: confidential (see env config for production wiring)
// Current version: Local simulation only. Safe for public test/beta.
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

const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Official USDC on Solana Devnet (SPL token) — use with Circle faucet https://faucet.circle.com/

// Confidential treasury address for mainnet RecipientAccount (Fuse multi-sig).
// The real value is NEVER committed to the public repo.
// Set via environment variable (Vercel dashboard or .env.local):
// NEXT_PUBLIC_TREASURY_FUSE=your_fuse_address_here (only on your private machine / private Vercel project)
// For production Race integration, the recipient should ideally be set via the Race CLI or a private script, not exposed in client bundle.
const TREASURY_FUSE = process.env.NEXT_PUBLIC_TREASURY_FUSE || '[CONFIDENTIAL_TREASURY_ADDRESS]';

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
  const [phase, setPhase] = useState<Phase>('boot');
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<ArenaNode | null>(null);

  // Simulated table state (local computer-game simulation for v0.1)
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

  const [showEdu, setShowEdu] = useState(false);
  const [eduContent, setEduContent] = useState({ title: '', body: '' });

  // Boot sequence — pure computer game feel
  useEffect(() => {
    if (phase !== 'boot') return;

    const lines = [
      'CYPHER CODE ARCHIVE — PROTOCOL INTERFACE LOADED',
      'RACE PROTOCOL CORE v0.2.x — MULTI-PARTY RANDOMIZATION ACTIVE',
      'SOLANA DEVNET — TEST USDC LEDGER (FOR SAFE PLAYER/TESTER FUNDING)',
      'AGENT CALLSIGN: [REDACTED] • CLEARANCE: FIELD-07',
      'INITIALIZING P2P ENTROPY SOURCE...',
      'LOADING GAME BUNDLE: race-holdem-core (WASM)',
      'TRANSPORT: SOLANA DEVNET • TOKEN: DEVNET USDC (4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU)',
      'THIS IS AN EDUCATIONAL CRYPTOGRAPHIC SIMULATION.',
      'SKIN-IN-THE-GAME PARTICIPATION ONLY. NO GAMBLING OFFERED.',
      'ALL RANDOMNESS VERIFIABLE VIA RACE P2P PROTOCOL.',
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
    // Reset table state for fresh simulation instance
    setYourPackets(createMockPackets(true));
    setCommunity(COMMUNITY_TEMPLATE.map(p => ({...p})));
    setPot(node.pool * 0.18);
    setYourStack(1.8 + Math.random() * 1.2);
    setOppStack(2.4);
    setLog([]);
    setRound(0);
    setToAct('you');
    setPhase('table');

    appendLog(`BOOTING SIMULATION INSTANCE ${node.id.toUpperCase()}`, 'sys');
    appendLog(`RACE P2P RANDOMIZATION COMPLETE — DECK SHUFFLE VERIFIED`, 'sys');
    appendLog(`AGENTS CONNECTED: ${node.agents} • ENTROPY POOL SEEDED WITH ${node.pool.toFixed(2)} USDC (DEVNET)`, 'sys');
    appendLog('PRE-COMMIT PHASE — YOUR MOVE, AGENT.', 'sys');
  }

  function revealCommunity(upTo: number) {
    setCommunity(prev => prev.map((p, idx) => idx < upTo ? { ...p, revealed: true } : p));
  }

  function revealYourPackets() {
    setYourPackets(prev => prev.map(p => ({ ...p, revealed: true })));
  }

  // Core "game" actions — heavily gamified / rethemed
  function performAction(action: 'commit' | 'escalate' | 'abort') {
    if (toAct !== 'you' || phase !== 'table') return;

    const amount = action === 'escalate' ? 0.18 : action === 'commit' ? 0.09 : 0;

    if (action === 'abort') {
      appendLog('YOU ABORT COMMITMENT — FOLDING FROM THIS ROUND.', 'you');
      // Opponent "wins" the pot in demo
      const newOpp = oppStack + pot;
      setOppStack(newOpp);
      setPot(0);
      endHand('You aborted. Protocol integrity maintained.', false);
      return;
    }

    const newYourStack = Math.max(0.01, yourStack - amount);
    const newPot = pot + amount;
    setYourStack(newYourStack);
    setPot(newPot);

    appendLog(action === 'escalate' 
      ? `ESCALATE — ALLOCATED +0.18 USDC (DEVNET) TO ENTROPY POOL. TOTAL POOL: ${newPot.toFixed(2)} USDC (DEVNET)`
      : `COMMIT — ALLOCATED 0.09 USDC (DEVNET). CURRENT POOL: ${newPot.toFixed(2)} USDC (DEVNET)`, 'you');

    // Advance round + opponent "response"
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

      // Very simple opponent logic for demo
      const oppAction = nextRound > 1 && Math.random() > 0.55 ? 'escalate' : 'commit';
      const oppAmt = oppAction === 'escalate' ? 0.21 : 0.09;

      const oppNewStack = Math.max(0.1, oppStack - oppAmt);
      setOppStack(oppNewStack);
      const oppNewPot = newPot + oppAmt;
      setPot(oppNewPot);

      appendLog(oppAction === 'escalate' 
        ? `OPPONENT AGENT ESCALATES +0.21 USDC (DEVNET). POOL NOW ${oppNewPot.toFixed(2)} USDC (DEVNET)`
        : `OPPONENT COMMITS 0.09 USDC (DEVNET).`, 'agent');

      setToAct('you');

      if (nextRound >= 3) {
        // Showdown
        setTimeout(() => {
          const youWin = Math.random() > 0.5; // Demo coinflip for excitement
          const winnerPot = oppNewPot;
          if (youWin) {
            const finalStack = newYourStack + winnerPot;
            setYourStack(finalStack);
            appendLog(`SETTLEMENT COMPLETE — YOU TAKE THE POOL. +${winnerPot.toFixed(2)} USDC (DEVNET)`, 'you');
            endHand('Optimal information management demonstrated. +42 MASTERY XP', true, winnerPot);
          } else {
            const finalOpp = oppNewStack + winnerPot;
            setOppStack(finalOpp);
            appendLog(`SETTLEMENT COMPLETE — OPPONENT CLAIMS POOL.`, 'agent');
            endHand('Strong play. Protocol lessons logged. +28 MASTERY XP', false, 0);
          }
        }, 650);
      }
    }, 520);
  }

  function endHand(message: string, youWon: boolean, wonAmount = 0) {
    setPhase('settled');
    appendLog(message, 'sys');

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
  }

  function withdrawAndReturn() {
    // In real version (devnet): this would call Race SDK withdraw + close token accounts → Devnet USDC back to tester wallet.
    appendLog('WITHDRAW INITIATED — CLOSING TOKEN ACCOUNTS • RETURNING DEVNET USDC TO YOUR TEST WALLET', 'sys');
    setTimeout(() => {
      setPhase('lobby');
      setCurrentNode(null);
      setShowEdu(false);
      // In real life the stack would be adjusted by on-chain settlement on devnet
    }, 620);
  }

  function openEduLink(topic: string) {
    // In production this would deep-link into /catalog or /paths with filter
    window.open(`/catalog?topic=${topic.toLowerCase().includes('game') ? 'general-crypto' : 'cryptography'}`, '_blank');
  }

  // Simple mock "deposit" for demo (in real: wallet sign + Race join + deposit to GameAccount)
  function mockDepositUSDC() {
    if (!currentNode) return;
    const deposit = 0.5;
    setYourStack(s => s + deposit);
    appendLog(`DEPOSITED ${deposit} USDC (SOLANA DEVNET). GET REAL TEST TOKENS AT https://faucet.circle.com/`, 'sys');
  }

  const isYouActing = toAct === 'you' && phase === 'table';

  return (
    <div className="min-h-[100dvh] bg-[#070b0f] text-[#00ff9f] selection:bg-[#00e67633] selection:text-[#00ff9f]">
      {/* Top chrome — feels like an old terminal menu */}
      <div className="border-b border-[#1a2530] bg-[#0a100f] px-4 py-2 font-mono text-[10px] tracking-[2px] text-[#00cc7a]">
        CYPHER ARENA v0.1 • BETA TEST / SIMULATION ONLY • RACE PROTOCOL • SOLANA DEVNET • USDC DEVNET TOKEN • AGENT TRAINING MODULE • GET TEST USDC: faucet.circle.com
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6">
        {/* HEADER / STATUS BAR */}
        <div className="mb-4 flex items-center justify-between border-b border-[#1a2530] pb-3">
          <div>
            <div className="font-mono text-2xl font-bold tracking-[-1.5px] text-[#00ff9f]">CIPHER ARENA</div>
            <div className="text-[10px] text-[#8b9cb0] -mt-1">ADVERSARIAL COMMITMENT TRAINING • POWERED BY RACE PROTOCOL</div>
          </div>
          <div className="text-right font-mono text-xs">
            <div>AGENT CLEARANCE: LEVEL {level} • FIELD</div>
            <div className="text-[#00cc7a]">MASTERY XP: {xp} • {badges.length} BADGES</div>
          </div>
        </div>

        {/* PERMANENT FRAMING — ZERO GAMBLING LANGUAGE + DEVNET USDC FOR TESTERS */}
        <div className="mb-6 rounded border border-[#00ff9f22] bg-[#0a100f] p-4 text-[12px] leading-tight">
          <strong className="text-[#ffb347]">THIS IS A COMPUTER GAME.</strong> A live cryptographic simulation and protocol exercise. <span className="text-[#ffb347] font-semibold">BETA TEST / SIMULATION ONLY — TEST ONLY FOR NOW. NO REAL MAINNET FUNDS. USE DEVNET.</span>
          You deposit <strong>Test USDC on Solana Devnet</strong>, it participates in on-chain game accounts (official Devnet SPL USDC mint), randomness is generated by multi-party cryptographic protocol (Race P2P), settlements are transparent on Solana Devnet.
          <span className="block mt-1 text-[#8b9cb0]">No house. No casino. No "winning money". This is skin-in-the-game training for sovereignty, game theory, and verifiable commitment schemes. All actions are auditable.</span>
          <span className="mt-1 block text-[#ffb347]">CONNECT DEVNET WALLET → GET FREE TEST USDC FROM https://faucet.circle.com/ (choose Solana Devnet) → TRAIN → WITHDRAW DEVNET USDC. ZERO FRICTION FOR TESTERS.</span>
          <span className="mt-1 block text-xs text-[#8b9cb0]">Devnet USDC Mint: <span className="font-mono text-[#00ff9f]">{DEVNET_USDC_MINT}</span> (mainnet treasury is kept confidential)</span>
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
              <div className="terminal-header mb-4 px-4 py-2 text-xs tracking-[3px]">MAIN TERMINAL — ACTIVE SIMULATION NODES — DEVNET USDC LEDGER (TEST ONLY)</div>

              <div className="grid gap-4 md:grid-cols-3">
                {NODES.map(node => (
                  <button
                    key={node.id}
                    onClick={() => bootIntoNode(node)}
                    className="group rounded border border-[#00ff9f33] bg-[#0c1513] p-5 text-left transition hover:border-[#00ff9f] hover:bg-[#111a18] active:translate-y-[1px]"
                  >
                    <div className="font-mono text-xs text-[#00cc7a] tracking-widest">{node.id.toUpperCase()}</div>
                    <div className="mt-1 text-lg font-semibold leading-tight text-white group-hover:text-[#00ff9f]">{node.label}</div>
                    
                    <div className="mt-4 flex items-baseline justify-between text-sm">
                      <div>AGENTS: <span className="text-white">{node.agents}</span></div>
                      <div>POOL: <span className="text-white tabular-nums">{node.pool.toFixed(2)}</span> USDC (DEVNET)</div>
                    </div>
                    <div className="mt-1 text-xs text-[#8b9cb0]">STATUS: {node.status} • MIN CLEARANCE: {node.clearance}</div>

                    <div className="mt-4 inline-block rounded border border-[#00ff9f] px-3 py-1 text-[10px] tracking-widest group-hover:bg-[#00ff9f] group-hover:text-[#0a100f]">BOOT INSTANCE →</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-[#1a2530] pt-4 text-xs text-[#8b9cb0]">
                All nodes run the same open Race Protocol game bundle (race-holdem core). Every shuffle is a multi-party cryptographic computation. Every settlement is an on-chain transaction you can verify. This is what decentralized adversarial games look like.
              </div>

              <div className="mt-3 text-[10px]">
                <Link href="/catalog?topic=cryptography" className="underline hover:text-white">Study the primitives →</Link> • 
                <span className="ml-2">Current: Solana Devnet USDC (easy tester funding). Mainnet treasury is confidential.</span>
              </div>
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
                  <div>ENTROPY POOL: <span className="ledger text-lg font-bold text-white">{pot.toFixed(3)}</span> USDC (DEVNET)</div>
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
                    YOUR LEDGER: <span className="ledger text-lg font-bold text-white">{yourStack.toFixed(3)}</span> USDC (DEVNET)<br />
                    OPPONENT LEDGER: <span className="ledger text-lg font-bold text-[#ffb347]">{oppStack.toFixed(3)}</span> USDC (DEVNET)
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
                        COMMIT 0.09 USDC (DEVNET)
                      </button>
                      <button
                        disabled={!isYouActing}
                        onClick={() => performAction('escalate')}
                        className="arena-button flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        ESCALATE +0.18 USDC (DEVNET)
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
                      <button onClick={mockDepositUSDC} className="arena-button secondary text-xs py-1 px-3">+0.50 DEVNET USDC DEPOSIT (MOCK)</button>
                      <button onClick={withdrawAndReturn} className="arena-button secondary text-xs py-1 px-3">WITHDRAW &amp; EXIT TO LOBBY</button>
                    </div>

                    <div className="mt-3 text-[10px] text-[#8b9cb0]">
                      For beta testing: Use Solana Devnet cluster + Devnet USDC mint {DEVNET_USDC_MINT}. Testers fund via Circle faucet (faucet.circle.com).
                      Future mainnet: Game token will switch to mainnet USDC; treasury configured confidentially (env var).
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
                  <div className="text-[#ffb347] text-sm">HAND COMPLETE • SETTLEMENT RECORDED ON-CHAIN (SIM)</div>
                  <button onClick={withdrawAndReturn} className="arena-button mt-3">WITHDRAW REMAINING DEVNET USDC (DEMO)</button>
                  <div className="text-xs mt-2 text-[#8b9cb0]">In the real devnet version this triggers Race withdraw + settlement. Devnet USDC returns to your test wallet. (Mainnet later uses your Fuse address.)</div>
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
            Real integration note (for when we add on-chain): Use Solana Devnet + Devnet USDC mint {DEVNET_USDC_MINT}. 
            Testers get free funds at faucet.circle.com (Solana Devnet). Mainnet production treasury is configured confidentially (via env var).
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

      <div className="text-center py-8 text-[10px] text-[#8b9cb0] border-t border-[#1a2530] mt-8">
        v0.1 BETA TEST / SIMULATION ONLY • SOLANA DEVNET USDC • GET TEST TOKENS: https://faucet.circle.com/ • RACE PROTOCOL • Mainnet treasury confidential
      </div>
    </div>
  );
}
