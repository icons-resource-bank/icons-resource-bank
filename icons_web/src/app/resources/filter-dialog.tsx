"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Loader2 } from "lucide-react";
import { type Filter as FilterType, filterApi, ResourceType } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { colorIntToHex } from "@/lib/utils";

const resourceTypes = [
  { id: "all", label: "All" },
  { id: ResourceType.URL.toString(), label: "Link" },
  { id: ResourceType.FILE.toString(), label: "File" },
];

interface FileType {
  id: string;
  label: string;
  types: string[];
}

const fileTypes: FileType[] = [
  { id: "docs", label: "Documents", types: ["pdf", "docx", "doc", "txt"] },
  { id: "sheets", label: "Spreadsheets", types: ["xlsx", "xls"] },
  { id: "slides", label: "Presentations", types: ["pptx", "ppt"] },
  { id: "video", label: "Videos", types: ["mp4", "mov", "avi", "video"] },
  { id: "audio", label: "Audio", types: ["mp3", "wav", "audio"] },
];

const sortOptions = [
  { id: "query:desc", label: "Most Relevant" },
  { id: "created_at:desc", label: "Newest First" },
  { id: "created_at:asc", label: "Oldest First" },
];

export interface FilterOptions {
  type: string | null;
  ftype: FileType[];
  tagIds: string[];
  sortBy: string;
}

interface FilterDialogProps {
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export function FilterDialog({ onApplyFilters, initialFilters }: FilterDialogProps) {
  const [selectedResourceType, setSelectedResourceType] = useState<string | null>(initialFilters?.type || "all");
  const [selectedFileTypes, setSelectedFileTypes] = useState<FileType[]>(initialFilters?.ftype || []);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialFilters?.tagIds || []);
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || "query:desc");
  const [tags, setTags] = useState<FilterType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const fetchedTags = await filterApi.getFilters();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast({
        title: "Error",
        description: "Failed to load tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceTypeChange = (value: string) => {
    setSelectedResourceType(value);
  };

  const handleFileTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      const selectedType = fileTypes.find((type) => type.id === typeId);
      if (!selectedType) return;
      setSelectedFileTypes([...selectedFileTypes, selectedType]);
    } else {
      setSelectedFileTypes(selectedFileTypes.filter((type) => type.id !== typeId));
    }
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    } else {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleReset = () => {
    setSelectedResourceType("all");
    setSelectedTagIds([]);
    setSortBy("created_at:desc");
    setSelectedFileTypes([]);
  };

  const handleApply = () => {
    onApplyFilters({
      type: selectedResourceType,
      ftype: selectedFileTypes,
      tagIds: selectedTagIds,
      sortBy,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center  border-border shadow-sm">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border shadow-md sm:max-w-[500px] dark:border-border">
        <DialogHeader>
          <DialogTitle>Filter Resources</DialogTitle>
          <DialogDescription>Refine your search with the following filters</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-6 overflow-y-auto py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resource Type</h3>
            <RadioGroup value={selectedResourceType || "all"} onValueChange={handleResourceTypeChange}>
              <div className="grid grid-cols-1 gap-3">
                {resourceTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                    <Label htmlFor={`type-${type.id}`} className="text-sm">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">File Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {fileTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ftype-${type.id}`}
                    checked={selectedFileTypes.includes(type)}
                    onCheckedChange={(checked) => handleFileTypeChange(type.id, checked === true)}
                  />
                  <Label htmlFor={`ftype-${type.id}`} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tags</h3>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : tags.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTagIds.includes(tag.id)}
                      onCheckedChange={(checked) => handleTagChange(tag.id, checked === true)}
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorIntToHex(tag.color) }} />
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags available</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sort By</h3>
            <RadioGroup value={sortBy} onValueChange={handleSortChange}>
              <div className="grid grid-cols-2 gap-3">
                {sortOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                    <Label htmlFor={`sort-${option.id}`} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="hover:bg-foreground/20">
            Reset
          </Button>
          <Button
            className="text-primary-foreground text-white hover:bg-primary/90 hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
