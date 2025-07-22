import express from 'express';
import User from '../models/User';
import Round from '../models/Round';
import Bet from '../models/Bet';
const router = express.Router();
// Global Stats
router.get('/global', async (req, res) => {
  try {
    const totalPlayers = await User.countDocuments();
    const totalRounds = await Round.countDocuments({ status: 'ended' });
    const gorbWagered = await Bet.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const colorWinRates = await Round.aggregate([
      { $match: { status: 'ended', winningBin: { $ne: null } } },
      { $group: { _id: '$winningBin', count: { $sum: 1 } } },
    ]);
    res.json({
      totalPlayers,
      totalRounds,
      gorbWagered: gorbWagered[0]?.total || 0,
      colorWinRates,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});
export default router; 