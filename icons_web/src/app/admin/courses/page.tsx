"use client";

import {
  PlusCircle,
  Pipette,
  Calculator,
  FlaskRoundIcon as Flask,
  Atom,
  BookOpen,
  Code,
  Palette,
  Mountain,
  Wrench,
  Microscope,
  BarChart2,
  Search,
  type LucideIcon,
} from "lucide-react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { get, post } from "@/lib/http";

// This would come from the database
const __courses = [
  {
    id: 1,
    code: "MATH 121",
    name: "Calculus I",
    yearLevel: 1,
    icon: "calculator",
  },
  {
    id: 2,
    code: "PHYS 117",
    name: "Physics I",
    yearLevel: 1,
    icon: "atom",
  },
];

const __filters = [
  {
    id: 1,
    name: "Notes",
    color: "#4B0082", // Purple
  },
  {
    id: 2,
    name: "Flashcards",
    color: "#2563EB", // Blue
  },
  {
    id: 3,
    name: "Quiz",
    color: "#16A34A", // Green
  },
  {
    id: 4,
    name: "Tutorial",
    color: "#DC2626", // Red
  },
];

// Constants

const years = [
  { id: 1, name: "First Year" },
  { id: 2, name: "Second Year" },
  { id: 3, name: "Third Year" },
  { id: 4, name: "Fourth Year" },
];

const predefinedColors = [
  { name: "Purple", value: "#4B0082" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Red", value: "#DC2626" },
  { name: "Orange", value: "#EA580C" },
  { name: "Yellow", value: "#CA8A04" },
  { name: "Pink", value: "#DB2777" },
  { name: "Teal", value: "#0D9488" },
  { name: "Indigo", value: "#4F46E5" },
  // Custom color option will be handled separately
];

// Define course icons
interface CourseIcon {
  name: string;
  icon: LucideIcon;
  description: string;
}

const courseIcons: CourseIcon[] = [
  { name: "wrench", icon: Wrench, description: "Engineering" },
  { name: "calculator", icon: Calculator, description: "Mathematics" },
  { name: "flask", icon: Flask, description: "Chemistry" },
  { name: "atom", icon: Atom, description: "Physics" },
  { name: "microscope", icon: Microscope, description: "Biology" },
  { name: "mountain", icon: Mountain, description: "Earth Sciences" },
  { name: "book-open", icon: BookOpen, description: "Literature" },
  { name: "code", icon: Code, description: "Programming" },
  { name: "palette", icon: Palette, description: "Graphics" },
  { name: "bar-chart-2", icon: BarChart2, description: "Statistics" },
];

const getIconByName = (name: string): LucideIcon => {
  const found = courseIcons.find((icon) => icon.name === name);
  return found?.icon || courseIcons[0].icon;
};

export default function ManageCoursesPage() {
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    icon: courseIcons[0].name,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewCourse((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setNewCourse({
      code: "",
      name: "",
      icon: courseIcons[0].name,
    });
  };

  const [courses, setCourses] = useState([]);
  async function fetchCourses() {
    if (courses.length) return courses;
    setCourses(await get("/courses"));
    return courses;
  }

  const createCourse = async (payload: any) => {
    try {
      const course = await post("/courses", {body: payload});
      setCourses((prev) => [...prev, course]);
      resetForm();
      // Close create dialog

    } catch (error) {
      console.error("Failed to create course", error);
    }
  }

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
            Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Manage available engineering courses</CardDescription>
              </div>
              <Dialog onOpenChange={(open) => !open && resetForm()}>
                <DialogTrigger asChild>
                  <Button className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>Add a new course to the resource bank</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="code">Course Code</Label>
                        <Input
                          id="code"
                          placeholder="APSC 112"
                          value={newCourse.code}
                          onChange={handleInputChange}
                        />{" "}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Course Name</Label>
                        <Input id="name" placeholder="Physics II" value={newCourse.name} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year-level">Year Level</Label>
                      <Select value={newCourse.year_level} onValueChange={(value) => handleSelectChange("year_level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year.id} value={year.id.toString()}>
                              {year.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="icon">Course Icon</Label>
                    <Select value={newCourse.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon">
                          {newCourse.icon && (
                            <div className="flex items-center gap-2">
                              {React.createElement(getIconByName(newCourse.icon), { className: "h-4 w-4" })}
                              <span>{courseIcons.find((i) => i.name === newCourse.icon)?.description || "Icon"}</span>
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
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                      onClick={() => createCourse(newCourse)}
                    >
                      Add Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by year level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year.id} value={year.name}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Year Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => {
                    const IconComponent = getIconByName(course.icon);
                    return (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 dark:bg-white/10">
                            <IconComponent className="h-5 w-5 text-primary dark:text-gray-400" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{course.code}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{years.find((year) => year.id === course.year_level)?.name}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <FilterTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FilterTab() {
  const [selectedColorOption, setSelectedColorOption] = useState("#4B0082");
  const [displayColor, setDisplayColor] = useState("#4B0082");
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState([]);

  async function fetchFilters() {
    if (filters.length) return filters;
    setFilters(await get("/tags"));
    return filters;
  }

  useEffect(() => {
    fetchFilters();
  }, []);

  // Handle selection of predefined color or custom option
  const handleColorOptionChange = (option: string) => {
    setSelectedColorOption(option);

    if (option === "custom") {
      setShowCustomPicker(true);
      // Don't update the final color yet, wait for custom color selection
    } else {
      // For predefined colors, update both display and final color immediately
      setDisplayColor(option);
      setShowCustomPicker(false);
    }
  };

  // Handle custom color picker changes with debounce
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    // Debounce the actual state update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Update display color immediately for visual feedback
    setDisplayColor(newColor);

    debounceTimerRef.current = setTimeout(() => {
      setDisplayColor(newColor);
    }, 100); // 100ms debounce
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const createFilter = async (payload: any, closeDialog: () => void) => {
    try {
        const filter = await post("/tags", {body: payload});
        setFilters((prev) => [...prev, filter]);
        closeDialog();
    } catch (error) {
        console.error("Failed to create filter", error);
        }
    }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Manage course filters</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Filter</DialogTitle>
              <DialogDescription>Add a new filter for courses</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Filter Name</Label>
                <Input id="name" placeholder="e.g., First Year" />
              </div>
              <div className="grid gap-2">
                <Label>Filter Color</Label>
                <RadioGroup
                  value={selectedColorOption}
                  onValueChange={handleColorOptionChange}
                  className="grid grid-cols-5 gap-2"
                >
                  {predefinedColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                      <Label
                        htmlFor={`color-${color.value}`}
                        className="flex cursor-pointer flex-col items-center space-y-1.5"
                      >
                        <div
                          className="h-8 w-8 rounded-full ring-2 ring-transparent ring-offset-2 transition-all"
                          style={{
                            backgroundColor: color.value,
                            boxShadow: selectedColorOption === color.value ? "0 0 0 2px hsl(var(--ring))" : "none",
                          }}
                        />
                        <span className="text-xs">{color.name}</span>
                      </Label>
                    </div>
                  ))}

                  {/* Custom color option */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="color-custom" className="sr-only" />
                    <Label htmlFor="color-custom" className="flex cursor-pointer flex-col items-center space-y-1.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white ring-2 ring-offset-2 transition-all"
                        style={{
                          boxShadow: selectedColorOption === "custom" ? "0 0 0 2px hsl(var(--ring))" : "none",
                        }}
                        onClick={() => {
                          handleColorOptionChange("custom");
                          document.getElementById("custom-color-picker")?.click();
                        }}
                      >
                        <Pipette className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-xs">Custom</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Hidden color picker that appears when custom is selected */}
                <div className={showCustomPicker ? "block" : "hidden"}>
                  <div className="mt-2 flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: displayColor }}
                    />
                    <Input
                      id="custom-color-picker"
                      type="color"
                      value={displayColor}
                      onChange={handleCustomColorChange}
                      className="h-10 w-full"
                    />
                    <div className="font-mono text-sm">{displayColor}</div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                type="submit"
                onClick={() => createFilter(newFilter, closeDialog)}
              >
                Add Filter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filters.map((filter) => (
              <TableRow key={filter.id}>
                <TableCell className="font-medium">{filter.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: filter.color }} />
                    <span>{filter.color}</span>
                  </div>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
