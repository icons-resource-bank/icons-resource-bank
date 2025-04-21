"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Upload, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceSidebar } from "@/components/resource/sidebar";
import { FilterDialog, type FilterOptions } from "./filter-dialog";
import { ResourceCard } from "@/components/resource/card";
import Link from "next/link";
import { courseApi, type PaginatedResponse, resourceApi, type Resource } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { RequireAuth } from "@/components/require-auth";

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseParam = searchParams.get("course");
  const searchQuery = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);
  const [filters, setFilters] = useState<FilterOptions>({
    type: null,
    ftype: [],
    tagIds: [],
    sortBy: "created_at:desc",
  });

  const getSortOptions = (sortOption: string) => {
    const [sortBy, sortOrder] = sortOption.split(":");
    return { sortBy, sortOrder } as { sortBy: string; sortOrder: "asc" | "desc" };
  };

  const getType = (type: string | null) => {
    const parsed = parseInt(type || "");
    if (isNaN(parsed)) {
      return undefined;
    }
    return parsed;
  };

  const {
    data: resourcesData,
    isLoading: isLoadingResources,
    error: resourcesError,
    refetch: refetchResources,
  }: {
    data?: PaginatedResponse<Resource>;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  } = useQuery({
    queryKey: ["resources", courseParam, currentPage, filters, searchQuery],
    queryFn: async () => {
      console.log(filters);
      return resourceApi.getResources({
        ...getSortOptions(filters.sortBy),
        courseIds: courseParam ? [courseParam] : undefined,
        query: searchQuery,
        ftype: filters.ftype.map((ft) => ft.types).flat(),
        tagIds: filters.tagIds,
        type: getType(filters.type),
      });
    },
  });

  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseParam],
    queryFn: () => courseApi.getCourse(courseParam as string),
    enabled: !!courseParam, // Only run query if courseParam exists
  });

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, courseParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }

    router.push(`/resources?${params.toString()}`);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil((resourcesData?.total || 0) / limit);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalResources = resourcesData?.total ?? 0;
  const totalPages = Math.ceil(totalResources / limit);
  const startItem = totalResources === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalResources);

  const isLoading = isLoadingResources || isLoadingCourse;

  return (
    <RequireAuth showMessage>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 overflow-hidden">
          <ResourceSidebar />
          <main className="flex h-full flex-1 flex-col border-l border-primary shadow-sm dark:border-border">
            <div className="border-primary p-6 dark:border-border">
              {courseData ? (
                <>
                  <h1 className="text-3xl font-bold">
                    {courseData.code} - {courseData.name}
                  </h1>
                  <p className="mt-1 text-muted-foreground">Category: {courseData.category}</p>
                  <p className="mt-2 max-w-3xl text-muted-foreground">{courseData.description}</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">Resources</h1>
                  <p className="text-muted-foreground">Browse and download course materials</p>
                </>
              )}
            </div>

            <div className="flex flex-col items-start justify-between border-b p-6 sm:flex-row sm:items-center">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span>Loading resources...</span>
                ) : (
                  <>
                    Showing {startItem} to {endItem} of {totalResources} resources
                    {courseData && <span> for {courseData.code}</span>}
                  </>
                )}
              </div>
              <div className="mt-4 flex w-full items-center gap-4 sm:mt-0 sm:w-auto">
                <Button asChild className="bg-primary text-white hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20">
                  <Link href="/upload" className="flex items-center gap-1 hover:border-foreground/20">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                </Button>
                <form onSubmit={handleSearch} className="relative w-full sm:w-[250px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    className="border-primary/20 pl-9 dark:border-border"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </form>
                <FilterDialog onApplyFilters={handleApplyFilters} initialFilters={filters} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-white" />
                </div>
              ) : resourcesError ? (
                <div className="rounded-lg border border-primary/20 bg-background py-12 text-center shadow-sm dark:border-border">
                  <h3 className="mb-2 text-lg font-medium text-destructive">Error</h3>
                  <p className="text-muted-foreground">Failed to load resources. Please try again.</p>
                  <Button onClick={refetchResources} className="mt-4 bg-primary text-white hover:bg-primary/90 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                    Try Again
                  </Button>
                </div>
              ) : totalResources > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resourcesData?.items.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
                </div>
              ) : (
                <div className="rounded-lg border border-primary/20 bg-background py-12 text-center shadow-sm">
                  <h3 className="mb-2 text-lg font-medium">No resources found</h3>
                  <p className="text-muted-foreground">
                    {courseData
                      ? `There are no resources available for ${courseData.code} yet.`
                      : searchQuery
                        ? "No resources match your search criteria."
                        : "No resources available."}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalResources > 0 && (
              <div className="flex items-center justify-between border-t border-primary/20 px-6 py-4 dark:border-border">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{startItem}</span> to{" "}
                  <span className="font-medium">{endItem}</span> of{" "}
                  <span className="font-medium">{totalResources}</span> resources
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
              </div>
            )}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
