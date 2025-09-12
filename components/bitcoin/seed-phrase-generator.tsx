"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateMnemonic, validateMnemonic, createWalletFromMnemonic } from "@/lib/bitcoin/wallet"
import { RefreshCw, Copy, Eye, EyeOff, AlertTriangle, CheckCircle, Download, Lock, Upload, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import CryptoJS from 'crypto-js'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeSVG } from 'qrcode.react'
import jsPDF from 'jspdf'
import { svg2pdf } from 'svg2pdf.js'

interface SeedPhraseGeneratorProps {
  onSeedGenerated?: (seed: string) => void
  onWalletCreated?: (wallet: any) => void
  defaultMode?: "generate" | "import"
}

export default function SeedPhraseGenerator({ onSeedGenerated, onWalletCreated, defaultMode = "generate" }: SeedPhraseGeneratorProps) {
  const [seedPhrase, setSeedPhrase] = useState<string[]>([])
  const [showSeed, setShowSeed] = useState<boolean>(false)
  const [seedStrength, setSeedStrength] = useState<number>(128) // 128, 160, 192, 224, or 256 bits
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [seedVerified, setSeedVerified] = useState<boolean>(false)
  const [verificationWords, setVerificationWords] = useState<{ word: string; index: number }[]>([])
  const [verificationInput, setVerificationInput] = useState<string[]>(["", "", ""])
  const [verificationError, setVerificationError] = useState<boolean>(false)
  const [mode, setMode] = useState<"generate" | "import">(defaultMode)
  const [importSeed, setImportSeed] = useState("")
  const [importError, setImportError] = useState("")
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveryProgress, setRecoveryProgress] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [challengeWords, setChallengeWords] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>([])
  const [useCustomNonce, setUseCustomNonce] = useState(false)
  const [customNonce, setCustomNonce] = useState('')
  const [nonceComplexity, setNonceComplexity] = useState(1)
  const [nonceIterations, setNonceIterations] = useState(1)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [backupPassword, setBackupPassword] = useState('')
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [backupError, setBackupError] = useState('')
  const [backupSuccess, setBackupSuccess] = useState(false)
  const [recoveryFile, setRecoveryFile] = useState<File | null>(null)
  const [recoveryPassword, setRecoveryPassword] = useState('')
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [recoveryError, setRecoveryError] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPassword, setImportPassword] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")
  const [showQR, setShowQR] = useState(false)
  const [qrPassword, setQrPassword] = useState('')
  const [qrEncrypted, setQrEncrypted] = useState('')
  const [qrError, setQrError] = useState('')
  const [qrDecrypted, setQrDecrypted] = useState('')
  const [qrScanInput, setQrScanInput] = useState('')
  const [qrScanPassword, setQrScanPassword] = useState('')
  const [qrScanResult, setQrScanResult] = useState('')

  // Generate a new seed phrase
  const handleGenerateSeed = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate entropy gathering
    for (let i = 1; i <= 10; i++) {
      setProgress(i * 10)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    try {
      const newSeed = await generateMnemonic(
        seedStrength,
        useCustomNonce ? customNonce : undefined,
        nonceComplexity,
        nonceIterations
      )
      setSeedPhrase(newSeed.split(' '))
      setProgress(100)
      setSeedVerified(false)

      if (onSeedGenerated) {
        onSeedGenerated(newSeed)
      }

      // Setup verification challenge
      setupVerificationChallenge(newSeed)
    } catch (error) {
      console.error("Error generating seed phrase:", error)
      // Show error to user
      toast.error(error instanceof Error ? error.message : "Failed to generate seed phrase. Please try again.")
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  // Setup verification challenge with random words from the seed
  const setupVerificationChallenge = (seed: string) => {
    const words = seed.split(" ")
    const indices: number[] = []

    // Get 3 unique random indices
    while (indices.length < 3) {
      const idx = Math.floor(Math.random() * words.length)
      if (!indices.includes(idx)) {
        indices.push(idx)
      }
    }

    // Sort indices in ascending order
    indices.sort((a, b) => a - b)

    // Create verification words
    const verifyWords = indices.map((index) => ({
      word: words[index],
      index: index + 1, // 1-based index for user display
    }))

    setVerificationWords(verifyWords)
    setVerificationInput(["", "", ""])
    setVerificationError(false)
  }

  // Verify the user has backed up their seed phrase
  const verifySeedBackup = () => {
    const isCorrect = verificationWords.every(
      (item, idx) => item.word.toLowerCase() === verificationInput[idx].toLowerCase().trim(),
    )

    if (isCorrect) {
      setSeedVerified(true)
      setVerificationError(false)
    } else {
      setVerificationError(true)
    }
  }

  // Handle wallet recovery
  const handleWalletRecovery = async () => {
    const trimmedSeed = importSeed.trim()
    
    // Basic validation
    if (!trimmedSeed) {
      setImportError("Please enter your seed phrase")
      return
    }

    // Check word count
    const wordCount = trimmedSeed.split(/\s+/).length
    if (wordCount !== 12 && wordCount !== 24) {
      setImportError("Seed phrase must be 12 or 24 words")
      return
    }

    setIsRecovering(true)
    setRecoveryProgress(0)
    setImportError("")

    try {
      // Simulate progress for better UX
      for (let i = 1; i <= 5; i++) {
        setRecoveryProgress(i * 20)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Validate mnemonic
      if (!validateMnemonic(trimmedSeed)) {
        throw new Error("Invalid seed phrase. Please check your words and try again.")
      }

      // Create wallet from seed
      const wallet = await createWalletFromMnemonic(trimmedSeed, undefined, 3)
      
      if (onWalletCreated) {
        onWalletCreated(wallet)
      }
    } catch (error) {
      console.error("Error recovering wallet:", error)
      setImportError(error instanceof Error ? error.message : "Failed to recover wallet. Please try again.")
    } finally {
      setIsRecovering(false)
      setRecoveryProgress(0)
    }
  }

  // Create wallet from seed phrase
  const createWallet = async () => {
    if (!seedPhrase.join(' ').trim() || !validateMnemonic(seedPhrase.join(' '))) {
      return
    }

    setIsCreatingWallet(true)

    try {
      // Create wallet with 3 accounts
      const wallet = await createWalletFromMnemonic(seedPhrase.join(' '), undefined, 3)

      if (onWalletCreated) {
        onWalletCreated(wallet)
      }
    } catch (error) {
      console.error("Error creating wallet:", error)
    } finally {
      setIsCreatingWallet(false)
    }
  }

  // Copy seed phrase to clipboard
  const copySeedToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '))
      setShowCopySuccess(true)
      // Hide success message after 2 seconds
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy seed phrase:', error)
      alert('Failed to copy seed phrase. Please try again.')
    }
  }

  // Download seed phrase as text file
  const downloadSeedPhrase = () => {
    const numberedSeedPhrase = seedPhrase
      .map((word, index) => `${(index + 1).toString().padStart(2, '0')}. ${word}`)
      .join('\n')

    const element = document.createElement("a")
    const file = new Blob(
      [
        "BITCOIN SEED PHRASE - KEEP SECURE\n\n" +
          numberedSeedPhrase +
          "\n\n" +
          "Created: " +
          new Date().toISOString() +
          "\n" +
          "WARNING: Anyone with access to this seed phrase can access your funds.\n" +
          "Store securely offline and never share with anyone.",
      ],
      { type: "text/plain" },
    )

    element.href = URL.createObjectURL(file)
    element.download = "bitcoin-seed-backup.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Backup wallet (download encrypted seed phrase)
  const handleBackupWallet = () => {
    setShowBackupModal(true)
    setBackupPassword('')
    setBackupError('')
    setBackupSuccess(false)
  }

  const handleDownloadBackup = () => {
    if (!backupPassword || backupPassword.length < 6) {
      setBackupError('Password must be at least 6 characters.')
      return
    }
    try {
      const encrypted = CryptoJS.AES.encrypt(seedPhrase.join(' '), backupPassword).toString()
      const backupData = {
        type: 'bitwill-wallet-backup',
        created: new Date().toISOString(),
        encryptedSeed: encrypted
      }
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bitwill-wallet-backup.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setBackupSuccess(true)
      setShowBackupModal(false)
    } catch (e) {
      setBackupError('Failed to create backup. Please try again.')
    }
  }

  const handleRecoveryFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRecoveryFile(file)
      setShowRecoveryModal(true)
    }
  }

  const handleRecoverySubmit = async () => {
    if (!recoveryFile) return

    setIsRecovering(true)
    setRecoveryError('')

    try {
      const text = await recoveryFile.text()
      let decryptedText = text

      // Check if the file is encrypted (contains "ENCRYPTED:" prefix)
      if (text.startsWith('ENCRYPTED:')) {
        if (!recoveryPassword) {
          setRecoveryError('Password is required for encrypted backup')
          setIsRecovering(false)
          return
        }

        try {
          // Remove the "ENCRYPTED:" prefix and decrypt
          const encryptedData = text.replace('ENCRYPTED:', '')
          const bytes = CryptoJS.AES.decrypt(encryptedData, recoveryPassword)
          decryptedText = bytes.toString(CryptoJS.enc.Utf8)

          if (!decryptedText) {
            throw new Error('Invalid password')
          }
        } catch (error) {
          setRecoveryError('Invalid password or corrupted backup file')
          setIsRecovering(false)
          return
        }
      }

      // Parse the seed phrase from the decrypted text
      const words = decryptedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
          // Handle numbered format (e.g., "01. word")
          const match = line.match(/^\d+\.\s*(.+)$/)
          return match ? match[1] : line
        })

      if (words.length !== 12) {
        throw new Error('Invalid seed phrase format')
      }

      if (!validateMnemonic(words.join(' '))) {
        throw new Error('Invalid seed phrase')
      }

      setSeedPhrase(words)
      setShowRecoveryModal(false)
      setRecoveryError('')
      setRecoveryPassword('')
      setRecoveryFile(null)
      toast.success('Wallet recovered successfully')
    } catch (error) {
      setRecoveryError(error instanceof Error ? error.message : 'Failed to recover wallet')
    } finally {
      setIsRecovering(false)
    }
  }

  const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
      setShowImportModal(true)
    }
  }

  const handleImportSubmit = async () => {
    if (!importFile) return

    setIsImporting(true)
    setImportError('')

    try {
      const text = await importFile.text()
      let decryptedText = text
      let seedPhrase = ''

      // Check if it's a JSON backup file (encrypted format)
      if (text.trim().startsWith('{')) {
        try {
          const backupData = JSON.parse(text)
          
          if (backupData.type === 'bitwill-wallet-backup' && backupData.encryptedSeed) {
            if (!importPassword) {
              setImportError('Password is required for encrypted backup')
              setIsImporting(false)
              return
            }

            // Decrypt the seed phrase
            const bytes = CryptoJS.AES.decrypt(backupData.encryptedSeed, importPassword)
            decryptedText = bytes.toString(CryptoJS.enc.Utf8)

            if (!decryptedText) {
              throw new Error('Invalid password')
            }
            
            seedPhrase = decryptedText
          } else {
            throw new Error('Invalid backup file format')
          }
        } catch (error) {
          if (error instanceof SyntaxError) {
            setImportError('Invalid backup file format')
          } else if (error instanceof Error && error.message === 'Invalid password') {
            setImportError('Invalid password. Please check your password and try again.')
          } else {
            setImportError(error instanceof Error ? error.message : 'Failed to decrypt backup file')
          }
          setIsImporting(false)
          return
        }
      } else {
        // Handle plain text file (check for ENCRYPTED: prefix for legacy format)
        if (text.startsWith('ENCRYPTED:')) {
          if (!importPassword) {
            setImportError('Password is required for encrypted backup')
            setIsImporting(false)
            return
          }

          try {
            const encryptedData = text.replace('ENCRYPTED:', '')
            const bytes = CryptoJS.AES.decrypt(encryptedData, importPassword)
            decryptedText = bytes.toString(CryptoJS.enc.Utf8)

            if (!decryptedText) {
              throw new Error('Invalid password')
            }
          } catch (error) {
            setImportError('Invalid password or corrupted backup file')
            setIsImporting(false)
            return
          }
        }

        // Parse the seed phrase from the decrypted/plain text
        const words = decryptedText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('BITCOIN SEED PHRASE') && !line.startsWith('Created:') && !line.startsWith('WARNING:'))
          .map(line => {
            // Handle numbered format (e.g., "01. word")
            const match = line.match(/^\d+\.\s*(.+)$/)
            return match ? match[1] : line
          })
          .filter(word => word && word.length > 0)

        if (words.length === 1) {
          // If all words are in one line, split by spaces
          seedPhrase = words[0]
        } else {
          seedPhrase = words.join(' ')
        }
      }

      // Validate the seed phrase
      const wordArray = seedPhrase.split(/\s+/).filter(w => w.length > 0)
      
      if (wordArray.length !== 12 && wordArray.length !== 24) {
        throw new Error(`Invalid seed phrase length: ${wordArray.length} words. Expected 12 or 24 words.`)
      }

      if (!validateMnemonic(seedPhrase)) {
        throw new Error('Invalid seed phrase. Please check the backup file and try again.')
      }

      // Create wallet directly from the backup
      const wallet = await createWalletFromMnemonic(seedPhrase, undefined, 3)
      
      if (onWalletCreated) {
        onWalletCreated(wallet)
      }

      setShowImportModal(false)
      setImportError('')
      setImportPassword('')
      setImportFile(null)
      toast.success('Wallet restored successfully from backup!')
    } catch (error) {
      console.error('Import error:', error)
      setImportError(error instanceof Error ? error.message : 'Failed to import wallet from backup file')
    } finally {
      setIsImporting(false)
    }
  }

  // Encrypt seed phrase with password and return base64 string
  async function encryptSeedPhraseToQR(seedPhrase: string, password: string): Promise<string> {
    if (!password) throw new Error('Password required for encryption')
    if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('Web Crypto API not available')
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt'])
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(seedPhrase))
    // Compose as base64: salt:iv:ciphertext
    return [
      btoa(String.fromCharCode(...salt)),
      btoa(String.fromCharCode(...iv)),
      btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    ].join(':')
  }

  // Decrypt base64 QR code data with password
  async function decryptSeedPhraseFromQR(qrData: string, password: string): Promise<string> {
    if (!password) throw new Error('Password required for decryption')
    if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('Web Crypto API not available')
    const [saltB64, ivB64, cipherB64] = qrData.split(':')
    if (!saltB64 || !ivB64 || !cipherB64) throw new Error('Invalid QR data format')
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0))
    const cipher = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0))
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)
    return new TextDecoder().decode(decrypted)
  }

  // Handler to generate encrypted QR code
  const handleGenerateQR = async () => {
    setQrError('')
    setShowQR(false)
    setQrEncrypted('')
    setQrDecrypted('')
    try {
      if (!seedPhrase.length) throw new Error('Generate a seed phrase first')
      if (!qrPassword) throw new Error('Enter a password to encrypt the QR code')
      const encrypted = await encryptSeedPhraseToQR(seedPhrase.join(' '), qrPassword)
      setQrEncrypted(encrypted)
      setShowQR(true)
    } catch (e: any) {
      setQrError(e.message)
    }
  }

  // Handler to decrypt QR code data
  const handleDecryptQR = async () => {
    setQrError('')
    setQrScanResult('')
    try {
      if (!qrScanInput) throw new Error('Paste QR code data to decrypt')
      if (!qrScanPassword) throw new Error('Enter password to decrypt')
      const decrypted = await decryptSeedPhraseFromQR(qrScanInput, qrScanPassword)
      setQrScanResult(decrypted)
    } catch (e: any) {
      setQrError(e.message)
    }
  }

  // Download QR code as vector PDF
  const downloadQRCodePDF = () => {
    if (!qrEncrypted) return
    const svg = document.querySelector('.qr-code-svg-download svg') as SVGSVGElement | null
    if (!svg) {
      toast.error('QR code SVG not found')
      return
    }
    // Create a jsPDF instance
    const pdf = new jsPDF({ unit: 'pt', format: [300, 300] })
    // Use jsPDF's .svg() method to render SVG into PDF
    pdf.svg(svg, { x: 40, y: 40, width: 220, height: 220 }).then(() => {
      pdf.save(`bitcoin-seed-qr-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('QR code PDF downloaded!')
    }).catch(() => {
      toast.error('Failed to render QR code in PDF')
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          {defaultMode === "import" ? "Bitcoin Wallet Recovery" : "Bitcoin Seed Phrase Generator"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Warning */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Important Security Notice</h3>
              <p className="text-yellow-800 text-sm">
                Your seed phrase is the master key to your Bitcoin wallet. Anyone with access to it can control your
                funds. Store it securely offline and never share it with anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={mode === "generate" ? "default" : "outline"}
            onClick={() => setMode("generate")}
            className="flex-1"
          >
            Generate New
          </Button>
          <Button
            variant={mode === "import" ? "default" : "outline"}
            onClick={() => setMode("import")}
            className="flex-1"
          >
            Import Existing
          </Button>
        </div>

        {/* Import Mode */}
        {mode === "import" && (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="file">Backup File</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div>
                  <Label htmlFor="import-seed">Enter Your Seed Phrase</Label>
                  <textarea
                    id="import-seed"
                    placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
                    value={importSeed}
                    onChange={(e) => {
                      setImportSeed(e.target.value)
                      setImportError("")
                    }}
                    className="w-full p-3 border rounded-md font-mono text-sm h-24 resize-none"
                    disabled={isRecovering}
                  />
                  {importError && <p className="text-sm text-red-500 mt-1">{importError}</p>}
                </div>

                {isRecovering && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Recovering wallet...</span>
                      <span>{recoveryProgress}%</span>
                    </div>
                    <Progress value={recoveryProgress} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={handleWalletRecovery} 
                  disabled={isRecovering || !importSeed.trim()}
                  className="w-full"
                >
                  {isRecovering ? "Recovering Wallet..." : "Recover Wallet"}
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div>
                  <Label htmlFor="backup-file">Select Backup File</Label>
                  <div className="mt-2">
                    <input
                      id="backup-file"
                      type="file"
                      accept=".json,.txt"
                      onChange={handleImportFileSelect}
                      className="w-full p-3 border rounded-md text-sm"
                      disabled={isImporting}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports encrypted JSON backups or plain text seed files
                  </p>
                </div>

                {importFile && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{importFile.name}</span>
                      <span className="text-xs text-gray-500">({(importFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  </div>
                )}

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing backup file...</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                )}

                {importError && <p className="text-sm text-red-500">{importError}</p>}

                <Button 
                  onClick={() => setShowImportModal(true)} 
                  disabled={!importFile || isImporting}
                  className="w-full"
                >
                  {isImporting ? "Processing..." : "Restore from Backup"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {mode === "generate" && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Security Level</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSeedStrength(128)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      seedStrength === 128
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    12 Words (128 bits)
                  </button>
                  <button
                    onClick={() => setSeedStrength(192)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      seedStrength === 192
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    18 Words (192 bits)
                  </button>
                  <button
                    onClick={() => setSeedStrength(256)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      seedStrength === 256
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    24 Words (256 bits)
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useCustomNonce"
                    checked={useCustomNonce}
                    onChange={(e) => setUseCustomNonce(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="useCustomNonce" className="text-sm font-medium text-gray-700">
                    Use Custom Nonce
                  </label>
                </div>
                
                {useCustomNonce && (
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={customNonce}
                        onChange={(e) => setCustomNonce(e.target.value)}
                        placeholder="Enter your custom nonce"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        A nonce adds extra entropy to your seed phrase. You can use any text, numbers, or combination.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nonce Complexity (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={nonceComplexity}
                          onChange={(e) => setNonceComplexity(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Simple</span>
                          <span>Complex</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Higher complexity adds more transformations to your nonce.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nonce Iterations (1-1000)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={nonceIterations}
                          onChange={(e) => setNonceIterations(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          More iterations increase the processing time and security.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateSeed}
                disabled={isGenerating || (useCustomNonce && !customNonce)}
                className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  isGenerating || (useCustomNonce && !customNonce)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate New Seed Phrase'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-medium">Your Seed Phrase</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800">{seedStrength} bits</Badge>
                <Button variant="outline" size="sm" onClick={() => setShowSeed(!showSeed)} disabled={!seedPhrase.length}>
                  {showSeed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {seedPhrase.length > 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="font-mono text-sm">
                  {showSeed ? (
                    <div className="grid grid-cols-3 gap-2">
                      {seedPhrase.map((word, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-gray-500 mr-2 w-6 text-right">{index + 1}.</span>
                          <span className="text-gray-900">{word}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-12">
                      <p className="text-gray-500">Click the eye icon to reveal your seed phrase</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copySeedToClipboard}
                    className="transition-all duration-200"
                  >
                    {showCopySuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSeedPhrase}>
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500 mb-4">No seed phrase generated yet</p>
                <Button onClick={handleGenerateSeed} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate New Seed Phrase
                    </>
                  )}
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Gathering entropy...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Update the verification challenge display to match the same style */}
            {seedVerified && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Verification Challenge</h3>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Verified
                  </Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="grid grid-cols-3 gap-2">
                    {verificationWords.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-gray-500 mr-2 w-6 text-right">{item.index + 1}.</span>
                        <span className="text-gray-900">{item.word}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seed Verification */}
        {seedPhrase.length > 0 && !seedVerified && mode === "generate" && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium">Verify Your Backup</h3>
            </div>

            <p className="text-sm text-gray-600">
              Please enter the following words from your seed phrase to verify you've backed it up correctly:
            </p>

            <div className="space-y-3">
              {verificationWords.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-24">Word #{item.index}:</span>
                  <input
                    type="text"
                    value={verificationInput[idx]}
                    onChange={(e) => {
                      const newInputs = [...verificationInput]
                      newInputs[idx] = e.target.value
                      setVerificationInput(newInputs)
                    }}
                    className={`flex-1 px-3 py-2 border rounded-md text-sm ${
                      verificationError ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder={`Enter word #${item.index}`}
                  />
                </div>
              ))}

              {verificationError && (
                <p className="text-sm text-red-600">
                  The words you entered don't match your seed phrase. Please try again.
                </p>
              )}

              <Button onClick={verifySeedBackup} className="w-full">
                Verify Backup
              </Button>
            </div>
          </div>
        )}

        {/* Seed Verified */}
        {seedVerified && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-800">Backup Verified!</h3>
            </div>
            <p className="text-sm text-green-700 mt-2">
              Your seed phrase has been verified. You can now create your wallet.
            </p>
          </div>
        )}

        {/* Create Wallet Button */}
        <Button
          onClick={createWallet}
          disabled={!seedPhrase.length || !seedVerified || isCreatingWallet}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isCreatingWallet ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Creating Wallet...
            </>
          ) : (
            "Create Wallet"
          )}
        </Button>

        {seedPhrase.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Seed Phrase</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copySeedToClipboard}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  {showCopySuccess ? (
                    <>
                      <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleBackupWallet}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md border border-green-500 bg-green-50"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Backup Wallet
                </button>
              </div>
            </div>

            {/* Backup Modal */}
            {showBackupModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Backup Wallet</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Password
                      </label>
                      <input
                        type="password"
                        value={backupPassword}
                        onChange={(e) => setBackupPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password to encrypt backup"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This password will be required to restore your wallet from backup.
                      </p>
                    </div>
                    {backupError && (
                      <p className="text-sm text-red-600">{backupError}</p>
                    )}
                    {backupSuccess && (
                      <p className="text-sm text-green-600">Backup created successfully!</p>
                    )}
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowBackupModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDownloadBackup}
                        disabled={!backupPassword || backupPassword.length < 6}
                      >
                        Download Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showRecoveryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Recover Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {recoveryFile?.name} appears to be encrypted. Please enter the password to decrypt it.
                </p>
                <Input
                  type="password"
                  placeholder="Enter backup password"
                  value={recoveryPassword}
                  onChange={(e) => setRecoveryPassword(e.target.value)}
                  disabled={isRecovering}
                />
                {recoveryError && (
                  <p className="text-sm text-red-500">{recoveryError}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRecoveryModal(false)
                      setRecoveryError('')
                      setRecoveryPassword('')
                      setRecoveryFile(null)
                    }}
                    disabled={isRecovering}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRecoverySubmit}
                    disabled={isRecovering}
                  >
                    {isRecovering ? 'Recovering...' : 'Recover'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Decrypt Backup File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="import-password">Backup Password</Label>
                  <Input
                    id="import-password"
                    type="password"
                    placeholder="Enter the password used to encrypt this backup"
                    value={importPassword}
                    onChange={(e) => {
                      setImportPassword(e.target.value)
                      setImportError("")
                    }}
                    disabled={isImporting}
                  />
                  {importError && <p className="text-sm text-red-500 mt-1">{importError}</p>}
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowImportModal(false)
                      setImportPassword("")
                      setImportError("")
                    }}
                    disabled={isImporting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImportSubmit}
                    disabled={!importPassword || isImporting}
                    className="flex-1"
                  >
                    {isImporting ? "Decrypting..." : "Decrypt & Import"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* QR Code Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Seed Phrase QR Code (Encrypted)</h3>
          <div className="flex flex-col gap-2 max-w-md">
            <Input
              type="password"
              placeholder="Password for QR encryption"
              value={qrPassword}
              onChange={e => setQrPassword(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleGenerateQR} disabled={isGenerating || !seedPhrase.length || !qrPassword}>
              Generate Encrypted QR Code
            </Button>
            {qrError && <div className="text-red-500 text-sm">{qrError}</div>}
            {showQR && qrEncrypted && (
              <div className="flex flex-col items-center mt-4 qr-code-svg-download">
                <QRCodeSVG value={qrEncrypted} size={220} level="M" includeMargin={true} />
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(qrEncrypted)
                      toast.success('QR code data copied!')
                    }}
                  >
                    Copy QR Data
                  </Button>
                  <Button
                    onClick={downloadQRCodePDF}
                    variant="outline"
                  >
                    Download QR Code (PDF)
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2 break-all max-w-xs">{qrEncrypted}</div>
              </div>
            )}
          </div>
        </div>
        {/* QR Code Decryption Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Decrypt Seed Phrase from QR Data</h3>
          <div className="flex flex-col gap-2 max-w-md">
            <textarea
              placeholder="Paste QR code data here (from above or scanned)"
              value={qrScanInput}
              onChange={e => setQrScanInput(e.target.value)}
              className="p-2 border rounded"
              rows={3}
            />
            <Input
              type="password"
              placeholder="Password to decrypt QR"
              value={qrScanPassword}
              onChange={e => setQrScanPassword(e.target.value)}
            />
            <Button onClick={handleDecryptQR} disabled={!qrScanInput || !qrScanPassword}>
              Decrypt QR Data
            </Button>
            {qrError && <div className="text-red-500 text-sm">{qrError}</div>}
            {qrScanResult && (
              <div className="mt-2 p-2 bg-green-100 rounded text-green-800">
                <b>Decrypted Seed Phrase:</b>
                <div className="font-mono break-words whitespace-pre-wrap">{qrScanResult}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
