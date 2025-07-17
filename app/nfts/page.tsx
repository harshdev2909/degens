"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, ArrowLeft, Sparkles, Lock, Star } from "lucide-react"
import Link from "next/link"

interface NFT {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  unlocked: boolean
  requirement: string
  dateEarned?: string
}

export default function NFTsPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "unlocked" | "locked">("all")

  const mockNFTs: NFT[] = [
    {
      id: "1",
      name: "Color Champion",
      description: "Won 10 consecutive rounds",
      rarity: "legendary",
      image: "🏆",
      unlocked: true,
      requirement: "Win 10 rounds in a row",
      dateEarned: "2025-07-17",
    },
    {
      id: "2",
      name: "Blue Hit God",
      description: "Hit blue 5 times during Color Surge",
      rarity: "epic",
      image: "🐀",
      unlocked: true,
      requirement: "Win 5 Color Surge rounds with Rat Dumpster",
      dateEarned: "2025-07-17",
    },
    {
      id: "3",
      name: "Red Rocket",
      description: "First win with red color",
      rarity: "common",
      image: "🗑️",
      unlocked: true,
      requirement: "Win your first round with Trash Can",
      dateEarned: "2025-07-17",
    },
    {
      id: "4",
      name: "Green Machine",
      description: "Win 3 rounds in a row with green",
      rarity: "rare",
      image: "🪤",
      unlocked: true,
      requirement: "Win 3 consecutive rounds with Trap Can",
      dateEarned: "2025-07-17",
    },
    {
      id: "5",
      name: "Degen Destroyer",
      description: "Win 100 total rounds",
      rarity: "legendary",
      image: "💀",
      unlocked: false,
      requirement: "Win 100 total rounds (Progress: 47/100)",
    },
    {
      id: "6",
      name: "Whale Watcher",
      description: "Bet over 1000 GORB in a single round",
      rarity: "epic",
      image: "🐋",
      unlocked: false,
      requirement: "Place a bet of 1000+ GORB",
    },
    {
      id: "7",
      name: "Color Surge Master",
      description: "Win 10 Color Surge events",
      rarity: "legendary",
      image: "⚡",
      unlocked: false,
      requirement: "Win 10 Color Surge rounds (Progress: 3/10)",
    },
    {
      id: "8",
      name: "Triple Threat",
      description: "Win with all three colors in one session",
      rarity: "rare",
      image: "🌈",
      unlocked: false,
      requirement: "Win with Trash Can, Trap Can, and Rat Dumpster in one session",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400 border-gray-400"
      case "rare":
        return "text-blue-400 border-blue-400"
      case "epic":
        return "text-purple-400 border-purple-400"
      case "legendary":
        return "text-yellow-400 border-yellow-400"
      default:
        return "text-gray-400 border-gray-400"
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/10"
      case "rare":
        return "bg-blue-500/10"
      case "epic":
        return "bg-purple-500/10"
      case "legendary":
        return "bg-yellow-500/10"
      default:
        return "bg-gray-500/10"
    }
  }

  const filteredNFTs = mockNFTs.filter((nft) => {
    if (selectedCategory === "unlocked") return nft.unlocked
    if (selectedCategory === "locked") return !nft.unlocked
    return true
  })

  const unlockedCount = mockNFTs.filter((nft) => nft.unlocked).length
  const totalCount = mockNFTs.length

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
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                MY NFTs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Collection Progress</div>
              <div className="text-lg font-bold text-yellow-400">
                {unlockedCount}/{totalCount} Unlocked
              </div>
            </div>
            <Link href="/game">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Play to Earn More
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {(["all", "unlocked", "locked"] as const).map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className={`capitalize ${
                    selectedCategory === category ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {category} {category === "unlocked" && `(${unlockedCount})`}{" "}
                  {category === "locked" && `(${totalCount - unlockedCount})`}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">
                  {mockNFTs.filter((n) => n.rarity === "legendary" && n.unlocked).length}
                </div>
                <div className="text-sm text-gray-400">Legendary NFTs</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <Medal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">
                  {mockNFTs.filter((n) => n.rarity === "epic" && n.unlocked).length}
                </div>
                <div className="text-sm text-gray-400">Epic NFTs</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">
                  {mockNFTs.filter((n) => n.rarity === "rare" && n.unlocked).length}
                </div>
                <div className="text-sm text-gray-400">Rare NFTs</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-500/10 border-gray-500/30">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-400">
                  {mockNFTs.filter((n) => n.rarity === "common" && n.unlocked).length}
                </div>
                <div className="text-sm text-gray-400">Common NFTs</div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <Card
                key={nft.id}
                className={`${getRarityBg(nft.rarity)} border-2 ${getRarityColor(nft.rarity)} ${
                  nft.unlocked ? "hover:scale-105" : "opacity-60"
                } transition-all duration-300`}
              >
                <CardHeader className="text-center pb-2">
                  <div className="relative">
                    <div className="text-6xl mb-2 filter">{nft.unlocked ? nft.image : "🔒"}</div>
                    {!nft.unlocked && <Lock className="absolute top-0 right-0 w-6 h-6 text-gray-400" />}
                  </div>
                  <CardTitle className="text-lg">{nft.name}</CardTitle>
                  <Badge variant="outline" className={`${getRarityColor(nft.rarity)} capitalize`}>
                    {nft.rarity}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-gray-300">{nft.description}</p>

                  <div className="text-xs text-gray-400">
                    <div className="font-bold mb-1">Requirement:</div>
                    <div>{nft.requirement}</div>
                  </div>

                  {nft.unlocked && nft.dateEarned && (
                    <div className="text-xs text-green-400">Earned: {nft.dateEarned}</div>
                  )}

                  {nft.unlocked ? (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      View Details
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-gray-600 text-gray-400 bg-transparent"
                      disabled
                    >
                      Locked
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Progress */}
          <div className="mt-12">
            <Card className="bg-gray-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Next Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                    <div>
                      <div className="font-bold">Degen Destroyer</div>
                      <div className="text-sm text-gray-400">Win 100 total rounds</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">47/100</div>
                      <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "47%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                    <div>
                      <div className="font-bold">Color Surge Master</div>
                      <div className="text-sm text-gray-400">Win 10 Color Surge rounds</div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold">3/10</div>
                      <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: "30%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
