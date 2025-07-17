"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wallet, Clock, TrendingUp, ArrowLeft, Zap, Eye, Sparkles, Users } from "lucide-react"
import Link from "next/link"

type Color = "red" | "green" | "blue"

interface Bet {
  color: Color
  amount: number
  wallet: string
}

interface RoundResult {
  winner: Color
  totalPot: number
  redAmount: number
  greenAmount: number
  blueAmount: number
  multiplier: number
}

export default function GamePage() {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentBets, setCurrentBets] = useState<Bet[]>([])
  const [gorbBalance, setGorbBalance] = useState(1000)
  const [roundNumber, setRoundNumber] = useState(1)
  const [lastResult, setLastResult] = useState<RoundResult | null>(null)
  const [isRoundActive, setIsRoundActive] = useState(true)
  const [userBet, setUserBet] = useState<Bet | null>(null)
  const [isColorSurge, setIsColorSurge] = useState(false)
  const [surgeMultiplier, setSurgeMultiplier] = useState(1)

  // Mock data for current bets
  const mockBets: Bet[] = [
    { color: "red", amount: 50, wallet: "7xK9...mN2p" },
    { color: "green", amount: 75, wallet: "Bx4L...kR8s" },
    { color: "blue", amount: 100, wallet: "Qm3N...vT9w" },
    { color: "red", amount: 25, wallet: "Zp8F...hY6u" },
    { color: "green", amount: 150, wallet: "Lk2M...dE4r" },
  ]

  useEffect(() => {
    setCurrentBets(mockBets)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isRoundActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isRoundActive) {
      endRound()
    }
  }, [timeLeft, isRoundActive])

  useEffect(() => {
    // Check if this is a Color Surge round (every 10th round)
    setIsColorSurge(roundNumber % 10 === 0)
    if (roundNumber % 10 === 0) {
      setSurgeMultiplier(10)
    } else {
      setSurgeMultiplier(1)
    }
  }, [roundNumber])

  const endRound = () => {
    setIsRoundActive(false)

    // Calculate totals
    const redTotal = currentBets.filter((b) => b.color === "red").reduce((sum, b) => sum + b.amount, 0)
    const greenTotal = currentBets.filter((b) => b.color === "green").reduce((sum, b) => sum + b.amount, 0)
    const blueTotal = currentBets.filter((b) => b.color === "blue").reduce((sum, b) => sum + b.amount, 0)
    const totalPot = redTotal + greenTotal + blueTotal

    // Determine winner (lowest staked color wins)
    const totals = { red: redTotal, green: greenTotal, blue: blueTotal }
    const winner = Object.entries(totals).reduce(
      (min, [color, amount]) => (amount < totals[min] ? (color as Color) : min),
      "red" as Color,
    )

    const winnerAmount = totals[winner]
    const multiplier = winnerAmount > 0 ? totalPot / winnerAmount : 0

    const result: RoundResult = {
      winner,
      totalPot,
      redAmount: redTotal,
      greenAmount: greenTotal,
      blueAmount: blueTotal,
      multiplier,
    }

    setLastResult(result)

    // Update user balance if they won
    if (userBet && userBet.color === winner) {
      setGorbBalance((prev) => prev + userBet.amount * multiplier)
    }

    // Start new round after 5 seconds
    setTimeout(() => {
      setTimeLeft(30)
      setIsRoundActive(true)
      setRoundNumber((prev) => prev + 1)
      setUserBet(null)
      setSelectedColor(null)
      setBetAmount("")
    }, 5000)
  }

  const placeBet = () => {
    if (!selectedColor || !betAmount || Number.parseInt(betAmount) <= 0) return

    const amount = Number.parseInt(betAmount)
    if (amount > gorbBalance) return

    const bet: Bet = {
      color: selectedColor,
      amount,
      wallet: "7xK9...mN2p",
    }

    setUserBet(bet)
    setCurrentBets((prev) => [...prev, bet])
    setGorbBalance((prev) => prev - amount)
  }

  const getColorTotals = () => {
    const red = currentBets.filter((b) => b.color === "red").reduce((sum, b) => sum + b.amount, 0)
    const green = currentBets.filter((b) => b.color === "green").reduce((sum, b) => sum + b.amount, 0)
    const blue = currentBets.filter((b) => b.color === "blue").reduce((sum, b) => sum + b.amount, 0)
    return { red, green, blue, total: red + green + blue }
  }

  const totals = getColorTotals()

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
              COLOR CLASH
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{gorbBalance} GORB</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Wallet className="w-5 h-5" />
              <span>7xK9...mN2p</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Round Info */}
              <Card
                className={`bg-gray-900/50 ${isColorSurge ? "border-yellow-500/50 shadow-yellow-500/20 shadow-lg" : "border-purple-500/30"}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      Round #{roundNumber}
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
                        <div className="text-xl font-bold text-yellow-400">{totals.total} GORB</div>
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

              {/* Color Selection */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Choose Your Trash</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6 place-items-center">
                    {([
                      { color: "red", label: "Trash Can", icon: "🗑️" },
                      { color: "green", label: "Trap Can", icon: "🪤" },
                      { color: "blue", label: "Rat Dumpster", icon: "🐀" },
                    ] as const).map(({ color, label, icon }) => (
                      <Button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        disabled={!isRoundActive || userBet !== null}
                        className={`flex flex-col items-center justify-center h-48 w-full text-3xl font-bold transition-all ${
                          color === "red"
                            ? `bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 ${selectedColor === "red" ? "ring-2 ring-red-400 bg-red-500/40" : ""}`
                            : color === "green"
                              ? `bg-green-500/20 border-2 border-green-500 hover:bg-green-500/30 ${selectedColor === "green" ? "ring-2 ring-green-400 bg-green-500/40" : ""}`
                              : `bg-blue-500/20 border-2 border-blue-500 hover:bg-blue-500/30 ${selectedColor === "blue" ? "ring-2 ring-blue-400 bg-blue-500/40" : ""}`
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`text-[5rem] mb-2 leading-none ${
                              color === "red" ? "text-red-400" : color === "green" ? "text-green-400" : "text-blue-400"
                            }`}
                          >
                            {icon}
                          </div>
                          <div className="capitalize text-2xl mb-1">{label}</div>
                          <div className="text-base opacity-75 font-mono">
                            {color === "red" ? totals.red : color === "green" ? totals.green : totals.blue} GORB
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
                        disabled={!isRoundActive || userBet !== null}
                        className="bg-gray-800 border-gray-600"
                      />
                      <Button
                        onClick={placeBet}
                        disabled={!selectedColor || !betAmount || !isRoundActive || userBet !== null}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                      >
                        Place Bet
                      </Button>
                    </div>

                    {userBet && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="text-green-400 font-bold">
                          ✅ Bet Placed: {userBet.amount} GORB on {userBet.color.toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Last Round Result */}
              {lastResult && (
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Last Round Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl">
                        {lastResult.winner === "red"
                          ? "🗑️"
                          : lastResult.winner === "green"
                          ? "🪤"
                          : "🐀"}
                      </div>
                      <div className="text-2xl font-bold">
                        <span
                          className={
                            lastResult.winner === "red"
                              ? "text-red-400"
                              : lastResult.winner === "green"
                                ? "text-green-400"
                                : "text-blue-400"
                          }
                        >
                          {lastResult.winner === "red"
                            ? "TRASH CAN WINS!"
                            : lastResult.winner === "green"
                            ? "TRAP CAN WINS!"
                            : "RAT DUMPSTER WINS!"}
                        </span>
                      </div>
                      <div className="text-lg">
                        Multiplier:{" "}
                        <span className="text-yellow-400 font-bold">{lastResult.multiplier.toFixed(2)}x</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>Trash Can: {lastResult.redAmount} GORB</div>
                        <div>Trap Can: {lastResult.greenAmount} GORB</div>
                        <div>Rat Dumpster: {lastResult.blueAmount} GORB</div>
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
                    {currentBets
                      .slice(-10)
                      .reverse()
                      .map((bet, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                bet.color === "red"
                                  ? "bg-red-400"
                                  : bet.color === "green"
                                    ? "bg-green-400"
                                    : "bg-blue-400"
                              }`}
                            />
                            <span className="text-sm font-mono">
                              {bet.color === "red"
                                ? "🗑️ Trash Can"
                                : bet.color === "green"
                                ? "🪤 Trap Can"
                                : "🐀 Rat Dumpster"}
                              {" "}
                              {bet.wallet}
                            </span>
                          </div>
                          <span className="text-yellow-400 font-bold">{bet.amount}</span>
                        </div>
                      ))}
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
                      <span className="text-red-400 font-bold">{totals.red} GORB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span>🪤 Trap Can</span>
                      </span>
                      <span className="text-green-400 font-bold">{totals.green} GORB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                        <span>🐀 Rat Dumpster</span>
                      </span>
                      <span className="text-blue-400 font-bold">{totals.blue} GORB</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total Pot</span>
                        <span className="text-yellow-400">{totals.total} GORB</span>
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
    </div>
  )
}
