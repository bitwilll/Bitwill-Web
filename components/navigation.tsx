"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Shield, Users, Key, AlertTriangle } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const getPageBadge = () => {
    switch (pathname) {
      case "/custody":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Secured Custody
          </Badge>
        )
      case "/inheritance":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Users className="w-3 h-3 mr-1" />
            Inheritance Plan
          </Badge>
        )
      case "/key-assure":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Key className="w-3 h-3 mr-1" />
            Key Assure
          </Badge>
        )
      case "/panic-mode":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Panic Mode
          </Badge>
        )
      case "/wallet":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <Shield className="w-3 h-3 mr-1" />
            Bitcoin Wallet
          </Badge>
        )
      default:
        return null
    }
  }

  const isActivePage = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">Bitwill</span>
            </Link>
            {getPageBadge()}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/custody"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePage("/custody")
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Secured Custody
            </Link>
            <Link
              href="/inheritance"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePage("/inheritance")
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              }`}
            >
              Crypto Inheritance
            </Link>
            <Link
              href="/key-assure"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePage("/key-assure")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              Key Assure
            </Link>
            <Link
              href="/panic-mode"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePage("/panic-mode")
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
              }`}
            >
              Panic Mode
            </Link>
            <Link
              href="/wallet"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePage("/wallet")
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Wallet
            </Link>
            <Link href="https://3hn1ch580pw.typeform.com/to/ULTW2Gy0?typeform-source=www.bitwill.com" target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 shadow-md hover:shadow-lg transition-all">
                CONTACT US
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/custody"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage("/custody")
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Secured Custody
              </Link>
              <Link
                href="/inheritance"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage("/inheritance")
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Crypto Inheritance
              </Link>
              <Link
                href="/key-assure"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage("/key-assure")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Key Assure
              </Link>
              <Link
                href="/panic-mode"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage("/panic-mode")
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Panic Mode
              </Link>
              <Link
                href="/wallet"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage("/wallet")
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link href="https://3hn1ch580pw.typeform.com/to/ULTW2Gy0?typeform-source=www.bitwill.com" target="_blank" rel="noopener noreferrer">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full mt-4 shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTACT US
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
