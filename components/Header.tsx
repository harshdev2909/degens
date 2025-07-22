"use client";
import { useWallet } from "@solana/wallet-adapter-react";

export function Header() {
  const { connected, publicKey, disconnect } = useWallet();
  return (
    <header className="flex justify-end items-center p-4">
      {connected && publicKey && (
        <div className="flex items-center gap-2">
          <span className="text-purple-300 font-mono">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </span>
          <button
            className="border border-purple-500 text-xs px-2 py-1 rounded text-purple-300 hover:bg-purple-800"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
} 