import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Connection } from '@solana/web3.js';
import userRoutes from './routes/user';
import roundRoutes from './routes/round';
import betRoutes from './routes/bet';
import leaderboardRoutes from './routes/leaderboard';
import payoutRoutes from './routes/payout';
import statsRoutes from './routes/stats';
import winnersRoutes from './routes/winners';
import treasuryRouter from './routes/treasury';
import setupWebSocket from './ws'; // Export a function from ws.ts that takes the server

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/winners', winnersRoutes);
app.use('/api/treasury', treasuryRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshdev2909:harsh9560@cluster0.p53fxm9.mongodb.net/';
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://rpc.gorbagana.wtf/';

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: unknown) => console.error('MongoDB connection error:', err));

// Solana connection
export const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', network: 'Gorbagana', solanaRpc: SOLANA_RPC_URL });
});

// --- WebSocket setup ---
const server = http.createServer(app);
setupWebSocket(server);

// --- Start server ---
server.listen(PORT, () => {
  console.log(`Server (API + WS) running on port ${PORT}`);
}); 