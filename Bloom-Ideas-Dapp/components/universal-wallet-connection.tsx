"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react" // Keep Wallet and LogOut icons

interface UniversalWalletConnectionProps {
  onConnectionChange?: (isConnected: boolean, address?: string) => void
}

export default function UniversalWalletConnection({ onConnectionChange }: UniversalWalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  // Removed ensName, balance, and showDropdown states as they are no longer needed

  const connectWallet = async () => {
    try {
      // Simulate thirdweb wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockAddress = "0x1234567890123456789012345678901234567890"
      // Removed mockEnsName and mockBalance as they are no longer displayed

      setAddress(mockAddress)
      setIsConnected(true)

      if (onConnectionChange) {
        onConnectionChange(true, mockAddress)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    // Reset other states if they were used elsewhere, though not directly displayed here

    if (onConnectionChange) {
      onConnectionChange(false)
    }
  }

  // Removed copyAddress and formatAddress as they are no longer needed

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    // When connected, the button itself becomes the disconnect button
    <Button
      onClick={disconnectWallet}
      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Disconnect Wallet
    </Button>
  )
}
