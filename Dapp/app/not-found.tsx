"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Flower2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <div className="flex flex-col items-center bg-white/80 rounded-lg shadow-lg p-8 max-w-md w-full">
        <Flower2 className="w-12 h-12 mb-4 text-emerald-500" />
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  )
} 