import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="container max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#4B0082]/10">
                <FileQuestion className="h-20 w-20 text-[#4B0082]" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#4B0082]">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>

          <p className="text-muted-foreground">The resource you're looking for doesn't exist or has been moved.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resources">
                <Search className="mr-2 h-4 w-4" />
                Browse Resources
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
