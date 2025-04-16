"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore, fetchUserInfo } from "@/stores/auth";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { login, update } = useAuthStore();

  useEffect(() => {
    async function handleCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        if (error) {
          setStatus("error");
          setErrorMessage(errorDescription || "Authentication failed");
          return;
        }

        if (!code) {
          setStatus("error");
          setErrorMessage("No authorization code received");
          return;
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirect_uri: `${window.location.origin}${pathname}` }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors?.[1] || "Failed to authenticate");
        }
        const data = await response.json();

        // Store token and user info
        login(data.token);
        const userInfo = await fetchUserInfo();
        update(userInfo);

        setStatus("success");

        // Redirect back to the original page
        const redirectPath = decodeURIComponent(urlParams.get("state") || "/");
        // Short delay to show success message
        setTimeout(() => router.push(redirectPath), 1000);
      } catch (error) {
        console.error("Authentication error:", error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Authentication failed");
      }
    }

    handleCallback();
  }, [router, login, update]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-8 text-center shadow-lg">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary dark:text-white" />
            <h1 className="text-2xl font-bold">Signing you in...</h1>
            <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Successfully signed in!</h1>
            <p className="text-muted-foreground">Redirecting you back...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Authentication failed</h1>
            <p className="text-muted-foreground">{errorMessage || "An error occurred during sign in."}</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-white hover:bg-primary/90 hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
