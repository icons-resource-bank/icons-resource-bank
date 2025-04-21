"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookCheck, FileCheck, LayoutDashboard, Users, MessageSquare } from "lucide-react";

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
    title: "Ingest Feedback",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full rounded-lg bg-gray-50 p-4 shadow-md md:min-h-[calc(100vh-80px)] md:w-64 dark:bg-footer">
      <h2 className="mb-6 text-xl font-bold text-primary dark:text-white">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.title}>
                <button
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-left",
                    isActive
                      ? "bg-primary text-white dark:bg-white/10"
                      : "text-muted-foreground hover:bg-gray-200 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
