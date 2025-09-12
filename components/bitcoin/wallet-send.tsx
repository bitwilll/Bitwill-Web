"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Send, AlertTriangle, RefreshCw, CheckCircle, Loader2 } from "lucide-react"
import { formatBTC, toSatoshis, createTransaction } from "@/lib/bitcoin/wallet"
import { getAddressUTXOs, broadcastTransaction, getEstimatedFeeRates, type UTXO } from "@/lib/bitcoin/api"

interface WalletSendProps {
  wallet: any
  balance: number
  onTransactionSent?: (txid: string) => void
  testnet?: boolean
}

export default function WalletSend({ wallet, balance, onTransactionSent, testnet = false }: WalletSendProps) {
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sendAmountSats, setSendAmountSats] = useState(0)
  const [feeRate, setFeeRate] = useState<"slow" | "medium" | "fast">("medium")
  const [feeRates, setFeeRates] = useState({ slow: 1, medium: 5, fast: 10 })
  const [estimatedFee, setEstimatedFee] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [utxos, setUtxos] = useState<UTXO[]>([])

  // Validate Bitcoin address
  const isValidAddress = (address: string): boolean => {
    // Basic validation - in a real app, use a proper Bitcoin address validator
    return (
      address.startsWith("1") ||
      address.startsWith("3") ||
      address.startsWith("bc1") ||
      (testnet &&
        (address.startsWith("m") || address.startsWith("n") || address.startsWith("2") || address.startsWith("tb1")))
    )
  }

  // Update amount in satoshis when BTC amount changes
  const handleAmountChange = (value: string) => {
    setSendAmount(value)

    try {
      const btcAmount = Number.parseFloat(value) || 0
      const sats = toSatoshis(btcAmount)
      setSendAmountSats(sats)

      // Estimate fee based on a simple transaction
      // In a real app, this would be more sophisticated
      const estimatedSize = 250 // bytes
      const feeRateValue = feeRates[feeRate]
      const fee = estimatedSize * feeRateValue
      setEstimatedFee(fee)
    } catch (e) {
      setSendAmountSats(0)
      setEstimatedFee(0)
    }
  }

  // Load UTXOs and fee rates
  const loadTransactionData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get fee rates
      const rates = await getEstimatedFeeRates()
      setFeeRates(rates)

      // Get UTXOs
      const addressUtxos = await getAddressUTXOs(wallet.accounts[0].address, testnet)
      setUtxos(addressUtxos)

      // Estimate fee based on UTXOs
      const estimatedSize = 150 + addressUtxos.length * 100 // rough estimate
      const feeRateValue = rates[feeRate]
      const fee = estimatedSize * feeRateValue
      setEstimatedFee(fee)
    } catch (error) {
      console.error("Error loading transaction data:", error)
      setError("Failed to load transaction data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Send transaction
  const sendTransaction = async () => {
    // Validate inputs
    if (!sendAddress || !sendAmount || !isValidAddress(sendAddress)) {
      setError("Please enter a valid Bitcoin address and amount")
      return
    }

    if (sendAmountSats <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (sendAmountSats + estimatedFee > balance) {
      setError("Insufficient balance including fees")
      return
    }

    setIsSending(true)
    setError(null)
    setSuccess(null)

    try {
      // Create and sign transaction
      const feeRateValue = feeRates[feeRate]
      const txHex = createTransaction(
        wallet.accounts[0],
        sendAddress,
        sendAmountSats,
        feeRateValue,
        utxos,
        testnet ? wallet.network : undefined,
      )

      // Broadcast transaction
      const txid = await broadcastTransaction(txHex, testnet)

      setSuccess(`Transaction sent successfully! TXID: ${txid}`)

      // Reset form
      setSendAddress("")
      setSendAmount("")
      setSendAmountSats(0)

      // Notify parent component
      if (onTransactionSent) {
        onTransactionSent(txid)
      }
    } catch (error) {
      console.error("Error sending transaction:", error)
      setError(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Send Bitcoin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipient Address */}
        <div>
          <Label htmlFor="send-address">Recipient Address</Label>
          <Input
            id="send-address"
            placeholder="Enter Bitcoin address"
            value={sendAddress}
            onChange={(e) => setSendAddress(e.target.value)}
            className={!sendAddress || isValidAddress(sendAddress) ? "" : "border-red-500"}
          />
          {sendAddress && !isValidAddress(sendAddress) && (
            <p className="text-sm text-red-500 mt-1">Invalid Bitcoin address</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="send-amount">Amount (BTC)</Label>
          <div className="relative">
            <Input
              id="send-amount"
              type="number"
              step="0.00000001"
              placeholder="0.00000000"
              value={sendAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sm text-gray-500">BTC</span>
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">Available: {formatBTC(balance)} BTC</p>
            <p className="text-sm text-gray-500">≈ ${(Number.parseFloat(sendAmount) || 0) * 45000} USD</p>
          </div>
        </div>

        {/* Fee Selection */}
        <div>
          <Label>Transaction Fee</Label>
          <RadioGroup
            value={feeRate}
            onValueChange={(value) => {
              setFeeRate(value as "slow" | "medium" | "fast")

              // Update estimated fee
              const estimatedSize = 250 // bytes
              const feeRateValue = feeRates[value as "slow" | "medium" | "fast"]
              const fee = estimatedSize * feeRateValue
              setEstimatedFee(fee)
            }}
            className="flex mt-2"
          >
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="slow" id="fee-slow" />
              <Label htmlFor="fee-slow" className="cursor-pointer">
                Slow
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="medium" id="fee-medium" />
              <Label htmlFor="fee-medium" className="cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="fast" id="fee-fast" />
              <Label htmlFor="fee-fast" className="cursor-pointer">
                Fast
              </Label>
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-3">
            <span className="text-sm text-gray-600">Network Fee</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">{formatBTC(estimatedFee)} BTC</span>
              <Badge className="bg-blue-100 text-blue-800">{feeRates[feeRate]} sat/byte</Badge>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
          <span className="font-medium">Total Amount</span>
          <span className="font-bold">{formatBTC(sendAmountSats + estimatedFee)} BTC</span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadTransactionData} disabled={isLoading || isSending} className="flex-1">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>

          <Button
            onClick={sendTransaction}
            disabled={
              !sendAddress ||
              !sendAmount ||
              !isValidAddress(sendAddress) ||
              sendAmountSats <= 0 ||
              sendAmountSats + estimatedFee > balance ||
              isLoading ||
              isSending
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Send Bitcoin
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
