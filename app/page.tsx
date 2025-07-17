"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Zap, Trophy, Target, Eye, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true)
      setIsConnecting(false)
    }, 2000)
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
          <div className="text-2xl font-bold bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Trash Clash
          </div>
          <div className="flex gap-4">
            <Link href="/spectator">
              <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/20 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                Spectator
              </Button>
            </Link>
            <Link href="/flash-flip">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 bg-transparent"
              >
                <Zap className="w-4 h-4 mr-2" />
                Flash Flip
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                TRASH CLASH
              </span>
              <span className="block text-3xl md:text-4xl text-purple-300 mt-4">Battle of the Degens</span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              High-speed Trash betting on Gorbagana. Choose your Trash, stake your GORB, and battle other degens
              in 30-second rounds of pure chaos.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 transition-all">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">Pick Your Trash</h3>
                  <p className="text-gray-300"> Trash Can, Trap Can, or Rat Dumpster - choose your side in the battle</p>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20 transition-all">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">Lightning Fast</h3>
                  <p className="text-gray-300">30-second rounds on Solana's blazing-fast network</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 transition-all">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Win Big</h3>
                  <p className="text-gray-300">Massive payouts for the winning color each round</p>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Connection */}
            <div className="space-y-6">
              {!walletConnected ? (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-bold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 text-green-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-lg">Wallet Connected: 7xK9...mN2p</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Link href="/game">
                      <Button className="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 hover:from-red-600 hover:via-green-600 hover:to-blue-600 text-white px-6 py-3 font-bold rounded-lg">
                        ENTER ARENA
                      </Button>
                    </Link>
                    <Link href="/spectator">
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-300 hover:bg-blue-500/20 px-6 py-3 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Spectate
                      </Button>
                    </Link>
                    <Link href="/flash-flip">
                      <Button
                        variant="outline"
                        className="border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 px-6 py-3 bg-transparent"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Flash Flip
                      </Button>
                    </Link>
                    <Link href="/nfts">
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/20 px-6 py-3 bg-transparent"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        My NFTs
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-400">Supports Backpack, Phantom, and all Solana wallets</p>
            </div>
          </div>
        </main>

        {/* Stats Footer */}
        <footer className="border-t border-purple-500/30 p-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-6 text-center mb-6">
              <div>
                <div className="text-2xl font-bold text-red-400">1,337</div>
                <div className="text-gray-400">Active Degens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">42,069</div>
                <div className="text-gray-400">GORB Staked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">∞</div>
                <div className="text-gray-400">Rounds Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">0.3s</div>
                <div className="text-gray-400">Avg Block Time</div>
              </div>
            </div>

            {/* Credit */}
            <div className="text-center border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm">
                Built by <span className="text-purple-400 font-bold">Harsh Sharma</span> with{" "}
                <span className="text-red-500">❤️</span> for degens
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
