"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  File,
  X,
  Loader2,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceApi, courseApi, filterApi, ResourceType } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { RequireAuth } from "@/components/require-auth";
import { useAuthStore } from "@/stores/auth";

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/x-rar-compressed",
  "image/jpeg",
  "image/png",
  "image/gif",
];

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function UploadPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [resourceType, setResourceType] = useState<ResourceType>(ResourceType.FILE);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuthStore();

  // Pagination state for user resources
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  // Fetch courses for dropdown
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseApi.getCourses(),
  });

  // Fetch tags/filters for selection
  const { data: filters, isLoading: isLoadingFilters } = useQuery({
    queryKey: ["filters"],
    queryFn: () => filterApi.getFilters(),
  });

  // Fetch user's uploaded resources
  const {
    data: userResourcesData,
    isLoading: isLoadingUserResources,
    error: userResourcesError,
  } = useQuery({
    queryKey: ["userResources", offset, limit],
    queryFn: () => resourceApi.getResources({ offset, limit, authorIds: [user.id] }),
  });

  // Upload resource mutation
  const uploadResourceMutation = useMutation({
    mutationFn: resourceApi.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userResources"] });
      toast({
        title: "Resource uploaded",
        description: "Your resource has been uploaded and is pending approval.",
        variant: "success",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload resource",
        variant: "destructive",
      });
    },
  });

  // Validate form fields
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (title && (title.length < 4 || title.length > 64)) {
      newErrors.title = "Title must be between 4 and 64 characters";
    }

    if (description && (description.length < 8 || description.length > 4096)) {
      newErrors.description = "Description must be between 8 and 4096 characters";
    }

    if (resourceType === ResourceType.URL && url && (url.length < 10 || url.length > 2048)) {
      newErrors.url = "URL must be between 10 and 2048 characters";
    }

    if (selectedTagIds.length > 10) {
      newErrors.tags = "You can select up to 10 tags";
    }

    setErrors(newErrors);
  }, [title, description, url, resourceType, selectedTagIds]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        file: `File size exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}`,
      }));
      setFile(null);
      return;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "File type not supported",
      }));
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.file;
      return newErrors;
    });
  };

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        if (prev.length >= 10) {
          toast({
            title: "Maximum tags reached",
            description: "You can select up to 10 tags",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, tagId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (!title) {
      newErrors.title = "Title is required";
    } else if (title.length < 4 || title.length > 64) {
      newErrors.title = "Title must be between 4 and 64 characters";
    }

    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 8 || description.length > 4096) {
      newErrors.description = "Description must be between 8 and 4096 characters";
    }

    if (!courseId) {
      newErrors.courseId = "Course is required";
    }

    if (resourceType === ResourceType.FILE && !file) {
      newErrors.file = "Please select a file to upload";
    }

    if (resourceType === ResourceType.URL) {
      if (!url) {
        newErrors.url = "URL is required";
      } else if (url.length < 10 || url.length > 2048) {
        newErrors.url = "URL must be between 10 and 2048 characters";
      } else {
        try {
          new URL(url);
        } catch (e) {
          newErrors.url = "Please enter a valid URL";
        }
      }
    }

    if (selectedTagIds.length > 10) {
      newErrors.tags = "You can select up to 10 tags";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    uploadResourceMutation.mutate({
      title,
      description,
      courseId,
      resourceType,
      file: resourceType === ResourceType.FILE ? file : null,
      url: resourceType === ResourceType.URL ? url : null,
      tagIds: selectedTagIds,
    });
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCourseId("");
    setResourceType(ResourceType.FILE);
    setUrl("");
    setFile(null);
    setSelectedTagIds([]);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Pagination helpers
  const total = userResourcesData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const startItem = total === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + (userResourcesData?.items.length || 0), total);

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

  return (
    <RequireAuth showMessage={true}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Upload Resources</h1>
          <p className="text-muted-foreground">
            Share your notes, study guides, and other resources with fellow students
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload New Resource</TabsTrigger>
            <TabsTrigger value="my-resources">My Uploads</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload a Resource</CardTitle>
                <CardDescription>
                  Share your study materials with other students. All uploads will be reviewed before being published.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title*</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Calculus I Midterm Study Guide"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      <p className="text-xs text-muted-foreground">4-64 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course*</Label>
                      <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger id="course" className={errors.courseId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCourses || typeof courses === "undefined" ? (
                            <div className="p-2">Loading courses...</div>
                          ) : (
                            courses?.items?.map?.((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.code} - {course.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.courseId && <p className="text-sm text-red-500">{errors.courseId}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a brief description of your resource..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    <p className="text-xs text-muted-foreground">8-4096 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Resource Type*</Label>
                    <RadioGroup
                      value={resourceType.toString()}
                      onValueChange={(value) => setResourceType(parseInt(value) as ResourceType)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={ResourceType.FILE.toString()} id="resource-type-file" />
                        <Label htmlFor="resource-type-file" className="cursor-pointer">
                          File Upload
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={ResourceType.URL.toString()} id="resource-type-url" />
                        <Label htmlFor="resource-type-url" className="cursor-pointer">
                          External URL
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {resourceType === ResourceType.FILE ? (
                    <div className="space-y-2">
                      <Label htmlFor="file">File Upload*</Label>
                      <div
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 ${
                          errors.file ? "border-red-500" : "border-border"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept={ALLOWED_FILE_TYPES.join(",")}
                        />
                        {file ? (
                          <div className="flex flex-col items-center">
                            <File className="mb-2 h-10 w-10 text-primary" />
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP, RAR, JPG, PNG, GIF (Max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="url">Resource URL*</Label>
                      <div className="flex">
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com/resource"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className={errors.url ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                      <p className="text-xs text-muted-foreground">Enter a valid URL to an external resource</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Tags (Optional)</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {isLoadingFilters ? (
                        <p className="text-sm text-muted-foreground">Loading tags...</p>
                      ) : (
                        filters?.map((filter) => {
                          const isSelected = selectedTagIds.includes(filter.id.toString());
                          return (
                            <Badge
                              key={filter.id}
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer ${isSelected ? "" : "hover:bg-secondary"}`}
                              onClick={() => toggleTag(filter.id.toString())}
                            >
                              {filter.name}
                              {isSelected && (
                                <X
                                  className="ml-1 h-3 w-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(filter.id.toString());
                                  }}
                                />
                              )}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                    {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                    <p className="text-xs text-muted-foreground">Select up to 10 tags</p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        uploadResourceMutation.isPending ||
                        Object.keys(errors).length > 0 ||
                        !title ||
                        !description ||
                        !courseId ||
                        (resourceType === ResourceType.FILE && !file) ||
                        (resourceType === ResourceType.URL && !url)
                      }
                    >
                      {uploadResourceMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Resource
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-resources">
            <Card>
              <CardHeader>
                <CardTitle>My Uploaded Resources</CardTitle>
                <CardDescription>Manage resources you've uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUserResources ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3">
                            <Skeleton className="h-5 w-[250px]" />
                            <Skeleton className="h-4 w-[90%]" />
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-4 w-[120px]" />
                              <Skeleton className="h-10 w-[100px]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : userResourcesError ? (
                  <div className="flex items-center justify-center py-8 text-destructive">
                    <p>Error loading your resources: {(userResourcesError as Error).message}</p>
                  </div>
                ) : userResourcesData?.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No uploads yet</h3>
                    <p className="text-muted-foreground">
                      You haven't uploaded any resources yet. Start sharing your knowledge!
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        document
                          .querySelector('[data-value="upload"]')
                          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Resource
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userResourcesData?.items.map((resource) => (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-medium">{resource.title}</h3>
                              <div className="flex items-center gap-2">
                                {resource.type === ResourceType.FILE ? (
                                  <Badge variant="outline" className="ml-2">
                                    {resource.ftype.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="ml-2">
                                    <Link className="mr-1 h-3 w-3" />
                                    URL
                                  </Badge>
                                )}
                                {resource.pending && (
                                  <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800">
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    Pending Approval
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{resource.description}</p>
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {resource.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-2">
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">{resource.course?.code}</span> • Uploaded{" "}
                                {formatDate(resource.createdAt)}
                                {resource.downloadCount !== undefined && <> • {resource.downloadCount} downloads</>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
              {total > 0 && (
                <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{startItem}</span> to{" "}
                    <span className="font-medium">{endItem}</span> of <span className="font-medium">{total}</span>{" "}
                    resources
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1 || isLoadingUserResources}
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
                      disabled={currentPage >= totalPages || isLoadingUserResources}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
}
