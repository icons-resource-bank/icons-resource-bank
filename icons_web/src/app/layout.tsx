import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iCons Resource Bank",
  description: "A platform for students to access resources for their courses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
