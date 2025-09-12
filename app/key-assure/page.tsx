"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  HardDrive,
  Cloud,
  Timer,
  Users,
  FileText,
  Zap,
  Plus,
} from "lucide-react"

import Navigation from "@/components/navigation"

export default function KeyAssurePage() {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [keyRotationProgress, setKeyRotationProgress] = useState(0)
  const [backupStatus, setBackupStatus] = useState({
    local: true,
    cloud: true,
    hardware: false,
    paper: true,
  })
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportPassword, setExportPassword] = useState('')
  const [isRunningTest, setIsRunningTest] = useState<string | null>(null)

  const seedPhrase =
    "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual"

  const keyBackups = [
    {
      id: "1",
      type: "Hardware Wallet",
      device: "Ledger Nano X",
      status: "active",
      lastVerified: "2024-01-15",
      location: "Primary Device",
    },
    {
      id: "2",
      type: "Encrypted USB",
      device: "SanDisk Ultra",
      status: "active",
      lastVerified: "2024-01-14",
      location: "Safe Deposit Box",
    },
    {
      id: "3",
      type: "Paper Backup",
      device: "Steel Plate",
      status: "active",
      lastVerified: "2024-01-10",
      location: "Home Safe",
    },
    {
      id: "4",
      type: "Cloud Backup",
      device: "Encrypted Storage",
      status: "pending",
      lastVerified: "2024-01-12",
      location: "Distributed Network",
    },
  ]

  const recoveryScenarios = [
    {
      scenario: "Lost Primary Device",
      difficulty: "Easy",
      timeToRecover: "5 minutes",
      requirements: ["Secondary device", "Biometric verification"],
      status: "ready",
    },
    {
      scenario: "Forgotten Password",
      difficulty: "Medium",
      timeToRecover: "15 minutes",
      requirements: ["Seed phrase", "Identity verification"],
      status: "ready",
    },
    {
      scenario: "Complete Device Loss",
      difficulty: "Medium",
      timeToRecover: "30 minutes",
      requirements: ["Backup device", "Recovery phrase", "2FA"],
      status: "ready",
    },
    {
      scenario: "Emergency Access",
      difficulty: "Hard",
      timeToRecover: "24 hours",
      requirements: ["Legal documentation", "Biometric scan", "Witness verification"],
      status: "configured",
    },
  ]

  const startKeyRotation = () => {
    setKeyRotationProgress(0)
    const interval = setInterval(() => {
      setKeyRotationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleBackupKeys = async () => {
    setIsBackingUp(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('Keys backed up successfully to all configured locations!')
    } catch (error) {
      alert('Backup failed. Please try again.')
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestoreKeys = async () => {
    if (confirm('This will restore keys from backup. Continue?')) {
      setIsRestoring(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 4000))
        alert('Keys restored successfully from backup!')
      } catch (error) {
        alert('Restore failed. Please try again.')
      } finally {
        setIsRestoring(false)
      }
    }
  }

  const handleVerifyBackups = async () => {
    setIsVerifying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 5000))
      alert('All backups verified successfully!')
    } catch (error) {
      alert('Backup verification failed. Please check your backup systems.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleAddBackup = () => {
    alert('Add Backup functionality would open a wizard to configure new backup methods.')
  }

  const handleVerifyBackup = (backupId: string) => {
    alert(`Verifying backup: ${backupId}`)
    // In a real app, this would verify the specific backup
  }

  const handleUpdateBackup = (backupId: string) => {
    alert(`Updating backup: ${backupId}`)
    // In a real app, this would update the specific backup
  }

  const handleTestRecovery = (scenario: string) => {
    if (confirm(`This will test the recovery scenario: ${scenario}. Continue?`)) {
      alert(`Testing ${scenario} recovery scenario...`)
    }
  }

  const handleViewGuide = (scenario: string) => {
    alert(`Opening recovery guide for: ${scenario}`)
    // In a real app, this would open documentation
  }

  const handleScheduleRotation = () => {
    alert('Key rotation scheduled successfully!')
  }

  const handleRunTest = async (testType: string) => {
    setIsRunningTest(testType)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert(`${testType} test completed successfully!`)
    } catch (error) {
      alert(`${testType} test failed.`)
    } finally {
      setIsRunningTest(null)
    }
  }

  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase)
      alert('Seed phrase copied to clipboard!')
    } catch (error) {
      alert('Failed to copy seed phrase.')
    }
  }

  const handleExportSeed = () => {
    setShowExportModal(true)
  }

  const handleConfirmExport = () => {
    if (!exportPassword || exportPassword.length < 6) {
      alert('Password must be at least 6 characters.')
      return
    }

    // Create encrypted backup file
    const element = document.createElement("a")
    const file = new Blob([`ENCRYPTED SEED PHRASE\nPassword Protected\nDate: ${new Date().toISOString()}`], 
      { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "key-backup-encrypted.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setShowExportModal(false)
    setExportPassword('')
    alert('Encrypted seed phrase exported successfully!')
  }

  const handleManageContacts = () => {
    alert('Emergency contacts management would open here.')
  }

  const handleContactSupport = () => {
    alert('Contacting key management support...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Key Assure</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced key management, backup, and recovery system ensuring your Bitcoin keys are always secure and
            accessible when you need them.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Status Overview */}
            <Card className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="w-8 h-8 mr-3" />
                  Key Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-green-100 text-sm">Security Score</p>
                    <p className="text-3xl font-bold">98/100</p>
                    <p className="text-green-100 text-sm">Excellent</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Active Backups</p>
                    <p className="text-3xl font-bold">4/4</p>
                    <p className="text-green-100 text-sm">All Systems</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Last Rotation</p>
                    <p className="text-3xl font-bold">30d</p>
                    <p className="text-green-100 text-sm">Ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="backups" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="backups">Key Backups</TabsTrigger>
                <TabsTrigger value="recovery">Recovery</TabsTrigger>
                <TabsTrigger value="rotation">Key Rotation</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="backups" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Key Backup Systems</CardTitle>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleAddBackup}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Backup
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {keyBackups.map((backup) => (
                        <div key={backup.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {backup.type === "Hardware Wallet" && <HardDrive className="w-5 h-5 text-blue-600" />}
                                {backup.type === "Encrypted USB" && <HardDrive className="w-5 h-5 text-blue-600" />}
                                {backup.type === "Paper Backup" && <FileText className="w-5 h-5 text-blue-600" />}
                                {backup.type === "Cloud Backup" && <Cloud className="w-5 h-5 text-blue-600" />}
                              </div>
                              <div>
                                <h3 className="font-semibold">{backup.type}</h3>
                                <p className="text-sm text-gray-600">{backup.device}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                backup.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {backup.status === "active" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Timer className="w-3 h-3 mr-1" />
                              )}
                              {backup.status}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Location:</span> {backup.location}
                            </div>
                            <div>
                              <span className="font-medium">Last Verified:</span> {backup.lastVerified}
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleVerifyBackup(backup.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Verify
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateBackup(backup.id)}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Update
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recovery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recovery Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recoveryScenarios.map((scenario, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{scenario.scenario}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  scenario.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : scenario.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {scenario.difficulty}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">{scenario.timeToRecover}</Badge>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">Requirements:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {scenario.requirements.map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestRecovery(scenario.scenario)}
                            >
                              Test Recovery
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewGuide(scenario.scenario)}
                            >
                              View Guide
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rotation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Rotation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Why Rotate Keys?</h3>
                      <p className="text-blue-800 text-sm">
                        Regular key rotation enhances security by limiting the exposure time of any single key pair and
                        reducing the impact of potential compromises.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Rotation Schedule</Label>
                        <select className="w-full mt-2 p-2 border rounded-md">
                          <option>Every 30 days</option>
                          <option>Every 60 days</option>
                          <option>Every 90 days</option>
                          <option>Manual only</option>
                        </select>
                      </div>
                      <div>
                        <Label>Next Scheduled Rotation</Label>
                        <Input value="February 15, 2024" readOnly className="mt-2" />
                      </div>
                    </div>

                    {keyRotationProgress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rotation Progress</span>
                          <span className="text-sm text-gray-600">{keyRotationProgress}%</span>
                        </div>
                        <Progress value={keyRotationProgress} className="w-full" />
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button
                        onClick={startKeyRotation}
                        disabled={keyRotationProgress > 0 && keyRotationProgress < 100}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {keyRotationProgress > 0 && keyRotationProgress < 100 ? "Rotating..." : "Start Rotation"}
                      </Button>
                      <Button onClick={handleScheduleRotation}>
                        <Timer className="w-4 h-4 mr-2" />
                        Schedule Rotation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Seed Phrase Verification</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Your Recovery Phrase</span>
                          <Button variant="outline" size="sm" onClick={() => setShowSeedPhrase(!showSeedPhrase)}>
                            {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="font-mono text-sm bg-white p-3 rounded border">
                          {showSeedPhrase ? seedPhrase : "•".repeat(120)}
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCopySeed}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleExportSeed}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Verification Tests</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Seed Phrase Test</p>
                            <p className="text-sm text-gray-600">Verify you can restore from seed phrase</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRunTest('Seed Phrase')}
                            disabled={isRunningTest === 'Seed Phrase'}
                          >
                            {isRunningTest === 'Seed Phrase' ? 'Testing...' : 'Run Test'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Backup Integrity</p>
                            <p className="text-sm text-gray-600">Check all backup systems are functional</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRunTest('Backup Integrity')}
                            disabled={isRunningTest === 'Backup Integrity'}
                          >
                            {isRunningTest === 'Backup Integrity' ? 'Testing...' : 'Verify All'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Access Path Test</p>
                            <p className="text-sm text-gray-600">Test emergency access procedures</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRunTest('Access Path')}
                            disabled={isRunningTest === 'Access Path'}
                          >
                            {isRunningTest === 'Access Path' ? 'Testing...' : 'Test Access'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleBackupKeys}
                  disabled={isBackingUp}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isBackingUp ? 'Backing Up...' : 'Backup Keys'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleRestoreKeys}
                  disabled={isRestoring}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isRestoring ? 'Restoring...' : 'Restore Keys'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={startKeyRotation}
                  disabled={keyRotationProgress > 0 && keyRotationProgress < 100}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {keyRotationProgress > 0 && keyRotationProgress < 100 ? 'Rotating...' : 'Rotate Keys'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleVerifyBackups}
                  disabled={isVerifying}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify Backups'}
                </Button>
              </CardContent>
            </Card>

            {/* Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Key Strength</span>
                  <Badge className="bg-green-100 text-green-800">256-bit</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Redundancy</span>
                  <Badge className="bg-green-100 text-green-800">4x</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Verification</span>
                  <span className="text-sm font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recovery Time</span>
                  <Badge className="bg-blue-100 text-blue-800">{"< 5 min"}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Primary Contact</p>
                  <p className="text-gray-600">Sarah Johnson</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Secondary Contact</p>
                  <p className="text-gray-600">Legal Advisor</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleManageContacts}
                >
                  Manage Contacts
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
                  Our key management experts are available 24/7 to help with any key security concerns.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleContactSupport}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Export Seed Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Export Encrypted Seed Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  This will export your seed phrase in encrypted format. Keep the password secure!
                </p>
              </div>
              <div>
                <Label htmlFor="export-password">Encryption Password</Label>
                <Input
                  id="export-password"
                  type="password"
                  value={exportPassword}
                  onChange={(e) => setExportPassword(e.target.value)}
                  placeholder="Enter a strong password (min 6 characters)"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExportModal(false)
                    setExportPassword('')
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmExport}
                  disabled={!exportPassword || exportPassword.length < 6}
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
