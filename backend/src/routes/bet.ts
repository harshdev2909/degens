import express, { Request, Response } from 'express';
import Bet, { Bin } from '../models/Bet';
import Round from '../models/Round';
import User from '../models/User';
import TreasuryTransaction from '../models/TreasuryTransaction';
import { solanaConnection } from '../index';
import { broadcastNewBet } from '../ws';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

const TREASURY_WALLET = process.env.TREASURY_WALLET || 'TREASURY_PUBLIC_KEY_HERE';
const FEE_PERCENT = 0.10;
const FEE_WALLET = process.env.FEE_WALLET;


const router = express.Router();

// Place a bet
router.post('/place', async (req: Request, res: Response) => {
  const { wallet, roundId, color, amount, txSignature } = req.body;
  
  if (!wallet || !roundId || !color || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!['trashcan', 'trapcan', 'ratdumpster'].includes(color)) {
    return res.status(400).json({ error: 'Invalid color' });
  }
  
  if (!FEE_WALLET) {
    return res.status(500).json({ error: 'FEE_WALLET not set in environment variables.' });
  }
  try {
    // Find or create user by wallet
    let user = await User.findOne({ wallet });
    if (!user) {
      user = await User.create({
        wallet,
        gorbBalance: 1000, // Default balance
        totalBets: 0,
        totalWins: 0,
        favoriteBin: color
      });
    }
    
    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }
    
    if (round.status !== 'active') {
      return res.status(400).json({ error: 'Round is not active' });
    }
    
    // Since SOL transaction already succeeded, user has enough balance
    // Update user's GORB balance to match their SOL balance (if needed)
    if (user.gorbBalance < amount) {
      // Get real SOL balance and update user's GORB balance
      try {
        const solBalance = await solanaConnection.getBalance(new (await import('@solana/web3.js')).PublicKey(wallet)) / 1e9;
        user.gorbBalance = solBalance;
        await user.save();
        console.log(`Updated user ${wallet} GORB balance to ${solBalance} (from SOL balance)`);
      } catch (err) {
        console.error('Failed to update user balance:', err);
        // Continue anyway since SOL transaction succeeded
      }
    }

    // Remove backend transaction creation/sending. Only verify the txSignature from frontend.
    // Use only one declaration of 'signature' in this scope.
    const signature = txSignature;
    const txInfo = await solanaConnection.getTransaction(signature, { commitment: 'confirmed' });
    if (!txInfo || !txInfo.meta || txInfo.meta.err) {
      return res.status(400).json({ error: 'Transaction not found or not confirmed' });
    }
    // Check for both transfers
    const { SystemProgram } = require('@solana/web3.js');
    const instructions = txInfo.transaction.message.instructions;
    let treasuryFound = false;
    let feeFound = false;
    for (const inst of instructions) {
      const programId = txInfo.transaction.message.accountKeys[inst.programIdIndex].toBase58();
      if (programId === SystemProgram.programId.toBase58()) {
        const keys = inst.accounts.map(idx => txInfo.transaction.message.accountKeys[idx].toBase58());
        if (keys[1] === TREASURY_WALLET) treasuryFound = true;
        if (keys[1] === FEE_WALLET) feeFound = true;
      }
    }
    if (!treasuryFound || !feeFound) {
      return res.status(400).json({ error: `Transaction does not include required transfers: treasuryFound=${treasuryFound}, feeFound=${feeFound}` });
    }

    // Create bet
    const fee = amount * FEE_PERCENT;
    const netAmount = amount - fee;

    // 1. Send netAmount to treasury, 2. Send fee to FEE_WALLET
    const treasuryPubkey = new PublicKey(TREASURY_WALLET);
    const feePubkey = new PublicKey(FEE_WALLET);
    const { blockhash, lastValidBlockHeight } = await solanaConnection.getLatestBlockhash();
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet),
        toPubkey: treasuryPubkey,
        lamports: netAmount * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet),
        toPubkey: feePubkey,
        lamports: fee * LAMPORTS_PER_SOL,
      })
    );
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey(wallet);
    // You must provide the correct signer here. If you do not have the user's private key, you cannot sign on their behalf.
    // For now, use an empty array (no signer) or replace with the correct Keypair if available.
    
    // Create bet
    const bet = await Bet.create({
      user: user._id,
      round: round._id,
      bin: color, // Map color to bin for database
      amount,
      txSignature: signature || 'MOCK_SIGNATURE'
    });
    
    // Update round totals
    round.bets.push(bet._id);
    round.totalPot += amount;
    
    // Update color-specific amounts
    if (color === 'trashcan') {
      round.trashcanAmount = (round.trashcanAmount || 0) + amount;
    } else if (color === 'trapcan') {
      round.trapcanAmount = (round.trapcanAmount || 0) + amount;
    } else if (color === 'ratdumpster') {
      round.ratdumpsterAmount = (round.ratdumpsterAmount || 0) + amount;
    }
    
    await round.save();
    
    // Deduct from user balance
    user.gorbBalance -= amount;
    user.totalBets += 1;
    await user.save();

    // Return bet with populated user info
    const populatedBet = await Bet.findById(bet._id).populate('user');
    
    if (!populatedBet) {
      throw new Error('Failed to create bet');
    }
    
    const betResponse = {
      _id: populatedBet._id,
      color: populatedBet.bin, // Map bin back to color for frontend
      amount: populatedBet.amount,
      wallet: (populatedBet.user as any).wallet,
      roundId: populatedBet.round,
      txSignature: populatedBet.txSignature,
      createdAt: populatedBet.createdAt
    };
    
    // Broadcast new bet to all connected clients
    await broadcastNewBet(betResponse);
    
    // After bet is created and user/round are updated, add:
    await TreasuryTransaction.create({
      signature: signature || 'MOCK_SIGNATURE',
      amount,
      direction: 'in',
      date: new Date(),
      userWallet: wallet,
      user: user._id
    });

    // Optionally, log the fee as a TreasuryTransaction with direction: 'fee' or 'in' and userWallet: FEE_WALLET
    if (FEE_WALLET) {
      await TreasuryTransaction.create({
        signature: signature || 'MOCK_SIGNATURE',
        amount: fee,
        direction: 'fee',
        date: new Date(),
        userWallet: FEE_WALLET,
        user: user._id
      });
    }
    
    res.json({ bet: betResponse });
    
  } catch (err) {
    console.error('Bet placement error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to place bet', details: err });
  }
});

// Get all bets for a round
router.get('/round/:roundId', async (req: Request, res: Response) => {
  const { roundId } = req.params;
  try {
    const bets = await Bet.find({ round: roundId }).populate('user');
    
    // Transform bets to match frontend expectations
    const transformedBets = bets.map(bet => ({
      _id: bet._id,
      color: bet.bin, // Map bin to color
      amount: bet.amount,
      wallet: (bet.user as any).wallet,
      roundId: bet.round,
      txSignature: bet.txSignature,
      createdAt: bet.createdAt
    }));
    
    res.json(transformedBets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get bets', details: err });
  }
});

// Helper: Determine winning color (most bets wins)
export async function determineWinningColor(roundId: string): Promise<string | null> {
  const bets = await Bet.find({ round: roundId });
  const colorTotals: Record<string, number> = { trashcan: 0, trapcan: 0, ratdumpster: 0 };
  
  bets.forEach(bet => {
    colorTotals[bet.bin] += bet.amount;
  });
  
  // Most bets wins
  let winner = 'trashcan';
  for (const color of ['trashcan', 'trapcan', 'ratdumpster']) {
    if (colorTotals[color] > colorTotals[winner]) {
      winner = color;
    }
  }
  
  return winner;
}

// Payout logic (to be called after round ends)
export async function payoutWinners(roundId: string) {
  const round = await Round.findById(roundId);
  if (!round || round.status !== 'ended' || !round.winningBin) return;
  
  const bets = await Bet.find({ round: roundId }).populate('user');
  const winners = bets.filter(bet => bet.bin === round.winningBin);
  
  if (winners.length === 0) return;
  
  const payout = round.totalPot / winners.length;
  
  for (const winnerBet of winners) {
    // Update in-game balance
    const user = await User.findById(winnerBet.user._id);
    if (user) {
      user.gorbBalance += payout;
      user.totalWins += 1;
      await user.save();
    }
  }
}

export default router; 