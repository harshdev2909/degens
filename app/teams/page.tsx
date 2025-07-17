"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Trophy, ArrowLeft, Crown, Target } from "lucide-react"
import Link from "next/link"

type TeamColor = "red" | "green" | "blue"

interface TeamStats {
  color: TeamColor
  name: string
  members: number
  totalWins: number
  totalStaked: number
  winRate: number
  currentStreak: number
  topPlayer: string
  emoji: string
}

interface TeamMember {
  wallet: string
  wins: number
  contribution: number
  joinDate: string
  rank: number
}

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<TeamColor>("red")
  const [userTeam, setUserTeam] = useState<TeamColor | null>("blue")

  const teamStats: TeamStats[] = [
    {
      color: "red",
      name: "Red Rockets",
      members: 1247,
      totalWins: 3420,
      totalStaked: 125000,
      winRate: 34.2,
      currentStreak: 8,
      topPlayer: "RedRocket88",
      emoji: "🔴",
    },
    {
      color: "green",
      name: "Green Machines",
      members: 1156,
      totalWins: 3180,
      totalStaked: 118000,
      winRate: 32.8,
      currentStreak: 3,
      topPlayer: "GreenGoblin",
      emoji: "🟢",
    },
    {
      color: "blue",
      name: "Blue Whales",
      members: 1389,
      totalWins: 3290,
      totalStaked: 142000,
      winRate: 33.0,
      currentStreak: 12,
      topPlayer: "BlueWhale777",
      emoji: "🔵",
    },
  ]

  const mockTeamMembers: TeamMember[] = [
    { wallet: "BlueWhale777", wins: 89, contribution: 15420, joinDate: "2024-01-01", rank: 1 },
    { wallet: "DeepBlue42", wins: 76, contribution: 12800, joinDate: "2024-01-03", rank: 2 },
    { wallet: "7xK9...mN2p", wins: 12, contribution: 2400, joinDate: "2024-01-15", rank: 847 },
    { wallet: "BlueStorm", wins: 45, contribution: 8900, joinDate: "2024-01-05", rank: 3 },
    { wallet: "AzureKing", wins: 38, contribution: 7200, joinDate: "2024-01-08", rank: 4 },
  ]

  const currentTeam = teamStats.find((team) => team.color === selectedTeam)!
  const sortedTeams = [...teamStats].sort((a, b) => b.totalWins - a.totalWins)

  const joinTeam = (team: TeamColor) => {
    setUserTeam(team)
  }

  const leaveTeam = () => {
    setUserTeam(null)
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
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                COLOR GUILDS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userTeam && (
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    userTeam === "red" ? "bg-red-500" : userTeam === "green" ? "bg-green-500" : "bg-blue-500"
                  } text-white`}
                >
                  {userTeam === "red" ? "🔴" : userTeam === "green" ? "🟢" : "🔵"} Team {userTeam}
                </Badge>
              </div>
            )}
            <Link href="/game">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Play Now
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Team Rankings */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Guild Leaderboard</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {sortedTeams.map((team, index) => (
                <Card
                  key={team.color}
                  className={`${
                    team.color === "red"
                      ? "bg-red-500/10 border-red-500/50"
                      : team.color === "green"
                        ? "bg-green-500/10 border-green-500/50"
                        : "bg-blue-500/10 border-blue-500/50"
                  } ${index === 0 ? "ring-2 ring-yellow-400" : ""} hover:scale-105 transition-all cursor-pointer`}
                  onClick={() => setSelectedTeam(team.color)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-400" />}
                      <div className="text-4xl">{team.emoji}</div>
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-400" />}
                    </div>
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`${
                        team.color === "red"
                          ? "border-red-500 text-red-400"
                          : team.color === "green"
                            ? "border-green-500 text-green-400"
                            : "border-blue-500 text-blue-400"
                      }`}
                    >
                      Rank #{index + 1}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{team.totalWins}</div>
                        <div className="text-gray-400">Total Wins</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{team.members}</div>
                        <div className="text-gray-400">Members</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Win Rate</span>
                        <span className="font-bold">{team.winRate}%</span>
                      </div>
                      <Progress value={team.winRate} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Current Streak</div>
                      <div className={`font-bold ${team.currentStreak > 0 ? "text-green-400" : "text-red-400"}`}>
                        {team.currentStreak > 0 ? "+" : ""}
                        {team.currentStreak}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Team Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card
                className={`${
                  currentTeam.color === "red"
                    ? "bg-red-500/10 border-red-500/30"
                    : currentTeam.color === "green"
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <span className="text-4xl">{currentTeam.emoji}</span>
                      {currentTeam.name}
                    </CardTitle>
                    {userTeam === currentTeam.color ? (
                      <Button
                        onClick={leaveTeam}
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500/20 bg-transparent"
                      >
                        Leave Team
                      </Button>
                    ) : userTeam ? (
                      <Button disabled variant="outline" className="border-gray-600 text-gray-400 bg-transparent">
                        Already in Team
                      </Button>
                    ) : (
                      <Button
                        onClick={() => joinTeam(currentTeam.color)}
                        className={`${
                          currentTeam.color === "red"
                            ? "bg-red-600 hover:bg-red-700"
                            : currentTeam.color === "green"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                      >
                        Join Team
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{currentTeam.totalWins}</div>
                      <div className="text-sm text-gray-400">Total Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {currentTeam.totalStaked.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">GORB Staked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{currentTeam.winRate}%</div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${currentTeam.currentStreak > 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {currentTeam.currentStreak > 0 ? "+" : ""}
                        {currentTeam.currentStreak}
                      </div>
                      <div className="text-sm text-gray-400">Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Top Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTeamMembers.map((member, index) => (
                      <div
                        key={member.wallet}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          member.wallet === "7xK9...mN2p"
                            ? "bg-purple-500/10 border border-purple-500/30"
                            : "bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700">
                            {index === 0 ? (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <span className="text-sm font-bold">#{member.rank}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-2">
                              {member.wallet}
                              {member.wallet === "7xK9...mN2p" && (
                                <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                                  YOU
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">Joined: {member.joinDate}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-green-400 font-bold">{member.wins} wins</div>
                          <div className="text-sm text-yellow-400">{member.contribution} GORB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Stats Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Guild Wars
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="text-yellow-400 font-bold text-lg">Season 1</div>
                    <div className="text-sm text-gray-300">Ends in 7 days</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Rank</span>
                      <span className="font-bold">#847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Team Contribution</span>
                      <span className="text-green-400 font-bold">2,400 GORB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Season Rewards</span>
                      <span className="text-purple-400 font-bold">NFT Badge</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Team Perks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>5% bonus on team color wins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Exclusive team chat</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span>Team-only tournaments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span>Season NFT rewards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Recent Team Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-400">BlueWhale777</span>
                      <span className="text-green-400">+420 GORB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400">DeepBlue42</span>
                      <span className="text-green-400">+180 GORB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400">7xK9...mN2p</span>
                      <span className="text-green-400">+50 GORB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400">BlueStorm</span>
                      <span className="text-red-400">-75 GORB</span>
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
