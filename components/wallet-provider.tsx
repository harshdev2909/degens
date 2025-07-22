"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// Gorbagana testnet configuration
const GORBAGANA_RPC = 'https://rpc.gorbagana.wtf/'
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface UserProfile {
  username: string | null;
  wallet: string;
}

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  gorBalance: number
  solBalance: number
  userProfile: UserProfile | null
  isLoading: boolean
  error: string | null
  refreshBalance: () => Promise<void>
  fetchUserProfile: () => Promise<void>
  sendTransaction: (to: PublicKey, amount: number) => Promise<string>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}

function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, sendTransaction: walletSendTransaction, signTransaction, disconnect } = useWallet()
  const [gorBalance, setGorBalance] = useState(0)
  const [solBalance, setSolBalance] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connection = useMemo(() => new Connection(GORBAGANA_RPC, 'confirmed'), [])

  const CONFIRM_TIMEOUT_MS = 60000; // 60 seconds

  const fetchUserProfile = async () => {
    if (!publicKey) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${publicKey.toBase58()}`);
      if (res.ok) {
        const data = await res.json();
        setUserProfile({ username: data.username, wallet: data.wallet });
      } else {
        setUserProfile(null); // No profile found, user is new
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setUserProfile(null);
    }
  };

  // Use SOL as GOR for now
  const refreshBalance = async () => {
    if (!publicKey) return
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch SOL balance and use it as GOR
      const solBalanceRaw = await connection.getBalance(publicKey)
      const solBalance = solBalanceRaw / LAMPORTS_PER_SOL
      setSolBalance(solBalance)
      setGorBalance(solBalance) // Use SOL as GOR
      
      console.log('Fetched SOL balance:', solBalance, 'SOL (used as GOR)')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
      console.error('Error fetching balance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTransaction = async (to: PublicKey, amount: number): Promise<string> => {
    if (!publicKey || !connected || !signTransaction || !walletSendTransaction) {
      throw new Error('Wallet not connected')
    }
    try {
      setIsLoading(true)
      setError(null)
      // Create a SOL transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: to,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      )
      // Send transaction using wallet adapter
      const signature = await walletSendTransaction(transaction, connection)
      // Wait for confirmation with longer timeout
      let confirmed = false;
      try {
        await Promise.race([
          connection.confirmTransaction(signature, 'confirmed').then(() => { confirmed = true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Transaction confirmation timed out.')), CONFIRM_TIMEOUT_MS))
        ])
      } catch (timeoutErr) {
        if (!confirmed) {
          setError('Transaction not confirmed in 60 seconds. Check status on the explorer.')
        }
      }
      await refreshBalance()
      return signature
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance();
      fetchUserProfile();
    } else {
      setGorBalance(0)
      setSolBalance(0)
      setUserProfile(null)
    }
  }, [connected, publicKey])

  const value = {
    connected,
    publicKey,
    gorBalance,
    solBalance,
    userProfile,
    isLoading,
    error,
    refreshBalance,
    fetchUserProfile,
    sendTransaction,
    disconnect
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function TrashRoyaleWalletProvider({ children }: { children: React.ReactNode }) {
  // Use the custom endpoint for both wallet adapter and connection
  const endpoint = GORBAGANA_RPC;
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add BackpackWalletAdapter here if available
    ],
    []
  );
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export { TrashRoyaleWalletProvider as WalletProvider, WalletMultiButton } 