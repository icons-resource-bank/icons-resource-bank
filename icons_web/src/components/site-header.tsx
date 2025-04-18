"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, ChevronDown, Settings, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore, logout } from "@/stores/auth";
import { hasAnyFlag, UserFlags } from "@/lib/flags";
import { cn } from "@/lib/utils";

const AUTH_REDIRECT_URI =
  typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "http://localhost:3000/auth/callback";

export function SiteHeader({ themeSetting }: { themeSetting: "light" | "dark" | "system" }) {
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to Microsoft login
    const authUrl =
      `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?` +
      `client_id=${process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(AUTH_REDIRECT_URI)}` +
      `&response_mode=query` +
      `&scope=openid%20profile%20email` +
      `&state=${encodeURIComponent(pathname || "/")}`;

    window.location.href = authUrl;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isStaff = () => {
    if (!isAuthenticated) return false;
    return hasAnyFlag(user?.flags ?? 0, [UserFlags.Staff, UserFlags.Admin]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center">
          {/* One image per theme */}
          <Image
            src={`/images/engsoc-wordmark-light.png`}
            alt="Engineering Society"
            width={120}
            height={72}
            className="h-12 w-auto dark:hidden"
            priority
          />
          <Image
            src={`/images/engsoc-wordmark-dark.png`}
            alt="Engineering Society"
            width={120}
            height={72}
            className="hidden h-12 w-auto dark:block"
            priority
          />
        </Link>
        <nav className="mx-6 flex flex-1 items-center justify-center space-x-8">
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/about"
                ? "text-primary dark:text-white"
                : "text-muted-foreground hover:text-primary dark:hover:text-white",
            )}
          >
            About
          </Link>
          <Link
            href="/get-involved"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/get-involved"
                ? "text-primary dark:text-white"
                : "text-muted-foreground hover:text-primary dark:hover:text-white",
            )}
          >
            Get Involved
          </Link>

          <Link
            href="/resources"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/resources"
                ? "text-primary dark:text-white"
                : "text-muted-foreground hover:text-primary dark:hover:text-white",
            )}
          >
            Resources
          </Link>
          <Link
            href="/upload"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname.startsWith("/upload")
                ? "text-primary dark:text-white"
                : "text-muted-foreground hover:text-primary dark:hover:text-white",
            )}
          >
            Upload
          </Link>
          {isStaff() && (
            <Link
              href="/admin/pending"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "text-primary dark:text-white"
                  : "text-muted-foreground hover:text-primary dark:hover:text-white",
              )}
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle themeSetting={themeSetting} />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <span>{user?.name ?? "Unknown"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account_management")}>
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
