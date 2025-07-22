import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://rpc.gorbagana.wtf/';
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

const TREASURY_SECRET_KEY = process.env.TREASURY_SECRET_KEY;
if (!TREASURY_SECRET_KEY) throw new Error('TREASURY_SECRET_KEY not set in env');
const treasuryKeypair = Keypair.fromSecretKey(Buffer.from(TREASURY_SECRET_KEY, 'hex'));

// TODO: Replace with actual GORB SPL token mint address
const GORB_MINT = process.env.GORB_MINT || 'GORB_MINT_ADDRESS_HERE';

// Placeholder: Transfer SOL (for demo, replace with SPL token transfer for GORB)
export async function sendGorbFromUserToTreasury(userKey: string, amount: number): Promise<string> {
  // In production, this would be a signed transaction from the user's wallet (frontend)
  // Here, just a placeholder for backend-initiated transfer
  throw new Error('User-to-treasury GORB transfer must be signed by user in wallet (frontend)');
}

export async function sendGorbFromTreasuryToUser(userWallet: string, amount: number): Promise<string> {
  // Placeholder: send SOL (replace with SPL token transfer for GORB)
  const toPubkey = new PublicKey(userWallet);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: treasuryKeypair.publicKey,
      toPubkey,
      lamports: amount, // For SPL, use token instructions
    })
  );
  const signature = await sendAndConfirmTransaction(connection, tx, [treasuryKeypair]);
  return signature;
} 