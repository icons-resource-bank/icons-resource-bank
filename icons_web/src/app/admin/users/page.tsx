"use client";

import {
  Search,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  UserCheck,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { hasFlag, UserFlags } from "@/lib/flags";
import { userApi, type User } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

const flagFilterOptions = [
  { value: "all", label: "All Users" },
  { value: UserFlags.Admin.toString(), label: "Admins" },
  { value: UserFlags.Staff.toString(), label: "Staff" },
  { value: UserFlags.Trusted.toString(), label: "Trusted Users" },
  { value: UserFlags.Banned.toString(), label: "Banned Users" },
];

const limitOptions = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

const banDurations = [
  { id: "1d", label: "1 Day", value: 1 },
  { id: "3d", label: "3 Days", value: 3 },
  { id: "7d", label: "7 Days", value: 7 },
  { id: "2w", label: "2 Weeks", value: 14 },
  { id: "1m", label: "1 Month", value: 30 },
  { id: "3m", label: "3 Months", value: 90 },
  { id: "permanent", label: "Permanently", value: -1 },
];

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [flagFilter, setFlagFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1); // For UI display only
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(25);

  // State for user actions
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedFlags, setSelectedFlags] = useState<number>(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [selectedBanDuration, setSelectedBanDuration] = useState<string>("");
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      // Reset to first page when search changes
      setOffset(0);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setOffset(0);
    setCurrentPage(1);
  }, [flagFilter]);

  // Convert flagFilter to number for API call
  const getFlagFilterValue = (): number | undefined => {
    if (flagFilter === "all") return undefined;
    return Number.parseInt(flagFilter, 10);
  };

  const {
    data: usersData,
    isLoading,
    error,
  }: {
    data?: { items: User[]; total: number };
    isLoading: boolean;
    error: unknown;
  } = useQuery({
    queryKey: ["users", debouncedSearch, flagFilter, offset, limit],
    queryFn: () =>
      userApi.getUsers({
        search: debouncedSearch,
        flagFilter: getFlagFilterValue(),
        offset,
        limit,
      }),
  });

  const banUserMutation = useMutation({
    mutationFn: userApi.banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User banned",
        description: `${userToBan?.name} has been banned successfully.`,
      });
      setBanDialogOpen(false);
      setUserToBan(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ban user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: userApi.unbanUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User unbanned",
        description: "User has been unbanned successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to unban user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateUserFlagsMutation = useMutation({
    mutationFn: ({ userId, flags }: { userId: string; flags: number }) => userApi.updateUserFlags(userId, flags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User updated",
        description: `User permissions have been updated successfully.`,
      });
      setEditDialogOpen(false);
      setUserToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getUserRoleText = (flags: number): string => {
    if (hasFlag(flags, UserFlags.Admin)) return "Admin";
    if (hasFlag(flags, UserFlags.Staff)) return "Staff";
    if (hasFlag(flags, UserFlags.Trusted)) return "Trusted";
    return "Student";
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setSelectedFlags(user.flags);
    setEditDialogOpen(true);
  };

  const handleFlagChange = (flag: UserFlags, checked: boolean) => {
    setSelectedFlags((prev) => {
      let newFlags = prev;

      if (checked) {
        // Only one of Admin or Staff should be given
        if (flag === UserFlags.Admin) {
          newFlags = (prev & ~UserFlags.Staff) | flag;
        } else if (flag === UserFlags.Staff) {
          newFlags = (prev & ~UserFlags.Admin) | flag;
        } else {
          newFlags = prev | flag;
        }
      } else {
        // Remove the flag
        newFlags = prev & ~flag;
      }

      return newFlags;
    });
  };

  const handleUpdateFlags = () => {
    if (userToEdit) {
      updateUserFlagsMutation.mutate({
        userId: userToEdit.id,
        flags: selectedFlags,
      });
    }
  };

  const handleBanUser = (user: User) => {
    setUserToBan(user);
    setSelectedBanDuration("7d"); // Default to 7 days
    setBanDialogOpen(true);
  };

  const handleBanSubmit = () => {
    if (userToBan && selectedBanDuration) {
      const banDuration = parseInt(selectedBanDuration, 10);
      banUserMutation.mutate({
        userId: userToBan.id,
        until: Number.isNaN(banDuration)
          ? null
          : new Date(Date.now() + banDuration * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  };

  const handleUnbanUser = (userId: string) => {
    unbanUserMutation.mutate(userId);
  };

  const isBanFormValid = () => {
    return selectedBanDuration.trim().length > 0;
  };

  // Update pagination helpers
  const total = usersData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + (usersData?.items.length || 0), total);

  // Update pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setOffset((newPage - 1) * limit);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setOffset((newPage - 1) * limit);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const numLimit = Number(newLimit);
    setLimit(numLimit);
    setOffset(0);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const isBanned = (user: User) => {
    return (
      hasFlag(user.flags, UserFlags.Banned) ||
      (user.tempBannedUntil !== null && new Date(user.tempBannedUntil) > new Date())
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">View and manage user accounts</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Search and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={flagFilter} onValueChange={setFlagFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {flagFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[250px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <p>Error loading users: {(error as Error).message}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {total > 0 ? (
                  usersData?.items.map((user) => (
                    <TableRow key={user.id} className={isBanned(user) ? "bg-red-50 dark:bg-red-950/20" : ""}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getUserRoleText(user.flags)}
                          {hasFlag(user.flags, UserFlags.AnalyticsOptOut) && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <BarChart2 className="mr-1 h-3 w-3" />
                              Analytics Opt-Out
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isBanned(user) ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Banned
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {user.tempBannedUntil ? `until ${formatDateTime(user.tempBannedUntil)}` : "permanently"}
                            </span>
                          </div>
                        ) : (
                          "Active"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          disabled={!hasFlag(currentUser?.flags ?? 0, UserFlags.Admin)}
                        >
                          Edit Permissions
                        </Button>
                        {isBanned(user) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-accent"
                            onClick={() => handleUnbanUser(user.id)}
                            disabled={unbanUserMutation.isPending}
                          >
                            {unbanUserMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Unban
                          </Button>
                        ) : (
                          <Button variant="destructive" size="sm" onClick={() => handleBanUser(user)}>
                            Ban
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span>{" "}
              of <span className="font-medium">{total}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              {/* Update the pagination UI to show current page */}
              <div className="text-sm">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages || 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        }
      </Card>

      {/* Edit User Permissions Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>Update permissions for {userToEdit?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">User Roles</Label>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-role"
                    checked={hasFlag(selectedFlags, UserFlags.Admin)}
                    onCheckedChange={(checked) => handleFlagChange(UserFlags.Admin, checked === true)}
                  />
                  <Label htmlFor="admin-role" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary dark:text-white" />
                    Admin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="staff-role"
                    checked={hasFlag(selectedFlags, UserFlags.Staff)}
                    onCheckedChange={(checked) => handleFlagChange(UserFlags.Staff, checked === true)}
                  />
                  <Label htmlFor="staff-role" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary dark:text-white" />
                    Staff
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trusted-role"
                    checked={hasFlag(selectedFlags, UserFlags.Trusted)}
                    onCheckedChange={(checked) => handleFlagChange(UserFlags.Trusted, checked === true)}
                  />
                  <UserCheck className="h-4 w-4 text-primary dark:text-white" />
                  <Label htmlFor="trusted-role">Trusted User</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateUserFlagsMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              onClick={handleUpdateFlags}
              disabled={updateUserFlagsMutation.isPending}
            >
              {updateUserFlagsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>Select how long to ban {userToBan?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="ban-duration" className="mb-3 block">
              Ban Duration*
            </Label>
            <Select value={selectedBanDuration} onValueChange={setSelectedBanDuration}>
              <SelectTrigger id="ban-duration" className="w-full">
                <SelectValue placeholder="Select ban duration" />
              </SelectTrigger>
              <SelectContent>
                {banDurations.map((duration) => (
                  <SelectItem key={duration.id} value={duration.id}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)} disabled={banUserMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanSubmit}
              disabled={!isBanFormValid() || banUserMutation.isPending}
            >
              {banUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Banning...
                </>
              ) : (
                "Ban User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
