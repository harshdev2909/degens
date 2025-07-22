import express, { Request, Response } from 'express';
import LeaderboardEntry from '../models/LeaderboardEntry';
import Bet from '../models/Bet';
import Round from '../models/Round';
import User from '../models/User';

const router = express.Router();

// Get current leaderboard (sorted by totalWon desc)
router.get('/', async (req: Request, res: Response) => {
  try {
    const leaderboard = await LeaderboardEntry.find()
      .populate('user')
      .sort({ totalWon: -1 })
      .limit(100);
    // Map to include username and wallet for each entry
    const result = leaderboard.map(entry => {
      // Type guard: check if user is populated
      let userObj: { wallet: string | null, username: string | null } = { wallet: null, username: null };
      if (entry.user && typeof entry.user === 'object' && 'wallet' in entry.user) {
        userObj.wallet = (entry.user as any).wallet || null;
        userObj.username = (entry.user as any).username || null;
      }
      return {
        ...entry.toObject(),
        user: userObj
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: err });
  }
});

// Update leaderboard after a round ends
router.post('/update', async (req: Request, res: Response) => {
  const { roundId } = req.body;
  if (!roundId) return res.status(400).json({ error: 'Missing roundId' });
  try {
    const round = await Round.findById(roundId);
    if (!round || !round.winningBin) return res.status(404).json({ error: 'Round not found or not ended' });
    const bets = await Bet.find({ round: roundId });
    for (const bet of bets) {
      const user = await User.findById(bet.user);
      if (!user) continue;
      let entry = await LeaderboardEntry.findOne({ user: user._id });
      if (!entry) {
        entry = await LeaderboardEntry.create({
          user: user._id,
          wins: 0,
          losses: 0,
          totalStaked: 0,
          totalWon: 0,
          favoriteBin: bet.bin,
        });
      }
      entry.totalStaked += bet.amount;
      if (bet.bin === round.winningBin) {
        entry.wins += 1;
        entry.totalWon += bet.amount; // Optionally, use payout amount
      } else {
        entry.losses += 1;
      }
      // Update favoriteBin if this bin is now most played
      // (Simple: just set to last bet's bin for now)
      entry.favoriteBin = bet.bin;
      await entry.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leaderboard', details: err });
  }
});

export default router; 