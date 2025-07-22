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
  /*
  // const [selectedCategory, setSelectedCategory] = useState<"all" | "unlocked" | "locked">("all")

  // const mockNFTs: NFT[] = [
  //   {
  //     id: "1",
  //     name: "Color Champion",
  //     description: "Won 10 consecutive rounds",
  //     rarity: "legendary",
  //     image: "🏆",
  //     unlocked: true,
  //     requirement: "Win 10 rounds in a row",
  //     dateEarned: "2025-07-17",
  //   },
  //   {
  //     id: "2",
  //     name: "Blue Hit God",
  //     description: "Hit blue 5 times during Color Surge",
  //     rarity: "epic",
  //     image: "🐀",
  //     unlocked: true,
  //     requirement: "Win 5 Color Surge rounds with Rat Dumpster",
  //     dateEarned: "2025-07-17",
  //   },
  //   {
  //     id: "3",
  //     name: "Red Rocket",
  //     description: "First win with red color",
  //     rarity: "common",
  //     image: "🗑️",
  //     unlocked: true,
  //     requirement: "Win your first round with Trash Can",
  //     dateEarned: "2025-07-17",
  //   },
  //   {
  //     id: "4",
  //     name: "Green Machine",
  //     description: "Win 3 rounds in a row with green",
  //     rarity: "rare",
  //     image: "🪤",
  //     unlocked: true,
  //     requirement: "Win 3 consecutive rounds with Trap Can",
  //     dateEarned: "2025-07-17",
  //   },
  //   {
  //     id: "5",
  //     name: "Degen Destroyer",
  //     description: "Win 100 total rounds",
  //     rarity: "legendary",
  //     image: "💀",
  //     unlocked: false,
  //     requirement: "Win 100 total rounds (Progress: 47/100)",
  //   },
  //   {
  //     id: "6",
  //     name: "Whale Watcher",
  //     description: "Bet over 1000 GORB in a single round",
  //     rarity: "epic",
  //     image: "🐋",
  //     unlocked: false,
  //     requirement: "Place a bet of 1000+ GORB",
  //   },
  //   {
  //     id: "7",
  //     name: "Color Surge Master",
  //     description: "Win 10 Color Surge events",
  //     rarity: "legendary",
  //     image: "⚡",
  //     unlocked: false,
  //     requirement: "Win 10 Color Surge rounds (Progress: 3/10)",
  //   },
  //   {
  //     id: "8",
  //     name: "Triple Threat",
  //     description: "Win with all three colors in one session",
  //     rarity: "rare",
  //     image: "🌈",
  //     unlocked: false,
  //     requirement: "Win with Trash Can, Trap Can, and Rat Dumpster in one session",
  //   },
  // ]

  // const getRarityColor = (rarity: string) => {
  //   switch (rarity) {
  //     case "common":
  //       return "text-gray-400 border-gray-400"
  //     case "rare":
  //       return "text-blue-400 border-blue-400"
  //     case "epic":
  //       return "text-purple-400 border-purple-400"
  //     case "legendary":
  //       return "text-yellow-400 border-yellow-400"
  //     default:
  //       return "text-gray-400 border-gray-400"
  //   }
  // }

  // const getRarityBg = (rarity: string) => {
  //   switch (rarity) {
  //     case "common":
  //       return "bg-gray-500/10"
  //     case "rare":
  //       return "bg-blue-500/10"
  //     case "epic":
  //       return "bg-purple-500/10"
  //     case "legendary":
  //       return "bg-yellow-500/10"
  //     default:
  //       return "bg-gray-500/10"
  //   }
  // }

  // const filteredNFTs = mockNFTs.filter((nft) => {
  //   if (selectedCategory === "unlocked") return nft.unlocked
  //   if (selectedCategory === "locked") return !nft.unlocked
  //   return true
  // })

  // const unlockedCount = mockNFTs.filter((nft) => nft.unlocked).length
  // const totalCount = mockNFTs.length

  // return (
  //   <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono">
  //     <div className="flex flex-col items-center gap-6">
  //       <div className="text-7xl animate-bounce">✨</div>
  //       <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
  //         NFTs - Coming Soon!
  //       </h1>
  //       <p className="text-lg text-gray-400 max-w-md text-center">
  //         Collect, trade, and show off your degenerate NFTs. Stay tuned for the next evolution of Trash Clash!
  //       </p>
  //     </div>
  //   </div>
  // )
  */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono">
      <div className="flex flex-col items-center gap-6">
        <div className="text-7xl animate-bounce">✨</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          NFTs - Coming Soon!
        </h1>
        <p className="text-lg text-gray-400 max-w-md text-center">
          Collect, trade, and show off your degenerate NFTs. Stay tuned for the next evolution of Trash Clash!
        </p>
      </div>
    </div>
  )
}
