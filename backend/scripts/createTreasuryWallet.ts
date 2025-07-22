import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://rpc.gorbagana.wtf/';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

async function createTreasuryWallet() {
  const keypair = Keypair.generate();
  console.log('Treasury Wallet Public Key:', keypair.publicKey.toBase58());
  console.log('Treasury Wallet Secret Key (save this securely!):', Buffer.from(keypair.secretKey).toString('hex'));

  // Optionally, airdrop some SOL for fees (testnet/devnet only)
  try {
    const airdropSignature = await connection.requestAirdrop(keypair.publicKey, 1 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature, 'confirmed');
    console.log('Airdropped 1 SOL to treasury wallet for transaction fees.');
  } catch (err) {
    console.log('Airdrop failed (likely not supported on mainnet):', err);
  }
}

createTreasuryWallet(); 