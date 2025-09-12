"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bitcoin, Wallet, Plus, Settings, Shield, Clock, RefreshCw, AlertTriangle, CheckCircle, Copy } from "lucide-react"
import Navigation from "@/components/navigation"
import SeedPhraseGenerator from "@/components/bitcoin/seed-phrase-generator"
import WalletSend from "@/components/bitcoin/wallet-send"
import WalletReceive from "@/components/bitcoin/wallet-receive"
import TransactionHistory from "@/components/bitcoin/transaction-history"
import { formatBTC } from "@/lib/bitcoin/wallet"
import { getAddressBalance, getBitcoinPrice, formatUSD } from "@/lib/bitcoin/api"
import { generateAddressQR } from "@/lib/bitcoin/wallet"

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [btcPrice, setBtcPrice] = useState(45000)
  const [isLoading, setIsLoading] = useState(false)
  const [showSeedGenerator, setShowSeedGenerator] = useState(false)
  const [showWalletRecover, setShowWalletRecover] = useState(false)
  const [recoveryStatus, setRecoveryStatus] = useState<"idle" | "recovering" | "success" | "error">("idle")
  const [pubKeyQr, setPubKeyQr] = useState<string>("")

  // Load wallet from localStorage on component mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("bitwill-wallet")
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet)
        setWallet(parsedWallet)
        loadWalletData(parsedWallet)
      } catch (error) {
        console.error("Error loading saved wallet:", error)
      }
    }
  }, [])

  // Generate QR for first account public key whenever wallet changes
  useEffect(() => {
    const gen = async () => {
      if (wallet?.accounts?.[0]?.publicKey) {
        const url = await generateAddressQR(wallet.accounts[0].publicKey)
        setPubKeyQr(url)
      }
    }
    gen()
  }, [wallet])

  // Load wallet balance and Bitcoin price
  const loadWalletData = async (walletData: any) => {
    if (!walletData?.accounts?.[0]?.address) return

    setIsLoading(true)
    try {
      const [walletBalance, currentPrice] = await Promise.all([
        getAddressBalance(walletData.accounts[0].address),
        getBitcoinPrice(),
      ])

      setBalance(walletBalance)
      setBtcPrice(currentPrice)
    } catch (error) {
      console.error("Error loading wallet data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle wallet creation from seed phrase
  const handleWalletCreated = (newWallet: any) => {
    setWallet(newWallet)
    setShowSeedGenerator(false)
    setShowWalletRecover(false)
    setRecoveryStatus("success")

    // Save wallet to localStorage (in production, this should be encrypted)
    localStorage.setItem("bitwill-wallet", JSON.stringify(newWallet))

    // Load wallet data
    loadWalletData(newWallet)

    // Show success message
    setTimeout(() => {
      setRecoveryStatus("idle")
    }, 3000)
  }

  // Handle transaction sent
  const handleTransactionSent = (txid: string) => {
    // Refresh wallet data after transaction
    if (wallet) {
      setTimeout(() => {
        loadWalletData(wallet)
      }, 2000)
    }
  }

  // Reset wallet (for demo purposes)
  const resetWallet = () => {
    localStorage.removeItem("bitwill-wallet")
    setWallet(null)
    setBalance(0)
    setShowSeedGenerator(false)
    setShowWalletRecover(false)
  }

  if (!wallet && !showSeedGenerator && !showWalletRecover) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Bitcoin Wallet</h1>
              <p className="text-xl text-gray-600">
                Get started with a secure, self-custodial Bitcoin wallet powered by industry-standard encryption.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <Plus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create New Wallet</h3>
                  <p className="text-gray-600 mb-4">Generate a new seed phrase and create a fresh Bitcoin wallet</p>
                  <Button onClick={() => setShowSeedGenerator(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Create New Wallet
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Recover Existing</h3>
                  <p className="text-gray-600 mb-4">Restore your wallet using an existing seed phrase</p>
                  <Button onClick={() => setShowWalletRecover(true)} variant="outline" className="w-full">
                    Recover Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Demo Wallet Notice</h3>
                  <p className="text-yellow-800 text-sm">
                    This is a demonstration wallet for testing purposes. Do not use for real Bitcoin transactions. The
                    wallet uses mock data and simplified cryptography.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showSeedGenerator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setShowSeedGenerator(false)} className="mb-4">
                ← Back
              </Button>
            </div>

            <SeedPhraseGenerator onWalletCreated={handleWalletCreated} />
          </div>
        </div>
      </div>
    )
  }

  if (showWalletRecover) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => setShowWalletRecover(false)} className="mb-4">
                ← Back
              </Button>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Recover Your Bitcoin Wallet</h1>
                <p className="text-xl text-gray-600">
                  Enter your existing seed phrase to restore your Bitcoin wallet and access your funds.
                </p>
              </div>
            </div>

            {recoveryStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800">Wallet recovered successfully!</p>
                </div>
              </div>
            )}

            <SeedPhraseGenerator onWalletCreated={handleWalletCreated} defaultMode="import" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Wallet Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="w-8 h-8" />
                    <CardTitle className="text-2xl">Bitcoin Wallet</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/20 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadWalletData(wallet)}
                      disabled={isLoading}
                      className="text-white hover:bg-white/20"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-orange-100 text-sm">Total Balance</p>
                    <p className="text-4xl font-bold">{formatBTC(balance)} BTC</p>
                    <p className="text-orange-100 text-lg">{formatUSD(balance / 100000000, btcPrice)}</p>
                  </div>
                  <div className="text-sm text-orange-100">
                    <p>Address: {wallet?.accounts?.[0]?.address?.substring(0, 20)}...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Actions */}
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="send">Send Bitcoin</TabsTrigger>
                <TabsTrigger value="receive">Receive Bitcoin</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>

              <TabsContent value="send" className="space-y-4">
                <WalletSend
                  wallet={wallet}
                  balance={balance}
                  onTransactionSent={handleTransactionSent}
                  testnet={false}
                />
              </TabsContent>

              <TabsContent value="receive" className="space-y-4">
                <WalletReceive wallet={wallet} onWalletUpdate={handleWalletCreated} />
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <TransactionHistory wallet={wallet} testnet={false} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Wallet Type</span>
                  <Badge className="bg-green-100 text-green-800">HD Wallet</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Seed Phrase</span>
                  <Badge className="bg-green-100 text-green-800">Secured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network</span>
                  <Badge className="bg-blue-100 text-blue-800">Bitcoin Mainnet</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Accounts</span>
                  <span className="text-sm font-medium">{wallet?.accounts?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-600">Derivation Path</p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">{wallet?.accounts?.[0]?.path || "N/A"}</p>
                </div>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-gray-600">Public Key</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all flex-1 overflow-x-auto">
                      {wallet?.accounts?.[0]?.publicKey || "N/A"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(wallet?.accounts?.[0]?.publicKey || "")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {pubKeyQr && (
                    <div className="flex justify-center">
                      <img src={pubKeyQr} alt="Public Key QR" className="w-32 h-32" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Demo Actions */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Demo Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={resetWallet}
                >
                  Reset Demo Wallet
                </Button>
                <p className="text-xs text-yellow-700">
                  This will clear the demo wallet and allow you to create a new one.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
