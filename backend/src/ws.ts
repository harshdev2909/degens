import { Server as WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import Round from './models/Round';
import Bet from './models/Bet';
import fetch from 'node-fetch';

const wss = new WebSocketServer({ port: 4001 });
let currentRound: any = null;
let roundNumber = 1;

export function broadcast(data: any) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(msg);
    }
  });
}

async function startNewRound() {
  try {
    // End previous round
    if (currentRound) {
      // Wait a short delay to ensure all bets are saved before ending the round
      await new Promise(resolve => setTimeout(resolve, 200));
      // Fetch all bets for this round directly from the database
      const bets = await Bet.find({ round: currentRound._id });
      // Calculate color totals
      const colorTotals = { trashcan: 0, trapcan: 0, ratdumpster: 0 };
      for (const bet of bets) {
        if (bet.bin in colorTotals) {
          colorTotals[bet.bin] += bet.amount;
        }
      }
      console.log('Round End Debug: bets:', bets);
      console.log('Round End Debug: colorTotals:', colorTotals);
      
      // Determine winner (most bets wins)
      let winningColor: 'trashcan' | 'trapcan' | 'ratdumpster' = 'trashcan';
      for (const color of ['trashcan', 'trapcan', 'ratdumpster'] as const) {
        if (colorTotals[color] > colorTotals[winningColor]) {
          winningColor = color;
        }
      }
      
      currentRound.status = 'ended';
      currentRound.endedAt = new Date();
      currentRound.winningBin = winningColor;
      currentRound.trashcanAmount = colorTotals.trashcan;
      currentRound.trapcanAmount = colorTotals.trapcan;
      currentRound.ratdumpsterAmount = colorTotals.ratdumpster;
      currentRound.totalPot = colorTotals.trashcan + colorTotals.trapcan + colorTotals.ratdumpster;
      
      await currentRound.save();
      // Update leaderboard after round ends
      try {
        await fetch('http://localhost:4000/api/leaderboard/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roundId: currentRound._id.toString() }),
        });
      } catch (err) {
        console.error('Failed to update leaderboard after round:', err);
      }
      
      // Broadcast round end with complete data
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
    
    // Start new round
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

// Function to broadcast new bet
export async function broadcastNewBet(bet: any) {
  broadcast({ type: 'new_bet', bet });
}

wss.on('connection', ws => {
  console.log('New WebSocket connection');
  
  // Send current round on connect
  if (currentRound) {
    ws.send(JSON.stringify({ type: 'round_start', round: currentRound }));
  }
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// Initialize WebSocket server after MongoDB connection
async function initializeWebSocket() {
  try {
    console.log('Initializing WebSocket server...');
    
    // Get the latest round
    currentRound = await Round.findOne().sort({ number: -1 });
    roundNumber = currentRound ? currentRound.number + 1 : 1;
    
    // Start the first round
    await startNewRound();
    
    // Set up the 30-second timer
    setInterval(startNewRound, 30 * 1000);
    
    console.log('WebSocket server running on ws://localhost:4001');
  } catch (err) {
    console.error('WebSocket initialization error:', err);
  }
}

// Wait for MongoDB to be ready
mongoose.connection.once('open', () => {
  initializeWebSocket();
}); 