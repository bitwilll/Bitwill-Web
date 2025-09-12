"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Lock,
  Server,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Fingerprint,
  Key,
  Database,
  Network,
  Zap,
} from "lucide-react"
import Navigation from "@/components/navigation"

export default function CustodyPage() {
  const [securityMetrics] = useState({
    uptime: "99.99%",
    transactions: "1,247,892",
    assetsSecured: "₿ 12,847.39",
    institutions: "247",
  })

  const handleStartFreeTrial = () => {
    alert('Starting free trial signup process...')
  }

  const handleScheduleConsultation = () => {
    alert('Scheduling consultation with custody specialists...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Enterprise-Grade Bitcoin Custody</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Institutional-level security for your Bitcoin assets with multi-signature protection, hardware security
            modules, and 24/7 monitoring.
          </p>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {Object.entries(securityMetrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
                <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-12 mb-16">
          {/* First row - Multi-Signature and Hardware Security */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="group hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Shield className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl">Multi-Signature Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Advanced multi-signature wallets requiring multiple approvals for transactions, eliminating single
                  points of failure and providing institutional-grade security.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    2-of-3, 3-of-5, or custom signature schemes
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Hardware wallet integration
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Geographically distributed keys
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                  <Server className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl">Hardware Security Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  FIPS 140-2 Level 3 certified hardware security modules protect your private keys with tamper-resistant
                  hardware and secure key generation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    FIPS 140-2 Level 3 certification
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Tamper-resistant hardware
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Secure key generation and storage
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Second row - Nuke Safe Vaults (full width) */}
          <Card className="group hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-600 transition-colors">
                      <Database className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Nuke Safe Vaults</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">
                    Nuclear-hardened underground vaults with EMP protection, designed to survive catastrophic events while
                    maintaining secure access to your Bitcoin keys and critical data.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
                      <span className="text-lg">Nuclear blast resistant construction</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
                      <span className="text-lg">EMP and radiation shielding</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
                      <span className="text-lg">Geographically distributed locations</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-4" />
                      <span className="text-lg">99.99% operational guarantee</span>
                    </li>
                  </ul>
                </div>
                
                {/* Nuclear Vault Illustration */}
                <div className="relative">
                  {/* Accent rotating ring */}
                  <div className="absolute inset-0 rounded-2xl border border-amber-400/30 animate-spin-slower pointer-events-none"></div>
                  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-600 hover:shadow-3xl transition-all duration-700">
                    <div className="relative">
                      {/* Vault Structure */}
                      <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl p-6 border-2 border-slate-500 shadow-inner">
                        
                        {/* Vault Door Header */}
                        <div className="bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg p-4 mb-6 border border-slate-400">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-emerald-400 rounded-full opacity-90 animate-pulse-slow"></div>
                              <div className="text-slate-100 font-semibold text-sm tracking-wider">SECURE FACILITY</div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-70"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-40"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Primary Storage Chamber */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 mb-6 border border-amber-400 shadow-lg">
                          <div className="flex items-center justify-center">
                            <Database className="h-10 w-10 text-white mr-3" />
                            <div>
                              <div className="text-white font-bold text-lg">BITCOIN VAULT</div>
                              <div className="text-amber-100 text-sm">Military Grade Security</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Security Status Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                              <Shield className="h-5 w-5 text-blue-400" />
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                            </div>
                            <div className="text-slate-200 text-xs font-medium mt-2">EMP Protection</div>
                          </div>
                          
                          <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                              <Lock className="h-5 w-5 text-purple-400" />
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                            </div>
                            <div className="text-slate-200 text-xs font-medium mt-2">Quantum Encryption</div>
                          </div>
                          
                          <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                              <Eye className="h-5 w-5 text-emerald-400" />
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                            </div>
                            <div className="text-slate-200 text-xs font-medium mt-2">Live Monitoring</div>
                          </div>
                          
                          <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                            <div className="flex items-center justify-between">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                            </div>
                            <div className="text-slate-200 text-xs font-medium mt-2">Blast Resistant</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Security Level Indicator */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-lg">
                        LEVEL 5
                      </div>
                      
                      {/* Depth Indicator */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-slate-900 text-slate-200 px-4 py-2 rounded-full text-xs font-medium border border-slate-600 shadow-lg">
                          <span className="text-orange-400">500ft</span> Underground
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features Tabs */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Advanced Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="monitoring">24/7 Monitoring</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
                <TabsTrigger value="access">Access Control</TabsTrigger>
                <TabsTrigger value="nukesafe">Nuke Safe</TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Real-Time Security Monitoring</h3>
                    <p className="text-gray-600 mb-6">
                      Our security operations center monitors your assets 24/7 with advanced threat detection, anomaly
                      analysis, and immediate incident response.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Eye className="h-5 w-5 text-blue-500 mr-3" />
                        Real-time transaction monitoring
                      </li>
                      <li className="flex items-center text-gray-700">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                        Anomaly detection and alerts
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Zap className="h-5 w-5 text-green-500 mr-3" />
                        Instant incident response
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">24/7</div>
                        <div className="text-sm text-gray-600">Monitoring</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">99.99%</div>
                        <div className="text-sm text-gray-600">Uptime</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Regulatory Compliance</h3>
                    <p className="text-gray-600 mb-6">
                      Full compliance with financial regulations including AML, KYC, and SOC 2 Type II certification for
                      institutional-grade custody services.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        SOC 2 Type II certified
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        AML/KYC compliance
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        Regular security audits
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">SOC 2 Type II</span>
                        <Badge className="bg-green-100 text-green-800">Certified</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">ISO 27001</span>
                        <Badge className="bg-green-100 text-green-800">Certified</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">PCI DSS</span>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="backup" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Secure Backup & Recovery</h3>
                    <p className="text-gray-600 mb-6">
                      Multi-layered backup systems with geographically distributed storage, encrypted backups, and
                      tested recovery procedures.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Database className="h-5 w-5 text-blue-500 mr-3" />
                        Geographically distributed backups
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Lock className="h-5 w-5 text-purple-500 mr-3" />
                        End-to-end encryption
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        Regular recovery testing
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg">
                    <div className="text-center">
                      <Database className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-purple-600 mb-2">3-2-1</div>
                      <div className="text-gray-600">Backup Strategy</div>
                      <p className="text-sm text-gray-500 mt-2">3 copies, 2 different media, 1 offsite</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="access" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Advanced Access Control</h3>
                    <p className="text-gray-600 mb-6">
                      Multi-factor authentication, biometric verification, and role-based access controls ensure only
                      authorized personnel can access your assets.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Fingerprint className="h-5 w-5 text-blue-500 mr-3" />
                        Biometric authentication
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Key className="h-5 w-5 text-purple-500 mr-3" />
                        Hardware security keys
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Network className="h-5 w-5 text-green-500 mr-3" />
                        Role-based permissions
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <Fingerprint className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm font-medium">Biometric</div>
                        <div className="text-xs text-gray-600">Verification</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <Key className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm font-medium">Hardware</div>
                        <div className="text-xs text-gray-600">Security Keys</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="nukesafe" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Nuclear-Hardened Vault Storage</h3>
                    <p className="text-gray-600 mb-6">
                      Our Nuke Safe facilities are underground bunkers designed to withstand nuclear blasts,
                      electromagnetic pulses, and other catastrophic events while maintaining secure access to your
                      Bitcoin keys.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <Shield className="h-5 w-5 text-orange-500 mr-3" />
                        Nuclear blast resistant (50+ PSI overpressure)
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Zap className="h-5 w-5 text-blue-500 mr-3" />
                        EMP shielding and Faraday cage protection
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Network className="h-5 w-5 text-green-500 mr-3" />
                        Independent power and communication systems
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Database className="h-5 w-5 text-purple-500 mr-3" />
                        Climate-controlled environment
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-lg">
                    <div className="text-center">
                      <Database className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                      <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                      <div className="text-gray-600 mb-4">Global Vault Locations</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-2 rounded">
                          <div className="font-medium">North America</div>
                          <div className="text-gray-600">2 Facilities</div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="font-medium">Europe</div>
                          <div className="text-gray-600">2 Facilities</div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="font-medium">Asia-Pacific</div>
                          <div className="text-gray-600">1 Facility</div>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <div className="font-medium">Depth</div>
                          <div className="text-gray-600">200+ ft</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Bitcoin Assets?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join leading institutions and high-net-worth individuals who trust Bitwill with their cryptocurrency
              custody needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={handleStartFreeTrial}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={handleScheduleConsultation}
              >
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
