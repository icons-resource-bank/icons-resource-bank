import "@/styles/globals.css";

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { cookies } from "next/headers";
import type React from "react";

import { Providers } from "./providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toast"

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iCons - Engineering Society of Queen's University",
  description: "A platform for students to access resources for their courses",
};

export default async function RootLayout({ children }: { children: React.ReactNode; theme: string }) {
  const values = await cookies();
  let themeSetting = values.get("theme")?.value || "system";
  let systemTheme = values.get("system-theme")?.value || "light";
  if (!["light", "dark", "system"].includes(themeSetting)) {
    themeSetting = "system";
  }
  if (!["light", "dark"].includes(systemTheme)) {
    systemTheme = "light";
  }
  const theme = themeSetting === "system" ? systemTheme : themeSetting;

  return (
    <>
      <html lang="en" suppressHydrationWarning className={theme === "dark" ? "dark" : ""} data-theme={theme}>
        <head>
          <script
            type="text/javascript"
            src="https://cdn.userway.org/widget.js"
            data-account={process.env.NEXT_PUBLIC_USERWAY_ACCOUNT_ID}
            async
          ></script>
        </head>
        <body className={`${font.className} flex min-h-screen flex-col`}>
          <Providers>
            <SiteHeader themeSetting={themeSetting as "light" | "dark" | "system"} />
            <div className="flex-1">{children}</div>
          </Providers>
        </body>
      </html>
      <SiteFooter />
      <Toaster />
    </>
  );
}
