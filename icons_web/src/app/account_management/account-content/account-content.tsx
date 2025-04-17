"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "../../../stores/auth";
import type React from "react";

// Alternative approach: determine role directly from user flags
function determineRoleFromFlags(flags: number): string {
  if (flags & 1) return "Admin"; // ADMIN = 1
  if (flags & 2) return "Staff"; // STAFF = 2
  if (flags & 4) return "Trusted User"; // TRUSTED = 4
  if (flags & 8) return "Banned"; // BANNED = 8
  return "Student"; // Default role
}

const AccountContent: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [userRole, setUserRole] = useState<string | null>(null);
  // Use useEffect to determine role when user data changes
  useEffect(() => {
    if (isAuthenticated && user && typeof user.flags === "number") {
      const role = determineRoleFromFlags(user.flags);
      setUserRole(role);
    } else {
      if (isAuthenticated && user) {
        console.log("User authenticated but flags not available:", user);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">
                  <span>{user?.name ?? "Please log in for this information to be displayed"}</span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900">
                  {isAuthenticated && user
                    ? userRole || "Role information not available"
                    : "Please log in for this information to be displayed"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email ?? "Please log in for this information to be displayed"}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                This information is synchronized with your Queen&apos;s University account. If you need to update your
                personal information, please contact the Registrar&apos;s Office.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountContent;
