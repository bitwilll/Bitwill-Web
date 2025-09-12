"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, CheckCircle, Timer } from "lucide-react"

interface TimeLockSettings {
  inactivityPeriod: number // months
  gracePeriod: number // days
  requiredConfirmations: number
  lastActivity: string
  status: "active" | "triggered" | "grace_period" | "expired"
  nextCheck: string
}

interface TimeLockManagerProps {
  settings: TimeLockSettings
  onSettingsChange: (settings: TimeLockSettings) => void
}

export default function TimeLockManager({ settings, onSettingsChange }: TimeLockManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempSettings, setTempSettings] = useState(settings)

  const saveSettings = () => {
    onSettingsChange(tempSettings)
    setIsEditing(false)
  }

  const checkIn = () => {
    const now = new Date()
    const nextCheck = new Date(now.getTime() + tempSettings.inactivityPeriod * 30 * 24 * 60 * 60 * 1000)

    onSettingsChange({
      ...settings,
      lastActivity: now.toISOString(),
      nextCheck: nextCheck.toISOString(),
      status: "active",
    })
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const nextCheck = new Date(settings.nextCheck)
    const diff = nextCheck.getTime() - now.getTime()

    if (diff <= 0) return "Overdue"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} days, ${hours} hours`
    return `${hours} hours`
  }

  const getProgressPercentage = () => {
    const now = new Date()
    const lastActivity = new Date(settings.lastActivity)
    const nextCheck = new Date(settings.nextCheck)

    const totalTime = nextCheck.getTime() - lastActivity.getTime()
    const elapsed = now.getTime() - lastActivity.getTime()

    return Math.min(100, (elapsed / totalTime) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Time Lock Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Current Status</h3>
            <Badge
              className={
                settings.status === "active"
                  ? "bg-green-100 text-green-800"
                  : settings.status === "triggered"
                    ? "bg-red-100 text-red-800"
                    : settings.status === "grace_period"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }
            >
              {settings.status === "active" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : settings.status === "triggered" ? (
                <AlertTriangle className="w-3 h-3 mr-1" />
              ) : (
                <Timer className="w-3 h-3 mr-1" />
              )}
              {settings.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Time until next check-in:</span>
              <span className="font-medium">{getTimeRemaining()}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <span>Last activity:</span>
              <span>{new Date(settings.lastActivity).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Time Lock Configuration</h3>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Inactivity Period</Label>
              {isEditing ? (
                <Select
                  value={tempSettings.inactivityPeriod.toString()}
                  onValueChange={(value) =>
                    setTempSettings({ ...tempSettings, inactivityPeriod: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-100 rounded text-sm">{settings.inactivityPeriod} months</div>
              )}
            </div>

            <div>
              <Label>Grace Period</Label>
              {isEditing ? (
                <Select
                  value={tempSettings.gracePeriod.toString()}
                  onValueChange={(value) => setTempSettings({ ...tempSettings, gracePeriod: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-100 rounded text-sm">{settings.gracePeriod} days</div>
              )}
            </div>

            <div>
              <Label>Required Confirmations</Label>
              {isEditing ? (
                <Select
                  value={tempSettings.requiredConfirmations.toString()}
                  onValueChange={(value) =>
                    setTempSettings({ ...tempSettings, requiredConfirmations: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 confirmation</SelectItem>
                    <SelectItem value="2">2 confirmations</SelectItem>
                    <SelectItem value="3">3 confirmations</SelectItem>
                    <SelectItem value="4">4 confirmations</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-100 rounded text-sm">{settings.requiredConfirmations} confirmations</div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <Button onClick={saveSettings} className="bg-purple-600 hover:bg-purple-700">
                Save Settings
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Check-in Action */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h4 className="font-medium text-blue-900">Regular Check-in</h4>
            <p className="text-sm text-blue-700">Confirm you still have access to your assets</p>
          </div>
          <Button onClick={checkIn} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Check In Now
          </Button>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Important</h4>
              <p className="text-sm text-yellow-800">
                If you don't check in within the specified period, the inheritance process will begin automatically.
                Make sure to set reminders and keep your contact information updated.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
