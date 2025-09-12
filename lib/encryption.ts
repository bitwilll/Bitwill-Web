// Client-side encryption utilities for document security

export class DocumentEncryption {
  private static readonly ALGORITHM = "AES-GCM"
  private static readonly KEY_LENGTH = 256
  private static readonly IV_LENGTH = 12
  private static readonly SALT_LENGTH = 16
  private static readonly ITERATIONS = 100000

  /**
   * Generate a cryptographically secure random salt
   */
  private static generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH))
  }

  /**
   * Generate a cryptographically secure random IV
   */
  private static generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.IV_LENGTH))
  }

  /**
   * Derive encryption key from password using PBKDF2
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ["encrypt", "decrypt"],
    )
  }

  /**
   * Encrypt file data with AES-256-GCM
   */
  static async encryptFile(
    file: File,
    password: string,
  ): Promise<{
    encryptedData: ArrayBuffer
    salt: Uint8Array
    iv: Uint8Array
    filename: string
    originalSize: number
    hash: string
  }> {
    try {
      // Generate salt and IV
      const salt = this.generateSalt()
      const iv = this.generateIV()

      // Derive encryption key
      const key = await this.deriveKey(password, salt)

      // Read file data
      const fileData = await file.arrayBuffer()

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        fileData,
      )

      // Generate hash of original file for integrity verification
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileData)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hash =
        "sha256:" +
        hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .substring(0, 16) +
        "..."

      return {
        encryptedData,
        salt,
        iv,
        filename: file.name,
        originalSize: file.size,
        hash,
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Decrypt file data with AES-256-GCM
   */
  static async decryptFile(
    encryptedData: ArrayBuffer,
    password: string,
    salt: Uint8Array,
    iv: Uint8Array,
    filename: string,
  ): Promise<Blob> {
    try {
      // Derive decryption key
      const key = await this.deriveKey(password, salt)

      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        encryptedData,
      )

      // Return as blob with original filename
      return new Blob([decryptedData], { type: this.getMimeType(filename) })
    } catch (error) {
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : "Invalid password or corrupted data"}`,
      )
    }
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length = 32): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => charset[byte % charset.length]).join("")
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length < 12) {
      feedback.push("Password should be at least 12 characters long")
    } else {
      score += 1
    }

    if (!/[a-z]/.test(password)) {
      feedback.push("Include lowercase letters")
    } else {
      score += 1
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push("Include uppercase letters")
    } else {
      score += 1
    }

    if (!/[0-9]/.test(password)) {
      feedback.push("Include numbers")
    } else {
      score += 1
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push("Include special characters")
    } else {
      score += 1
    }

    return {
      isValid: score >= 4 && password.length >= 12,
      score,
      feedback,
    }
  }

  /**
   * Get MIME type from filename
   */
  private static getMimeType(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
    }
    return mimeTypes[extension || ""] || "application/octet-stream"
  }

  /**
   * Create encrypted package for storage
   */
  static createEncryptedPackage(
    encryptedData: ArrayBuffer,
    salt: Uint8Array,
    iv: Uint8Array,
    metadata: {
      filename: string
      originalSize: number
      hash: string
      timestamp: number
    },
  ): ArrayBuffer {
    // Create a package that includes all necessary data for decryption
    const metadataString = JSON.stringify(metadata)
    const metadataBytes = new TextEncoder().encode(metadataString)

    // Package format: [salt][iv][metadata_length][metadata][encrypted_data]
    const packageSize = salt.length + iv.length + 4 + metadataBytes.length + encryptedData.byteLength
    const packageBuffer = new ArrayBuffer(packageSize)
    const packageView = new Uint8Array(packageBuffer)

    let offset = 0

    // Add salt
    packageView.set(salt, offset)
    offset += salt.length

    // Add IV
    packageView.set(iv, offset)
    offset += iv.length

    // Add metadata length (4 bytes)
    const metadataLengthView = new DataView(packageBuffer, offset, 4)
    metadataLengthView.setUint32(0, metadataBytes.length, true)
    offset += 4

    // Add metadata
    packageView.set(metadataBytes, offset)
    offset += metadataBytes.length

    // Add encrypted data
    packageView.set(new Uint8Array(encryptedData), offset)

    return packageBuffer
  }

  /**
   * Extract data from encrypted package
   */
  static extractEncryptedPackage(packageBuffer: ArrayBuffer): {
    salt: Uint8Array
    iv: Uint8Array
    metadata: {
      filename: string
      originalSize: number
      hash: string
      timestamp: number
    }
    encryptedData: ArrayBuffer
  } {
    const packageView = new Uint8Array(packageBuffer)
    let offset = 0

    // Extract salt
    const salt = packageView.slice(offset, offset + this.SALT_LENGTH)
    offset += this.SALT_LENGTH

    // Extract IV
    const iv = packageView.slice(offset, offset + this.IV_LENGTH)
    offset += this.IV_LENGTH

    // Extract metadata length
    const metadataLengthView = new DataView(packageBuffer, offset, 4)
    const metadataLength = metadataLengthView.getUint32(0, true)
    offset += 4

    // Extract metadata
    const metadataBytes = packageView.slice(offset, offset + metadataLength)
    const metadataString = new TextDecoder().decode(metadataBytes)
    const metadata = JSON.parse(metadataString)
    offset += metadataLength

    // Extract encrypted data
    const encryptedData = packageBuffer.slice(offset)

    return { salt, iv, metadata, encryptedData }
  }
}

// Utility functions for file handling
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
