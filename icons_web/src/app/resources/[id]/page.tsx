"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Download, ExternalLink, Loader2 } from "lucide-react";
import { ResourceType, resourceApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getIcon } from "../utils";
import { RequireAuth } from "@/components/require-auth";
import { hasAnyFlag, UserFlags } from "@/lib/flags";
import { useAuthStore } from "@/stores/auth";

const isYouTubeUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(url);
};

const getYouTubeVideoId = (url: string): string | null => {
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(youtubeRegex);
  return match && match[2].length === 11 ? match[2] : null;
};

// Add this component for YouTube embeds
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="mb-6 aspect-video w-full overflow-hidden rounded-md border border-primary/20 dark:border-border">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video"
      ></iframe>
    </div>
  );
};

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const resourceId = params.id as string;

  const {
    data: resource,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => resourceApi.getResource(resourceId),
  });

  const downloadMutation = useMutation({
    mutationFn: resourceApi.downloadResource,
    onSuccess: ({ url, filename }) => {
      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename ?? resource?.title ?? "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${filename ?? resource?.title}`,
      });
    },
    onError: (error) => {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading this resource",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resourceApi.deleteResource,
    onSuccess: () => {
      toast({
        title: "Resource deleted",
        description: "The resource has been successfully deleted",
      });
      router.push("/resources");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting this resource",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async () => {
    if (!resource) return;
    downloadMutation.mutate(resource.id);
    await resourceApi.trackDownload(resource.id); // Track the download
    resource.downloadCount++;
  };

  const resourceLoadError = resourceError
    ? "Failed to load resource. It may have been removed or you don't have permission to view it."
    : null;

  if (isLoadingResource) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="container flex flex-1 items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-white" />
        </main>
      </div>
    );
  }

  if (resourceLoadError || !resource) {
    return (
      <RequireAuth showMessage>
        <div className="flex min-h-screen flex-col">
          <main className="container flex-1 py-8">
            <Button variant="ghost" onClick={router.back} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
            <Card className="border-primary/20 dark:border-white/20">
              <CardContent className="p-6">
                <div className="py-8 text-center">
                  <h2 className="mb-2 text-xl font-semibold text-destructive">Resource not found</h2>
                  <p className="mb-4 text-muted-foreground">{resourceLoadError}</p>
                  <Button
                    className="bg-primary text-white hover:bg-primary/90 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                    onClick={() => router.push("/resources")}
                  >
                    Browse Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </RequireAuth>
    );
  }

  const IconComponent = getIcon(resource);

  return (
    <RequireAuth showMessage>
      <div className="flex min-h-screen flex-col">
        <main className="container flex-1 py-8">
          <Button variant="ghost" onClick={router.back} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>

          <Card className="border-primary/20 dark:border-white/20">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 dark:bg-white/10">
                <IconComponent className="h-8 w-8 text-primary dark:text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{resource.title}</CardTitle>
                <p className="mt-1 text-lg font-medium">{`${resource.course.code} - ${resource.course.name}`}</p>{" "}
                <p className="mt-1 text-sm text-muted-foreground">
                  Uploaded by {resource.author.name} on {formatDate(resource.createdAt)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="border-primary/20 text-primary">
                    {tag.name}
                  </Badge>
                ))}
                {resource.pending && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="whitespace-pre-line text-muted-foreground">{resource.description}</p>
              </div>

              <div className="mt-6 rounded-md border border-primary/20 bg-muted/30 p-4 dark:border-white/20">
                {resource.type === ResourceType.URL && isYouTubeUrl(resource.uri) && (
                  <YouTubeEmbed videoId={getYouTubeVideoId(resource.uri) || ""} />
                )}
                <div className="flex items-center justify-between">
                  <div>
                    {resource.type === ResourceType.FILE && (
                      <p className="text-sm font-medium">
                        Resource Type: <span className="text-muted-foreground">{resource.ftype}</span>
                      </p>
                    )}
                    <p className="mt-1 text-sm font-medium">
                      {(resource.type === ResourceType.URL ? "Click" : "Download") +
                        (resource.downloadCount === 1 ? "" : "s")}
                      : <span className="text-muted-foreground">{resource.downloadCount}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.type === ResourceType.URL ? (
                      <Button
                        className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                        asChild
                        onClick={() => resourceApi.trackDownload(resource.id)}
                      >
                        <a href={resource.uri} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open Resource
                        </a>
                      </Button>
                    ) : (
                      <Button
                        className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    )}
                    {hasAnyFlag(user?.flags ?? 0, [UserFlags.Admin, UserFlags.Staff]) && (
                      <Button variant="destructive" onClick={() => deleteMutation.mutate(resource.id)}>
                        <AlertTriangle className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-primary/20 pt-6">
              <p className="text-sm text-muted-foreground">
                If you find this resource helpful, please consider uploading your own materials to help other students.
              </p>
            </CardFooter>
          </Card>
        </main>
      </div>
    </RequireAuth>
  );
}
