"use client";

import type React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getIconByName, yearLevels, getYearLevelLabel } from "./types";
import type { Course, Filter } from "@/lib/api";

interface CourseTableProps {
  courses: Course[] | undefined;
  filters: Filter[] | undefined;
  isLoading: boolean;
  error: unknown;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  yearLevelFilter: number;
  setYearLevelFilter: React.Dispatch<React.SetStateAction<number>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}

export function CourseTable({
  courses,
  filters,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  yearLevelFilter,
  setYearLevelFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  onEdit,
  onDelete,
}: CourseTableProps) {
  const handleYearLevelChange = (value: string) => {
    const yearLevel = parseInt(value, 10);
    setYearLevelFilter(yearLevel);
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={yearLevelFilter.toString()} onValueChange={handleYearLevelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={0} value="0">All Years</SelectItem>
            {yearLevels.map((year) => (
              <SelectItem key={year.value} value={year.value.toString()}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-destructive">
          <p>Error loading courses: {(error as Error).message}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course) => {
                const IconComponent = getIconByName(course.icon);
                return (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 dark:bg-white/10">
                        <IconComponent className="h-5 w-5 text-primary dark:text-gray-400" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{getYearLevelLabel(course.yearLevel)}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell className="max-w-xs truncate" title={course.description}>
                      {course.description ? (
                        course.description.length > 100 ? (
                          `${course.description.substring(0, 100)}...`
                        ) : (
                          course.description
                        )
                      ) : (
                        <span className="italic text-muted-foreground">No description</span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
