"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Shield, AlertTriangle, Wallet, FileText, Settings } from "lucide-react"
import Navigation from "@/components/navigation"
import DocumentUpload from "@/components/document-upload"
import BeneficiaryManager from "@/components/inheritance/beneficiary-manager"
import TimeLockManager from "@/components/inheritance/time-lock-manager"
import AssetAllocation from "@/components/inheritance/asset-allocation"

export default function InheritancePage() {
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      relationship: "spouse",
      percentage: 60,
      status: "verified" as const,
      walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      lastVerified: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Michael Johnson",
      email: "michael.johnson@email.com",
      phone: "+1 (555) 987-6543",
      relationship: "child",
      percentage: 30,
      status: "pending" as const,
      verificationCode: "ABC123",
    },
    {
      id: "3",
      name: "Emily Johnson",
      email: "emily.johnson@email.com",
      phone: "+1 (555) 456-7890",
      relationship: "child",
      percentage: 10,
      status: "verified" as const,
      walletAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      lastVerified: "2024-01-14T15:45:00Z",
    },
  ])

  const [timeLockSettings, setTimeLockSettings] = useState({
    inactivityPeriod: 12, // months
    gracePeriod: 30, // days
    requiredConfirmations: 2,
    lastActivity: "2024-01-15T10:30:00Z",
    status: "active" as const,
    nextCheck: "2025-01-15T10:30:00Z",
  })

  const [assets, setAssets] = useState([
    {
      id: "1",
      type: "bitcoin" as const,
      name: "Main Bitcoin Wallet",
      amount: 0.05847,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      currentValue: 2630.15,
      allocation: {
        "1": 60,
        "2": 30,
        "3": 10,
      },
    },
  ])

  const [uploadedDocuments, setUploadedDocuments] = useState([
    {
      id: "1",
      name: "Last Will and Testament",
      originalName: "will_testament.pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-10",
      encrypted: true,
      hash: "sha256:a1b2c3d4e5f6...",
      status: "encrypted",
    },
  ])

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => sum + asset.currentValue, 0)
  }

  const getVerifiedBeneficiaries = () => {
    return beneficiaries.filter((b) => b.status === "verified").length
  }

  const getTotalPercentage = () => {
    return beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
  }

  const getInheritanceStatus = () => {
    const hasVerifiedBeneficiaries = getVerifiedBeneficiaries() > 0
    const hasCorrectAllocation = getTotalPercentage() === 100
    const hasAssets = assets.length > 0
    const hasDocuments = uploadedDocuments.length > 0

    if (hasVerifiedBeneficiaries && hasCorrectAllocation && hasAssets && hasDocuments) {
      return { status: "complete", color: "green" }
    } else if (hasVerifiedBeneficiaries && hasAssets) {
      return { status: "partial", color: "yellow" }
    } else {
      return { status: "incomplete", color: "red" }
    }
  }

  const inheritanceStatus = getInheritanceStatus()

  const handleAddBeneficiary = () => {
    // This will be handled by the BeneficiaryManager component
    alert('Use the "Add Beneficiary" button in the Beneficiaries tab to add new beneficiaries.')
  }

  const handleAddAsset = () => {
    alert('Add Asset functionality would allow you to add Bitcoin wallets, other cryptocurrencies, or traditional assets to your inheritance plan.')
  }

  const handleCheckIn = async () => {
    try {
      // Update last activity timestamp
      setTimeLockSettings(prev => ({
        ...prev,
        lastActivity: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      }))
      alert('Check-in successful! Time lock timer has been reset.')
    } catch (error) {
      alert('Check-in failed. Please try again.')
    }
  }

  const handleUploadDocument = () => {
    // This will be handled by the DocumentUpload component
    alert('Use the Documents tab to upload legal documents for your inheritance plan.')
  }

  const handleTriggerEmergency = () => {
    if (confirm('EMERGENCY: This will immediately trigger inheritance distribution according to your plan. This action cannot be undone. Continue?')) {
      alert('Emergency inheritance trigger activated. All beneficiaries will be notified and assets will be distributed according to your plan.')
    }
  }

  const handleExtendTimeLock = () => {
    const months = prompt('How many additional months do you want to extend the time lock?', '12')
    if (months && !isNaN(Number(months))) {
      const extensionMonths = Number(months)
      setTimeLockSettings(prev => ({
        ...prev,
        inactivityPeriod: prev.inactivityPeriod + extensionMonths,
        nextCheck: new Date(Date.now() + (prev.inactivityPeriod + extensionMonths) * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
      alert(`Time lock extended by ${extensionMonths} months.`)
    }
  }

  const handlePausePlan = () => {
    if (confirm('This will pause your inheritance plan. No distributions will occur even if time locks expire. Continue?')) {
      setTimeLockSettings(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'paused' : 'active'
      }))
      alert(`Inheritance plan ${timeLockSettings.status === 'active' ? 'paused' : 'activated'}.`)
    }
  }

  const handleContactSupport = () => {
    alert('Contacting inheritance planning support team...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card className="bg-gradient-to-br from-purple-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Users className="w-8 h-8 mr-3" />
                  Crypto Inheritance Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-purple-100 text-sm">Beneficiaries</p>
                    <p className="text-3xl font-bold">{beneficiaries.length}</p>
                    <p className="text-purple-100 text-xs">{getVerifiedBeneficiaries()} verified</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Total Value</p>
                    <p className="text-3xl font-bold">${getTotalValue().toLocaleString()}</p>
                    <p className="text-purple-100 text-xs">{assets.length} assets</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Allocation</p>
                    <p className="text-3xl font-bold">{getTotalPercentage()}%</p>
                    <p className="text-purple-100 text-xs">distributed</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Time Lock</p>
                    <p className="text-3xl font-bold">{timeLockSettings.inactivityPeriod}m</p>
                    <p className="text-purple-100 text-xs">inactivity period</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="beneficiaries" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="timelock">Time Lock</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="beneficiaries" className="space-y-4">
                <BeneficiaryManager beneficiaries={beneficiaries} onBeneficiariesChange={setBeneficiaries} />
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <AssetAllocation assets={assets} beneficiaries={beneficiaries} onAssetsChange={setAssets} />
              </TabsContent>

              <TabsContent value="timelock" className="space-y-4">
                <TimeLockManager settings={timeLockSettings} onSettingsChange={setTimeLockSettings} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <DocumentUpload
                  onDocumentUploaded={(doc) => {
                    setUploadedDocuments((prev) => [...prev, doc])
                  }}
                  onDocumentDeleted={(docId) => {
                    setUploadedDocuments((prev) => prev.filter((d) => d.id !== docId))
                  }}
                />

                {/* Uploaded Documents List */}
                {uploadedDocuments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Legal Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {uploadedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>{doc.size}</span>
                                  <span>Uploaded {doc.uploadDate}</span>
                                  <Badge className="bg-green-100 text-green-800">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Encrypted
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Plan Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Status</span>
                  <Badge
                    className={
                      inheritanceStatus.color === "green"
                        ? "bg-green-100 text-green-800"
                        : inheritanceStatus.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {inheritanceStatus.status.charAt(0).toUpperCase() + inheritanceStatus.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Beneficiaries</span>
                  <span className="font-medium">
                    {getVerifiedBeneficiaries()}/{beneficiaries.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asset Value</span>
                  <span className="font-medium">${getTotalValue().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allocation</span>
                  <Badge
                    className={
                      getTotalPercentage() === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {getTotalPercentage()}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time Lock</span>
                  <Badge
                    className={
                      timeLockSettings.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }
                  >
                    {timeLockSettings.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={handleAddBeneficiary}>
                  <Users className="w-4 h-4 mr-2" />
                  Add Beneficiary
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleAddAsset}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleCheckIn}>
                  <Clock className="w-4 h-4 mr-2" />
                  Check In
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleUploadDocument}>
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={handleTriggerEmergency}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Trigger Emergency
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleExtendTimeLock}>
                  <Clock className="w-4 h-4 mr-2" />
                  Extend Time Lock
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handlePausePlan}>
                  <Shield className="w-4 h-4 mr-2" />
                  Pause Plan
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Our inheritance planning experts are here to help you secure your crypto assets for your loved ones.
                </p>
                <Button variant="outline" className="w-full" onClick={handleContactSupport}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
