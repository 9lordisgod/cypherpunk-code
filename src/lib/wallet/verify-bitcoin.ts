import message from "bitcoinjs-message";

export function verifyBitcoinSignature(
  address: string,
  text: string,
  signature: string
): boolean {
  try {
    return message.verify(address, text, signature, undefined, true);
  } catch {
    return false;
  }
}