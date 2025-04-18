"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, MessageSquare, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { feedbackApi, type PaginatedResponse, type Feedback } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";

// Items per page options
const limitOptions = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

export default function FeedbackPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(25);

  // Delete confirmation state
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Feedback details modal state
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      // Reset to first page when search changes
      setOffset(0);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch feedback
  const {
    data: feedbackData,
    isLoading,
    error,
  }: {
    data?: PaginatedResponse<Feedback>;
    isLoading: boolean;
    error: Error | null;
  } = useQuery({
    queryKey: ["feedback", debouncedSearch, offset, limit],
    queryFn: () =>
      feedbackApi.getFeedback({
        offset,
        limit,
        query: debouncedSearch,
      }),
  });

  // Delete feedback mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: feedbackApi.deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      toast({
        title: "Feedback deleted",
        description: "The feedback has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete feedback: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle view feedback details
  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDetailsDialogOpen(true);
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id: string) => {
    setFeedbackToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete feedback
  const confirmDeleteFeedback = () => {
    if (feedbackToDelete !== null) {
      deleteFeedbackMutation.mutate(feedbackToDelete);
    }
  };

  // Pagination helpers
  const total = feedbackData?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + (feedbackData?.items?.length || 0), total);

  // Pagination handlers
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
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Feedback</h1>
        <p className="text-muted-foreground">View and manage user feedback submissions</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Review feedback from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <p>Error loading feedback: {(error as Error).message}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50%]">Feedback</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackData && feedbackData.items.length > 0 ? (
                  feedbackData.items.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{feedback.user.name}</div>
                          <div className="text-sm text-muted-foreground">{feedback.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDateTime(feedback.createdAt)}</TableCell>
                      <TableCell>
                        <div className="max-h-24 max-w-xs overflow-y-auto truncate whitespace-pre-wrap text-sm">
                          {feedback.comment.length > 100
                            ? `${feedback.comment.substring(0, 100)}...`
                            : feedback.comment}
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(feedback)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteFeedback(feedback.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                        <p>No feedback found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {total > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span>{" "}
              of <span className="font-medium">{total}</span> feedback items
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
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feedback from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFeedbackToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteFeedback}
              disabled={deleteFeedbackMutation.isPending}
            >
              {deleteFeedbackMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Feedback Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">User Information</h3>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="font-medium">{selectedFeedback?.user.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedFeedback?.user.email}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Submission Content</h3>
                <div className="max-h-[300px] overflow-y-auto rounded-md bg-muted/50 p-3">
                  <p className="max-w-full whitespace-pre-wrap break-words">{selectedFeedback?.comment}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">Submission Details</h3>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-sm">
                    <span className="font-medium">Feedback ID:</span> {selectedFeedback?.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Submitted:</span>{" "}
                    {selectedFeedback && formatDateTime(selectedFeedback.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (selectedFeedback) {
                  setDetailsDialogOpen(false);
                  handleDeleteFeedback(selectedFeedback.id);
                }
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Feedback
            </Button>
            <Button
              size="sm"
              className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              onClick={() => setDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
