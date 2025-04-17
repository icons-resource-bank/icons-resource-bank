"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import {UserFlags, hasAnyFlag} from "@/lib/flags"

interface RequireAuthProps {
  children: React.ReactNode
  showMessage?: boolean
  staff?: boolean
}

export function RequireAuth({ children, showMessage = false, staff = false }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if user has required flags
  const hasRequiredFlags = () => {
    if (!staff || !user) return true
    return hasAnyFlag(user.flags, [UserFlags.Staff, UserFlags.Admin])
  }

  // Redirect if not authenticated and no message should be shown
  useEffect(() => {
    if (isClient && !isAuthenticated && !showMessage) {
      router.push("/")
    }
  }, [isAuthenticated, isClient, router, showMessage])

  // If not yet on client, show nothing to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  // If not authenticated and should show message
  if (!isAuthenticated && showMessage) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be signed in to access this page. </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If authenticated but doesn't have required flags
  if (isAuthenticated && staff && !hasRequiredFlags()) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If authenticated and has required flags, render children
  return <>{children}</>
}
