"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bitcoin, DollarSign, Wallet, Plus, Edit, Trash2 } from "lucide-react"

interface Asset {
  id: string
  type: "bitcoin" | "ethereum" | "other"
  name: string
  amount: number
  address: string
  currentValue: number // in USD
  allocation: { [beneficiaryId: string]: number } // percentage allocation per beneficiary
}

interface AssetAllocationProps {
  assets: Asset[]
  beneficiaries: Array<{ id: string; name: string; percentage: number }>
  onAssetsChange: (assets: Asset[]) => void
}

export default function AssetAllocation({ assets, beneficiaries, onAssetsChange }: AssetAllocationProps) {
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [newAsset, setNewAsset] = useState({
    type: "bitcoin" as const,
    name: "",
    amount: 0,
    address: "",
  })

  const addAsset = () => {
    if (!newAsset.name || !newAsset.address || newAsset.amount <= 0) return

    const asset: Asset = {
      id: Date.now().toString(),
      ...newAsset,
      currentValue: newAsset.amount * (newAsset.type === "bitcoin" ? 45000 : 2500), // Mock prices
      allocation: {},
    }

    // Initialize allocation based on beneficiary percentages
    beneficiaries.forEach((beneficiary) => {
      asset.allocation[beneficiary.id] = beneficiary.percentage
    })

    onAssetsChange([...assets, asset])
    setNewAsset({ type: "bitcoin", name: "", amount: 0, address: "" })
    setIsAddingAsset(false)
  }

  const removeAsset = (id: string) => {
    onAssetsChange(assets.filter((a) => a.id !== id))
  }

  const updateAssetAllocation = (assetId: string, beneficiaryId: string, percentage: number) => {
    const updatedAssets = assets.map((asset) =>
      asset.id === assetId
        ? {
            ...asset,
            allocation: { ...asset.allocation, [beneficiaryId]: percentage },
          }
        : asset,
    )
    onAssetsChange(updatedAssets)
  }

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => sum + asset.currentValue, 0)
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "bitcoin":
        return <Bitcoin className="w-5 h-5 text-orange-500" />
      case "ethereum":
        return <div className="w-5 h-5 bg-blue-500 rounded-full" />
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Asset Allocation</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <DollarSign className="w-3 h-3 mr-1" />${getTotalValue().toLocaleString()}
            </Badge>
            <Button size="sm" onClick={() => setIsAddingAsset(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Asset Form */}
        {isAddingAsset && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-4">Add New Asset</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Asset Type</Label>
                <select
                  value={newAsset.type}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, type: e.target.value as "bitcoin" | "ethereum" | "other" })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label>Asset Name</Label>
                <Input
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g., Main Bitcoin Wallet"
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  value={newAsset.amount || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, amount: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00000000"
                />
              </div>
              <div>
                <Label>Wallet Address</Label>
                <Input
                  value={newAsset.address}
                  onChange={(e) => setNewAsset({ ...newAsset, address: e.target.value })}
                  placeholder="Enter wallet address"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={addAsset} disabled={!newAsset.name || !newAsset.address || newAsset.amount <= 0}>
                Add Asset
              </Button>
              <Button variant="outline" onClick={() => setIsAddingAsset(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Asset List */}
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getAssetIcon(asset.type)}
                  <div>
                    <h3 className="font-semibold">{asset.name}</h3>
                    <p className="text-sm text-gray-600">
                      {asset.amount} {asset.type.toUpperCase()} • ${asset.currentValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {asset.address.substring(0, 8)}...{asset.address.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeAsset(asset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Beneficiary Allocation */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Beneficiary Allocation</h4>
                {beneficiaries.map((beneficiary) => {
                  const allocation = asset.allocation[beneficiary.id] || 0
                  const assetValue = (asset.currentValue * allocation) / 100

                  return (
                    <div key={beneficiary.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{beneficiary.name}</span>
                          <span className="text-sm text-gray-600">${assetValue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={allocation} className="flex-1 h-2" />
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={allocation || ""}
                            onChange={(e) =>
                              updateAssetAllocation(asset.id, beneficiary.id, Number.parseInt(e.target.value) || 0)
                            }
                            className="w-16 h-8 text-xs"
                          />
                          <span className="text-xs text-gray-500 w-6">%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Allocation Summary */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Total Allocated:</span>
                    <span
                      className={
                        Object.values(asset.allocation).reduce((sum, val) => sum + val, 0) === 100
                          ? "text-green-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {Object.values(asset.allocation).reduce((sum, val) => sum + val, 0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {assets.length === 0 && !isAddingAsset && (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Assets Added</h3>
              <p className="text-gray-500 mb-4">Add your cryptocurrency assets to create inheritance allocations</p>
              <Button onClick={() => setIsAddingAsset(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Asset
              </Button>
            </div>
          )}
        </div>

        {/* Portfolio Summary */}
        {assets.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Portfolio Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Assets:</span>
                <div className="font-bold text-blue-900">{assets.length}</div>
              </div>
              <div>
                <span className="text-blue-700">Total Value:</span>
                <div className="font-bold text-blue-900">${getTotalValue().toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700">Beneficiaries:</span>
                <div className="font-bold text-blue-900">{beneficiaries.length}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
