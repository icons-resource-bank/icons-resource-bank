"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { courseApi, type Course } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query"

// Interface for grouped courses
interface CourseGroup {
  [year: string]: {
    [category: string]: Course[];
  };
}

export function ResourceSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");

  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(courseParam);
  const [groupedCourses, setGroupedCourses] = useState<CourseGroup>({});
  const [_isLoading, setIsLoading] = useState(true);

  // Query for courses
  const {
    data: coursesData,
    isLoading: queryIsLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseApi.getCourses().then(r => r.items),
  });

  // Group courses by year and category
  useEffect(() => {
    const grouped: CourseGroup = {};

    // Ensure coursesData is defined before processing
    if (queryIsLoading || !coursesData) {
        return;
    }

    console.log(coursesData);

    coursesData?.forEach?.((course) => {
      const year = `Year ${course.yearLevel}`;
      const category = course.category;

      if (!grouped[year]) {
        grouped[year] = {};
      }

      if (!grouped[year][category]) {
        grouped[year][category] = [];
      }

      grouped[year][category].push(course);
    });

    setGroupedCourses(grouped);

    // Auto-expand the first year if no years are expanded
    if (expandedYears.length === 0 && Object.keys(grouped).length > 0) {
      setExpandedYears([Object.keys(grouped)[0]]);
    }
  }, [coursesData]);

  // Update selected course when URL parameter changes
  useEffect(() => {
    if (courseParam) {
      setSelectedCourse(courseParam);

      // Find the course to get its year and category
      const course = coursesData?.find((c) => c.id === courseParam);
      if (course) {
        const year = `Year ${course.yearLevel}`;
        const category = course.category;
        const yearCategory = `${year}-${category}`;

        // Auto-expand the relevant sections
        setExpandedYears((prev) => (prev.includes(year) ? prev : [...prev, year]));
        setExpandedCategories((prev) => (prev.includes(yearCategory) ? prev : [...prev, yearCategory]));
      }
    }
  }, [courseParam, coursesData]);

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
  };

  const toggleCategory = (yearCategory: string) => {
    setExpandedCategories((prev) =>
      prev.includes(yearCategory) ? prev.filter((c) => c !== yearCategory) : [...prev, yearCategory],
    );
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    router.push(`/resources?course=${courseId}`);
  };

  if (queryIsLoading || !coursesData) {
    return (
      <div className="flex w-64 flex-shrink-0 items-center justify-center overflow-y-auto border-r border-primary/30 bg-primary text-white shadow-md dark:border-border dark:bg-background dark:text-foreground">
        <div className="flex flex-col items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white dark:text-primary" />
          <p className="mt-4 text-sm">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-primary/30 bg-primary text-white shadow-md dark:border-border dark:bg-background dark:text-foreground">
      <div className="sticky top-0 z-10 border-b border-white/20 bg-primary p-4 shadow-sm dark:border-border dark:bg-background">
        <h2 className="text-lg font-semibold">Courses</h2>
      </div>
      <nav className="p-2">
        {Object.keys(groupedCourses).length > 0 ? (
          Object.entries(groupedCourses)
            .sort(([yearA], [yearB]) => {
              // Extract the year number and compare
              const numA = Number.parseInt(yearA.split(" ")[1]);
              const numB = Number.parseInt(yearB.split(" ")[1]);
              return numA - numB;
            })
            .map(([year, categories]) => (
              <div key={year} className="mb-1">
                <button
                  onClick={() => toggleYear(year)}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-800"
                >
                  {expandedYears.includes(year) ? (
                    <ChevronDown className="mr-2 h-4 w-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{year}</span>
                </button>

                {expandedYears.includes(year) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {Object.entries(categories).map(([category, coursesInCategory]) => {
                      const yearCategory = `${year}-${category}`;
                      return (
                        <div key={yearCategory}>
                          <button
                            onClick={() => toggleCategory(yearCategory)}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-800"
                          >
                            {expandedCategories.includes(yearCategory) ? (
                              <ChevronDown className="mr-2 h-4 w-4 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="truncate">{category}</span>
                          </button>

                          {expandedCategories.includes(yearCategory) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {coursesInCategory.map((course) => (
                                <button
                                  key={course.id}
                                  onClick={() => handleCourseClick(course.id)}
                                  className={cn(
                                    "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-800",
                                    selectedCourse === course.id && "bg-white/20 dark:bg-gray-700",
                                  )}
                                >
                                  <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{course.code}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-sm text-white/70 dark:text-gray-400">No courses available</p>
          </div>
        )}
      </nav>
    </div>
  );
}
