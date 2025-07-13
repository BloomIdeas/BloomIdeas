'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { mainnet, sepolia, polygon } from 'viem/chains'

export const config = getDefaultConfig({
  appName: 'Bloom Ideas',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_PROJECT_ID', // Get a project ID from https://cloud.walletconnect.com
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
}) 