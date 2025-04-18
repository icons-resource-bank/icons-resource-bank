import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
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
} from "lucide-react";
import type { Filter } from "@/lib/api";

// Course form interface
export interface CourseFormData {
  id?: string;
  code: string;
  name: string;
  category: string;
  yearLevel: number;
  icon: string;
  createdAt?: string;
  description: string;
}

// Filter form interface
export interface FilterFormData {
  id?: string;
  name: string;
  color: number;
}

// Define course icons
export interface CourseIcon {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const courseIcons: CourseIcon[] = [
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

// Helper function to get icon component by name
export function getIconByName(name: string): LucideIcon {
  const found = courseIcons.find((icon) => icon.name === name);
  return found?.icon || BookOpen; // Default to BookOpen if not found
}

// Year levels
export const yearLevels = [
  { value: 1, label: "First Year" },
  { value: 2, label: "Second Year" },
  { value: 3, label: "Third Year" },
  { value: 4, label: "Fourth Year" },
];

// Helper function to get year level label from value
export function getYearLevelLabel(value: number): string {
  const yearLevel = yearLevels.find((yl) => yl.value === value);
  return yearLevel?.label || "Unknown Year";
}

// Predefined colors for the color picker
export const predefinedColors = [
  { name: "Purple", value: 0x4b0082, hexValue: "#4B0082" },
  { name: "Blue", value: 0x2563eb, hexValue: "#2563EB" },
  { name: "Green", value: 0x16a34a, hexValue: "#16A34A" },
  { name: "Red", value: 0xdc2626, hexValue: "#DC2626" },
  { name: "Orange", value: 0xea580c, hexValue: "#EA580C" },
  { name: "Yellow", value: 0xca8a04, hexValue: "#CA8A04" },
  { name: "Pink", value: 0xdb2777, hexValue: "#DB2777" },
  { name: "Teal", value: 0x0d9488, hexValue: "#0D9488" },
  { name: "Indigo", value: 0x4f46e5, hexValue: "#4F46E5" },
];

// Helper function to convert integer color to hex string
export function colorIntToHex(colorInt: number): string {
  return `#${colorInt.toString(16).padStart(6, "0")}`;
}

// Helper function to convert hex string to integer color
export function colorHexToInt(colorHex: string): number {
  return Number.parseInt(colorHex.replace("#", ""), 16);
}

// Validation constants
export const MIN_DESCRIPTION_LENGTH = 8;
export const MAX_DESCRIPTION_LENGTH = 4096;
export const MAX_CATEGORY_LENGTH = 64;
export const MIN_COURSE_CODE_LENGTH = 4;
export const MAX_COURSE_CODE_LENGTH = 16;
export const MIN_COURSE_NAME_LENGTH = 4;
export const MAX_COURSE_NAME_LENGTH = 64;
export const MIN_FILTER_NAME_LENGTH = 4;
export const MAX_FILTER_NAME_LENGTH = 32;

// Filter tab props
export interface FilterTabProps {
  filters: Filter[];
  onEdit: (filter: Filter) => void;
  onDelete: (id: number) => void;
  filterForm: FilterFormData;
  filterFormOpen: boolean;
  setFilterFormOpen: (open: boolean) => void;
  handleFilterInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterSubmit: () => void;
  resetFilterForm: () => void;
  isEditingFilter: boolean;
  filterFormErrors: Record<string, string>;
  deleteFilterDialogOpen: boolean;
  setDeleteFilterDialogOpen: (open: boolean) => void;
  confirmFilterDelete: () => void;
  isFilterFormValid: () => boolean;
  isLoading: boolean;
  error: unknown;
  isPending: boolean;
}
