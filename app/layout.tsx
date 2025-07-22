import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { Toaster } from "@/components/ui/toaster";
import "@solana/wallet-adapter-react-ui/styles.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Trash Clash",
  description: "Battle of the Degens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <WalletProvider>
          {children}
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}
