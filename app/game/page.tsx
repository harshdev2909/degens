"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wallet, Clock, TrendingUp, ArrowLeft, Zap, Eye, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { useWalletContext } from "@/components/wallet-provider"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { WinningModal } from "@/components/winning-modal"
import { UsernameModal } from "@/components/username-modal";

type Color = "trashcan" | "trapcan" | "ratdumpster"

interface Bet {
  _id: string
  color: Color
  amount: number
  wallet: string
  roundId: string
  txSignature?: string
  createdAt: string
}

interface Round {
  _id: string
  number: number
  status: "active" | "ended"
  expiresAt: string
  totalPot: number
  winningBin?: Color
  trashcanAmount: number
  trapcanAmount: number
  ratdumpsterAmount: number
  createdAt: string
}

interface RoundResult {
  winner: Color
  totalPot: number
  trashcanAmount: number
  trapcanAmount: number
  ratdumpsterAmount: number
  multiplier: number
}

const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || "DeSFkqJ9i6xqvcF4sELv1UvD1hM929wD7YxspJbLmN2p"
const SOLANA_RPC = "https://rpc.gorbagana.wtf/"

export default function GamePage() {
  const { connected, publicKey, gorBalance, refreshBalance, userProfile, fetchUserProfile } = useWalletContext()
  const { sendTransaction, disconnect } = useWallet()
  const connection = new Connection(SOLANA_RPC)
  const wsRef = useRef<WebSocket | null>(null)
  const { toast } = useToast()

  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [currentBets, setCurrentBets] = useState<Bet[]>([])
  const [round, setRound] = useState<Round | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [lastResult, setLastResult] = useState<RoundResult | null>(null)
  const [lastResultRoundNumber, setLastResultRoundNumber] = useState<number | null>(null)
  const [isRoundActive, setIsRoundActive] = useState(true)
  // Track user bets by roundId
  const [userBetsByRound, setUserBetsByRound] = useState<{ [roundId: string]: Bet }>({})
  // Ref to always have latest userBetsByRound in websocket handler
  const userBetsByRoundRef = useRef(userBetsByRound)
  useEffect(() => { userBetsByRoundRef.current = userBetsByRound }, [userBetsByRound])
  const [isColorSurge, setIsColorSurge] = useState(false)
  const [surgeMultiplier, setSurgeMultiplier] = useState(1)
  const [placingBet, setPlacingBet] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  
  // Winning modal state
  const [showWinningModal, setShowWinningModal] = useState(false)
  const [winningData, setWinningData] = useState<{
    betAmount: number;
    winningAmount: number;
    multiplier: number;
    winningColor: string;
    roundNumber: number;
    didWin: boolean;
  } | null>(null)

  // Username Modal state
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Loader state for websocket/game load
  const [gameLoading, setGameLoading] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)

  // Add a ref to always have the latest publicKey
  const publicKeyRef = useRef(publicKey);
  useEffect(() => { publicKeyRef.current = publicKey }, [publicKey]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4001"
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      console.log("WebSocket connected")
      setWsConnected(true)
    }

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      console.log("WebSocket message:", data)

      if (data.type === "round_start") {
        setRound(data.round)
        setIsRoundActive(true)
        setCurrentBets([]) // Clear bets for new round
        setSelectedColor(null)
        setBetAmount("")
        setError(null)
        setGameLoading(false) // Game is ready after first round_start
      } else if (data.type === "round_end") {
        console.log("=== ROUND END RECEIVED ===");
        console.log("Round data:", data.round);
        console.log("==========================");
        
        setRound(data.round)
        setIsRoundActive(false)
        
        // Calculate result with fixed multipliers
        let multiplier = 1;
        if (data.round.winningBin === "trashcan" || data.round.winningBin === "trapcan") multiplier = 2;
        if (data.round.winningBin === "ratdumpster") multiplier = 10;
        const result: RoundResult = {
          winner: data.round.winningBin,
          totalPot: data.round.totalPot,
          trashcanAmount: data.round.trashcanAmount,
          trapcanAmount: data.round.trapcanAmount,
          ratdumpsterAmount: data.round.ratdumpsterAmount,
          multiplier: multiplier
        }
        setLastResult(result)
        setLastResultRoundNumber(data.round.number)
        
        // Check if current user won
        console.log("=== WIN DETECTION DEBUG ===");
        console.log("publicKey:", publicKeyRef.current ? publicKeyRef.current.toBase58() : 'N/A');
        console.log("userBet:", userBetsByRoundRef.current[data.round._id]);
        console.log("result.winner:", result.winner);
        console.log("userBet?.color:", userBetsByRoundRef.current[data.round._id]?.color);
        console.log("Win condition:", publicKeyRef.current && userBetsByRoundRef.current[data.round._id] && userBetsByRoundRef.current[data.round._id].color === result.winner);
        console.log("==========================");
        
        // Look up user's bet for this round
        console.log('userBetsByRound keys:', Object.keys(userBetsByRoundRef.current));
        console.log('Looking for roundId:', data.round._id.toString());
        const userBetForRound = userBetsByRoundRef.current[data.round._id.toString()];
        const didWin = publicKeyRef.current && userBetForRound && userBetForRound.color === result.winner;
        let winningAmount = 0;
        if (didWin) {
          winningAmount = userBetForRound.amount * result.multiplier;
        }
        // Only show modal if user placed a bet for this round
        if (userBetForRound) {
          setWinningData({
            betAmount: userBetForRound.amount,
            winningAmount: winningAmount,
            multiplier: result.multiplier,
            winningColor: result.winner,
            roundNumber: data.round.number - 1,
            didWin: !!didWin
          });
          setShowWinningModal(true);
          // Remove this bet from the object to prevent duplicate modals
          setUserBetsByRound(prev => {
            const updated = { ...prev };
            delete updated[data.round._id];
            console.log("userBetsByRound after modal:", updated);
            // Also update ref immediately
            userBetsByRoundRef.current = updated;
            return updated;
          });
        } else {
          // Fallback debug: print all state if modal not shown
          console.log("[DEBUG] Modal not shown. State:", {
            userBetsByRound,
            roundId: data.round._id,
            userBetForRound,
            publicKey: publicKeyRef.current?.toBase58(),
            resultWinner: result.winner
          });
        }
        
        // Process payout if win
        if (didWin && userBetForRound) {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
            const payoutRes = await fetch(`${apiUrl}/api/payouts/process`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                wallet: publicKeyRef.current.toBase58(),
                amount: winningAmount,
                roundNumber: data.round.number - 1,
                betAmount: userBetForRound.amount,
                multiplier: result.multiplier
              }),
            });
            
            if (payoutRes.ok) {
              const payoutData = await payoutRes.json();
              console.log("Payout processed:", payoutData);
              refreshBalance();
            } else {
              console.error("Payout failed:", await payoutRes.json());
            }
          } catch (err) {
            console.error("Payout error:", err);
          }
        }
        // Show toast
        toast({
          title: didWin
            ? "🎉 CONGRATULATIONS! 🎉"
            : `Round ${data.round.number - 1} Complete! 🎉`,
          description: didWin
            ? `You won ${winningAmount.toFixed(4)} SOL!`
            : `${result.winner === "trashcan" ? "Trash Can" : result.winner === "trapcan" ? "Trap Can" : "Rat Dumpster"} wins with ${result.multiplier.toFixed(2)}x multiplier!`,
          variant: didWin ? "default" : "default",
        });
      } else if (data.type === "new_bet") {
        console.log("WebSocket received new bet:", data.bet);
        setCurrentBets(prev => {
          // Check if bet already exists to prevent duplicates
          const betExists = prev.some(bet => bet._id === data.bet._id);
          if (betExists) {
            console.log("Bet already exists, skipping duplicate");
            return prev; // Don't add duplicate
          }
          console.log("Adding new bet to currentBets");
          return [...prev, data.bet];
        })
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setError("Connection error. Please refresh the page.")
      setGameLoading(false)
    }

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected")
      setWsConnected(false)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Fetch current round and bets on component mount
  useEffect(() => {
    const fetchCurrentRound = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        const res = await fetch(`${apiUrl}/api/rounds/current`)
        if (res.ok) {
          const roundData = await res.json()
          setRound(roundData)
          setIsRoundActive(roundData.status === "active")
          
          // Fetch bets for current round
          const betsRes = await fetch(`${apiUrl}/api/bets/round/${roundData._id}`)
          if (betsRes.ok) {
            const betsData = await betsRes.json()
            setCurrentBets(betsData)
          }
        }
      } catch (err) {
        console.error("Error fetching current round:", err)
        setError("Failed to load game data")
      } finally {
        setGameLoading(false)
      }
    }

    fetchCurrentRound()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!round || round.status !== "active" || !round.expiresAt) return

    const updateTimer = () => {
      const expiresAt = new Date(round.expiresAt).getTime()
      const now = Date.now()
      const secondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000))
      setTimeLeft(secondsLeft)
    }

    // Update immediately
    updateTimer()

    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [round])

  // Check for Color Surge rounds
  useEffect(() => {
    if (round) {
      setIsColorSurge(round.number % 10 === 0)
      setSurgeMultiplier(round.number % 10 === 0 ? 10 : 1)
    }
  }, [round])

  // Place real SOL bet
  const placeBet = async () => {
    if (!selectedColor || !betAmount || !publicKey || !round || !connected) {
      setError("Please connect wallet and select a color")
      return
    }

    const amount = Number(betAmount)
    if (amount <= 0) {
      setError("Invalid bet amount")
      return
    }

    setPlacingBet(true)
    setError(null)

    // Backup timeout to reset button state
    const timeoutId = setTimeout(() => {
      console.log("Backup timeout: Setting placingBet to false")
      setPlacingBet(false)
    }, 30000) // 30 seconds timeout

    try {
      console.log("=== TRANSACTION DEBUG ===")
      console.log("Bet amount:", amount, "SOL")
      console.log("Displayed balance (gorBalance):", gorBalance, "SOL")
      console.log("Proceeding with SOL transaction...")
      console.log("=====================")

      console.log("Starting SOL transaction...")
      console.log("From:", publicKey.toBase58())
      console.log("To:", TREASURY_WALLET)
      console.log("Amount:", amount, "SOL")

      // 1. Send SOL transaction to treasury
      const treasuryPubkey = new PublicKey(TREASURY_WALLET)
      // Get recent blockhash and lastValidBlockHeight ONCE
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      )
      tx.recentBlockhash = blockhash
      tx.feePayer = publicKey

      console.log("Sending transaction...")
      const signature = await sendTransaction(tx, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed"
      })
      
      console.log("Transaction sent:", signature)
      console.log("Confirming transaction...")
      
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, "confirmed")

      if (confirmation.value.err) {
        throw new Error("Transaction failed: " + confirmation.value.err)
      }

      console.log("Transaction confirmed!")

      // 2. Record bet in database
      console.log("Recording bet in database...")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      const res = await fetch(`${apiUrl}/api/bets/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          roundId: round._id,
          color: selectedColor,
          amount: amount,
          txSignature: signature,
        }),
      })

      console.log("Database response status:", res.status)
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error("Database error:", errorData)
        throw new Error(errorData.error || "Failed to place bet")
      }

      const betData = await res.json()
      console.log("Bet data received:", betData)

      // Store bet by roundId
      setUserBetsByRound(prev => {
        const updated = { ...prev, [round._id.toString()]: betData.bet };
        console.log('userBetsByRound after placing bet:', updated);
        return updated;
      })
      // Don't add to currentBets here - let WebSocket handle it to prevent duplicates
      
      // Refresh balance
      console.log("Refreshing balance...")
      await refreshBalance()
      
      // Clear form
      setSelectedColor(null)
      setBetAmount("")
      
      console.log("Bet placed successfully!")
      setError(null) // Clear any previous errors
      
      // Show success toast
      toast({
        title: "Bet Placed Successfully! 🎉",
        description: `${amount} SOL bet placed on ${selectedColor.toUpperCase()}`,
        variant: "default",
      })
      
    } catch (err: any) {
      console.error("Bet placement error:", err)
      setError(err.message || "Failed to place bet")
      
      // Show error toast
      toast({
        title: "Bet Failed ❌",
        description: err.message || "Failed to place bet",
        variant: "destructive",
      })
    } finally {
      console.log("Setting placingBet to false")
      clearTimeout(timeoutId) // Clear the backup timeout
      setPlacingBet(false)
    }
  }

  const getColorTotals = () => {
    const trashcan = currentBets.filter((b) => b.color === "trashcan").reduce((sum, b) => sum + b.amount, 0)
    const trapcan = currentBets.filter((b) => b.color === "trapcan").reduce((sum, b) => sum + b.amount, 0)
    const ratdumpster = currentBets.filter((b) => b.color === "ratdumpster").reduce((sum, b) => sum + b.amount, 0)
    return { trashcan, trapcan, ratdumpster, total: trashcan + trapcan + ratdumpster }
  }

  const totals = getColorTotals()

  // Helper to get current roundId safely
  const roundId = round?._id;

  // Check for username after wallet connect or profile fetch
  useEffect(() => {
    // Only show if userProfile is null or username is missing/empty/whitespace
    if (
      connected &&
      (!userProfile || !userProfile.username || !userProfile.username.trim())
    ) {
      setShowUsernameModal(true);
    } else {
      setShowUsernameModal(false);
    }
  }, [connected, userProfile]);

  const handleUsernameSubmit = async (username: string) => {
    if (!publicKey) return;
    setUsernameLoading(true);
    await fetch(`${apiUrl}/api/users/set-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: publicKey.toBase58(), username }),
    });
    await fetchUserProfile(); // Refetch profile
    setUsernameLoading(false);
    setShowUsernameModal(false);
  };

  // Loader for websocket connection (bulletproof, with minimum display time)
  const [wsLoaderMinTimePassed, setWsLoaderMinTimePassed] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setWsLoaderMinTimePassed(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Loader for entering mid-round
  const [showRoundTransitionLoader, setShowRoundTransitionLoader] = useState(false)
  // Detect if user enters during an active round
  useEffect(() => {
    if (round && round.status === "active") {
      // Only show if this is the first round loaded (i.e., on entry)
      setShowRoundTransitionLoader(true)
    }
  }, [round])
  // Listen for round_start to hide the loader
  useEffect(() => {
    if (showRoundTransitionLoader && round && round.status === "active" && timeLeft === 30) {
      // Hide loader on new round start (timeLeft resets to 30)
      setShowRoundTransitionLoader(false)
    }
    if (showRoundTransitionLoader && round && round.status === "ended") {
      // Hide loader if round ends before new round starts (edge case)
      setShowRoundTransitionLoader(false)
    }
  }, [round, timeLeft, showRoundTransitionLoader])

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-400">You need to connect your wallet to play</p>
        </div>
      </div>
    )
  }

  // Always show loader until wsConnected is true AND minimum loader time has passed
  if (!wsConnected || !wsLoaderMinTimePassed) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid mb-4" />
          <div className="text-lg font-bold">Connecting to game server...</div>
        </div>
      </div>
    )
  }

  // Loader for entering during an active round
  if (showRoundTransitionLoader) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid mb-4" />
          <div className="text-lg font-bold">Waiting for next round to start...</div>
          <div className="text-sm text-gray-400">You entered during an ongoing round. Please wait for the next round.</div>
        </div>
      </div>
    )
  }

  // Remove wsConnected from the other loader
  if (gameLoading || !round) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid mb-4" />
          <div className="text-lg font-bold">Loading Game...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-purple-500/30">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="text-2xl font-bold bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              TRASH CLASH
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{gorBalance} GOR</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshBalance}
                className="text-xs text-gray-400 hover:text-white"
              >
                🔄
              </Button>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Wallet className="w-5 h-5" />
              <span>{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
              {connected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs ml-2"
                  onClick={disconnect}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Round Info */}
              {round && (
                <Card
                  className={`bg-gray-900/50 ${isColorSurge ? "border-yellow-500/50 shadow-yellow-500/20 shadow-lg" : "border-purple-500/30"}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        Round #{round.number}
                        {isColorSurge && (
                          <Badge className="bg-gradient-to-r from-red-500 to-blue-500 text-white animate-pulse">
                            TRASH SURGE! 🌟
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge variant="outline" className="border-purple-500 text-purple-300">
                        {isRoundActive ? "ACTIVE" : "ENDED"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-xl font-bold">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Total Pot</div>
                          <div className="text-xl font-bold text-yellow-400">{totals.total} GOR</div>
                        </div>
                      </div>
                      <Progress value={((30 - timeLeft) / 30) * 100} className="h-2" />
                      {isColorSurge && (
                        <div className="text-center p-3 bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 rounded-lg border border-yellow-500/30">
                          <div className="text-yellow-400 font-bold">⚡ TRASH SURGE ACTIVE ⚡</div>
                          <div className="text-sm text-gray-300">One random trash will get 10x multiplier!</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Color Selection */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Choose Your Trash</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6 place-items-center">
                    {([
                      { color: "trashcan", label: "Trash Can", icon: "🗑️" },
                      { color: "trapcan", label: "Trap Can", icon: "🪤" },
                      { color: "ratdumpster", label: "Rat Dumpster", icon: "🐀" },
                    ] as const).map(({ color, label, icon }) => (
                      <Button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!isRoundActive || !roundId || userBetsByRound[roundId] !== undefined || placingBet}
                        className={`flex flex-col items-center justify-center h-48 w-full text-3xl font-bold transition-all ${
                          color === "trashcan"
                            ? `bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 ${selectedColor === "trashcan" ? "ring-2 ring-red-400 bg-red-500/40" : ""}`
                            : color === "trapcan"
                              ? `bg-green-500/20 border-2 border-green-500 hover:bg-green-500/30 ${selectedColor === "trapcan" ? "ring-2 ring-green-400 bg-green-500/40" : ""}`
                              : `bg-blue-500/20 border-2 border-blue-500 hover:bg-blue-500/30 ${selectedColor === "ratdumpster" ? "ring-2 ring-blue-400 bg-blue-500/40" : ""}`
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`text-[5rem] mb-2 leading-none ${
                              color === "trashcan" ? "text-red-400" : color === "trapcan" ? "text-green-400" : "text-blue-400"
                            }`}
                          >
                            {icon}
                          </div>
                          <div className="capitalize text-2xl mb-1">{label}</div>
                          <div className="text-base opacity-75 font-mono">
                            {color === "trashcan" ? totals.trashcan : color === "trapcan" ? totals.trapcan : totals.ratdumpster} GOR
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Betting Interface */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        placeholder="Bet amount"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        disabled={!isRoundActive || !roundId || userBetsByRound[roundId] !== undefined || placingBet}
                        className="bg-gray-800 border-gray-600"
                      />
                      <Button
                        onClick={placeBet}
                        disabled={!selectedColor || !betAmount || !isRoundActive || !roundId || userBetsByRound[roundId] !== undefined || placingBet}
                        className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 px-8"
                      >
                        {placingBet ? "Placing Bet..." : "Place Bet"}
                      </Button>
                      <Button
                        onClick={async () => {
                          if (publicKey) {
                            const balance = await connection.getBalance(publicKey) / LAMPORTS_PER_SOL
                            console.log("Direct balance check:", balance, "SOL")
                            alert(`Direct balance: ${balance.toFixed(4)} SOL`)
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Check Balance
                      </Button>
                      <Button
                        onClick={() => {
                          console.log("Manual reset of placingBet state")
                          setPlacingBet(false)
                          setError(null)
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        disabled={!placingBet}
                      >
                        Reset Button
                      </Button>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="text-red-400 font-bold">❌ {error}</div>
                      </div>
                    )}

                    {roundId && userBetsByRound[roundId] && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-green-400 font-bold">
                           ✅ Bet Placed: {userBetsByRound[roundId]?.amount} GOR on {userBetsByRound[roundId]?.color.toUpperCase()}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Last Round Result */}
              {lastResult && (
                <Card className="bg-gray-900/50 border-purple-500/30 animate-in slide-in-from-bottom-2 duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Round #{lastResultRoundNumber ?? 'N/A'} Result</span>
                      {isRoundActive && (
                        <Badge variant="outline" className="border-green-500 text-green-300">
                          New Round Active
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl">
                        {lastResult.winner === "trashcan"
                          ? "🗑️"
                          : lastResult.winner === "trapcan"
                          ? "🪤"
                          : "🐀"}
                      </div>
                      <div className="text-2xl font-bold">
                        <span
                          className={
                            lastResult.winner === "trashcan"
                              ? "text-red-400"
                              : lastResult.winner === "trapcan"
                                ? "text-green-400"
                                : "text-blue-400"
                          }
                        >
                          {lastResult.winner === "trashcan"
                            ? "TRASH CAN WINS!"
                            : lastResult.winner === "trapcan"
                            ? "TRAP CAN WINS!"
                            : "RAT DUMPSTER WINS!"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Total Pot: {lastResult.totalPot} GOR
                        {lastResult.totalPot === 0 && (
                          <span className="ml-2 text-red-400">(No bets placed this round)</span>
                        )}
                      </div>
                      <div className="text-lg">
                        Multiplier:{" "}
                        <span className="text-yellow-400 font-bold">{lastResult.multiplier.toFixed(2)}x</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>Trash Can: {lastResult.trashcanAmount} GOR</div>
                        <div>Trap Can: {lastResult.trapcanAmount} GOR</div>
                        <div>Rat Dumpster: {lastResult.ratdumpsterAmount} GOR</div>
                      </div>
                      
                      <div className="flex justify-center mt-4">
                        <Button
                          onClick={() => {
                            setLastResult(null);
                            setLastResultRoundNumber(null);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Dismiss Result
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Live Bets */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Live Bets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {currentBets.length === 0 ? (
                      <div className="text-center text-gray-400 py-4">No bets yet</div>
                    ) : (
                      currentBets
                        .slice(-10)
                        .reverse()
                        .map((bet, index) => (
                          <div key={bet._id || index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  bet.color === "trashcan"
                                    ? "bg-red-400"
                                    : bet.color === "trapcan"
                                      ? "bg-green-400"
                                      : "bg-blue-400"
                                }`}
                              />
                              <span className="text-sm font-mono">
                                {bet.color === "trashcan"
                                  ? "🗑️ Trash Can"
                                  : bet.color === "trapcan"
                                  ? "🪤 Trap Can"
                                  : "🐀 Rat Dumpster"}
                                {" "}
                                {bet.wallet.slice(0, 4)}...{bet.wallet.slice(-4)}
                              </span>
                            </div>
                            <span className="text-yellow-400 font-bold">{bet.amount}</span>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Color Stats */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Round Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <span>🗑️ Trash Can</span>
                      </span>
                      <span className="text-red-400 font-bold">{totals.trashcan} GOR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span>🪤 Trap Can</span>
                      </span>
                      <span className="text-green-400 font-bold">{totals.trapcan} GOR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                        <span>🐀 Rat Dumpster</span>
                      </span>
                      <span className="text-blue-400 font-bold">{totals.ratdumpster} GOR</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total Pot</span>
                        <span className="text-yellow-400">{totals.total} GOR</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/leaderboard">
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                    >
                      View Leaderboard
                    </Button>
                  </Link>
                  <Link href="/spectator">
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/20 bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Spectator Mode
                    </Button>
                  </Link>
                  <Link href="/flash-flip">
                    <Button
                      variant="outline"
                      className="w-full border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 bg-transparent"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Flash Flip
                    </Button>
                  </Link>
                  <Link href="/nfts">
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      My NFTs
                    </Button>
                  </Link>
                  <Link href="/teams">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Team Stats
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                  >
                    Transaction History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                  >
                    Game Rules
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 p-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Built by <span className="text-purple-400 font-bold">Harsh Sharma</span> with{" "}
            <span className="text-red-500">❤️</span> for degens
          </p>
        </div>
      </footer>
      
      {/* Winning Modal */}
      {showWinningModal && winningData && (
        <WinningModal
          isOpen={showWinningModal}
          onClose={() => setShowWinningModal(false)}
          betAmount={winningData.betAmount}
          winningAmount={winningData.winningAmount}
          multiplier={winningData.multiplier}
          winningColor={winningData.winningColor}
          roundNumber={winningData.roundNumber}
          walletAddress={publicKey?.toBase58() || ""}
          didWin={winningData.didWin}
        />
      )}

      {/* Username Modal for new users */}
      <UsernameModal
        isOpen={showUsernameModal}
        onSubmit={handleUsernameSubmit}
        onClose={() => {}}
        loading={usernameLoading}
        description="Enter a unique username to personalize your profile."
      />
    </div>
  )
}
