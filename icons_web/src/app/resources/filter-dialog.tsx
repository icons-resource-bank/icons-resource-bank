"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Filter } from "lucide-react"

// Sample filter options
const resourceTypes = [
  { id: "pdf", label: "PDF Documents" },
  { id: "docx", label: "Word Documents" },
  { id: "pptx", label: "PowerPoint Presentations" },
  { id: "video", label: "Videos" },
  { id: "audio", label: "Audio" },
]

const resourceCategories = [
  { id: "lecture", label: "Lecture Notes" },
  { id: "lab", label: "Lab Materials" },
  { id: "assignment", label: "Assignments" },
  { id: "exam", label: "Past Exams" },
  { id: "tutorial", label: "Tutorials" },
  { id: "textbook", label: "Textbooks" },
]

const sortOptions = [
  { id: "recent", label: "Most Recent" },
  { id: "popular", label: "Most Popular" },
  { id: "az", label: "A-Z" },
  { id: "za", label: "Z-A" },
]

export function FilterDialog() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, typeId])
    } else {
      setSelectedTypes(selectedTypes.filter((id) => id !== typeId))
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleReset = () => {
    setSelectedTypes([])
    setSelectedCategories([])
    setSortBy("recent")
  }

  const handleApply = () => {
    // In a real app, this would apply the filters
    console.log("Applied filters:", { selectedTypes, selectedCategories, sortBy })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-border shadow-sm ">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border dark:border-border shadow-md ">
        <DialogHeader>
          <DialogTitle>Filter Resources</DialogTitle>
          <DialogDescription>Refine your search with the following filters</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 ">
          <div className="space-y-4 ">
            <h3 className="text-sm font-medium">Resource Type</h3>
            <div className="grid grid-cols-2 gap-3 ">
              {resourceTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2 ">
                  <Checkbox className="dark:border-white"
                    id={`type-${type.id}`}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleTypeChange(type.id, checked === true)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="text-sm ">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resource Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {resourceCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox className="dark:border-white"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sort By</h3>
            <RadioGroup value={sortBy} onValueChange={handleSortChange}>
              <div className="grid grid-cols-2 gap-3">
                {sortOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 ">
                    <RadioGroupItem value={option.id} id={`sort-${option.id}`} />
                    <Label htmlFor={`sort-${option.id}`} className="text-sm ">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="dark:bg-white dark:border-2 dark:text-black hover:bg-foreground/20">
            Reset
          </Button>
          <Button className="dark:border-2 dark:bg-white hover:bg-foreground/20 dark:text-black hover:text-white" onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

