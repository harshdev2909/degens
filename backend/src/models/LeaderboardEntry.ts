import mongoose, { Document, Schema, Types } from 'mongoose';
import { Bin } from './Bet';

export interface ILeaderboardEntry extends Document {
  user: Types.ObjectId;
  wins: number;
  losses: number;
  totalStaked: number;
  totalWon: number;
  favoriteBin: Bin;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  totalStaked: { type: Number, default: 0 },
  totalWon: { type: Number, default: 0 },
  favoriteBin: { type: String, enum: ['trashcan', 'trapcan', 'ratdumpster'], required: true },
}, { timestamps: true });

export default mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);
