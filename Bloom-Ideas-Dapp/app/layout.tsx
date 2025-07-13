import '@rainbow-me/rainbowkit/styles.css';
// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ReactNode } from 'react'
import Providers from './providers'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bloom Ideas - Web3 Hackathon Platform",
  description: "Where hackathon ideas flourish in invisible gardens",
  generator: "Pranshu Rastogi",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookie = headers().get('cookie')
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers cookie={cookie}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
