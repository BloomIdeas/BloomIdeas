"use client"

import { useEffect, useState, useRef } from "react"
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
import MessageSigningModal from './message-signing-modal'
import { useSignatureVerification } from '@/hooks/use-signature-verification'
import { supabase } from '@/lib/supabaseClient'  // your initialized client
import { useIsMobile } from '@/hooks/use-mobile'
import { useSprouts } from "@/hooks/use-sprouts"

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
  const [showSigningModal, setShowSigningModal] = useState(false)
  const [bloomUsername, setBloomUsername] = useState<string | null>(null)
  const [pfpEmoji, setPfpEmoji] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const {
    hasVerifiedSignature,
    signature,
    isLoading: signatureLoading,
    verifySignature,
    clearSignature,
  } = useSignatureVerification()

  const {
    totalSprouts,
    loading: sproutsLoading,
  } = useSprouts(address ?? null)

  // ensure we only run in browser
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  // Fetch user's bloom_username when connected and authenticated
  useEffect(() => {
    const fetchBloomUsername = async () => {
      if (isMounted && isConnected && address && hasVerifiedSignature) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('bloom_username')
            .eq('wallet_address', address)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching bloom_username:', error)
          } else if (data) {
            setBloomUsername(data.bloom_username)
          }
        } catch (err) {
          console.error('Error fetching bloom_username:', err)
        }
      }
    }

    fetchBloomUsername()
  }, [isMounted, isConnected, address, hasVerifiedSignature])

  // Remove Grove-Keeper badge and fetch pfp_emoji for avatar
  // 1. Add pfpEmoji state
  // 2. Fetch pfp_emoji from Supabase when fetching bloomUsername
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isMounted && isConnected && address && hasVerifiedSignature) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('bloom_username, pfp_emoji, updated_at')
            .eq('wallet_address', address)
            .single()

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user profile:', error)
          } else if (data) {
            setBloomUsername(data.bloom_username)
            setPfpEmoji(data.pfp_emoji)
          }
        } catch (err) {
          console.error('Error fetching user profile:', err)
        }
      }
    }
    fetchUserProfile()
  }, [isMounted, isConnected, address, hasVerifiedSignature])

  // 3. Helper to get a random emoji if pfp_emoji is not set
  const randomEmojis = ["🌱", "🌸", "🌻", "🌼", "🌷", "🍀", "🪴", "🌺", "🌵", "🍃"]
  function getRandomEmoji() {
    return randomEmojis[Math.floor(Math.random() * randomEmojis.length)]
  }

  // if connected but no valid signature, prompt sign
  useEffect(() => {
    if (
      isMounted &&
      isConnected &&
      address &&
      !signatureLoading &&
      !hasVerifiedSignature
    ) {
      setShowSigningModal(true)
    }
  }, [isMounted, isConnected, address, signatureLoading, hasVerifiedSignature])

  // propagate connection+auth upward
  useEffect(() => {
    onConnectionChange?.(isConnected && hasVerifiedSignature, address)
  }, [isConnected, hasVerifiedSignature, address, onConnectionChange])

  // upsert user record in Supabase
  const upsertUserSignature = async (
    wallet: string,
    sig: string
  ): Promise<void> => {
    try {
      // 1. Check existing
      const { data: existing, error: selErr } = await supabase
        .from('users')
        .select('signature_count')
        .eq('wallet_address', wallet)
        .single()
      if (selErr && selErr.code !== 'PGRST116') throw selErr

      if (existing) {
        // 2a. Update signature & increment count
        const { error: updErr } = await supabase
          .from('users')
          .update({
            signature: sig,
            signature_count: existing.signature_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('wallet_address', wallet)
        if (updErr) throw updErr
      } else {
        // 2b. Insert new user with initial count=1
        const { error: insErr } = await supabase
          .from('users')
          .insert({
            wallet_address: wallet,
            signature: sig,
            signature_count: 1,
          })
        if (insErr) throw insErr
      }

      toast.success('Wallet authenticated')
    } catch (err) {
      console.error('Upsert user error:', err)
      toast.error('Failed to record login')
    }
  }

  const handleSignSuccess = (sig: string) => {
    if (!address) return
    // 1. Verify on-chain signature
    verifySignature(sig)
    // 2. Persist into Supabase
    upsertUserSignature(address, sig)
    // 3. Close modal
    setShowSigningModal(false)
  }

  const handleSignReject = () => {
    setShowSigningModal(false)
    clearSignature()
    disconnect()
    toast.error('Signature required to continue')
  }

  const handleDisconnect = () => {
    clearSignature()
    setShowDropdown(false)
    disconnect()
    toast('Disconnected')
  }

  if (!isMounted) return null

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        size={isMobile ? "sm" : "default"}
        className="bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 
                   hover:from-lime-400 hover:to-green-500 text-white font-semibold 
                   shadow-lg px-3 md:px-6 py-2 rounded-lg border-0 focus:ring-2 
                   focus:ring-lime-300 transition-all duration-200 text-xs md:text-sm"
        style={{ background: 'linear-gradient(90deg, #A3E635 0%, #65C32F 100%)' }}
      >
        {isMobile ? "Connect" : "Connect Wallet"}
      </Button>
    )
  }

  if (showSigningModal && address) {
    return (
      <MessageSigningModal
        address={address}
        onSignSuccess={handleSignSuccess}
        onSignReject={handleSignReject}
      />
    )
  }

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''
  const balance = balanceData
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4)
    : '0.0000'
  const symbol = balanceData?.symbol ?? 'ETH'
  const chain = chainId
    ? [mainnet, sepolia, polygon].find((c) => c.id === chainId) ??
      mainnet
    : mainnet
  const explorerUrl = chain.blockExplorers?.default
    ? `${chain.blockExplorers.default.url}/address/${address}`
    : null

  const copyAddress = async () => {
    try {
      if (address) await navigator.clipboard.writeText(address)
      toast.success('Address copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  // 1. Add a helper for animated emoji avatar
  function AnimatedEmojiAvatar({ emoji, size = 40, animate = false }: { emoji: string, size?: number, animate?: boolean }) {
    return (
      <span
        className={
          `inline-flex items-center justify-center rounded-full bg-emerald-100 shadow-md ` +
          (animate ? 'animate-bounce' : '')
        }
        style={{ fontSize: size, width: size, height: size }}
      >
        {emoji}
      </span>
    )
  }

  // 2. In the closed state (Button), show pfp emoji, wallet address, and sprouts earned
  return (
    <div className="relative">
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={() => setShowDropdown((v) => !v)}
        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm px-2 md:px-4 py-1 md:py-2 flex items-center gap-2 md:gap-3 text-xs md:text-sm min-h-[44px]"
      >
        <AnimatedEmojiAvatar emoji={pfpEmoji || getRandomEmoji()} size={isMobile ? 28 : 32} animate={false} />
        <span className="font-medium hidden sm:inline">{shortAddr}</span>
        <span className="flex items-center gap-1 ml-1 md:ml-2 text-emerald-700 text-xs font-semibold">
          {sproutsLoading ? '...' : totalSprouts > 0 ? `${totalSprouts}` : '0'} <span className="text-lg">🌱</span>
        </span>
      </Button>

      {showDropdown && (
        <Card 
          ref={dropdownRef}
          className={`absolute top-full right-0 mt-2 border-emerald-100 
                     bg-white/95 backdrop-blur-sm shadow-lg z-50 ${
                       isMobile ? 'w-72' : 'w-80'
                     }`}
        >
          <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
            {/* Profile Header */}
            <div className="flex items-center gap-2 md:gap-3 border-b border-emerald-100 pb-2 md:pb-3">
              <AnimatedEmojiAvatar emoji={pfpEmoji || getRandomEmoji()} size={isMobile ? 48 : 56} animate={true} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-emerald-900 text-sm md:text-base">
                  {bloomUsername || "Anonymous Gardener"}
                </p>
                <p className="text-xs md:text-sm text-emerald-600/70">{shortAddr}</p>
              </div>
            </div>

            {/* Wallet & Access Info */}
            <div className="space-y-2">
              <div className="flex justify-between text-emerald-700 text-xs md:text-sm">
                <span>Balance</span>
                <span className="font-medium text-emerald-900">
                  {balance} {symbol}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 text-xs md:text-sm">
                <span>Sprouts Earned</span>
                {sproutsLoading ? (
                  <span className="font-medium text-emerald-900">...</span>
                ) : totalSprouts > 0 ? (
                  <span className="font-medium text-emerald-900">{totalSprouts} 🌱</span>
                ) : (
                  <span className="font-medium text-emerald-900">Plant ideas, nurture to earn sprouts</span>
                )}
              </div>
              <div className="flex justify-between text-emerald-700 text-xs md:text-sm">
                <span>Network</span>
                <Badge className="border-emerald-200 text-emerald-700 text-xs">
                  {chain.name}
                </Badge>
              </div>
              {hasVerifiedSignature && (
                <div className="flex justify-between text-emerald-700 text-xs md:text-sm">
                  <span>Garden Access</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    Verified ✅
                  </Badge>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-1 md:space-y-2 border-t border-emerald-100 pt-2">
              <Link href="/profile/me">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-emerald-700 hover:bg-emerald-50 text-xs md:text-sm"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  View Profile
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="w-full justify-start text-emerald-700 hover:bg-emerald-50 text-xs md:text-sm"
              >
                <Copy className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Copy Address
              </Button>

              {explorerUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-emerald-700 hover:bg-emerald-50 text-xs md:text-sm"
                >
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                className="w-full justify-start text-red-600 hover:bg-red-50 text-xs md:text-sm"
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
