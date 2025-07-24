"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, ArrowLeft, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

interface Player {
  rank: number
  wallet: string
  username?: string | null
  wins: number
  losses: number
  totalStaked: number
  totalWon: number
  winRate: number
  streak: number
  favoriteColor: "red" | "green" | "blue"
}

interface GlobalStats {
  totalPlayers: number;
  totalRounds: number;
  gorbWagered: number;
  colorWinRates: { _id: string, count: number }[];
}

interface RecentWinner {
  username: string | null;
  wallet: string;
  color: "red" | "green" | "blue";
  amount: number;
  round: number;
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "all">("all")
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        const res = await fetch(`${apiUrl}/api/leaderboard`)
        const data = await res.json()
        setPlayers(
          data.map((entry: any, idx: number) => ({
            rank: idx + 1,
            wallet: entry.user?.wallet || "Unknown",
            username: entry.user?.username || null,
            wins: entry.wins,
            losses: entry.losses,
            totalStaked: entry.totalStaked,
            totalWon: entry.totalWon,
            winRate:
              entry.wins + entry.losses > 0
                ? ((entry.wins / (entry.wins + entry.losses)) * 100)
                : 0,
            streak: 0, // You can add streak logic if you want
            favoriteColor:
              entry.favoriteBin === "trashcan"
                ? "red"
                : entry.favoriteBin === "trapcan"
                ? "green"
                : "blue",
          }))
        )
      } catch (err) {
        setPlayers([])
      }
      setLoading(false)
    }
    async function fetchStats() {
      try {
        const res = await fetch(`${apiUrl}/api/stats/global`);
        const data = await res.json();
        setGlobalStats(data);
      } catch (err) {
        console.error("Failed to fetch global stats", err);
      }
    }
    async function fetchRecentWinners() {
      try {
        const res = await fetch(`${apiUrl}/api/winners/recent`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentWinners(data);
        } else {
          setRecentWinners([]); // Ensure it's always an array
        }
      } catch (err) {
        console.error("Failed to fetch recent winners", err);
        setRecentWinners([]); // Ensure it's always an array on error
      }
    }
    fetchLeaderboard()
    fetchStats();
    fetchRecentWinners();
  }, [apiUrl]);

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
    return color === "red"
      ? "🗑️"
      : color === "green"
        ? "🪤"
        : "🐀"
  }

  const calculateWinRate = (colorId: string) => {
    if (!globalStats || !globalStats.colorWinRates) return '0.0%';
    const totalWins = globalStats.colorWinRates.reduce((sum, rate) => sum + rate.count, 0);
    if (totalWins === 0) return '0.0%';
    const colorWins = globalStats.colorWinRates.find(rate => rate._id === colorId)?.count || 0;
    return ((colorWins / totalWins) * 100).toFixed(1) + '%';
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
                {players.slice(0, 3).map((player, index) => (
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
                      <CardTitle className="text-lg">
                        {player.username ? player.username : player.wallet.slice(0, 4) + "..." + player.wallet.slice(-4)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-2xl font-bold text-green-400">{player.totalWon} GORB</div>
                      <div className="text-sm text-gray-400">Total Won</div>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-lg">{getColorEmoji(player.favoriteColor)}</span>
                        <Badge
                          variant="outline"
                          className={`$ {
                            player.favoriteColor === "red"
                              ? "border-red-500 text-red-400"
                              : player.favoriteColor === "green"
                                ? "border-green-500 text-green-400"
                                : "border-blue-500 text-blue-400"
                          }`}
                        >
                          {player.favoriteColor === "red"
                            ? "Trash Can"
                            : player.favoriteColor === "green"
                              ? "Trap Can"
                              : "Rat Dumpster"}
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
                    {loading ? (
                      <div className="text-center text-gray-400 py-4">Loading leaderboard...</div>
                    ) : players.length === 0 ? (
                      <div className="text-center text-gray-400 py-4">No leaderboard data available.</div>
                    ) : players.map((player) => (
                      <div
                        key={player.wallet}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-gray-800/50 bg-gray-800/30`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8">{getRankIcon(player.rank)}</div>
                          <div>
                            <div className="font-bold flex items-center gap-2">
                              {player.username ? player.username : player.wallet.slice(0, 4) + "..." + player.wallet.slice(-4)}
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
                            <span className="text-xs text-gray-400 font-mono">
                              {player.favoriteColor === "red"
                                ? "Trash Can"
                                : player.favoriteColor === "green"
                                  ? "Trap Can"
                                  : "Rat Dumpster"}
                            </span>
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
                    <span className="font-bold">{globalStats?.totalPlayers?.toLocaleString() ?? '...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Rounds</span>
                    <span className="font-bold">{globalStats?.totalRounds?.toLocaleString() ?? '...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GORB Wagered</span>
                    <span className="font-bold text-yellow-400">{globalStats?.gorbWagered?.toLocaleString() ?? '...'}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="text-sm text-gray-400 mb-2">Color Win Rates</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🗑️</span> <span className="text-red-400">Trash Can</span>
                        </span>
                        <span>{calculateWinRate('trashcan')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🪤</span> <span className="text-green-400">Trap Can</span>
                        </span>
                        <span>{calculateWinRate('trapcan')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🐀</span> <span className="text-blue-400">Rat Dumpster</span>
                        </span>
                        <span>{calculateWinRate('ratdumpster')}</span>
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
                  <div className="space-y-3 sm:space-y-2 flex flex-col sm:block overflow-x-auto">
                    <div className="flex flex-col gap-3 sm:gap-2 sm:block min-w-0">
                      {Array.isArray(recentWinners) && recentWinners.map((winner, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-gray-800/50 rounded min-w-[220px] sm:min-w-0"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg sm:text-xl">{getColorEmoji(winner.color)}</span>
                            <div className="min-w-0">
                              <div className="text-sm sm:text-base font-mono truncate max-w-[120px] sm:max-w-[160px]">
                                {winner.username || (winner.wallet ? winner.wallet.slice(0, 4) + '...' + winner.wallet.slice(-4) : 'Unknown')}
                              </div>
                              <div className="text-xs text-gray-400">Round #{winner.round}</div>
                              <div className="text-xs text-gray-400">
                                {winner.color === "red" ? "Trash Can" : winner.color === "green" ? "Trap Can" : "Rat Dumpster"}
                              </div>
                            </div>
                          </div>
                          <span className="text-green-400 font-bold text-base sm:text-lg mt-2 sm:mt-0">+{winner.amount}</span>
                        </div>
                      ))}
                    </div>
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
