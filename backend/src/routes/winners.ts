import express from 'express';
import Bet from '../models/Bet';

const router = express.Router();

// Recent Winners
router.get('/recent', async (req, res) => {
  try {
    const winningBets = await Bet.find({ /* Logic to find winning bets */ })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user');
      
    // Simplified: Find recent bets and assume they are winners for now
    const recentBets = await Bet.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user');

    const winners = recentBets.map(bet => ({
      wallet: (bet.user as any).wallet,
      username: (bet.user as any).username,
      color: bet.bin,
      amount: bet.amount, // This should be the payout amount in a real scenario
      round: bet.round, // You might want to populate round number here
    }));
    
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent winners' });
  }
});

export default router; 