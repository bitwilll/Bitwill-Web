"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertTriangle,
  Shield,
  Zap,
  Timer,
  Users,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Smartphone,
  Trash2,
} from "lucide-react"
import Navigation from "@/components/navigation"
import NukeSafeAnimation from "@/components/panic/nuke-safe-animation"

export default function PanicModePage() {
  const [panicModeActive, setPanicModeActive] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Spouse",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      priority: 1,
      verified: true,
    },
    {
      id: "2",
      name: "Legal Advisor",
      relationship: "Attorney",
      phone: "+1 (555) 987-6543",
      email: "advisor@lawfirm.com",
      priority: 2,
      verified: true,
    },
    {
      id: "3",
      name: "Michael Johnson",
      relationship: "Son",
      phone: "+1 (555) 456-7890",
      email: "michael.j@email.com",
      priority: 3,
      verified: false,
    },
  ])
  const [showAddContact, setShowAddContact] = useState(false)
  const [showContactMessage, setShowContactMessage] = useState<string | null>(null)
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  })
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false)
  const [isTestingPanic, setIsTestingPanic] = useState(false)
  const [showPanicSettings, setShowPanicSettings] = useState(false)

  const [panicActions] = useState([
    {
      id: "lockdown",
      name: "Immediate Lockdown",
      description: "Lock all accounts and disable access",
      enabled: true,
      critical: true,
    },
    {
      id: "transfer",
      name: "Emergency Transfer",
      description: "Transfer assets to secure cold storage",
      enabled: true,
      critical: true,
    },
    {
      id: "notify",
      name: "Notify Contacts",
      description: "Alert emergency contacts immediately",
      enabled: true,
      critical: false,
    },
    {
      id: "wipe",
      name: "Device Wipe",
      description: "Remotely wipe all connected devices",
      enabled: false,
      critical: true,
    },
    {
      id: "legal",
      name: "Legal Notification",
      description: "Notify legal representatives",
      enabled: true,
      critical: false,
    },
  ])

  const [deadManSwitch, setDeadManSwitch] = useState({
    enabled: true,
    interval: 30, // days
    lastCheckin: "2024-01-15",
    nextDeadline: "2024-02-14",
    warningsSent: 0,
  })

  const activatePanicMode = () => {
    setPanicModeActive(true)
    // In a real app, this would trigger actual panic mode procedures
  }

  const deactivatePanicMode = () => {
    setPanicModeActive(false)
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.email) {
      alert('Please fill in all required fields')
      return
    }

    const contact = {
      id: String(Date.now()),
      ...newContact,
      priority: emergencyContacts.length + 1,
      verified: false
    }

    setEmergencyContacts([...emergencyContacts, contact])
    setNewContact({ name: '', relationship: '', phone: '', email: '' })
    setShowAddContact(false)
    alert('Emergency contact added successfully!')
  }

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
      setEmergencyContacts(emergencyContacts.filter(c => c.id !== contactId))
    }
  }

  const handleMessageContact = (contactId: string) => {
    const contact = emergencyContacts.find(c => c.id === contactId)
    if (contact) {
      setShowContactMessage(contact.name)
      // In a real app, this would open a messaging interface
      setTimeout(() => {
        setShowContactMessage(null)
        alert(`Message sent to ${contact.name}`)
      }, 2000)
    }
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    try {
      // Simulate check-in process
      await new Promise(resolve => setTimeout(resolve, 2000))
      setDeadManSwitch(prev => ({
        ...prev,
        lastCheckin: new Date().toISOString().split('T')[0],
        nextDeadline: new Date(Date.now() + prev.interval * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
      alert('Check-in successful! Next deadline updated.')
    } catch (error) {
      alert('Check-in failed. Please try again.')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleSendTestAlert = async () => {
    setIsSendingTestAlert(true)
    try {
      // Simulate sending test alert
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('Test alert sent to all emergency contacts!')
    } catch (error) {
      alert('Failed to send test alert. Please try again.')
    } finally {
      setIsSendingTestAlert(false)
    }
  }

  const handleTestPanicMode = async () => {
    if (confirm('This will run a test of panic mode systems without actually activating them. Continue?')) {
      setIsTestingPanic(true)
      try {
        // Simulate panic mode test
        await new Promise(resolve => setTimeout(resolve, 5000))
        alert('Panic mode test completed successfully! All systems operational.')
      } catch (error) {
        alert('Panic mode test failed. Please contact support.')
      } finally {
        setIsTestingPanic(false)
      }
    }
  }

  const handleSavePanicSettings = () => {
    alert('Panic mode settings saved successfully!')
    // In a real app, this would save settings to backend
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nuke Safe / Vault Lockdown animation overlay */}
      <NukeSafeAnimation active={panicModeActive} />

      <Navigation />

      {/* Panic Mode Alert */}
      {panicModeActive && (
        <div className="bg-red-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-4">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-bold">PANIC MODE ACTIVATED - ALL SYSTEMS LOCKED</span>
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Panic Mode</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Emergency security protocols to protect your Bitcoin assets in critical situations. Instant lockdown, asset
            transfer, and emergency contact notification.
          </p>
        </div>

        {/* Panic Activation Button */}
        {!panicModeActive && (
          <div className="text-center mb-8">
            <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white max-w-md mx-auto">
              <CardContent className="p-6">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-200" />
                <h3 className="text-xl font-bold mb-2">Emergency Activation</h3>
                <p className="text-red-100 mb-4 text-sm">
                  Use only in genuine emergencies. This will lock all accounts and notify contacts.
                </p>
                <Button
                  onClick={() => {
                    if (confirm('EMERGENCY ACTIVATION: This will immediately activate panic mode and lock all your accounts. This action cannot be undone easily. Continue?')) {
                      activatePanicMode()
                    }
                  }}
                  className="w-full bg-white text-red-600 hover:bg-red-50 font-bold"
                  size="lg"
                >
                  ACTIVATE PANIC MODE
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {panicModeActive && (
          <div className="text-center mb-8">
            <Card className="bg-red-50 border-red-200 max-w-md mx-auto">
              <CardContent className="p-6">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-bold mb-2 text-red-800">Panic Mode Active</h3>
                <p className="text-red-700 mb-4 text-sm">
                  All systems locked. Emergency contacts have been notified.
                </p>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to deactivate panic mode? This will restore normal operations.')) {
                      deactivatePanicMode()
                    }
                  }}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100"
                >
                  Deactivate Panic Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Actions */}
            <Card className={panicModeActive ? "border-red-500 bg-red-50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <AlertTriangle className={`w-8 h-8 mr-3 ${panicModeActive ? "text-red-600" : ""}`} />
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {panicActions.map((action) => (
                    <div
                      key={action.id}
                      className={`border rounded-lg p-4 ${action.critical ? "border-red-200 bg-red-50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{action.name}</h3>
                            {action.critical && <Badge className="bg-red-100 text-red-800">Critical</Badge>}
                          </div>
                          <p className="text-gray-600 text-sm">{action.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch checked={action.enabled} disabled={panicModeActive} />
                          {panicModeActive && action.enabled && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
                <TabsTrigger value="deadman">Dead Man's Switch</TabsTrigger>
                <TabsTrigger value="settings">Panic Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Emergency Contacts</CardTitle>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => setShowAddContact(true)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg">{contact.name}</h3>
                                <Badge className="bg-blue-100 text-blue-800">Priority {contact.priority}</Badge>
                                <Badge
                                  className={
                                    contact.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {contact.verified ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Clock className="w-3 h-3 mr-1" />
                                  )}
                                  {contact.verified ? "Verified" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{contact.relationship}</p>
                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {contact.phone}
                                </div>
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-2" />
                                  {contact.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMessageContact(contact.id)}
                                disabled={showContactMessage === contact.name}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deadman" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dead Man's Switch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-yellow-800">How Dead Man's Switch Works</h3>
                          <p className="text-yellow-700 text-sm mt-1">
                            If you don't check in within the specified interval, emergency protocols will automatically
                            activate to protect your assets and notify your contacts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Check-in Interval</Label>
                        <select className="w-full mt-2 p-2 border rounded-md">
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30" selected>
                            30 days
                          </option>
                          <option value="60">60 days</option>
                          <option value="90">90 days</option>
                        </select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div className="mt-2 flex items-center space-x-2">
                          <Switch checked={deadManSwitch.enabled} />
                          <span className={deadManSwitch.enabled ? "text-green-600" : "text-gray-600"}>
                            {deadManSwitch.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Last Check-in</Label>
                        <Input value={deadManSwitch.lastCheckin} readOnly className="mt-2" />
                      </div>
                      <div>
                        <Label>Next Deadline</Label>
                        <Input value={deadManSwitch.nextDeadline} readOnly className="mt-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <h4 className="font-medium text-green-800">Time Until Next Check-in</h4>
                        <p className="text-green-700">14 days, 6 hours remaining</p>
                      </div>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleCheckIn}
                        disabled={isCheckingIn}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isCheckingIn ? "Checking In..." : "Check In Now"}
                      </Button>
                    </div>

                    <div>
                      <Label>Emergency Message</Label>
                      <Textarea
                        placeholder="Message to be sent to emergency contacts if dead man's switch activates..."
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Panic Mode Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Activation Methods</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Mobile App</p>
                              <p className="text-sm text-gray-600">Activate via mobile app button</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">SMS Command</p>
                              <p className="text-sm text-gray-600">Send "PANIC" to emergency number</p>
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium">Email Trigger</p>
                              <p className="text-sm text-gray-600">Send email with panic code</p>
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Security Delays</Label>
                      <div className="mt-2 grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Lockdown Delay</Label>
                          <select className="w-full mt-1 p-2 border rounded-md text-sm">
                            <option>Immediate</option>
                            <option>5 minutes</option>
                            <option>15 minutes</option>
                            <option>30 minutes</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-sm">Transfer Delay</Label>
                          <select className="w-full mt-1 p-2 border rounded-md text-sm">
                            <option>Immediate</option>
                            <option>1 hour</option>
                            <option>6 hours</option>
                            <option>24 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Recovery Options</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Allow Self-Recovery</p>
                            <p className="text-sm text-gray-600">You can deactivate panic mode yourself</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Require Contact Verification</p>
                            <p className="text-sm text-gray-600">Emergency contacts must verify recovery</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleSavePanicSettings}
                    >
                      Save Panic Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Panic Status */}
            <Card className={panicModeActive ? "border-red-500 bg-red-50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className={`w-5 h-5 mr-2 ${panicModeActive ? "text-red-600" : ""}`} />
                  Panic Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode Status</span>
                  <Badge className={panicModeActive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {panicModeActive ? "ACTIVE" : "Standby"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Contacts</span>
                  <span className="font-medium">{emergencyContacts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dead Man's Switch</span>
                  <Badge
                    className={deadManSwitch.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {deadManSwitch.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Check-in</span>
                  <span className="text-sm font-medium">14 days</span>
                </div>
              </CardContent>
            </Card>

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
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  disabled={panicModeActive || isTestingPanic}
                  onClick={handleTestPanicMode}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {isTestingPanic ? "Testing..." : "Test Panic Mode"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowAddContact(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Contacts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                >
                  <Timer className="w-4 h-4 mr-2" />
                  {isCheckingIn ? "Checking In..." : "Check In Now"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleSendTestAlert}
                  disabled={isSendingTestAlert}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isSendingTestAlert ? "Sending..." : "Send Test Alert"}
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">24/7 Emergency Line</p>
                    <p className="text-gray-600">+1 (800) BITWILL</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Email</p>
                    <p className="text-gray-600">emergency@bitwill.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Legal Support</p>
                    <p className="text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Important
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  Panic mode should only be used in genuine emergencies. False activations may result in permanent asset
                  loss and cannot be reversed without proper verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-name">Full Name *</Label>
                <Input
                  id="contact-name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="contact-relationship">Relationship</Label>
                <Input
                  id="contact-relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="e.g., Spouse, Attorney, Family"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number *</Label>
                <Input
                  id="contact-phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email Address *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddContact(false)
                    setNewContact({ name: '', relationship: '', phone: '', email: '' })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddContact}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Add Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Contact Loading */}
      {showContactMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Sending Message</h3>
              <p className="text-gray-600">Contacting {showContactMessage}...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
