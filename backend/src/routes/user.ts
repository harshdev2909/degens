import express, { Request, Response } from 'express';
import User from '../models/User';
import { solanaConnection } from '../index';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const router = express.Router();

// Register user (by wallet address)
router.post('/register', async (req: Request, res: Response) => {
  const { wallet, username } = req.body;
  if (!wallet) return res.status(400).json({ error: 'Wallet address required' });
  try {
    let user = await User.findOne({ wallet });
    const solBalance = await solanaConnection.getBalance(new PublicKey(wallet)) / LAMPORTS_PER_SOL;

    if (!user) {
      user = await User.create({ wallet, username, gorbBalance: solBalance });
    } else {
      user.gorbBalance = solBalance;
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err });
  }
});

// Login user (by wallet address)
router.post('/login', async (req: Request, res: Response) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: 'Wallet address required' });
  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update with live balance on login
    user.gorbBalance = await solanaConnection.getBalance(new PublicKey(wallet)) / LAMPORTS_PER_SOL;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
});

// Set or update username for a wallet
router.post('/set-username', async (req, res) => {
  const { wallet, username } = req.body;
  console.log('[set-username] Request body:', req.body);
  if (!wallet || !username) return res.status(400).json({ error: 'Missing wallet or username' });
  try {
    let user = await User.findOne({ wallet });
    const solBalance = await solanaConnection.getBalance(new PublicKey(wallet)) / LAMPORTS_PER_SOL;

    if (!user) {
      user = await User.create({ wallet, username, gorbBalance: solBalance });
      console.log('[set-username] Created new user:', user);
    } else {
      user.username = username;
      user.gorbBalance = solBalance;
      await user.save();
      console.log('[set-username] Updated user:', user);
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('[set-username] Error:', err);
    res.status(500).json({ error: 'Failed to set username', details: err });
  }
});

// Get user by wallet address
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;
  if (!wallet) return res.status(400).json({ error: 'Wallet address required' });
  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update with live balance on fetch
    user.gorbBalance = await solanaConnection.getBalance(new PublicKey(wallet)) / LAMPORTS_PER_SOL;
    await user.save();
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err });
  }
});

export default router; 