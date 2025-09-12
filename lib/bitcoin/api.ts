// Mock Bitcoin API for demonstration purposes

export interface UTXO {
  txid: string
  vout: number
  value: number
  status: {
    confirmed: boolean
    block_height?: number
    block_hash?: string
    block_time?: number
  }
  scriptPubKey: string
}

export interface Transaction {
  id: string
  type: "sent" | "received"
  amount: number
  address: string
  timestamp: string
  confirmations: number
  status: "pending" | "confirmed"
  txid: string
  fee?: number
}

/**
 * Get mock balance for demonstration
 */
export async function getAddressBalance(address: string, testnet = false): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock balance based on address
  const mockBalance = 5847392 // satoshis
  return mockBalance
}

/**
 * Get mock UTXOs for demonstration
 */
export async function getAddressUTXOs(address: string, testnet = false): Promise<UTXO[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      txid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
      vout: 0,
      value: 1234567,
      status: {
        confirmed: true,
        block_height: 800000,
        block_hash: "000000000000000000000000000000000000000000000000000000000000000a",
        block_time: Math.floor(Date.now() / 1000) - 86400,
      },
      scriptPubKey: "0014d85c2b71d0060b09c9886aeb815e50991dda124d",
    },
    {
      txid: "c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6",
      vout: 1,
      value: 4612825,
      status: {
        confirmed: true,
        block_height: 799900,
        block_hash: "000000000000000000000000000000000000000000000000000000000000000b",
        block_time: Math.floor(Date.now() / 1000) - 172800,
      },
      scriptPubKey: "0014d85c2b71d0060b09c9886aeb815e50991dda124d",
    },
  ]
}

/**
 * Get mock transaction history
 */
export async function getAddressTransactions(address: string, testnet = false): Promise<Transaction[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return [
    {
      id: "tx1",
      type: "received",
      amount: 1234567,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      timestamp: "2024-01-15T10:30:00Z",
      confirmations: 6,
      status: "confirmed",
      txid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    },
    {
      id: "tx2",
      type: "sent",
      amount: -567890,
      address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      timestamp: "2024-01-14T15:45:00Z",
      confirmations: 12,
      status: "confirmed",
      txid: "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    },
    {
      id: "tx3",
      type: "received",
      amount: 4612825,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      timestamp: "2024-01-13T09:15:00Z",
      confirmations: 24,
      status: "confirmed",
      txid: "c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6",
    },
  ]
}

/**
 * Mock broadcast transaction
 */
export async function broadcastTransaction(txHex: string, testnet = false): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate mock transaction ID
  const mockTxId = "d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6"
  return mockTxId
}

/**
 * Get current Bitcoin price
 */
export async function getBitcoinPrice(): Promise<number> {
  try {
    // Try to fetch real price, fallback to mock
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    if (response.ok) {
      const data = await response.json()
      return data.bitcoin.usd
    }
  } catch (error) {
    console.log("Using mock Bitcoin price")
  }

  // Fallback mock price
  return 45000
}

/**
 * Get estimated fee rates
 */
export async function getEstimatedFeeRates(): Promise<{ slow: number; medium: number; fast: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock fee rates in sat/byte
  return {
    slow: 1,
    medium: 5,
    fast: 10,
  }
}

/**
 * Format USD value
 */
export function formatUSD(btcAmount: number, btcPrice: number): string {
  return (btcAmount * btcPrice).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}
