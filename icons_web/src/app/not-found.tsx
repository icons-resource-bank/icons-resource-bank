import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-6">
        <div className="container max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/10 dark:bg-white/10 dark:bg-opacity-10">
                <FileQuestion className="h-20 w-20 text-primary dark:text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-primary dark:text-white">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>

          <p className="text-muted-foreground">The resource you're looking for doesn't exist or has been moved.</p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button
              asChild
              className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            >
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
  );
}
