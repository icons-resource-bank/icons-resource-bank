"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type CourseFormData,
  courseIcons,
  getIconByName,
  yearLevels,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_CATEGORY_LENGTH,
  MIN_COURSE_CODE_LENGTH,
  MAX_COURSE_CODE_LENGTH,
  MIN_COURSE_NAME_LENGTH,
  MAX_COURSE_NAME_LENGTH,
} from "./types";

interface CourseFormProps {
  courseForm: CourseFormData;
  setCourseForm: React.Dispatch<React.SetStateAction<CourseFormData>>;
  courseFormOpen: boolean;
  setCourseFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditingCourse: boolean;
  resetCourseForm: () => void;
  handleCourseSubmit: () => void;
  isCourseFormValid: () => boolean;
  isPending: boolean;
  categories: string[];
}

export function CourseForm({
  courseForm,
  setCourseForm,
  courseFormOpen,
  setCourseFormOpen,
  isEditingCourse,
  resetCourseForm,
  handleCourseSubmit,
  isCourseFormValid,
  isPending,
  categories,
}: CourseFormProps) {
  const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({});
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  useEffect(() => {
    if (courseFormOpen) {
      setCategoryInputValue(courseForm.category);
    }
  }, [courseFormOpen, courseForm.category, courseForm.description.length]);

  // Handle course form input change
  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    if (id === "description") {
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        setCourseForm((prev) => ({ ...prev, [id]: value }));
      }
      validateCourseField("description", value);
    } else if (id === "code") {
      if (value.length <= MAX_COURSE_CODE_LENGTH) {
        setCourseForm((prev) => ({ ...prev, [id]: value }));
      }
      validateCourseField("code", value);
    } else if (id === "name") {
      if (value.length <= MAX_COURSE_NAME_LENGTH) {
        setCourseForm((prev) => ({ ...prev, [id]: value }));
      }
      validateCourseField("name", value);
    } else if (id === "category") {
      if (value.length <= MAX_CATEGORY_LENGTH) {
        setCourseForm((prev) => ({ ...prev, [id]: value }));
        setCategoryInputValue(value);

        // Filter categories for suggestions
        if (value.trim()) {
          const filtered = categories.filter((cat) => cat.toLowerCase().includes(value.toLowerCase()));
          setFilteredCategories(filtered);
          setShowCategorySuggestions(true);
        } else {
          setFilteredCategories([]);
          setShowCategorySuggestions(false);
        }

        validateCourseField("category", value);
      }
    } else {
      setCourseForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Handle category suggestion selection
  const handleCategorySelect = (category: string) => {
    setCourseForm((prev) => ({ ...prev, category }));
    setCategoryInputValue(category);
    setShowCategorySuggestions(false);
    validateCourseField("category", category);
  };

  // Validate course field
  const validateCourseField = (field: string, value: string) => {
    let error = "";

    if (field === "code") {
      if (value.trim().length < MIN_COURSE_CODE_LENGTH) {
        error = `Course code must be at least ${MIN_COURSE_CODE_LENGTH} characters`;
      } else if (value.length > MAX_COURSE_CODE_LENGTH) {
        error = `Course code must be at most ${MAX_COURSE_CODE_LENGTH} characters`;
      }
    } else if (field === "name") {
      if (value.trim().length < MIN_COURSE_NAME_LENGTH) {
        error = `Course name must be at least ${MIN_COURSE_NAME_LENGTH} characters`;
      } else if (value.length > MAX_COURSE_NAME_LENGTH) {
        error = `Course name must be at most ${MAX_COURSE_NAME_LENGTH} characters`;
      }
    } else if (field === "category") {
      if (value.trim().length === 0) {
        error = "Category is required";
      } else if (value.length > MAX_CATEGORY_LENGTH) {
        error = `Category must be at most ${MAX_CATEGORY_LENGTH} characters`;
      }
    } else if (field == "description") {
      if (value.trim().length < MIN_DESCRIPTION_LENGTH) {
        error = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
      } else if (value.length > MAX_DESCRIPTION_LENGTH) {
        error = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`;
      }
    }

    setCourseFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  // Close category suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector(".category-dropdown");
      const input = document.getElementById("category");
      const dropdownButton = document.querySelector(".category-dropdown-button");

      // Don't close if clicking on the dropdown, input, or dropdown button
      if (
        (dropdown && dropdown.contains(target)) ||
        (input && input.contains(target)) ||
        (dropdownButton && dropdownButton.contains(target))
      ) {
        return;
      }

      // Close if clicking elsewhere
      setShowCategorySuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Dialog
      open={courseFormOpen}
      onOpenChange={(open) => {
        setCourseFormOpen(open);
        if (!open) resetCourseForm();
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {isEditingCourse ? "Edit course details" : "Add a new course to the resource bank"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Course Code*</Label>
              <Input
                id="code"
                placeholder="e.g., MATH 121"
                value={courseForm.code}
                onChange={handleCourseInputChange}
                className={courseFormErrors.code ? "border-red-500" : ""}
              />
              {courseFormErrors.code && <p className="text-xs text-red-500">{courseFormErrors.code}</p>}
              <p className="text-xs text-muted-foreground">
                {courseForm.code.length}/{MAX_COURSE_CODE_LENGTH} characters
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name*</Label>
              <Input
                id="name"
                placeholder="e.g., Calculus I"
                value={courseForm.name}
                onChange={handleCourseInputChange}
                className={courseFormErrors.name ? "border-red-500" : ""}
              />
              {courseFormErrors.name && <p className="text-xs text-red-500">{courseFormErrors.name}</p>}
              <p className="text-xs text-muted-foreground">
                {courseForm.name.length}/{MAX_COURSE_NAME_LENGTH} characters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="yearLevel" className="mb-2">
                Year Level
              </Label>
              <Select
                value={courseForm.yearLevel.toString()}
                onValueChange={(value) => setCourseForm((prev) => ({ ...prev, yearLevel: Number.parseInt(value, 10) }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  {yearLevels.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Add an invisible spacer to match the height of the category field's character count */}
              <div className="invisible mt-1 h-5">
                <span className="text-xs">&nbsp;</span>
              </div>
            </div>
            <div className="relative flex flex-col">
              <Label htmlFor="category" className="mb-2">
                Category*
              </Label>
              <div className="flex">
                <Input
                  id="category"
                  placeholder="e.g., Mathematics"
                  value={categoryInputValue}
                  onChange={handleCourseInputChange}
                  className={`${courseFormErrors.category ? "border-red-500" : ""} h-10 rounded-r-none`}
                  onFocus={() => {
                    if (categories.length > 0) {
                      setFilteredCategories(
                        categories.filter((cat) => cat.toLowerCase().includes(categoryInputValue.toLowerCase())),
                      );
                      setShowCategorySuggestions(true);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="category-dropdown-button h-10 rounded-l-none border-l-0 px-3"
                  onClick={() => {
                    setShowCategorySuggestions(!showCategorySuggestions);
                    setFilteredCategories(categories);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </div>
              {courseFormErrors.category && <p className="mt-1 text-xs text-red-500">{courseFormErrors.category}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {categoryInputValue.length}/{MAX_CATEGORY_LENGTH} characters
              </p>

              {/* Category suggestions dropdown - Fixed positioning */}
              {showCategorySuggestions && filteredCategories.length > 0 && (
                <div className="category-dropdown absolute left-0 right-0 top-[72px] z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <ul className="py-1">
                    {filteredCategories.map((category, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onMouseDown={(e) => {
                          // Using onMouseDown instead of onClick to prevent the input from losing focus before the click event
                          e.preventDefault();
                          handleCategorySelect(category);
                        }}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Course Icon</Label>
            <Select
              value={courseForm.icon}
              onValueChange={(value) => setCourseForm((prev) => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select icon">
                  {courseForm.icon && (
                    <div className="flex items-center gap-2">
                      {React.createElement(getIconByName(courseForm.icon), { className: "h-4 w-4" })}
                      <span>{courseIcons.find((i) => i.name === courseForm.icon)?.description || "Icon"}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {courseIcons.map((icon) => (
                  <SelectItem key={icon.name} value={icon.name}>
                    <div className="flex items-center gap-2">
                      <icon.icon className="h-4 w-4" />
                      <span>{icon.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Course Description*</Label>
            <textarea
              id="description"
              placeholder="Enter course description..."
              value={courseForm.description}
              onChange={handleCourseInputChange}
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <div className="flex items-center justify-between">
              {courseFormErrors.description && <p className="text-xs text-red-500">{courseFormErrors.description}</p>}
              <p className="text-xs text-muted-foreground">
                {courseForm.description.length}/{MAX_DESCRIPTION_LENGTH} characters
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            type="button"
            onClick={handleCourseSubmit}
            disabled={!isCourseFormValid() || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditingCourse ? "Saving..." : "Creating..."}
              </>
            ) : isEditingCourse ? (
              "Save Changes"
            ) : (
              "Add Course"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
