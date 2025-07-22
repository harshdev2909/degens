import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  wallet: string;
  username?: string;
  gorbBalance: number;
  totalBets: number;
  totalWins: number;
  favoriteBin?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  wallet: { type: String, required: true, unique: true },
  username: { type: String },
  gorbBalance: { type: Number, default: 1000 },
  totalBets: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  favoriteBin: { type: String, enum: ['red', 'green', 'blue'] },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema); 