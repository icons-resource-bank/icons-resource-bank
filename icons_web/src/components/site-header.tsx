"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LogIn, ChevronDown, Settings, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  // This would be replaced with actual auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("John Doe");

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/engsoc-wordmark.png"
            alt="Engineering Society"
            width={120}
            height={72}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <nav className="mx-6 flex flex-1 items-center justify-center space-x-8">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/get-involved"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Get Involved
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Services
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Resources
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Upload
          </Link>
          <Link
            href="/admin/pending"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>
        <div className="ml-auto">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <span>{username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} variant="ghost" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
