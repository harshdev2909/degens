import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Coins, TrendingUp } from 'lucide-react';

interface WinningModalProps {
  isOpen: boolean;
  onClose: () => void;
  betAmount: number;
  winningAmount: number;
  multiplier: number;
  winningColor: string;
  roundNumber: number;
  walletAddress: string;
  didWin: boolean; // NEW PROP
}

export function WinningModal({
  isOpen,
  onClose,
  betAmount,
  winningAmount,
  multiplier,
  winningColor,
  roundNumber,
  walletAddress,
  didWin // NEW PROP
}: WinningModalProps) {
  const getColorIcon = (color: string) => {
    switch (color) {
      case 'trashcan': return '🗑️';
      case 'trapcan': return '🪤';
      case 'ratdumpster': return '🐀';
      default: return '🎯';
    }
  };

  const getColorName = (color: string) => {
    switch (color) {
      case 'trashcan': return 'Trash Can';
      case 'trapcan': return 'Trap Can';
      case 'ratdumpster': return 'Rat Dumpster';
      default: return color;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'trashcan': return 'text-red-400';
      case 'trapcan': return 'text-green-400';
      case 'ratdumpster': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900/95 border-purple-500/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {didWin ? '🎉 YOU WIN! 🎉' : '😢 YOU LOST'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          {/* Winning Icon */}
          <div className="text-8xl animate-bounce">
            {getColorIcon(winningColor)}
          </div>
          
          {/* Winning Color */}
          <div className={`text-2xl font-bold ${getColorClass(winningColor)}`}>
            {getColorName(winningColor)} WINS!
          </div>
          
          {/* Round Info */}
          <div className="text-sm text-gray-400">
            Round #{roundNumber}
          </div>
          
          {/* Bet Details */}
          <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                Your Bet:
              </span>
              <span className="text-yellow-400 font-bold">{betAmount} SOL</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Multiplier:
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                {multiplier.toFixed(2)}x
              </Badge>
            </div>
            
            {didWin ? (
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-lg font-bold">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    You Won:
                  </span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {winningAmount.toFixed(4)} SOL
                  </span>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-lg font-bold text-red-400">
                    <Zap className="w-5 h-5 text-red-400" />
                    You Lost:
                  </span>
                  <span className="text-2xl font-bold text-red-400">
                    {betAmount.toFixed(4)} SOL
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Wallet Info */}
          <div className="text-xs text-gray-400">
            <div>Wallet: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</div>
            {didWin ? (
              <div>Amount automatically added to your balance!</div>
            ) : (
              <div>Better luck next time!</div>
            )}
          </div>
          
          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800"
          >
            Continue Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 