"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, User, Bell, Settings, LogOut, Copy, ExternalLink, Flower2, Leaf, Heart } from "lucide-react"
import Link from "next/link"

interface SmartWalletConnectionProps {
  onConnect?: (address: string) => void
}

export default function SmartWalletConnection({ onConnect }: SmartWalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [ensName, setEnsName] = useState("")
  const [balance, setBalance] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const connectWallet = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockAddress = "0x1234567890123456789012345678901234567890"
      const mockEnsName = "builder.eth"
      const mockBalance = "2.45"

      setAddress(mockAddress)
      setEnsName(mockEnsName)
      setBalance(mockBalance)
      setIsConnected(true)

      if (onConnect) {
        onConnect(mockAddress)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setEnsName("")
    setBalance("")
    setShowDropdown(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Garden
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {/* Quick Action Icons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm p-2"
        >
          <Bell className="w-4 h-4" />
        </Button>
        <Link href="/profile/me">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm p-2"
          >
            <User className="w-4 h-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm p-2"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Wallet Info */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
        >
          <Avatar className="w-5 h-5 mr-2">
            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
              {ensName ? ensName.slice(0, 2).toUpperCase() : address.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{ensName || formatAddress(address)}</span>
          <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
            {balance} ETH
          </Badge>
        </Button>

        {showDropdown && (
          <Card className="absolute top-full right-0 mt-2 w-80 border-emerald-100 bg-white/95 backdrop-blur-sm shadow-lg z-50">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {ensName ? ensName.slice(0, 2).toUpperCase() : address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-900">{ensName || "Garden Builder"}</p>
                    <p className="text-sm text-emerald-600/70">{formatAddress(address)}</p>
                    <Badge className="bg-teal-400 text-white border-0 mt-1">
                      <Flower2 className="w-3 h-3 mr-1" />
                      Grove-Keeper
                    </Badge>
                  </div>
                </div>

                {/* Garden Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">342</p>
                    <p className="text-xs text-emerald-600/70">Sprouts</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <Heart className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-900">28</p>
                    <p className="text-xs text-emerald-600/70">Gardens Loved</p>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="space-y-2 pt-2 border-t border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">Balance</span>
                    <span className="font-medium text-emerald-900">{balance} ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700">Network</span>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      Ethereum
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-emerald-100">
                  <Button
                    variant="ghost"
                    onClick={copyAddress}
                    className="w-full justify-start text-emerald-700 hover:bg-emerald-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-emerald-700 hover:bg-emerald-50">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Etherscan
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={disconnectWallet}
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
