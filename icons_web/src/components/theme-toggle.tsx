"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function applyTheme(setTheme: any, themeOption: "light" | "dark" | "system") {
    setTheme(themeOption);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = themeOption === "system" ? systemTheme : themeOption;

    document.cookie = `theme=${themeOption}; path=/; max-age=31536000`;
    document.cookie = `system-theme=${systemTheme}; path=/; max-age=31536000`;
    document.querySelector("html")?.setAttribute("data-theme", theme);
    document.querySelector("html")?.classList.remove(theme === "dark" ? "light" : "dark");
    document.querySelector("html")?.classList.add(theme);
  };

export function ThemeToggle({ themeSetting }: { themeSetting: "light" | "dark" | "system" }) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(themeSetting);

  useEffect(() => {
    if (theme === "system") {
      applyTheme(setTheme, "system");
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => applyTheme(setTheme, "light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme(setTheme, "dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme(setTheme, "system")} className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
