"use client";

import type React from "react";

import { useEffect } from "react";
import { userApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, update, logout } = useAuthStore();

  useEffect(() => {
    async function refreshUser() {
      if (isAuthenticated) {
        try {
          const userInfo = await userApi.getCurrentUser();
          update(userInfo);
        } catch (error) {
          console.error("Failed to fetch user info", error);
          logout();
        }
      }
    }
    refreshUser();

  }, [isAuthenticated, update, logout]);

  return <>{children}</>;
}
