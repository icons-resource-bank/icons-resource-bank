import { User, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    id: "account",
    title: "Account Information",
    icon: User,
  },
  {
    id: "settings",
    title: "General Settings",
    icon: Settings,
  },
  {
    id: "privacy",
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
    <div className="w-full bg-gray-50 dark:bg-footer p-4 md:min-h-[calc(100vh-80px)] md:w-64 rounded-lg shadow-md">
      <h2 className="mb-6 text-xl font-bold text-primary dark:text-white">Account Management</h2>
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-left",
                  activeItem === item.id ? "bg-primary text-white dark:bg-white/10" : "text-muted-foreground hover:bg-gray-200 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
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
