import express, { Request, Response } from 'express';
import Round, { IRound } from '../models/Round';
import Bet from '../models/Bet';

const router = express.Router();

// Get the current active round
router.get('/current', async (req: Request, res: Response) => {
  try {
    const round = await Round.findOne({ status: 'active' }).populate('bets');
    if (!round) {
      // Create a new round if none exists
      const lastRound = await Round.findOne().sort({ number: -1 });
      const nextNumber = lastRound ? lastRound.number + 1 : 1;
      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + 30 * 1000); // 30 seconds
      
      const newRound = await Round.create({
        number: nextNumber,
        status: 'active',
        totalPot: 0,
        redAmount: 0,
        greenAmount: 0,
        blueAmount: 0,
        startedAt,
        expiresAt,
      });
      
      res.json(newRound);
    } else {
      res.json(round);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to get current round', details: err });
  }
});

// Get round status
router.get('/:id/status', async (req: Request, res: Response) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) return res.status(404).json({ error: 'Round not found' });
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get round status', details: err });
  }
});

// Create a new round
router.post('/create', async (req: Request, res: Response) => {
  try {
    // End any currently active round
    await Round.updateMany({ status: 'active' }, { status: 'ended', endedAt: new Date() });
    
    // Get next round number
    const lastRound = await Round.findOne().sort({ number: -1 });
    const nextNumber = lastRound ? lastRound.number + 1 : 1;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + 30 * 1000); // 30 seconds
    
    const round = await Round.create({
      number: nextNumber,
      status: 'active',
      totalPot: 0,
      startedAt,
      expiresAt,
    });
    
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create round', details: err });
  }
});

// Update round (for adding expiresAt to existing rounds)
router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { expiresAt, winningColor } = req.body;
  
  try {
    const round = await Round.findById(id);
    if (!round) return res.status(404).json({ error: 'Round not found' });
    
    if (expiresAt) {
      round.expiresAt = new Date(expiresAt);
    }
    
    if (winningColor && ['red', 'green', 'blue'].includes(winningColor)) {
      round.status = 'ended';
      round.winningBin = winningColor;
      round.endedAt = new Date();
    }
    
    await round.save();
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update round', details: err });
  }
});

// End a round and set the winning color
router.patch('/:id/end', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { winningColor } = req.body;
  
  if (!['red', 'green', 'blue'].includes(winningColor)) {
    return res.status(400).json({ error: 'Invalid winning color' });
  }
  
  try {
    const round = await Round.findById(id);
    if (!round) return res.status(404).json({ error: 'Round not found' });
    
    round.status = 'ended';
    round.winningBin = winningColor;
    round.endedAt = new Date();
    await round.save();
    
    res.json(round);
  } catch (err) {
    res.status(500).json({ error: 'Failed to end round', details: err });
  }
});

export default router; 