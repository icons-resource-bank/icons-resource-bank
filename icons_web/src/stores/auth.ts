import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchApi } from "@/lib/api";


interface User {
  id: string;
  name: string;
  email: string;
  flags: number;
  created_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  update: (user: User) => void;
}

export async function fetchUserInfo() {
  return await fetchApi("/users/@me", { method: "GET" });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
      update: (user) => set({ user }),
    }),
    {
      name: "auth-store",
    },
  ),
);
