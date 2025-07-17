import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Color Clash: Battle of the Degens | Gorbagana",
  description:
    "High-speed color betting on Solana's Gorbagana testnet. Choose your color, stake GORB tokens, and battle other degens in real-time.",
  keywords: "Solana, Web3, Gaming, Betting, Gorbagana, GORB, Degens, Color Clash"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>{children}</body>
    </html>
  )
}
