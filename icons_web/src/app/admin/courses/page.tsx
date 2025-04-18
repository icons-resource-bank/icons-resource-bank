"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { courseApi, filterApi, type Course, type Filter } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { CourseForm } from "./course-form";
import { CourseTable } from "./course-table";
import { FilterTab } from "./filter-tab";
import {
  type CourseFormData,
  type FilterFormData,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_CATEGORY_LENGTH,
  MIN_COURSE_CODE_LENGTH,
  MAX_COURSE_CODE_LENGTH,
  MIN_COURSE_NAME_LENGTH,
  MAX_COURSE_NAME_LENGTH,
  MIN_FILTER_NAME_LENGTH,
  MAX_FILTER_NAME_LENGTH,
  predefinedColors,
  colorHexToInt,
} from "./types";

export default function ManageCoursesPage() {
  const queryClient = useQueryClient();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [yearLevelFilter, setYearLevelFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State for course form
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    code: "",
    name: "",
    category: "",
    yearLevel: 1,
    icon: "book-open",
    description: "",
  });

  // State for filter form
  const [filterFormOpen, setFilterFormOpen] = useState(false);
  const [isEditingFilter, setIsEditingFilter] = useState(false);
  const [filterForm, setFilterForm] = useState<FilterFormData>({
    name: "",
    color: predefinedColors[0].value,
  });

  // State for validation
  const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({});
  const [filterFormErrors, setFilterFormErrors] = useState<Record<string, string>>({});

  // State for description character count
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  // State for category suggestions
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  // State for confirmation dialogs
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [filterToDelete, setFilterToDelete] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFilterDialogOpen, setDeleteFilterDialogOpen] = useState(false);

  // State for pending mutations
  const [isPending, setIsPending] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch courses
  const {
    data: courses,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses", debouncedSearch, yearLevelFilter, categoryFilter],
    queryFn: () => courseApi.getCourses(debouncedSearch, yearLevelFilter, categoryFilter).then((r) => r.items),
  });

  // Fetch filters
  const {
    data: filters,
    isLoading: isLoadingFilters,
    error: filtersError,
  } = useQuery({
    queryKey: ["filters"],
    queryFn: filterApi.getFilters,
  });

  // Extract unique categories from courses
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      if (!courses) return [];
      const categorySet = new Set<string>();
      courses.forEach((course) => {
        if (course.category) {
          categorySet.add(course.category);
        }
      });
      return Array.from(categorySet);
    },
    enabled: !!courses,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Course created",
        description: "Course has been created successfully.",
      });
      setCourseFormOpen(false);
      resetCourseForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: courseApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Course updated",
        description: "Course has been updated successfully.",
      });
      setCourseFormOpen(false);
      resetCourseForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: courseApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course deleted",
        description: "Course has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Create filter mutation
  const createFilterMutation = useMutation({
    mutationFn: filterApi.createFilter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast({
        title: "Filter created",
        description: "Filter has been created successfully.",
      });
      setFilterFormOpen(false);
      resetFilterForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create filter: ${error.message}`,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Update filter mutation
  const updateFilterMutation = useMutation({
    mutationFn: filterApi.updateFilter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast({
        title: "Filter updated",
        description: "Filter has been updated successfully.",
      });
      setFilterFormOpen(false);
      resetFilterForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update filter: ${error.message}`,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Delete filter mutation
  const deleteFilterMutation = useMutation({
    mutationFn: filterApi.deleteFilter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast({
        title: "Filter deleted",
        description: "Filter has been deleted successfully.",
      });
      setDeleteFilterDialogOpen(false);
      setFilterToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete filter: ${error.message}`,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsPending(true);
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Check if course form is valid
  const isCourseFormValid = () => {
    return (
      courseForm.code.trim().length >= MIN_COURSE_CODE_LENGTH &&
      courseForm.name.trim().length >= MIN_COURSE_NAME_LENGTH &&
      courseForm.category.trim().length > 0 &&
      courseForm.description.trim().length >= MIN_DESCRIPTION_LENGTH
    );
  };

  // Check if filter form is valid
  const isFilterFormValid = () => {
    return filterForm.name.trim().length >= MIN_FILTER_NAME_LENGTH && filterForm.color !== undefined;
  };

  // Handle filter form input change
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "name") {
      setFilterForm((prev) => ({ ...prev, [id]: value }));
      validateFilterField("name", value);
    } else if (id === "color" && e.target.type === "color") {
      // Convert hex color to integer
      const colorInt = colorHexToInt(value);
      setFilterForm((prev) => ({ ...prev, color: colorInt }));
    } else {
      setFilterForm((prev) => ({ ...prev, [id]: value }));
    }
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
    } else if (field === "description") {
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

  // Validate filter field
  const validateFilterField = (field: string, value: string) => {
    let error = "";

    if (field === "name") {
      if (value.trim().length < MIN_FILTER_NAME_LENGTH) {
        error = `Filter name must be at least ${MIN_FILTER_NAME_LENGTH} characters`;
      } else if (value.length > MAX_FILTER_NAME_LENGTH) {
        error = `Filter name must be at most ${MAX_FILTER_NAME_LENGTH} characters`;
      }
    }

    setFilterFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  // Validate course form
  const validateCourseForm = () => {
    const codeValid = validateCourseField("code", courseForm.code);
    const nameValid = validateCourseField("name", courseForm.name);
    const categoryValid = validateCourseField("category", courseForm.category);
    const descriptionValid = validateCourseField("description", courseForm.description);

    return codeValid && nameValid && categoryValid && descriptionValid;
  };

  // Validate filter form
  const validateFilterForm = () => {
    return validateFilterField("name", filterForm.name);
  };

  // Handle course form submit
  const handleCourseSubmit = () => {
    if (validateCourseForm()) {
      if (isEditingCourse && courseForm.id) {
        updateCourseMutation.mutate(courseForm as Course);
      } else {
        createCourseMutation.mutate(courseForm as Omit<Course, "id">);
      }
    }
  };

  // Handle filter form submit
  const handleFilterSubmit = () => {
    if (validateFilterForm()) {
      if (isEditingFilter && filterForm.id) {
        updateFilterMutation.mutate(filterForm as Filter);
      } else {
        createFilterMutation.mutate(filterForm as Omit<Filter, "id">);
      }
    }
  };

  // Reset course form
  const resetCourseForm = () => {
    setCourseForm({
      code: "",
      name: "",
      category: "",
      yearLevel: 1,
      icon: "book-open",
      description: "",
    });
    setDescriptionCharCount(0);
    setCourseFormErrors({});
    setIsEditingCourse(false);
    setCategoryInputValue("");
    setShowCategorySuggestions(false);
  };

  // Reset filter form
  const resetFilterForm = () => {
    setFilterForm({
      name: "",
      color: predefinedColors[0].value,
    });
    setFilterFormErrors({});
    setIsEditingFilter(false);
  };

  // Open course edit dialog
  const openCourseEditDialog = (course: Course) => {
    setCourseForm({
      id: course.id,
      code: course.code,
      name: course.name,
      category: course.category,
      yearLevel: course.yearLevel,
      icon: course.icon,
      description: course.description,
    });
    setCategoryInputValue(course.category);
    setDescriptionCharCount(course.description.length);
    setIsEditingCourse(true);
    setCourseFormOpen(true);
  };

  // Open filter edit dialog
  const openFilterEditDialog = (filter: Filter) => {
    setFilterForm({
      id: filter.id,
      name: filter.name,
      color: filter.color,
    });
    setIsEditingFilter(true);
    setFilterFormOpen(true);
  };

  // Handle course delete
  const handleCourseDelete = (id: number) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm course delete
  const confirmCourseDelete = () => {
    if (courseToDelete !== null) {
      deleteCourseMutation.mutate(courseToDelete);
    }
  };

  // Handle filter delete
  const handleFilterDelete = (id: number) => {
    setFilterToDelete(id);
    setDeleteFilterDialogOpen(true);
  };

  // Confirm filter delete
  const confirmFilterDelete = () => {
    if (filterToDelete !== null) {
      deleteFilterMutation.mutate(filterToDelete);
    }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <p className="text-muted-foreground">Manage courses and filters</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger className="data-[state=active]:bg-white/10" value="courses">
            Courses
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white/10" value="filters">
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Manage engineering courses</CardDescription>
              </div>
              <Button
                className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                onClick={() => {
                  resetCourseForm();
                  setCourseFormOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </CardHeader>
            <CardContent>
              <CourseTable
                courses={courses}
                filters={filters}
                isLoading={isLoadingCourses}
                error={coursesError}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                yearLevelFilter={yearLevelFilter}
                setYearLevelFilter={setYearLevelFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                onEdit={openCourseEditDialog}
                onDelete={handleCourseDelete}
              />
            </CardContent>
          </Card>

          {/* Course Form Dialog */}
          <CourseForm
            courseForm={courseForm}
            setCourseForm={setCourseForm}
            courseFormOpen={courseFormOpen}
            setCourseFormOpen={setCourseFormOpen}
            isEditingCourse={isEditingCourse}
            resetCourseForm={resetCourseForm}
            handleCourseSubmit={handleCourseSubmit}
            isCourseFormValid={isCourseFormValid}
            isPending={createCourseMutation.isPending || updateCourseMutation.isPending}
            categories={categories}
          />

          {/* Course Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the course and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCourseToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={confirmCourseDelete}
                  disabled={deleteCourseMutation.isPending}
                >
                  {deleteCourseMutation.isPending ? (
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
        </TabsContent>

        <TabsContent value="filters">
          <FilterTab
            filters={filters || []}
            onEdit={openFilterEditDialog}
            onDelete={handleFilterDelete}
            filterForm={filterForm}
            filterFormOpen={filterFormOpen}
            setFilterFormOpen={setFilterFormOpen}
            handleFilterInputChange={handleFilterInputChange}
            handleFilterSubmit={handleFilterSubmit}
            resetFilterForm={resetFilterForm}
            isEditingFilter={isEditingFilter}
            filterFormErrors={filterFormErrors}
            deleteFilterDialogOpen={deleteFilterDialogOpen}
            setDeleteFilterDialogOpen={setDeleteFilterDialogOpen}
            confirmFilterDelete={confirmFilterDelete}
            isFilterFormValid={isFilterFormValid}
            isLoading={isLoadingFilters}
            error={filtersError}
            isPending={
              createFilterMutation.isPending || updateFilterMutation.isPending || deleteFilterMutation.isPending
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
