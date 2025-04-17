"use client";
import { User, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Account Information",
    icon: User,
  },
  {
    title: "General Settings",
    icon: Settings,
  },
  {
    title: "Privacy and Agreements",
    icon: Shield,
  },
];

interface AccountSidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export function AccountSidebar({ activeItem, setActiveItem }: AccountSidebarProps) {
  return (
    <div className="w-full bg-gray-50 p-4 md:min-h-[calc(100vh-80px)] md:w-64">
      <h2 className="mb-6 text-xl font-bold text-primary">Account Management</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <button
                onClick={() => setActiveItem(item.title)}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-left",
                  activeItem === item.title ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
