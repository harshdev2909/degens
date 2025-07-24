import { Server as WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import Round from './models/Round';
import Bet from './models/Bet';
import fetch from 'node-fetch';

let wss: WebSocketServer;
let currentRound: any = null;
let roundNumber = 1;

export function broadcast(data: any) {
  const msg = JSON.stringify(data);
  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(msg);
    }
  });
}

async function startNewRound() {
  try {
    if (currentRound) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const bets = await Bet.find({ round: currentRound._id });
      const colorTotals = { trashcan: 0, trapcan: 0, ratdumpster: 0 };
      for (const bet of bets) {
        if (bet.bin in colorTotals) {
          colorTotals[bet.bin] += bet.amount;
        }
      }
      // Determine winner (ratdumpster is rare)
      const rand = Math.random();
      let winningColor: 'trashcan' | 'trapcan' | 'ratdumpster';
      if (rand < 0.10) {
        winningColor = 'ratdumpster'; // 10% chance
      } else if (rand < 0.55) {
        winningColor = 'trashcan'; // 45% chance
      } else {
        winningColor = 'trapcan'; // 45% chance
        }
      currentRound.status = 'ended';
      currentRound.endedAt = new Date();
      currentRound.winningBin = winningColor;
      currentRound.trashcanAmount = colorTotals.trashcan;
      currentRound.trapcanAmount = colorTotals.trapcan;
      currentRound.ratdumpsterAmount = colorTotals.ratdumpster;
      currentRound.totalPot = colorTotals.trashcan + colorTotals.trapcan + colorTotals.ratdumpster;
      await currentRound.save();
      // Use API_BASE_URL env var for cross-service calls (set to your Render URL in production)
      const apiBase = process.env.API_BASE_URL || 'http://localhost:4000';
      try {
        await fetch(`${apiBase}/api/leaderboard/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roundId: currentRound._id.toString() }),
        });
      } catch (err) {
        console.error('Failed to update leaderboard after round:', err);
      }
      broadcast({ 
        type: 'round_end', 
        round: {
          ...currentRound.toObject(),
          winningBin: winningColor,
          trashcanAmount: colorTotals.trashcan,
          trapcanAmount: colorTotals.trapcan,
          ratdumpsterAmount: colorTotals.ratdumpster,
          totalPot: colorTotals.trashcan + colorTotals.trapcan + colorTotals.ratdumpster
        }
      });
    }
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + 30 * 1000);
    currentRound = await Round.create({
      number: roundNumber++,
      status: 'active',
      totalPot: 0,
      trashcanAmount: 0,
      trapcanAmount: 0,
      ratdumpsterAmount: 0,
      startedAt,
      expiresAt,
    });
    broadcast({ type: 'round_start', round: currentRound });
  } catch (err) {
    console.error('Error in startNewRound:', err);
  }
}

export async function broadcastNewBet(bet: any) {
  broadcast({ type: 'new_bet', bet });
}

export default function setupWebSocket(server?: any) {
  if (server) {
    wss = new WebSocketServer({ server });
    console.log('WebSocket server attached to shared HTTP server.');
  } else {
    wss = new WebSocketServer({ port: 4001 });
    console.log('WebSocket server running on ws://localhost:4001');
  }
wss.on('connection', ws => {
  console.log('New WebSocket connection');
  if (currentRound) {
    ws.send(JSON.stringify({ type: 'round_start', round: currentRound }));
  }
});
wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});
  // Wait for MongoDB to be ready
  mongoose.connection.once('open', () => {
    initializeWebSocket();
  });
}

async function initializeWebSocket() {
  try {
    console.log('Initializing WebSocket server...');
    currentRound = await Round.findOne().sort({ number: -1 });
    roundNumber = currentRound ? currentRound.number + 1 : 1;
    await startNewRound();
    setInterval(startNewRound, 30 * 1000);
  } catch (err) {
    console.error('WebSocket initialization error:', err);
  }
}