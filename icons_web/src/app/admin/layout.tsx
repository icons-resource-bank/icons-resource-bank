"use client";

import type React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { RequireAuth } from "@/components/require-auth";
import { UserFlags } from "../../lib/flags";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RequireAuth staff>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
