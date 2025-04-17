"use client"

import type React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Video, FileAudio, File, ExternalLink } from "lucide-react"
import Link from "next/link"
import { type Resource, ResourceType, resourceApi } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import {getIcon } from "@/app/resources/utils"

const isYouTubeUrl = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(url);
};

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Determine the icon based on the resource type
  const IconComponent = getIcon(resource);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { url, filename } = await resourceApi.downloadResource(resource.id);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${filename || resource.title}`,
      });
      await resourceApi.trackDownload(resource.id); // Track the download
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading this resource",
        variant: "destructive",
      });
    }
  };

  const cardContent = (
    <>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            {/* Fix flashing when hover */}
            <h3 className="line-clamp-2 font-semibold">{resource.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{resource.course.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {resource.downloadCount}{" "}
              {resource.type === ResourceType.URL ? "click" : "download" + (resource.downloadCount === 1 ? "" : "s")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="border-primary/20 text-primary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-[#d8c5e9] bg-muted/30 px-6 py-3">
        <div className="text-xs text-muted-foreground">Uploaded {formatDate(resource.createdAt)}</div>
        {resource.type === ResourceType.URL ? (
          <Button
            size="sm"
            className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            asChild
          >
            <a href={resource.uri} target="_blank" rel="noopener noreferrer">
              {isYouTubeUrl(resource.uri) ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                  <span className="sr-only md:not-sr-only">YouTube</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Link</span>
                </>
              )}
            </a>
          </Button>
        ) : (
          <Button
            size="sm"
            className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Download</span>
          </Button>
        )}
      </CardFooter>
    </>
  );

  return (
    <Card className="resource-card group cursor-pointer overflow-hidden border border-[#d8c5e9] bg-card shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:hover:border-primary/70">
      <Link
        href={`/resources/${resource.id}`}
        className="resource-card-link block h-full transition-colors hover:text-primary dark:hover:text-primary/90"
      >
        {cardContent}
      </Link>
    </Card>
  );
}
