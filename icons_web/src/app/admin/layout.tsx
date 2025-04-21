"use client";

import type React from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { RequireAuth } from "@/components/require-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth staff showMessage>
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto flex-1 pt-8">
          <div className="flex flex-row flex-1 gap-6">
            <AdminSidebar />
            <div className="flex-1">{children}</div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
