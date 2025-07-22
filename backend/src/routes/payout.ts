import express, { Request, Response } from 'express';
import User from '../models/User';
import { solanaConnection } from '../index';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import TreasuryTransaction from '../models/TreasuryTransaction';
// import dotenv from 'dotenv'

const TREASURY_WALLET = process.env.TREASURY_WALLET || 'TREASURY_PUBLIC_KEY_HERE';
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY || 'LKyhd2NquP6AoE1tvV7mz9CVG4qKrW163mNiY5tJtUeSrfsytEVC3pcPPZb7VNF8dRzVHe4fHDARjpmsiKDbADp';
if (!TREASURY_PRIVATE_KEY) throw new Error('Missing TREASURY_PRIVATE_KEY in env');
let treasuryKeypair: Keypair;
try {
  treasuryKeypair = Keypair.fromSecretKey(bs58.decode(TREASURY_PRIVATE_KEY));
} catch (e) {
  throw new Error('Invalid base58 private key in TREASURY_PRIVATE_KEY. Please check your .env file.');
}

const router = express.Router();

// Process payout to winner
router.post('/process', async (req: Request, res: Response) => {
  const { wallet, amount, roundNumber, betAmount, multiplier } = req.body;
  
  if (!wallet || !amount || !roundNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    console.log(`Processing payout: ${amount} SOL to ${wallet} for round ${roundNumber}`);
    
    // Find user
    const user = await User.findOne({ wallet });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // 1. Send SOL from treasury to winner's wallet (on-chain)
    const winnerPubkey = new PublicKey(wallet);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasuryKeypair.publicKey,
        toPubkey: winnerPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    const signature = await solanaConnection.sendTransaction(tx, [treasuryKeypair]);
    let confirmed = false;
    let attempts = 0;
    let confirmation;
    while (!confirmed && attempts < 5) {
      confirmation = await solanaConnection.confirmTransaction(signature, 'confirmed');
      if (confirmation.value && !confirmation.value.err) confirmed = true;
      else await new Promise(res => setTimeout(res, 2000));
      attempts++;
    }
    if (!confirmed) {
      console.error('Transaction confirmation failed after retries:', confirmation?.value);
      return res.status(500).json({ error: 'Transaction not confirmed', details: confirmation?.value });
    }

    // 2. Update user's in-game balance (for stats/leaderboard)
    user.gorbBalance += amount;
    user.totalWins += 1;
    await user.save();

    console.log(`Updated user ${wallet} balance: +${amount} SOL (GORB balance: ${user.gorbBalance})`);
    console.log(`On-chain payout sent. Tx signature: ${signature}`);

    // After payout is sent and user is updated, and after confirmation check:
    try {
      await TreasuryTransaction.create({
        signature,
        amount,
        direction: 'out',
        date: new Date(),
        userWallet: wallet,
        user: user._id
      });
      console.log('Treasury OUT transaction recorded:', signature);
    } catch (err) {
      console.error('Failed to record OUT transaction:', err);
    }

    res.json({ 
      success: true, 
      message: `Payout of ${amount} SOL sent on-chain!`,
      newBalance: user.gorbBalance,
      transactionId: signature
    });
    
  } catch (err) {
    console.error('Payout error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to process payout', details: err });
  }
});

// Get user's payout history
router.get('/history/:wallet', async (req: Request, res: Response) => {
  const { wallet } = req.params;
  
  try {
    const user = await User.findOne({ wallet });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, you would fetch from a payout history table
    res.json({
      totalWins: user.totalWins,
      totalBets: user.totalBets,
      currentBalance: user.gorbBalance,
      // payoutHistory: [] // Would contain actual payout records
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to get payout history', details: err });
  }
});

export default router; 