import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";
import bs58 from "bs58";
import nacl from "tweetnacl";

function decodeSignature(signature: string): Uint8Array | null {
  try {
    const fromBase64 = Buffer.from(signature, "base64");
    if (fromBase64.length === 64) return new Uint8Array(fromBase64);
  } catch {
    // fall through
  }

  try {
    const fromBase58 = bs58.decode(signature);
    if (fromBase58.length === 64) return fromBase58;
  } catch {
    // fall through
  }

  return null;
}

export function verifySolanaSiws(
  input: SolanaSignInInput,
  output: SolanaSignInOutput
): boolean {
  try {
    return verifySignIn(input, {
      ...output,
      account: {
        ...output.account,
        publicKey: new Uint8Array(output.account.publicKey),
      },
      signature: new Uint8Array(output.signature),
      signedMessage: new Uint8Array(output.signedMessage),
    });
  } catch {
    return false;
  }
}

export function verifySolanaLegacySignature(
  address: string,
  signedMessageBase64: string,
  signature: string,
  nonce: string
): boolean {
  try {
    const signedMessage = Buffer.from(signedMessageBase64, "base64");
    const decoded = new TextDecoder().decode(signedMessage);
    if (!decoded.includes(nonce)) return false;

    const publicKey = bs58.decode(address);
    const signatureBytes = decodeSignature(signature);
    if (publicKey.length !== 32 || !signatureBytes) return false;

    return nacl.sign.detached.verify(signedMessage, signatureBytes, publicKey);
  } catch {
    return false;
  }
}