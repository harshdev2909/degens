import mongoose, { Document, Schema, Types } from 'mongoose';
import { Bin } from './Bet';

export type RoundStatus = 'active' | 'ended';

export interface IRound extends Document {
  number: number;
  status: RoundStatus;
  bets: Types.ObjectId[];
  winningBin?: Bin;
  totalPot: number;
  trashcanAmount: number;
  trapcanAmount: number;
  ratdumpsterAmount: number;
  startedAt: Date;
  endedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoundSchema = new Schema<IRound>({
  number: { type: Number, required: true },
  status: { type: String, enum: ['active', 'ended'], required: true },
  bets: [{ type: Schema.Types.ObjectId, ref: 'Bet' }],
  winningBin: { type: String, enum: ['trashcan', 'trapcan', 'ratdumpster'] },
  totalPot: { type: Number, default: 0 },
  trashcanAmount: { type: Number, default: 0 },
  trapcanAmount: { type: Number, default: 0 },
  ratdumpsterAmount: { type: Number, default: 0 },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date },
  expiresAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<IRound>('Round', RoundSchema); 