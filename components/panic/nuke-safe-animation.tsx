import React from "react"
import { Shield, AlertTriangle } from "lucide-react"

interface NukeSafeAnimationProps {
  active: boolean
}

// A full-screen animated overlay that visually communicates that vault lockdown / "nuke safe" mode is engaged.
// Renders nothing unless `active` is true.
export default function NukeSafeAnimation({ active }: NukeSafeAnimationProps) {
  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm select-none">
      {/* Rotating concentric rings */}
      <div className="relative vault-container w-64 h-64">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-red-700 animate-spin-slow security-glow" />

        {/* Middle ring (opposite direction) */}
        <div className="absolute inset-4 rounded-full border-4 border-red-500 animate-spin-slower" style={{ animationDirection: "reverse" }} />

        {/* Inner vault door */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 vault-door animate-vault-door flex items-center justify-center">
          <Shield className="w-20 h-20 text-red-600 animate-pulse-glow" />
        </div>

        {/* Horizontal security scan line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/50 animate-security-scan" />
      </div>

      {/* Flashing warning text */}
      <div className="absolute bottom-16 flex items-center space-x-3">
        <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
        <span className="text-xl font-bold text-red-500 animate-pulse">VAULT LOCKDOWN ENGAGED</span>
        <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
      </div>
    </div>
  )
} 