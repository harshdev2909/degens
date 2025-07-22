import mongoose, { Document, Schema, Types } from 'mongoose';

export type Bin = 'trashcan' | 'trapcan' | 'ratdumpster';

export interface IBet extends Document {
  user: Types.ObjectId;
  round: Types.ObjectId;
  bin: Bin;
  amount: number;
  txSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BetSchema = new Schema<IBet>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  round: { type: Schema.Types.ObjectId, ref: 'Round', required: true },
  bin: { type: String, enum: ['trashcan', 'trapcan', 'ratdumpster'], required: true },
  amount: { type: Number, required: true },
  txSignature: { type: String },
}, { timestamps: true });

export default mongoose.model<IBet>('Bet', BetSchema); 