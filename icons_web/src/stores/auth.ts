import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchApi, type User } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  update: (user: User) => void;
}

export async function logout() {
  await fetchApi("/auth/logout", { method: "POST" });
  useAuthStore.getState().logout();
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
