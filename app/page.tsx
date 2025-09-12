"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Users, AlertTriangle, ArrowRight, CheckCircle, Eye, Key } from "lucide-react"
import Navigation from "@/components/navigation"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [animatedElements, setAnimatedElements] = useState({
    hero: false,
    features: false,
    products: false,
  })

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedElements((prev) => ({ ...prev, hero: true })), 100)
    const timer2 = setTimeout(() => setAnimatedElements((prev) => ({ ...prev, features: true })), 500)
    const timer3 = setTimeout(() => setAnimatedElements((prev) => ({ ...prev, products: true })), 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${animatedElements.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Trust-free Crypto
                  <br />
                  <span className="text-blue-300">Access Management</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Bitwill is a trust-free, auditable and secure crypto access management system powered by a
                  patent-pending technology that helps crypto hodlers, investors, traders & exchanges insure
                  crypto-assets without ever sharing their private keys.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="https://3hn1ch580pw.typeform.com/to/ULTW2Gy0?typeform-source=www.bitwill.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Visual Animation */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${animatedElements.hero ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              style={{ perspective: "1200px" }}
            >
              <div className="relative w-[450px] h-[450px] mx-auto">
                {/* Soft Ambient Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-600/30 to-emerald-500/30 blur-3xl" />

                {/* Outlined Rotating Hexagons */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Large Hexagon */}
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute animate-spin-slow"
                    style={{ width: "90%", height: "90%", animationDuration: "90s" }}
                  >
                    <polygon
                      points="100,10 180,55 180,145 100,190 20,145 20,55"
                      fill="none"
                      stroke="rgba(59,130,246,0.4)"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Inner Hexagon (reverse) */}
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute"
                    style={{ width: "65%", height: "65%", animation: "spin 120s linear reverse infinite" }}
                  >
                    <polygon
                      points="100,10 180,55 180,145 100,190 20,145 20,55"
                      fill="none"
                      stroke="rgba(139,92,246,0.3)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Central Metallic Bitcoin & Security Badges */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* Authentic Bitcoin Coin */}
                  <div className="relative w-36 h-36 rounded-full bg-[#F7931A] shadow-[0_0_25px_rgba(247,147,26,0.4)] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-16 w-16"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                    </svg>
                  </div>

                  {/* Outlined Security Icons */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <Shield className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="absolute right-[-1.75rem] top-1/2 -translate-y-1/2">
                    <Lock className="h-6 w-6 text-purple-300" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <Key className="h-6 w-6 text-green-300" />
                  </div>
                  <div className="absolute left-[-1.75rem] top-1/2 -translate-y-1/2">
                    <Users className="h-6 w-6 text-indigo-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${animatedElements.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">Security Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Advanced Bitcoin Security</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience enterprise-grade security with our innovative approach to cryptocurrency management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Multi-Signature Security",
                description: "Advanced multi-sig protection with hardware wallet integration",
              },
              {
                icon: Lock,
                title: "Zero-Knowledge Proofs",
                description: "Verify transactions without revealing sensitive information",
              },
              {
                icon: Eye,
                title: "Transparent Auditing",
                description: "Full audit trail with cryptographic verification",
              },
              {
                icon: AlertTriangle,
                title: "Emergency Protocols",
                description: "Panic mode and emergency access controls",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 delay-${index * 100} ${animatedElements.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                    <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${animatedElements.products ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">Our Products</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Save your crypto assets</h2>
            <p className="text-xl text-gray-600">safely for your successors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            {/* Secured Custody */}
            <Card
              className={`group hover:shadow-2xl transition-all duration-700 ${animatedElements.products ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} flex flex-col h-full w-full items-start justify-between p-8 bg-white rounded-2xl border border-gray-100`}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Secured Custody</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Enterprise-grade custody solution with multi-signature security, hardware wallet integration, and institutional-level protection for your Bitcoin assets.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Multi-signature wallets
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Hardware security modules
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  24/7 monitoring
                </li>
              </ul>
              <Link href="/custody" className="w-full mt-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            {/* Crypto Inheritance */}
            <Card
              className={`group hover:shadow-2xl transition-all duration-700 delay-200 ${animatedElements.products ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} flex flex-col h-full w-full items-start justify-between p-8 bg-white rounded-2xl border border-gray-100`}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Crypto Inheritance</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Secure inheritance planning for your cryptocurrency assets. Ensure your loved ones can access your Bitcoin without compromising security during your lifetime.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Time-locked transfers
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Beneficiary management
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Legal compliance
                </li>
              </ul>
              <Link href="/inheritance" className="w-full mt-auto">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            {/* Key Assure */}
            <Card
              className={`group hover:shadow-2xl transition-all duration-700 delay-300 ${animatedElements.products ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} flex flex-col h-full w-full items-start justify-between p-8 bg-white rounded-2xl border border-gray-100`}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Key className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Key Assure</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Advanced key management and assurance for your digital assets. Protect, verify, and recover your keys securely.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Key backup & recovery
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Tamper-proof verification
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Multi-device sync
                </li>
              </ul>
              <Link href="/key-assure" className="w-full mt-auto">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            {/* Panic Mode */}
            <Card
              className={`group hover:shadow-2xl transition-all duration-700 delay-400 ${animatedElements.products ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} flex flex-col h-full w-full items-start justify-between p-8 bg-white rounded-2xl border border-gray-100`}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Panic Mode</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Instantly secure your assets in emergencies. Activate panic protocols to freeze, alert, and protect your funds.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Instant asset freeze
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Emergency notifications
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Customizable triggers
                </li>
              </ul>
              <Link href="/panic-mode" className="w-full mt-auto">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Secure Your Bitcoin Future?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Bitwill with their cryptocurrency security and inheritance planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Link href="https://calendly.com/bitwill/15min?month=2025-06" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Bitwill</h3>
              <p className="text-gray-400">Secure, trust-free cryptocurrency management for the future.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/custody" className="hover:text-white transition-colors">
                    Secured Custody
                  </Link>
                </li>
                <li>
                  <Link href="/inheritance" className="hover:text-white transition-colors">
                    Crypto Inheritance
                  </Link>
                </li>
                <li>
                  <Link href="/key-assure" className="hover:text-white transition-colors">
                    Key Assure
                  </Link>
                </li>
                <li>
                  <Link href="/panic-mode" className="hover:text-white transition-colors">
                    Panic Mode
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bitwill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
