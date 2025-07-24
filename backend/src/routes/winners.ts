import express from 'express';
import Bet from '../models/Bet';
import Round from '../models/Round';

const router = express.Router();

// Recent Winners
router.get('/recent', async (req, res) => {
  try {
    // Find the last 5 ended rounds
    const recentRounds = await Round.find({ status: 'ended', winningBin: { $ne: null } })
      .sort({ endedAt: -1 })
      .limit(5);
    const winners: any[] = [];
    for (const round of recentRounds) {
      // Find all winning bets for this round
      const winningBets = await Bet.find({ round: round._id, bin: round.winningBin })
        .populate('user');
      for (const bet of winningBets) {
        winners.push({
          wallet: (bet.user as any)?.wallet,
          username: (bet.user as any)?.username,
          color: bet.bin,
          amount: bet.amount, // Optionally, you could return payout amount
          round: round.number,
        });
      }
    }
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent winners' });
  }
});

export default router; 