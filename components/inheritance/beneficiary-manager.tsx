"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Mail, Phone, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Beneficiary {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
  percentage: number
  status: "verified" | "pending" | "failed"
  walletAddress?: string
  publicKey?: string
  verificationCode?: string
  lastVerified?: string
}

interface BeneficiaryManagerProps {
  beneficiaries: Beneficiary[]
  onBeneficiariesChange: (beneficiaries: Beneficiary[]) => void
}

export default function BeneficiaryManager({ beneficiaries, onBeneficiariesChange }: BeneficiaryManagerProps) {
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = useState<string | null>(null)
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    percentage: 0,
    walletAddress: "",
  })

  const addBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.email || newBeneficiary.percentage <= 0) {
      return
    }

    const beneficiary: Beneficiary = {
      id: Date.now().toString(),
      ...newBeneficiary,
      status: "pending",
      verificationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    }

    const updatedBeneficiaries = [...beneficiaries, beneficiary]
    onBeneficiariesChange(updatedBeneficiaries)

    // Send verification email (simulated)
    sendVerificationEmail(beneficiary)

    setNewBeneficiary({
      name: "",
      email: "",
      phone: "",
      relationship: "",
      percentage: 0,
      walletAddress: "",
    })
    setIsAddingBeneficiary(false)
  }

  const sendVerificationEmail = async (beneficiary: Beneficiary) => {
    // Simulate sending verification email
    console.log(`Sending verification email to ${beneficiary.email}`)
    console.log(`Verification code: ${beneficiary.verificationCode}`)

    // In a real app, this would send an actual email
    setTimeout(() => {
      // Simulate email verification after 3 seconds
      const updatedBeneficiaries = beneficiaries.map((b) =>
        b.id === beneficiary.id ? { ...b, status: "verified" as const, lastVerified: new Date().toISOString() } : b,
      )
      onBeneficiariesChange(updatedBeneficiaries)
    }, 3000)
  }

  const removeBeneficiary = (id: string) => {
    const updatedBeneficiaries = beneficiaries.filter((b) => b.id !== id)
    onBeneficiariesChange(updatedBeneficiaries)
  }

  const updateBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    const updatedBeneficiaries = beneficiaries.map((b) => (b.id === id ? { ...b, ...updates } : b))
    onBeneficiariesChange(updatedBeneficiaries)
  }

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Beneficiaries</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              className={totalPercentage === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {totalPercentage}% allocated
            </Badge>
            <Button
              size="sm"
              onClick={() => setIsAddingBeneficiary(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Beneficiary
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add New Beneficiary Form */}
          {isAddingBeneficiary && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-4">Add New Beneficiary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newBeneficiary.name}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBeneficiary.email}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newBeneficiary.phone}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={newBeneficiary.relationship}
                    onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="percentage">Inheritance Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={newBeneficiary.percentage || ""}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, percentage: Number(e.target.value) })}
                    placeholder="Enter percentage"
                  />
                </div>
                <div>
                  <Label htmlFor="wallet">Bitcoin Address (Optional)</Label>
                  <Input
                    id="wallet"
                    value={newBeneficiary.walletAddress}
                    onChange={(e) => setNewBeneficiary({ ...newBeneficiary, walletAddress: e.target.value })}
                    placeholder="Enter Bitcoin address"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={addBeneficiary} disabled={!newBeneficiary.name || !newBeneficiary.email}>
                  Add Beneficiary
                </Button>
                <Button variant="outline" onClick={() => setIsAddingBeneficiary(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Beneficiaries */}
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{beneficiary.name}</h3>
                    <Badge className="bg-blue-100 text-blue-800">{beneficiary.percentage}%</Badge>
                    <Badge
                      className={
                        beneficiary.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : beneficiary.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {beneficiary.status === "verified" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : beneficiary.status === "pending" ? (
                        <Clock className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {beneficiary.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {beneficiary.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {beneficiary.phone}
                    </div>
                    <div>
                      <span className="font-medium">Relationship:</span> {beneficiary.relationship}
                    </div>
                    {beneficiary.walletAddress && (
                      <div>
                        <span className="font-medium">Wallet:</span> {beneficiary.walletAddress.substring(0, 8)}...
                        {beneficiary.walletAddress.slice(-8)}
                      </div>
                    )}
                  </div>
                  {beneficiary.status === "pending" && beneficiary.verificationCode && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                      <span className="font-medium">Verification Code:</span> {beneficiary.verificationCode}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (beneficiary.status === "pending") {
                        sendVerificationEmail(beneficiary)
                      }
                    }}
                  >
                    {beneficiary.status === "pending" ? "Resend" : <Edit className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeBeneficiary(beneficiary.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {beneficiaries.length === 0 && !isAddingBeneficiary && (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Beneficiaries Added</h3>
              <p className="text-gray-500 mb-4">Add beneficiaries to start your inheritance plan</p>
              <Button onClick={() => setIsAddingBeneficiary(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Beneficiary
              </Button>
            </div>
          )}

          {/* Allocation Warning */}
          {totalPercentage !== 100 && beneficiaries.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">
                  {totalPercentage > 100
                    ? `Over-allocated by ${totalPercentage - 100}%. Please adjust percentages.`
                    : `Under-allocated by ${100 - totalPercentage}%. Please add more beneficiaries or adjust percentages.`}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
