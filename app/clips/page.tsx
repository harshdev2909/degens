"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Share, ArrowLeft, Video, Sparkles } from "lucide-react"
import Link from "next/link"

interface GameClip {
  id: string
  roundNumber: number
  playerColor: "red" | "green" | "blue"
  result: "win" | "loss"
  amount: number
  multiplier: number
  timestamp: string
  reactions: string[]
  isColorSurge: boolean
}

export default function ClipsPage() {
  const [selectedClip, setSelectedClip] = useState<GameClip | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const mockClips: GameClip[] = [
    {
      id: "1",
      roundNumber: 1337,
      playerColor: "blue",
      result: "win",
      amount: 420,
      multiplier: 8.5,
      timestamp: "2024-01-15 14:30",
      reactions: ["🔥", "💎", "🚀"],
      isColorSurge: false,
    },
    {
      id: "2",
      roundNumber: 1340,
      playerColor: "red",
      result: "win",
      amount: 1000,
      multiplier: 10.0,
      timestamp: "2024-01-15 15:45",
      reactions: ["🔥", "💀", "👑"],
      isColorSurge: true,
    },
    {
      id: "3",
      roundNumber: 1335,
      playerColor: "green",
      result: "loss",
      amount: 150,
      multiplier: 0,
      timestamp: "2024-01-15 13:20",
      reactions: ["😭", "💀"],
      isColorSurge: false,
    },
  ]

  const generateClip = () => {
    setIsGenerating(true)
    // Simulate clip generation
    setTimeout(() => {
      setIsGenerating(false)
      // Add new clip to the list (mock)
    }, 3000)
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
            <div className="flex items-center gap-2">
              <Video className="w-6 h-6 text-pink-400" />
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                CT CLIPS
              </div>
            </div>
          </div>

          <Button
            onClick={generateClip}
            disabled={isGenerating}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            <Video className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Clip"}
          </Button>
        </header>

        <div className="container mx-auto px-6 py-8">
          {isGenerating && (
            <Card className="mb-8 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30">
              <CardContent className="p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full mx-auto mb-4" />
                <div className="text-lg font-bold text-pink-400">Generating Epic Clip...</div>
                <div className="text-sm text-gray-300">Adding effects, reactions, and degen energy</div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Clips List */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Your Clips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockClips.map((clip) => (
                      <div
                        key={clip.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          clip.result === "win"
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        } ${selectedClip?.id === clip.id ? "ring-2 ring-purple-400" : ""}`}
                        onClick={() => setSelectedClip(clip)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getColorEmoji(clip.playerColor)}</div>
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                Round #{clip.roundNumber}
                                {clip.isColorSurge && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    SURGE
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">{clip.timestamp}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                clip.result === "win" ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {clip.result === "win" ? "+" : "-"}
                              {clip.amount} GORB
                            </div>
                            {clip.result === "win" && (
                              <div className="text-sm text-yellow-400">{clip.multiplier}x multiplier</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {clip.reactions.map((reaction, index) => (
                              <span key={index} className="text-lg">
                                {reaction}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                              <Share className="w-3 h-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clip Preview */}
            <div className="space-y-6">
              {selectedClip ? (
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Clip Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mock Video Player */}
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <div className="text-gray-400">Click to play clip</div>
                        <div className="text-sm text-gray-500 mt-1">Round #{selectedClip.roundNumber}</div>
                      </div>
                    </div>

                    {/* Clip Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Color</span>
                        <span className="flex items-center gap-1">
                          {getColorEmoji(selectedClip.playerColor)}
                          <span className="capitalize">{selectedClip.playerColor}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Result</span>
                        <span
                          className={`font-bold capitalize ${
                            selectedClip.result === "win" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {selectedClip.result}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="text-yellow-400 font-bold">{selectedClip.amount} GORB</span>
                      </div>
                      {selectedClip.result === "win" && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Multiplier</span>
                          <span className="text-purple-400 font-bold">{selectedClip.multiplier}x</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Clip
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/20 bg-transparent"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share on CT
                      </Button>
                    </div>

                    {/* Add Reactions */}
                    <div>
                      <div className="text-sm font-bold mb-2">Add Reaction</div>
                      <div className="grid grid-cols-4 gap-2">
                        {["🔥", "💎", "🚀", "💀", "😭", "👑", "⚡", "🌟"].map((emoji) => (
                          <Button
                            key={emoji}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 hover:bg-gray-600/20 bg-transparent"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardContent className="p-8 text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-400">Select a clip to preview</div>
                  </CardContent>
                </Card>
              )}

              {/* Clip Stats */}
              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Clip Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Clips</span>
                    <span className="font-bold">{mockClips.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Epic Wins</span>
                    <span className="text-green-400 font-bold">
                      {mockClips.filter((c) => c.result === "win").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rekt Moments</span>
                    <span className="text-red-400 font-bold">
                      {mockClips.filter((c) => c.result === "loss").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Color Surge Clips</span>
                    <span className="text-yellow-400 font-bold">{mockClips.filter((c) => c.isColorSurge).length}</span>
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
