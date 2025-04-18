"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PendingContentPage() {
  const queryClient = useQueryClient();
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

  // Fetch pending resources
  const {
    data: pendingResources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resources", "pending"],
    queryFn: () =>
      resourceApi.getResources({
        pending: true,
        limit: 100,
      }),
  });

  // Approve resource mutation
  const approveResourceMutation = useMutation({
    mutationFn: resourceApi.approveResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Resource approved",
        description: "The resource has been approved and is now available to users.",
        variant: "success",
      });
      setIsApproving(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to approve resource: ${error.message}`,
        variant: "destructive",
      });
      setIsApproving(null);
    },
  });

  // Reject resource mutation
  const rejectResourceMutation = useMutation({
    mutationFn: resourceApi.denyResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Resource rejected",
        description: "The resource has been rejected.",
      });
      setIsRejecting(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reject resource: ${error.message}`,
        variant: "destructive",
      });
      setIsRejecting(null);
    },
  });

  // Handle approve resource
  const handleApproveResource = (id: string) => {
    setIsApproving(id);
    approveResourceMutation.mutate(id);
  };

  // Handle reject resource
  const handleRejectResource = (id: string) => {
    setIsRejecting(id);
    rejectResourceMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Resources</h1>
        <p className="text-muted-foreground">Review and approve submitted resources</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>Resources waiting for administrator review</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-destructive">
              <p>Error loading pending resources: {(error as Error).message}</p>
            </div>
          ) : pendingResources?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No pending resources</h3>
              <p className="text-muted-foreground">There are no resources waiting for approval at this time.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingResources?.items.map((resource) => (
                  <TableRow key={resource.id}>
                    {/* link to /resources/id in title */}
                    <TableCell className="font-medium">
                      <a href={`/resources/${resource.id}`} className="text-blue-600 hover:underline">
                        {resource.title}
                      </a>
                    </TableCell>
                    <TableCell>{resource.course.code}</TableCell>
                    <TableCell>{resource.author.name}</TableCell>
                    <TableCell>{formatDate(resource.createdAt)}</TableCell>
                    <TableCell>{resource.ftype.toUpperCase()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveResource(resource.id)}
                        disabled={isApproving === resource.id || isRejecting === resource.id}
                      >
                        {isApproving === resource.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-1 h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectResource(resource.id)}
                        disabled={isApproving === resource.id || isRejecting === resource.id}
                      >
                        {isRejecting === resource.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-1 h-4 w-4" />
                        )}
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
