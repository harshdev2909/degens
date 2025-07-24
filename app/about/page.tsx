"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono px-4 py-8 sm:px-6 md:px-12 lg:px-48">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-purple-300 hover:text-white">&larr; Back</Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">About Trash Clash</h1>
        <p className="mb-6 text-gray-300">Welcome to the filthiest arena on the blockchain.</p>
        <p className="mb-8">Trash Clash is a real-time betting game built on the Gorbagana testnet (Solana) where degens fight for glory… in the trash.</p>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-2">The rules are simple but brutal:</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pick a bin.</li>
              <li>Bet your $GOR.</li>
              <li>win.</li>
              <li>Chaos reigns supreme.</li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">The Lore: The Trash Wars of Gorbagana</h2>
            <p className="mb-2">Long ago, when the memecoins first rose, Gorbagana descended into chaos.<br />Degens fought over rugs, dumps, and moonshots — and the trash piled higher than the pumps.</p>
            <p className="mb-2">From this garbage, three sacred bins emerged:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Trash Can – The classic, OG bin of degens past.</li>
              <li>Trap Can – A cursed bin that rewards only the bold.</li>
              <li>Rat Dumpster – Home of the true CT rats who never sell.</li>
            </ul>
            <p className="mt-2">Every clash is a battle of psychology — do you follow the herd or go solo into the filth?</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">Why We Built It</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To turn degen culture into gameplay — no fake narratives, pure chaos.</li>
              <li>To test real-time, on-chain mechanics for betting games.</li>
              <li>To create something fun + memeable while exploring Gorbagana’s insane energy.</li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">The Team</h2>
            <p>Built by Stepous Labs — a small team of builders shipping on-chain experiments for the culture, not VC bags.</p>
            <p className="mt-2">We’re building Trash Clash in public. Every win, every bug, every meme = part of the story.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">Join the Chaos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Play now: <a href="https://www.trashclash.xyz" className="underline text-blue-400">https://www.trashclash.xyz</a></li>
              <li>Get test $GOR: <a href="https://faucet.gorbagana.wtf" className="underline text-green-400">https://faucet.gorbagana.wtf</a></li>
              <li>Follow the lore: <a href="https://x.com/harsh_sharmaa9" className="underline text-blue-400">https://x.com/harsh_sharmaa9</a></li>
              {/* <li>Join the trash mob: <a href="#" className="underline text-blue-400">[Telegram link]</a></li> */}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
} 