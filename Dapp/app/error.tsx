"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Flower2 } from "lucide-react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <Alert variant="destructive" className="max-w-md w-full">
        <Flower2 className="w-8 h-8 mb-2 text-destructive" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          {error?.message || "An unexpected error occurred. Please try again or return to the homepage."}
        </AlertDescription>
      </Alert>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => reset()} variant="outline">Try Again</Button>
        <Link href="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  )
} 