"use client";

import { Open_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw } from "lucide-react";

const font = Open_Sans({ subsets: ["latin"] });

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        className={`${font.className} flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6`}
      >
        <main className="container max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#4B0082]/10">
                <AlertOctagon className="h-20 w-20 text-[#4B0082]" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#4B0082]">Critical Error</h1>
          <h2 className="text-2xl font-semibold">Application Crashed</h2>

          <p className="text-gray-600">
            We're sorry, but the application has encountered a critical error. Please try refreshing the page.
          </p>

          <div className="flex justify-center pt-4">
            <Button onClick={reset} variant="default" size="lg">
              <RefreshCcw className="mr-2 h-5 w-5" />
              Refresh Application
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
