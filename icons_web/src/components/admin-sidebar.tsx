"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookCheck, FileCheck, LayoutDashboard, Settings, Users } from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pending Content",
    href: "/admin/pending",
    icon: FileCheck,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manage Courses",
    href: "/admin/courses",
    icon: BookCheck,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-100 w-64 flex-col bg-[#273655] text-white">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
