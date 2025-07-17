"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, ArrowLeft, Users, Clock, Trophy, Target } from "lucide-react"
import Link from "next/link"

type Color = "red" | "green" | "blue"

interface Challenge {
  id: string
  challenger: string
  opponent: string
  challengerColor: Color
  opponentColor: Color
  amount: number
  status: "pending" | "active" | "completed"
  winner?: string
  timeLeft?: number
}

interface DuelResult {
  winner: string
  loser: string
  winnerColor: Color
  loserColor: Color
  amount: number
}

export default function FlashFlipPage() {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [betAmount, setBetAmount] = useState("")
  const [gorbBalance, setGorbBalance] = useState(1000)
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [lastResult, setLastResult] = useState<DuelResult | null>(null)
  const [challengeWallet, setChallengeWallet] = useState("")

  const mockChallenges: Challenge[] = [
    {
      id: "1",
      challenger: "RedRocket88",
      opponent: "Open Challenge",
      challengerColor: "red",
      opponentColor: "green",
      amount: 100,
      status: "pending",
    },
    {
      id: "2",
      challenger: "BlueWhale777",
      opponent: "Open Challenge",
      challengerColor: "blue",
      opponentColor: "red",
      amount: 250,
      status: "pending",
    },
    {
      id: "3",
      challenger: "GreenGoblin",
      opponent: "Open Challenge",
      challengerColor: "green",
      opponentColor: "blue",
      amount: 75,
      status: "pending",
    },
  ]

  const [availableChallenges, setAvailableChallenges] = useState(mockChallenges)

  useEffect(() => {
    if (activeChallenge && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (activeChallenge && timeLeft === 0) {
      endDuel()
    }
  }, [timeLeft, activeChallenge])

  const createChallenge = () => {
    if (!selectedColor || !betAmount || Number.parseInt(betAmount) <= 0) return

    const amount = Number.parseInt(betAmount)
    if (amount > gorbBalance) return

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      challenger: "7xK9...mN2p",
      opponent: challengeWallet || "Open Challenge",
      challengerColor: selectedColor,
      opponentColor: selectedColor === "red" ? "green" : selectedColor === "green" ? "blue" : "red",
      amount,
      status: "pending",
    }

    setAvailableChallenges((prev) => [...prev, newChallenge])
    setGorbBalance((prev) => prev - amount)
    setSelectedColor(null)
    setBetAmount("")
    setChallengeWallet("")
  }

  const acceptChallenge = (challenge: Challenge) => {
    if (gorbBalance < challenge.amount) return

    setActiveChallenge({
      ...challenge,
      status: "active",
      opponent: "7xK9...mN2p",
    })
    setTimeLeft(10) // 10 second duel
    setGorbBalance((prev) => prev - challenge.amount)
    setAvailableChallenges((prev) => prev.filter((c) => c.id !== challenge.id))
  }

  const endDuel = () => {
    if (!activeChallenge) return

    const winner = Math.random() > 0.5 ? activeChallenge.challenger : activeChallenge.opponent
    const loser = winner === activeChallenge.challenger ? activeChallenge.opponent : activeChallenge.challenger
    const winnerColor =
      winner === activeChallenge.challenger ? activeChallenge.challengerColor : activeChallenge.opponentColor
    const loserColor =
      winner === activeChallenge.challenger ? activeChallenge.opponentColor : activeChallenge.challengerColor

    const result: DuelResult = {
      winner,
      loser,
      winnerColor,
      loserColor,
      amount: activeChallenge.amount * 2,
    }

    setLastResult(result)

    // Update balance if user won
    if (winner === "7xK9...mN2p") {
      setGorbBalance((prev) => prev + activeChallenge.amount * 2)
    }

    setActiveChallenge(null)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        {activeChallenge && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10 animate-pulse" />
        )}
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
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                FLASH FLIP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{gorbBalance} GORB</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Users className="w-5 h-5" />
              <span>7xK9...mN2p</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {activeChallenge ? (
            /* Active Duel */
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gray-900/50 border-yellow-500/50 shadow-yellow-500/20 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl flex items-center justify-center gap-2">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    DUEL IN PROGRESS
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-xl">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="font-bold text-red-400">{timeLeft}s</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Challenger */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {activeChallenge.challengerColor === "red"
                          ? "🔴"
                          : activeChallenge.challengerColor === "green"
                            ? "🟢"
                            : "🔵"}
                      </div>
                      <div className="text-xl font-bold">{activeChallenge.challenger}</div>
                      <Badge
                        className={`mt-2 ${
                          activeChallenge.challengerColor === "red"
                            ? "bg-red-500"
                            : activeChallenge.challengerColor === "green"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        } text-white`}
                      >
                        {activeChallenge.challengerColor.toUpperCase()}
                      </Badge>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-4">VS</div>
                      <div className="text-2xl font-bold text-yellow-400">{activeChallenge.amount * 2} GORB</div>
                      <div className="text-sm text-gray-400">Winner Takes All</div>
                      <Progress value={((10 - timeLeft) / 10) * 100} className="mt-4 h-3" />
                    </div>

                    {/* Opponent */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {activeChallenge.opponentColor === "red"
                          ? "🔴"
                          : activeChallenge.opponentColor === "green"
                            ? "🟢"
                            : "🔵"}
                      </div>
                      <div className="text-xl font-bold">{activeChallenge.opponent}</div>
                      <Badge
                        className={`mt-2 ${
                          activeChallenge.opponentColor === "red"
                            ? "bg-red-500"
                            : activeChallenge.opponentColor === "green"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        } text-white`}
                      >
                        {activeChallenge.opponentColor.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Create Challenge */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Create Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Color Selection */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Choose Your Color</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { color: "red", label: "Trash Can", icon: "🗑️" },
                          { color: "green", label: "Trap Can", icon: "🪤" },
                          { color: "blue", label: "Rat Dumpster", icon: "🐀" },
                        ].map(({ color, label, icon }) => (
                          <Button
                            key={color}
                            onClick={() => setSelectedColor(color as Color)}
                            className={`h-32 flex flex-col items-center justify-center text-xl font-bold transition-all ${
                              color === "red"
                                ? `bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 ${selectedColor === "red" ? "ring-2 ring-red-400 bg-red-500/40" : ""}`
                                : color === "green"
                                  ? `bg-green-500/20 border-2 border-green-500 hover:bg-green-500/30 ${selectedColor === "green" ? "ring-2 ring-green-400 bg-green-500/40" : ""}`
                                  : `bg-blue-500/20 border-2 border-blue-500 hover:bg-blue-500/30 ${selectedColor === "blue" ? "ring-2 ring-blue-400 bg-blue-500/40" : ""}`
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`text-[4rem] mb-2 leading-none ${
                                  color === "red" ? "text-red-400" : color === "green" ? "text-green-400" : "text-blue-400"
                                }`}
                              >
                                {icon}
                              </div>
                              <div className="capitalize text-2xl mb-1">{label}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Bet Amount */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Bet Amount</h3>
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          placeholder="Enter GORB amount"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          className="bg-gray-800 border-gray-600"
                        />
                        <div className="flex gap-2">
                          {[25, 50, 100, 250].map((amount) => (
                            <Button
                              key={amount}
                              onClick={() => setBetAmount(amount.toString())}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-600/20"
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Challenge Specific Player */}
                    <div>
                      <h3 className="text-lg font-bold mb-3">Challenge Player (Optional)</h3>
                      <Input
                        type="text"
                        placeholder="Enter wallet address or leave blank for open challenge"
                        value={challengeWallet}
                        onChange={(e) => setChallengeWallet(e.target.value)}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>

                    <Button
                      onClick={createChallenge}
                      disabled={!selectedColor || !betAmount || Number.parseInt(betAmount) <= 0}
                      className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white py-3 text-lg font-bold"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Create Challenge
                    </Button>
                  </CardContent>
                </Card>

                {/* Available Challenges */}
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Open Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableChallenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-[2.5rem]">
                              {challenge.challengerColor === "red"
                                ? "🗑️"
                                : challenge.challengerColor === "green"
                                  ? "🪤"
                                  : "🐀"}
                            </div>
                            <div>
                              <div className="font-bold">{challenge.challenger}</div>
                              <div className="text-sm text-gray-400">
                                {challenge.challengerColor === "red" ? "Trash Can" : challenge.challengerColor === "green" ? "Trap Can" : "Rat Dumpster"}
                                {" vs "}
                                {challenge.opponentColor === "red" ? "Trash Can" : challenge.opponentColor === "green" ? "Trap Can" : "Rat Dumpster"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-yellow-400 font-bold">{challenge.amount} GORB</div>
                              <div className="text-sm text-gray-400">Winner gets {challenge.amount * 2}</div>
                            </div>
                            <Button
                              onClick={() => acceptChallenge(challenge)}
                              disabled={gorbBalance < challenge.amount || challenge.challenger === "7xK9...mN2p"}
                              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      ))}

                      {availableChallenges.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          No open challenges available. Create one to get started!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Last Result */}
                {lastResult && (
                  <Card className="bg-gray-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle>Last Duel Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="text-5xl">
                          {lastResult.winnerColor === "red"
                            ? "🗑️"
                            : lastResult.winnerColor === "green"
                            ? "🪤"
                            : "🐀"}
                        </div>
                        <div className="text-2xl font-bold">
                          <span
                            className={
                              lastResult.winnerColor === "red"
                                ? "text-red-400"
                                : lastResult.winnerColor === "green"
                                ? "text-green-400"
                                : "text-blue-400"
                            }
                          >
                            {lastResult.winner} WINS!
                          </span>
                        </div>
                        <div className="text-lg">
                          Won: <span className="text-yellow-400 font-bold">{lastResult.amount} GORB</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {lastResult.winnerColor === "red" ? "Trash Can" : lastResult.winnerColor === "green" ? "Trap Can" : "Rat Dumpster"}
                          {" defeated "}
                          {lastResult.loserColor === "red" ? "Trash Can" : lastResult.loserColor === "green" ? "Trap Can" : "Rat Dumpster"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Flash Flip Stats */}
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Your Flash Flip Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duels Won</span>
                      <span className="text-green-400 font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duels Lost</span>
                      <span className="text-red-400 font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-blue-400 font-bold">72.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Earned</span>
                      <span className="text-yellow-400 font-bold">1,240 GORB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Streak</span>
                      <span className="text-green-400 font-bold">+3</span>
                    </div>
                  </CardContent>
                </Card>

                {/* How to Play */}
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>How Flash Flip Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        1
                      </div>
                      <div>Choose your TRASH and bet amount</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        2
                      </div>
                      <div>Create challenge or accept existing one</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        3
                      </div>
                      <div>10-second duel begins automatically</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        4
                      </div>
                      <div>Winner takes all (2x the bet amount)</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/game">
                      <Button
                        variant="outline"
                        className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                      >
                        Regular Game Mode
                      </Button>
                    </Link>
                    <Link href="/leaderboard">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                      >
                        View Leaderboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                    >
                      Duel History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
