"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ResourceSharingPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Share What You Know!</h1>
          <div className="flex items-center justify-center gap-2 text-lg font-medium">
            <span>Upload</span>
            <span className="text-muted-foreground">→</span>
            <span>Get Approved</span>
            <span className="text-muted-foreground">→</span>
            <span>Post</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>New Source</CardTitle>
              <CardDescription>Create sources for others to use!</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload/new_source">
                <Button className="w-full py-6 text-lg" size="lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Source
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Sources</CardTitle>
              <CardDescription>You have created the following sources:</CardDescription>
              <p className="text-xs text-muted-foreground mt-1">To edit / delete source, click on the source title.</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="https://www.youtube.com/watch?v=PmvLB5dIEp8" className="text-primary hover:underline flex items-center">
                    <span className="mr-2">•</span>
                    Crash Course Organic Chemistry
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/watch?v=g7u6pIfUVy4" className="text-primary hover:underline flex items-center">
                    <span className="mr-2">•</span>
                    All about Kinetic Energy
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
