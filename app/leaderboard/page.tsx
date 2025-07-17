"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, ArrowLeft, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

interface Player {
  rank: number
  wallet: string
  wins: number
  losses: number
  totalStaked: number
  totalWon: number
  winRate: number
  streak: number
  favoriteColor: "red" | "green" | "blue"
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "all">("all")

  const mockPlayers: Player[] = [
    {
      rank: 1,
      wallet: "DegenKing420",
      wins: 47,
      losses: 23,
      totalStaked: 15420,
      totalWon: 28350,
      winRate: 67.1,
      streak: 8,
      favoriteColor: "red",
    },
    {
      rank: 2,
      wallet: "ColorMaster88",
      wins: 42,
      losses: 28,
      totalStaked: 12800,
      totalWon: 19200,
      winRate: 60.0,
      streak: 3,
      favoriteColor: "green",
    },
    {
      rank: 3,
      wallet: "BlueWhale777",
      wins: 38,
      losses: 32,
      totalStaked: 22100,
      totalWon: 25400,
      winRate: 54.3,
      streak: -2,
      favoriteColor: "blue",
    },
    {
      rank: 4,
      wallet: "GorbGoblin",
      wins: 35,
      losses: 25,
      totalStaked: 9800,
      totalWon: 14200,
      winRate: 58.3,
      streak: 5,
      favoriteColor: "red",
    },
    {
      rank: 5,
      wallet: "RainbowRekt",
      wins: 33,
      losses: 37,
      totalStaked: 11500,
      totalWon: 9800,
      winRate: 47.1,
      streak: -1,
      favoriteColor: "green",
    },
    {
      rank: 6,
      wallet: "7xK9...mN2p",
      wins: 12,
      losses: 8,
      totalStaked: 2400,
      totalWon: 3200,
      winRate: 60.0,
      streak: 2,
      favoriteColor: "blue",
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getColorEmoji = (color: "red" | "green" | "blue") => {
    return color === "red" ? "🔴" : color === "green" ? "🟢" : "🔵"
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
              LEADERBOARD
            </div>
          </div>

          <Link href="/game">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Play Now
            </Button>
          </Link>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Timeframe Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {(["daily", "weekly", "all"] as const).map((period) => (
                <Button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  variant={timeframe === period ? "default" : "ghost"}
                  className={`capitalize ${
                    timeframe === period ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Top 3 Podium */}
            <div className="lg:col-span-4 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                {mockPlayers.slice(0, 3).map((player, index) => (
                  <Card
                    key={player.wallet}
                    className={`${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/50"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-400/20 to-gray-500/10 border-gray-400/50"
                          : "bg-gradient-to-br from-amber-600/20 to-amber-700/10 border-amber-600/50"
                    } ${index === 0 ? "md:order-2 transform md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"}`}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="flex justify-center mb-2">{getRankIcon(player.rank)}</div>
                      <CardTitle className="text-lg">{player.wallet}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-2xl font-bold text-green-400">{player.totalWon} GORB</div>
                      <div className="text-sm text-gray-400">Total Won</div>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-lg">{getColorEmoji(player.favoriteColor)}</span>
                        <Badge
                          variant="outline"
                          className={`${
                            player.favoriteColor === "red"
                              ? "border-red-500 text-red-400"
                              : player.favoriteColor === "green"
                                ? "border-green-500 text-green-400"
                                : "border-blue-500 text-blue-400"
                          }`}
                        >
                          {player.favoriteColor}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-400">{player.wins}W</span> /
                        <span className="text-red-400 ml-1">{player.losses}L</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Full Leaderboard */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Full Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlayers.map((player) => (
                      <div
                        key={player.wallet}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-gray-800/50 ${
                          player.wallet === "7xK9...mN2p"
                            ? "bg-purple-500/10 border border-purple-500/30"
                            : "bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8">{getRankIcon(player.rank)}</div>
                          <div>
                            <div className="font-bold flex items-center gap-2">
                              {player.wallet}
                              {player.wallet === "7xK9...mN2p" && (
                                <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                                  YOU
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {player.wins}W / {player.losses}L • {player.winRate}% WR
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <div className="text-green-400 font-bold">{player.totalWon}</div>
                            <div className="text-xs text-gray-400">Won</div>
                          </div>
                          <div>
                            <div
                              className={`font-bold ${player.streak > 0 ? "text-green-400" : player.streak < 0 ? "text-red-400" : "text-gray-400"}`}
                            >
                              {player.streak > 0 ? "+" : ""}
                              {player.streak}
                            </div>
                            <div className="text-xs text-gray-400">Streak</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{getColorEmoji(player.favoriteColor)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Global Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Players</span>
                    <span className="font-bold">1,337</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Rounds</span>
                    <span className="font-bold">42,069</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GORB Wagered</span>
                    <span className="font-bold text-yellow-400">2.1M</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="text-sm text-gray-400 mb-2">Color Win Rates</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          🔴 <span className="text-red-400">Red</span>
                        </span>
                        <span>34.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          🟢 <span className="text-green-400">Green</span>
                        </span>
                        <span>32.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          🔵 <span className="text-blue-400">Blue</span>
                        </span>
                        <span>33.0%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Recent Winners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { wallet: "DegenKing420", color: "red" as const, amount: 420, round: 1337 },
                      { wallet: "BlueWhale777", color: "blue" as const, amount: 777, round: 1336 },
                      { wallet: "GorbGoblin", color: "green" as const, amount: 250, round: 1335 },
                      { wallet: "ColorMaster88", color: "red" as const, amount: 180, round: 1334 },
                    ].map((winner, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getColorEmoji(winner.color)}</span>
                          <div>
                            <div className="text-sm font-mono">{winner.wallet}</div>
                            <div className="text-xs text-gray-400">Round #{winner.round}</div>
                          </div>
                        </div>
                        <span className="text-green-400 font-bold">+{winner.amount}</span>
                      </div>
                    ))}
                  </div>
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
