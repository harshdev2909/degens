"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, TrendingUp, ArrowLeft, Users, Zap } from "lucide-react"
import Link from "next/link"

type Color = "red" | "green" | "blue"

interface SpectatorBet {
  prediction: Color
  confidence: number
}

export default function SpectatorPage() {
  const [timeLeft, setTimeLeft] = useState(30)
  const [roundNumber, setRoundNumber] = useState(1)
  const [isRoundActive, setIsRoundActive] = useState(true)
  const [spectatorBet, setSpectatorBet] = useState<SpectatorBet | null>(null)
  const [spectatorPoints, setSpectatorPoints] = useState(100)
  const [isColorSurge, setIsColorSurge] = useState(false)

  // Mock live betting data
  const [liveBets] = useState({
    red: 450,
    green: 320,
    blue: 680,
  })

  const [spectatorCount] = useState(1247)

  useEffect(() => {
    // Check if this is a Color Surge round (every 10th round)
    setIsColorSurge(roundNumber % 10 === 0)
  }, [roundNumber])

  useEffect(() => {
    if (timeLeft > 0 && isRoundActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isRoundActive) {
      endRound()
    }
  }, [timeLeft, isRoundActive])

  const endRound = () => {
    setIsRoundActive(false)

    // Award spectator points if prediction was correct
    if (spectatorBet) {
      const winner = Math.random() > 0.5 ? spectatorBet.prediction : "red"
      if (spectatorBet.prediction === winner) {
        setSpectatorPoints((prev) => prev + spectatorBet.confidence * 2)
      }
    }

    setTimeout(() => {
      setTimeLeft(30)
      setIsRoundActive(true)
      setRoundNumber((prev) => prev + 1)
      setSpectatorBet(null)
    }, 5000)
  }

  const makeSpectatorBet = (color: Color) => {
    if (!isRoundActive || spectatorBet) return

    setSpectatorBet({
      prediction: color,
      confidence: 10,
    })
    setSpectatorPoints((prev) => prev - 10)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        {isColorSurge && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 animate-pulse" />
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
              <Eye className="w-6 h-6 text-blue-400" />
              <div className="text-2xl font-bold text-blue-400">SPECTATOR MODE</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-blue-400">
              <Users className="w-5 h-5" />
              <span>{spectatorCount} watching</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{spectatorPoints} Points</span>
            </div>
            <Link href="/game">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Join Game
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Spectator Area */}
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
                          COLOR SURGE! 🌟
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="outline" className="border-blue-500 text-blue-300">
                      <Eye className="w-4 h-4 mr-1" />
                      SPECTATING
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
                        <div className="text-xl font-bold text-yellow-400">
                          {liveBets.red + liveBets.green + liveBets.blue} GORB
                        </div>
                      </div>
                    </div>
                    <Progress value={((30 - timeLeft) / 30) * 100} className="h-2" />
                    {isColorSurge && (
                      <div className="text-center p-3 bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 rounded-lg border border-yellow-500/30">
                        <div className="text-yellow-400 font-bold">⚡ COLOR SURGE ACTIVE ⚡</div>
                        <div className="text-sm text-gray-300">One random color will get 10x multiplier!</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Live Betting Display */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Live Betting Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {(["red", "green", "blue"] as Color[]).map((color) => (
                      <div
                        key={color}
                        className={`p-6 rounded-lg border-2 text-center ${
                          color === "red"
                            ? "bg-red-500/10 border-red-500"
                            : color === "green"
                              ? "bg-green-500/10 border-green-500"
                              : "bg-blue-500/10 border-blue-500"
                        }`}
                      >
                        <div
                          className={`text-4xl mb-2 ${
                            color === "red" ? "text-red-400" : color === "green" ? "text-green-400" : "text-blue-400"
                          }`}
                        >
                          {color === "red" ? "🔴" : color === "green" ? "🟢" : "🔵"}
                        </div>
                        <div className="text-xl font-bold capitalize">{color}</div>
                        <div className="text-2xl font-bold text-yellow-400 mt-2">
                          {color === "red" ? liveBets.red : color === "green" ? liveBets.green : liveBets.blue} GORB
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {Math.round(
                            ((color === "red" ? liveBets.red : color === "green" ? liveBets.green : liveBets.blue) /
                              (liveBets.red + liveBets.green + liveBets.blue)) *
                              100,
                          )}
                          % of pot
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Spectator Prediction */}
                  <div className="border-t border-gray-600 pt-4">
                    <h3 className="text-lg font-bold mb-3">Make Your Prediction (10 Points)</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(["red", "green", "blue"] as Color[]).map((color) => (
                        <Button
                          key={color}
                          onClick={() => makeSpectatorBet(color)}
                          disabled={!isRoundActive || spectatorBet !== null || spectatorPoints < 10}
                          className={`h-12 ${spectatorBet?.prediction === color ? "ring-2 ring-yellow-400" : ""} ${
                            color === "red"
                              ? "bg-red-500/20 border border-red-500 hover:bg-red-500/30"
                              : color === "green"
                                ? "bg-green-500/20 border border-green-500 hover:bg-green-500/30"
                                : "bg-blue-500/20 border border-blue-500 hover:bg-blue-500/30"
                          }`}
                        >
                          {color === "red" ? "🔴" : color === "green" ? "🟢" : "🔵"} Predict {color}
                        </Button>
                      ))}
                    </div>
                    {spectatorBet && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-blue-400 font-bold">
                          ✅ Prediction: {spectatorBet.prediction.toUpperCase()} will win!
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spectator Sidebar */}
            <div className="space-y-6">
              {/* Spectator Stats */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Correct Predictions</span>
                      <span className="text-green-400 font-bold">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wrong Predictions</span>
                      <span className="text-red-400 font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accuracy</span>
                      <span className="text-blue-400 font-bold">70%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Points Earned</span>
                      <span className="text-yellow-400 font-bold">140</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Chat */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Spectator Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                    <div className="flex gap-2">
                      <span className="text-blue-400">DegenKing420:</span>
                      <span>RED IS DEAD 💀</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-400">GreenGoblin:</span>
                      <span>GREEN MACHINE GO BRRR 🚀</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-400">RedRocket:</span>
                      <span>BLUE WHALE INCOMING 🐋</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-purple-400">SpectatorPro:</span>
                      <span>Color surge next round? 👀</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-400">GorbGod:</span>
                      <span>10x incoming 💎</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type message..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
                    />
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Send
                    </Button>
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
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Join Game
                    </Button>
                  </Link>
                  <Link href="/leaderboard">
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
                    >
                      View Leaderboard
                    </Button>
                  </Link>
                  <Link href="/teams">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                    >
                      Team Stats
                    </Button>
                  </Link>
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
