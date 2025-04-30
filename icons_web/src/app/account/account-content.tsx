"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth";
import type React from "react";
import { hasFlag, UserFlags } from "@/lib/flags";
import { User } from "@/lib/api";

// Alternative approach: determine role directly from user flags
function determineRoleFromFlags(user: User): string {
  if (
    hasFlag(user.flags, UserFlags.Banned) ||
    (user.tempBannedUntil !== null && new Date(user.tempBannedUntil) > new Date())
  )
    return "Banned";

  const result = [];
  if (hasFlag(user.flags, UserFlags.Admin)) result.push("Admin");
  if (hasFlag(user.flags, UserFlags.Staff)) result.push("Staff");
  if (hasFlag(user.flags, UserFlags.Trusted)) result.push("Trusted");
  return result.join(", ");
}

const AccountContent: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && typeof user.flags === "number") {
      const role = determineRoleFromFlags(user);
      setUserRole(role);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary dark:text-white">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p>
                  <span>{user?.name ?? "Loading..."}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p>{isAuthenticated && user ? userRole || "Role information not available" : "Loading..."}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p>{user?.email ?? "Loading..."}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                This information is synchronized with your Queen’s University account. If you need to update your
                personal information, please contact the Registrar’s Office.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountContent;
