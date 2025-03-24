"use client"

import { useEffect } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="container max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#4B0082]/10">
                <AlertTriangle className="h-20 w-20 text-[#4B0082]" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#4B0082]">Oops!</h1>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>

          <p className="text-muted-foreground">
            We're sorry, but we encountered an unexpected error. Our team has been notified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={reset} variant="default">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
