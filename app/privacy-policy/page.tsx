"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono px-4 py-8 sm:px-6 md:px-12 lg:px-48">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-purple-300 hover:text-white">&larr; Back</Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy – Trash Clash</h1>
        <div className="text-gray-400 mb-8">Last updated: [24/07/2025]</div>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
            <p className="mb-2">We do not collect personally identifiable information (PII) such as names, emails, or phone numbers. However, we may collect the following:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Wallet addresses (public Solana addresses used for gameplay)</li>
              <li>Gameplay data (bets, wins/losses, round participation)</li>
              {/* <li>Technical data (device type, browser type, IP address for security purposes)</li> */}
              <li>Cookies/local storage for basic site functionality</li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">2. How We Use Information</h2>
            <p className="mb-2">We use collected data to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enable gameplay and process bets</li>
              <li>Display leaderboards and game history</li>
              <li>Improve game performance and user experience</li>
              <li>Prevent abuse, fraud, or malicious activity</li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">3. Sharing of Information</h2>
            <p className="mb-2">We do not sell or trade user data. Information may be shared only:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>With service providers (e.g., analytics, hosting) to maintain functionality</li>
              <li>If required by law or legal process</li>
              <li>In case of a platform security investigation</li>
            </ul>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">4. Blockchain Data</h2>
            <p>Gameplay transactions occur on the Gorbagana testnet (Solana) and are publicly viewable on the blockchain. We do not control or remove on-chain data.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">5. Security</h2>
            <p>We implement industry-standard measures to protect information. However, due to the public nature of blockchains and internet-based services, we cannot guarantee absolute security of your data.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">6. Children’s Privacy</h2>
            <p>Trash Clash is not intended for individuals under 18. If you believe a minor has interacted with the game, please contact us.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with the updated date.</p>
          </section>
          <div className="border-t border-gray-700" />
          <section>
            <h2 className="text-xl font-bold mb-2">8. Contact</h2>
            <p>For questions about this Privacy Policy, reach out via:<br />
              <span className="font-mono text-purple-300">Email: harshsharmaa990@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 