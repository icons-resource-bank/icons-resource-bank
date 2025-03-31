"use client";

import type React from "react";

import { useEffect } from "react";
import { useAuthStore, fetchUserInfo } from "@/stores/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, update, logout } = useAuthStore();

  useEffect(() => {
    async function refreshUser() {
      if (isAuthenticated) {
        try {
          const userInfo = await fetchUserInfo();
          update(userInfo);
        } catch (error) {
          console.error("Failed to fetch user info", error);
          logout();
          return;
        }
      }
    }

    try {
      refreshUser();
    } catch (error) {
      console.error("Failed to refresh user info", error);
      logout();
    }
  }, [isAuthenticated, update, logout]);

  return <>{children}</>;
}
