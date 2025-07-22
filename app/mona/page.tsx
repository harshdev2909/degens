"use client"

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

export default function MonaPage() {
  const [txns, setTxns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("https://degens-6q78.onrender.com/api/treasury/transactions").then(res => res.json()),
      fetch("https://degens-6q78.onrender.com/api/treasury/users").then(res => res.json()),
    ]).then(([txns, users]) => {
      setTxns(txns);
      setUsers(users);
      setLoading(false);
    });
  }, []);

  const totalIn = txns.filter(t => t.direction === "in").reduce((sum, t) => sum + t.amount, 0);
  const totalOut = txns.filter(t => t.direction === "out").reduce((sum, t) => sum + t.amount, 0);
  const netPL = totalIn - totalOut;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid mb-4" />
          <div className="text-lg font-bold">Loading Treasury Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Treasury Wallet Monitoring
        </h1>

        {/* Overall Stats */}
        <Card className="bg-gray-900/70 border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-yellow-400">📊</span>
              Overall Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Total In</span>
                <span className="text-2xl font-bold text-green-400">{totalIn} SOL</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Total Out</span>
                <span className="text-2xl font-bold text-red-400">{totalOut} SOL</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Net P/L</span>
                <span className={`text-2xl font-bold ${netPL >= 0 ? "text-green-400" : "text-red-400"}`}>{netPL >= 0 ? "+" : "-"}{Math.abs(netPL)} SOL</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Total Transactions</span>
                <span className="text-2xl font-bold text-blue-400">{txns.length}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm">Total Users</span>
                <span className="text-2xl font-bold text-purple-400">{users.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Wallet className="w-6 h-6 text-yellow-400" />
              Treasury Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signature</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txns.map((txn, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{txn.signature}</TableCell>
                      <TableCell>
                        <Badge className={txn.direction === "in" ? "bg-green-600" : "bg-red-600"}>
                          {txn.direction === "in" ? (
                            <span className="flex items-center gap-1"><ArrowDown className="w-4 h-4" /> IN</span>
                          ) : (
                            <span className="flex items-center gap-1"><ArrowUp className="w-4 h-4" /> OUT</span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className={txn.direction === "in" ? "text-green-400" : "text-red-400"}>
                        {txn.amount} SOL
                      </TableCell>
                      <TableCell className="text-xs text-gray-400">{new Date(txn.date).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{txn.user?.wallet || txn.userWallet}</span>
                        {txn.user?.username && (
                          <span className="ml-2 text-purple-300 font-bold">{txn.user.username}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Monitoring */}
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-blue-400">👤</span>
              User Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Total In</TableHead>
                  <TableHead>Total Out</TableHead>
                  <TableHead>Net P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, i) => {
                  const net = user.totalIn - user.totalOut;
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{user.wallet}</TableCell>
                      <TableCell className="text-purple-300 font-bold">
                        {user.username && user.username.trim() ? user.username : <span className="text-gray-500 italic">No username</span>}
                      </TableCell>
                      <TableCell className="text-green-400">{user.totalIn} SOL</TableCell>
                      <TableCell className="text-red-400">{user.totalOut} SOL</TableCell>
                      <TableCell className={net >= 0 ? "text-green-400" : "text-red-400"}>
                        {net >= 0 ? "+" : "-"}{Math.abs(net)} SOL
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 