import { NextRequest, NextResponse } from 'next/server';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

// In-memory store for demo. 
// For production cross-device persistence:
//   npm install @vercel/kv
//   import { kv } from '@vercel/kv';
//   Then: await kv.set(`arena-progress:${publicKey}`, progress);
//   await kv.get(`arena-progress:${publicKey}`);

const progressStore = new Map<string, any>();

function verifySignature(message: string, signature: string, publicKeyStr: string): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const pubKey = new PublicKey(publicKeyStr);
    const pubkeyBytes = pubKey.toBytes();
    return nacl.sign.detached.verify(messageBytes, signatureBytes, pubkeyBytes);
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, message, signature, publicKey, progress } = body || {};

    if (!action || !message || !signature || !publicKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!verifySignature(message, signature, publicKey)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const key = publicKey;

    if (action === 'save') {
      if (!progress) {
        return NextResponse.json({ error: 'Progress data required for save' }, { status: 400 });
      }
      // Optional: could parse message to ensure it matches the provided progress for extra tamper resistance
      const saved = {
        ...progress,
        timestamp: Date.now(),
        publicKey: key,
      };
      progressStore.set(key, saved);
      // Example for real KV:
      // await kv.set(`arena-progress:${key}`, saved);
      return NextResponse.json({ ok: true, saved: true });
    }

    if (action === 'load') {
      const data = progressStore.get(key) || null;
      // const data = await kv.get(`arena-progress:${key}`);
      return NextResponse.json({ progress: data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Arena progress API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
