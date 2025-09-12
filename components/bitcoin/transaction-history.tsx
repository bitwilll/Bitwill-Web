"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowDownLeft, ArrowUpRight, ExternalLink, RefreshCw, Search } from "lucide-react"
import { formatBTC } from "@/lib/bitcoin/wallet"
import { getAddressTransactions, type Transaction } from "@/lib/bitcoin/api"

interface TransactionHistoryProps {
  wallet: any
  testnet?: boolean
}

export default function TransactionHistory({ wallet, testnet = false }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = async () => {
    if (!wallet?.accounts?.[0]?.address) return

    setIsLoading(true)
    setError(null)

    try {
      const txs = await getAddressTransactions(wallet.accounts[0].address, testnet)
      setTransactions(txs)
    } catch (error) {
      console.error("Error loading transactions:", error)
      setError("Failed to load transaction history")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (wallet?.accounts?.[0]?.address) {
      loadTransactions()
    }
  }, [wallet])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getExplorerUrl = (txid: string) => {
    const baseUrl = testnet ? "https://blockstream.info/testnet/tx/" : "https://blockstream.info/tx/"
    return baseUrl + txid
  }

  const truncateAddress = (address: string) => {
    if (!address) return ""
    return address.substring(0, 8) + "..." + address.substring(address.length - 8)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Transaction History
        </CardTitle>
        <Button variant="outline" size="sm" onClick={loadTransactions} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center p-4">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={loadTransactions} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No Transactions Yet</h3>
            <p className="text-gray-500 mt-1">Transactions will appear here once you send or receive Bitcoin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.txid} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "received" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft
                        className={`w-5 h-5 ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}
                      />
                    ) : (
                      <ArrowUpRight
                        className={`w-5 h-5 ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{tx.type === "received" ? "Received" : "Sent"}</p>
                      <Badge
                        className={`ml-2 ${
                          tx.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">{formatDate(tx.timestamp)}</span>
                      <span>•</span>
                      <span className="ml-2">{truncateAddress(tx.address)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "received" ? "+" : "-"}
                    {formatBTC(Math.abs(tx.amount))} BTC
                  </p>
                  <div className="flex items-center justify-end text-sm text-gray-500">
                    <span className="mr-2">{tx.confirmations} confirmations</span>
                    <a
                      href={getExplorerUrl(tx.txid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
