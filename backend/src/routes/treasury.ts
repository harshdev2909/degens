import express from 'express';
import TreasuryTransaction from '../models/TreasuryTransaction';
import User from '../models/User';

const router = express.Router();

// Get all treasury transactions
router.get('/transactions', async (req, res) => {
  try {
    const txns = await TreasuryTransaction.find().sort({ date: -1 }).lean();
    // Populate user info
    const users = await User.find().lean();
    const userMap = Object.fromEntries(users.map(u => [u.wallet, u]));
    const txnsWithUser = txns.map(txn => ({
      ...txn,
      user: userMap[txn.userWallet] ? { wallet: userMap[txn.userWallet].wallet, username: userMap[txn.userWallet].username } : { wallet: txn.userWallet }
    }));
    res.json(txnsWithUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch treasury transactions', details: err });
  }
});

// Get user monitoring stats
router.get('/users', async (req, res) => {
  try {
    const txns = await TreasuryTransaction.find().lean();
    const userStats: Record<string, { wallet: string; totalIn: number; totalOut: number; username?: string }> = {};
    txns.forEach(txn => {
      if (!userStats[txn.userWallet]) userStats[txn.userWallet] = { wallet: txn.userWallet, totalIn: 0, totalOut: 0 };
      if (txn.direction === 'in') userStats[txn.userWallet].totalIn += txn.amount;
      else userStats[txn.userWallet].totalOut += txn.amount;
    });
    // Attach usernames
    const users = await User.find().lean();
    users.forEach(u => {
      if (userStats[u.wallet]) userStats[u.wallet].username = u.username;
    });
    res.json(Object.values(userStats));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats', details: err });
  }
});

export default router; 