"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center bg-background p-6">
        <div className="container max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/10 dark:bg-white/10 dark:bg-opacity-10">
                <AlertTriangle className="h-20 w-20 text-primary dark:text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-primary dark:text-white">Oops!</h1>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>

          <p className="text-muted-foreground">
            We're sorry, but we encountered an unexpected error. Our team has been notified.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button
              onClick={reset}
              variant="default"
              className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            >
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
  );
}
