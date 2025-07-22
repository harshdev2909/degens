import mongoose, { Document, Schema, Types } from 'mongoose';

export type TreasuryDirection = 'in' | 'out';

export interface ITreasuryTransaction extends Document {
  signature: string;
  amount: number;
  direction: TreasuryDirection;
  date: Date;
  userWallet: string;
  user?: Types.ObjectId;
}

const TreasuryTransactionSchema = new Schema<ITreasuryTransaction>({
  signature: { type: String, required: true },
  amount: { type: Number, required: true },
  direction: { type: String, enum: ['in', 'out', 'fee'], required: true },
  date: { type: Date, required: true },
  userWallet: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<ITreasuryTransaction>('TreasuryTransaction', TreasuryTransactionSchema); 