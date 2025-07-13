"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { formatUnits } from 'viem'
import { mainnet, sepolia, polygon } from 'viem/chains'

interface UniversalWalletConnectionProps {
  onConnectionChange?: (isConnected: boolean, address?: string) => void
}

export default function UniversalWalletConnection({
  onConnectionChange,
}: UniversalWalletConnectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { data: balanceData } = useBalance({ address, chainId })
  const [showDropdown, setShowDropdown] = useState(false)

  // Get chain info from chainId
  const getChainInfo = (id: number) => {
    switch (id) {
      case mainnet.id:
        return mainnet
      case sepolia.id:
        return sepolia
      case polygon.id:
        return polygon
      default:
        return mainnet
    }
  }

  const chain = chainId ? getChainInfo(chainId) : null

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      onConnectionChange?.(isConnected, address)
    }
  }, [isMounted, isConnected, address, onConnectionChange])

  if (!isMounted) return null

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        className="bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 hover:from-lime-400 hover:to-green-500 text-white font-semibold shadow-lg px-6 py-2 rounded-lg border-0 focus:ring-2 focus:ring-lime-300 transition-all duration-200"
        style={{ background: 'linear-gradient(90deg, #A3E635 0%, #65C32F 100%)' }}
      >
        Connect Wallet
      </Button>
    )
  }

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""
  const balance = balanceData ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4) : "0.0000"
  const symbol = balanceData?.symbol ?? "ETH"
  const netName = chain?.name ?? "Unknown"

  const explorerUrl = chain?.blockExplorers?.default
    ? `${chain.blockExplorers.default.url}/address/${address}`
    : null

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => toast.success("Address copied"))
        .catch(() => toast.error("Copy failed"))
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowDropdown(v => !v)}
        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm"
      >
        <Avatar className="w-5 h-5 mr-2">
          <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
            {shortAddr.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{shortAddr}</span>
        <Badge className="ml-2 bg-emerald-100 text-emerald-700">
          {balance} {symbol}
        </Badge>
      </Button>

      {showDropdown && (
        <Card className="absolute top-full right-0 mt-2 w-80 border-emerald-100 bg-white/95 backdrop-blur-sm shadow-lg z-50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {shortAddr.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-emerald-900">Anonymous Gardener</p>
                <p className="text-sm text-emerald-600/70">{shortAddr}</p>
                <Badge className="bg-teal-400 text-white border-0 mt-1">
                  Grove-Keeper
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-emerald-700">
                <span>Balance</span>
                <span className="font-medium text-emerald-900">{balance} {symbol}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Garden Sprouts</span>
                <span className="font-medium text-emerald-900">342 🌱</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Network</span>
                <Badge className="border-emerald-200 text-emerald-700">
                  {netName}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 border-t border-emerald-100 pt-2">
              <Link href="/profile/me">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={copyAddress}
                className="w-full justify-start text-emerald-700 hover:bg-emerald-50"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
              {explorerUrl && (
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-emerald-700 hover:bg-emerald-50"
                >
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => { disconnect(); setShowDropdown(false); }}
                className="w-full justify-start text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
