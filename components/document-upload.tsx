"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DocumentEncryption, formatFileSize, downloadBlob } from "@/lib/encryption"
import { Upload, Key, AlertTriangle, CheckCircle, Eye, EyeOff, RefreshCw } from "lucide-react"

interface EncryptedDocument {
  id: string
  name: string
  originalName: string
  size: string
  uploadDate: string
  encrypted: boolean
  hash: string
  status: string
  encryptedData?: ArrayBuffer
  salt?: Uint8Array
  iv?: Uint8Array
}

interface DocumentUploadProps {
  onDocumentUploaded?: (document: EncryptedDocument) => void
  onDocumentDeleted?: (documentId: string) => void
}

export default function DocumentUpload({ onDocumentUploaded, onDocumentDeleted }: DocumentUploadProps) {
  const [encryptionKey, setEncryptionKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [keyValidation, setKeyValidation] = useState<{
    isValid: boolean
    score: number
    feedback: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateKey = (key: string) => {
    const validation = DocumentEncryption.validatePassword(key)
    setKeyValidation(validation)
  }

  const generateSecureKey = () => {
    const newKey = DocumentEncryption.generateSecurePassword(24)
    setEncryptionKey(newKey)
    validateKey(newKey)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !encryptionKey) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress((i / files.length) * 50) // First 50% for processing

        // Encrypt the file
        const encryptedResult = await DocumentEncryption.encryptFile(file, encryptionKey)

        setUploadProgress(((i + 0.5) / files.length) * 100) // Next 50% for "upload"

        // Create encrypted package
        const packageBuffer = DocumentEncryption.createEncryptedPackage(
          encryptedResult.encryptedData,
          encryptedResult.salt,
          encryptedResult.iv,
          {
            filename: encryptedResult.filename,
            originalSize: encryptedResult.originalSize,
            hash: encryptedResult.hash,
            timestamp: Date.now(),
          },
        )

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create document record
        const newDocument: EncryptedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          originalName: file.name,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split("T")[0],
          encrypted: true,
          hash: encryptedResult.hash,
          status: "encrypted",
          encryptedData: encryptedResult.encryptedData,
          salt: encryptedResult.salt,
          iv: encryptedResult.iv,
        }

        onDocumentUploaded?.(newDocument)
        setUploadProgress(((i + 1) / files.length) * 100)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDecryptDownload = async (document: EncryptedDocument) => {
    if (!document.encryptedData || !document.salt || !document.iv) {
      alert("Document data not available for decryption")
      return
    }

    const password = prompt("Enter decryption password:")
    if (!password) return

    try {
      const decryptedBlob = await DocumentEncryption.decryptFile(
        document.encryptedData,
        password,
        document.salt,
        document.iv,
        document.originalName,
      )

      downloadBlob(decryptedBlob, document.originalName)
    } catch (error) {
      alert(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Encryption Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Encryption Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Security Notice</h3>
                <p className="text-blue-800 text-sm">
                  Your encryption key is never transmitted to our servers. Store it securely - if lost, your documents
                  cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type={showKey ? "text" : "password"}
                  placeholder="Enter or generate encryption key"
                  value={encryptionKey}
                  onChange={(e) => {
                    setEncryptionKey(e.target.value)
                    validateKey(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button onClick={generateSecureKey} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>

            {keyValidation && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Strength:</span>
                  <div className="flex-1">
                    <Progress value={(keyValidation.score / 5) * 100} className="h-2" />
                  </div>
                  <Badge
                    className={
                      keyValidation.score >= 4
                        ? "bg-green-100 text-green-800"
                        : keyValidation.score >= 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {keyValidation.score >= 4 ? "Strong" : keyValidation.score >= 2 ? "Medium" : "Weak"}
                  </Badge>
                </div>
                {keyValidation.feedback.length > 0 && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {keyValidation.feedback.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-2 text-yellow-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <Upload className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                {isUploading ? "Encrypting and Processing..." : "Upload Legal Documents"}
              </h3>
              <p className="text-gray-500 mb-4">Documents will be encrypted with AES-256-GCM before storage</p>

              {isUploading && (
                <div className="w-full max-w-xs mb-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">{Math.round(uploadProgress)}% complete</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
                disabled={isUploading || !encryptionKey || !keyValidation?.isValid}
              />
              <label htmlFor="document-upload">
                <Button
                  variant="outline"
                  disabled={isUploading || !encryptionKey || !keyValidation?.isValid}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Processing..." : "Select Documents"}
                  </span>
                </Button>
              </label>
              {(!encryptionKey || !keyValidation?.isValid) && (
                <p className="text-red-500 text-sm mt-2">Please set a strong encryption key first</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encryption Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Encryption Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Algorithm:</span>
                <span>AES-256-GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Key Derivation:</span>
                <span>PBKDF2</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hash Function:</span>
                <span>SHA-256</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Salt Length:</span>
                <span>128 bits</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">IV Length:</span>
                <span>96 bits</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Iterations:</span>
                <span>100,000</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <CheckCircle className="w-4 h-4 inline mr-2" />
              All encryption is performed client-side. Your documents and keys never leave your device unencrypted.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
