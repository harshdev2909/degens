"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono px-4 py-8 sm:px-6 md:px-12 lg:px-48">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-purple-300 hover:text-white">&larr; Back</Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Contact & Support</h1>
        <p className="mb-4 text-gray-300">Need help, found a bug, or have feedback? We’re building Trash Clash in public and your input is crucial.</p>
        <ul className="list-disc pl-6 space-y-1 mb-6">
          <li>Support Email: <span className="font-mono text-purple-300">harshsharmaa990@gmail.com</span></li>
          {/* <li>Telegram (Community Chat): <a href="#" className="underline text-blue-400">[Insert TG link]</a></li> */}
          <li>X/Twitter: <a href="https://x.com/harsh_sharmaa9" className="underline text-blue-400">@harsh_sharmaa9</a></li>
          {/* <li>GitHub (if open-source): <a href="#" className="underline text-blue-400">[Insert repo link]</a></li> */}
        </ul>
        <div className="mb-8 text-gray-400">We aim to respond to queries within 24–48 hours.</div>
        <div className="border-t border-gray-700 my-8" />
        <h2 className="text-2xl font-bold mb-4">FAQ – Frequently Asked Questions</h2>
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-bold mb-2">1. What is Trash Clash?</h3>
            <p>Trash Clash is a real-time, on-chain betting game on the Gorbagana testnet (Solana) where you bet on bins (Trash Can, Trap Can, Rat Dumpster). The least picked bin wins, and winners split the pool.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">2. Is it free to play?</h3>
            <p>Yes — the game runs on test $GOR tokens (no real value). Grab some from the faucet to play.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">3. How do I get started?</h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Install Backpack Wallet</li>
              <li>Create a new Solana wallet</li>
              <li>Set RPC: <span className="font-mono text-yellow-300">https://rpc.gorbagana.wtf/</span></li>
              <li>Get test GOR from faucet: <span className="font-mono text-green-300">https://faucet.gorbagana.wtf/</span></li>
              <li>Start playing at: <span className="font-mono text-purple-300">https://www.trashclash.xyz</span></li>
            </ol>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">4. Are my bets and wins on-chain?</h3>
            <p>Yes. All bets, wins, and round outcomes are verifiable on-chain via the Gorbagana testnet.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">5. Can I play on mobile?</h3>
            <p>Currently best on desktop browsers; mobile support is being improved.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">6. Is there any real money involved?</h3>
            <p>No — this is purely for testing and fun. $GOR is a test token without monetary value.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">7. How can I report bugs or suggest features?</h3>
            <ul className="list-disc pl-6 space-y-1">
              {/* <li>Drop feedback in our Telegram group</li> */}
              <li>Tag us on Twitter/X with <span className="font-mono text-purple-300">#harsh_sharmaa9</span></li>
              <li>Or email us directly at <span className="font-mono text-purple-300">harshsharmaa990@gmail.com</span></li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h3 className="text-lg font-bold mb-2">8. Will there be rewards for testers?</h3>
            <p>We’re exploring leaderboards, badges, and future rewards for early testers once mainnet or community events are live.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 