"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Download, QrCode, Plus, Wallet } from "lucide-react"
import { generateAddressQR, createWalletFromMnemonic } from "@/lib/bitcoin/wallet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WalletReceiveProps {
  wallet: any
  onWalletUpdate?: (updatedWallet: any) => void
}

export default function WalletReceive({ wallet, onWalletUpdate }: WalletReceiveProps) {
  const [activeAccount, setActiveAccount] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [pubKeyQrUrl, setPubKeyQrUrl] = useState<string>("")
  const [branch, setBranch] = useState<number>(0) // derivation path branch (0 external,1 internal)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const walletAccount = wallet?.accounts?.[activeAccount]
  const walletAddress = walletAccount?.address || ""
  const publicKey = walletAccount?.publicKey || ""

  useEffect(() => {
    if (publicKey) {
      generatePubKeyQr()
    }
  }, [walletAddress, publicKey])

  const generateQrCode = async () => {
    try {
      const qrUrl = await generateAddressQR(walletAddress)
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const generatePubKeyQr = async () => {
    try {
      const qrUrl = await generateAddressQR(publicKey)
      setPubKeyQrUrl(qrUrl)
    } catch (error) {
      console.error("Error generating public key QR code:", error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQrCode = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `bitcoin-address-${walletAddress.substring(0, 8)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateNewAddress = async () => {
    if (!wallet?.mnemonic) return

    setIsGenerating(true)
    try {
      // Generate a new wallet with one additional account
      const newWallet = await createWalletFromMnemonic(
        wallet.mnemonic,
        wallet.network,
        wallet.accounts.length + 1
      )

      // Update the wallet with the new account
      if (onWalletUpdate) {
        onWalletUpdate(newWallet)
      }

      // Set the active account to the newly generated one
      setActiveAccount(newWallet.accounts.length - 1)
    } catch (error) {
      console.error("Error generating new address:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle branch change (derivation path m/44'/0'/0'/{branch}/{index})
  const handleBranchChange = async (newBranch: number) => {
    if (branch === newBranch || !wallet?.mnemonic) return
    setBranch(newBranch)
    // regenerate wallet accounts for demo purposes
    const newWallet = await createWalletFromMnemonic(wallet.mnemonic, wallet.network, wallet.accounts.length)
    if (onWalletUpdate) onWalletUpdate(newWallet)
    setActiveAccount(0)
  }

  return (
    <div className="space-y-6">
      {/* Address Navigation Pane */}
    <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Your Addresses
        </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewAddress}
              disabled={isGenerating}
              className="h-7 px-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              {isGenerating ? "..." : "New Address"}
            </Button>
          </div>
      </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 p-2">
              {wallet?.accounts?.map((account: any, index: number) => (
                <Button
                  key={index}
                  variant={activeAccount === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveAccount(index)}
                  className={`whitespace-nowrap font-mono text-xs ${
                    activeAccount === index ? "bg-blue-600" : "hover:bg-gray-100"
                  }`}
                >
                  Address {index + 1}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Address Details & Derivation Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Receive Bitcoin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Derivation Path Selector */}
        <div>
          <Label>Derivation Path Branch</Label>
          <div className="flex space-x-2 mt-2">
            {[0, 1].map((b) => (
              <Button
                key={b}
                variant={branch === b ? "default" : "outline"}
                size="sm"
                onClick={() => handleBranchChange(b)}
                className="font-mono text-xs"
              >
                {`m/44'/0'/0'/${b}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Bitcoin Address */}
        <div>
          <Label>Your Bitcoin Address</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input value={walletAddress} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className={copied ? "bg-green-50 text-green-600 border-green-200" : ""}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {copied && <p className="text-sm text-green-600 mt-1">Address copied to clipboard!</p>}
        </div>

        {/* Address QR Code */}
        <div className="flex justify-center p-6 bg-white rounded-lg border">
          {qrCodeUrl ? (
            <div className="flex flex-col items-center">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="Bitcoin Address QR Code" className="w-48 h-48" />
              <p className="text-xs text-gray-500 mt-2 text-center break-all max-w-[200px]">{walletAddress}</p>
            </div>
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Loading QR Code...</span>
            </div>
          )}
        </div>

        {/* Public Key & QR */}
        <div className="border-t pt-4 space-y-3">
          <Label>Full Public Key</Label>
          <div className="flex items-center space-x-2">
            <Input value={publicKey} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(publicKey)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {/* Public Key QR */}
          <div className="flex justify-center p-4 bg-white rounded-lg border">
            {pubKeyQrUrl ? (
              <img src={pubKeyQrUrl} alt="Public Key QR" className="w-40 h-40" />
            ) : (
              <span className="text-gray-400">Loading QR...</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" onClick={downloadQrCode} disabled={!qrCodeUrl}>
            <Download className="w-4 h-4 mr-2" />
            Download QR
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </Button>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            Send Bitcoin to this address to receive funds in your wallet. Always double-check the address before
            sending.
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
