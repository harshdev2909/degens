import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://rpc.gorbagana.wtf/';
const TREASURY_WALLET = process.env.TREASURY_WALLET;
const GORB_MINT = process.env.GORB_MINT || 'GORB_MINT_ADDRESS_HERE';

// if (!TREASURY_WALLET) throw new Error('TREASURY_WALLET not set in env');

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

async function checkBalance() {
  const pubkey = new PublicKey('5Lnanojf1q4qPEKMmgv1RCt2GU9ioWAfUGzrcc1E7X7g');
  const solBalance = await connection.getBalance(pubkey);
  console.log('Treasury SOL Balance:', solBalance / LAMPORTS_PER_SOL, 'SOL');

  // Placeholder for GORB SPL token balance
  // To implement: use @solana/spl-token to fetch SPL token balance
  console.log('GOR SPL Token Balance: (fetch with @solana/spl-token)');
}

checkBalance(); 