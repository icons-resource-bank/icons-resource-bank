import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";
import { SiteFooter } from "../components/site-footer";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iCons - Engineering Society of Queen's University",
  description: "A platform for students to access resources for their courses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="text/javascript"
        src="https://cdn.userway.org/widget.js"
        data-account={process.env.NEXT_PUBLIC_USERWAY_ACCOUNT_ID}
        async
      ></script>
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
      <SiteFooter />
    </>
  );
}
