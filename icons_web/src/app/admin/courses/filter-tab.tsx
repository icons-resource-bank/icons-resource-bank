"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { PlusCircle, Pipette, Loader2 } from "lucide-react";
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
import { type FilterTabProps, predefinedColors, MAX_FILTER_NAME_LENGTH } from "./types";
import { colorIntToHex, colorHexToInt } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function FilterTab({
  filters,
  onEdit,
  onDelete,
  filterForm,
  filterFormOpen,
  setFilterFormOpen,
  handleFilterInputChange,
  handleFilterSubmit,
  resetFilterForm,
  isEditingFilter,
  filterFormErrors,
  deleteFilterDialogOpen,
  setDeleteFilterDialogOpen,
  confirmFilterDelete,
  isFilterFormValid,
  isLoading,
  error,
  isPending,
}: FilterTabProps) {
  // Use the first predefined color's value as default
  const defaultColorInt = predefinedColors[0].value;
  const defaultColorHex = predefinedColors[0].hexValue;

  const [selectedColorOption, setSelectedColorOption] = useState<string | number>(defaultColorInt);
  const [displayColorHex, setDisplayColorHex] = useState(defaultColorHex);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle selection of predefined color or custom option
  const handleColorOptionChange = (option: string) => {
    if (option === "custom") {
      setSelectedColorOption("custom");
      setShowCustomPicker(true);
      // Don't update the form color yet, wait for custom color selection
    } else {
      // For predefined colors, convert the string option back to number
      const colorInt = Number.parseInt(option, 10);
      setSelectedColorOption(colorInt);
      setDisplayColorHex(colorIntToHex(colorInt));
      // Update the form with the integer color value
      updateFilterFormColor(colorInt);
      setShowCustomPicker(false);
    }
  };

  // Helper function to update the filter form color
  const updateFilterFormColor = (colorInt: number) => {
    // This function should be provided by the parent component
    // For now, we'll directly update the filterForm
    filterForm.color = colorInt;
  };

  // Handle custom color picker changes with debounce
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColorHex = e.target.value;

    // Update display color immediately for visual feedback
    setDisplayColorHex(newColorHex);

    // Debounce the actual state update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const colorInt = colorHexToInt(newColorHex);
      updateFilterFormColor(colorInt);
    }, 100); // 100ms debounce
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Tags</CardTitle>
          <CardDescription>Manage resource tags</CardDescription>
        </div>
        <Dialog
          open={filterFormOpen}
          onOpenChange={(open) => {
            setFilterFormOpen(open);
            if (!open) resetFilterForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
              onClick={() => {
                resetFilterForm();
                setFilterFormOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingFilter ? "Edit Filter" : "Add New Filter"}</DialogTitle>
              <DialogDescription>
                {isEditingFilter ? "Edit filter details" : "Add a new filter for courses"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Filter Name*</Label>
                <Input
                  id="name"
                  placeholder="e.g., First Year"
                  value={filterForm.name}
                  onChange={handleFilterInputChange}
                  className={filterFormErrors.name ? "border-red-500" : ""}
                />
                {filterFormErrors.name && <p className="text-xs text-red-500">{filterFormErrors.name}</p>}
                <p className="text-xs text-muted-foreground">
                  {filterForm.name.length}/{MAX_FILTER_NAME_LENGTH} characters
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Filter Color</Label>
                <RadioGroup
                  value={typeof selectedColorOption === "number" ? selectedColorOption.toString() : selectedColorOption}
                  onValueChange={handleColorOptionChange}
                  className="grid grid-cols-5 gap-2"
                >
                  {predefinedColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={color.value.toString()} id={`color-${color.value}`} className="sr-only" />
                      <Label
                        htmlFor={`color-${color.value}`}
                        className="flex cursor-pointer flex-col items-center space-y-1.5"
                      >
                        <div
                          className="h-8 w-8 rounded-full ring-2 ring-transparent ring-offset-2 transition-all"
                          style={{
                            backgroundColor: color.hexValue,
                            boxShadow: selectedColorOption === color.value ? "0 0 0 2px hsl(var(--primary))" : "none",
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
                          boxShadow: selectedColorOption === "custom" ? "0 0 0 2px hsl(var(--primary))" : "none",
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
                      style={{ backgroundColor: displayColorHex }}
                    />
                    <Input
                      id="custom-color-picker"
                      type="color"
                      value={displayColorHex}
                      onChange={handleCustomColorChange}
                      className="h-10 w-full"
                    />
                    <div className="font-mono text-sm">{displayColorHex}</div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                onClick={handleFilterSubmit}
                disabled={!isFilterFormValid() || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditingFilter ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditingFilter ? "Save Changes" : "Add Filter"}</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <p>Error loading filters: {(error as Error).message}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filters.length > 0 ? (
                filters.map((filter) => (
                  <TableRow key={filter.id}>
                    <TableCell className="font-medium">{filter.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: colorIntToHex(filter.color) }}
                        />
                        <span>{colorIntToHex(filter.color)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(filter)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(filter.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No filters found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Filter Delete Confirmation Dialog */}
      <AlertDialog open={deleteFilterDialogOpen} onOpenChange={setDeleteFilterDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the filter and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmFilterDelete}
              disabled={isPending}
            >
              {isPending ? (
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
    </Card>
  );
}
