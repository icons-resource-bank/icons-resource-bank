"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Upload, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { ResourceSidebar, allCourses } from "@/components/resource-sidebar"
import { FilterDialog } from "./filter-dialog"
import { ResourceCard } from "@/components/resource-card"
import Link from "next/link"

// Sample resources data
const resources = [
  {
    id: 1,
    title: "Calculus I - Limits and Continuity",
    course: "APSC 171",
    type: "PDF",
    icon: FileText,
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15",
    downloads: 128,
    tags: ["Lecture Notes", "First Year"],
  },
  {
    id: 2,
    title: "Physics I - Mechanics Problem Set",
    course: "APSC 111",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-01-20",
    downloads: 95,
    tags: ["Problem Set", "First Year"],
    link: "https://example.com/physics-problem-set",
  },
  {
    id: 3,
    title: "Introduction to Computer Programming - Python Basics",
    course: "APSC 141",
    type: "Video",
    icon: Video,
    uploadedBy: "Alex Johnson",
    uploadedAt: "2024-01-25",
    downloads: 210,
    tags: ["Tutorial", "First Year"],
    link: "https://youtube.com/watch?v=example",
  },
  {
    id: 4,
    title: "Chemistry and Materials - Periodic Table Guide",
    course: "APSC 131",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Sarah Williams",
    uploadedAt: "2024-01-18",
    downloads: 156,
    tags: ["Study Guide", "First Year"],
  },
  {
    id: 5,
    title: "Calculus I - Integration Techniques",
    course: "APSC 171",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Michael Brown",
    uploadedAt: "2024-01-22",
    downloads: 142,
    tags: ["Lecture Notes", "First Year"],
    link: "https://example.com/calculus-integration",
  },
  {
    id: 6,
    title: "Physics I - Lab Report Template",
    course: "APSC 111",
    type: "DOCX",
    icon: FileText,
    uploadedBy: "Emily Davis",
    uploadedAt: "2024-01-17",
    downloads: 89,
    tags: ["Lab", "Template", "First Year"],
  },
  {
    id: 7,
    title: "Introduction to Computer Programming - Algorithms Explained",
    course: "APSC 141",
    type: "Video",
    icon: Video,
    uploadedBy: "David Wilson",
    uploadedAt: "2024-01-28",
    downloads: 175,
    tags: ["Tutorial", "First Year"],
    link: "https://youtube.com/watch?v=algorithms-explained",
  },
  {
    id: 8,
    title: "Chemistry and Materials - Molecular Bonding",
    course: "APSC 131",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Lisa Martinez",
    uploadedAt: "2024-01-19",
    downloads: 132,
    tags: ["Study Guide", "First Year"],
  },
  // Add more resources to demonstrate scrolling
  {
    id: 9,
    title: "Engineering Graphics - CAD Fundamentals",
    course: "APSC 162",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Robert Johnson",
    uploadedAt: "2024-01-21",
    downloads: 118,
    tags: ["Tutorial", "First Year"],
    link: "https://example.com/cad-fundamentals",
  },
  {
    id: 10,
    title: "Earth Systems Engineering - Climate Models",
    course: "APSC 151",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Emma Thompson",
    uploadedAt: "2024-01-23",
    downloads: 87,
    tags: ["Lecture Notes", "First Year"],
  },
  {
    id: 11,
    title: "Engineering Practice - Team Dynamics Workshop",
    course: "APSC 101, 102, 103",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Brian Frank",
    uploadedAt: "2024-01-14",
    downloads: 203,
    tags: ["Workshop", "First Year"],
    link: "https://example.com/team-dynamics",
  },
  {
    id: 12,
    title: "Engineering Practice - Laboratory Safety Guidelines",
    course: "APSC 101, 102, 103",
    type: "PDF",
    icon: FileText,
    uploadedBy: "Brian Frank",
    uploadedAt: "2024-01-16",
    downloads: 189,
    tags: ["Lab", "Safety", "First Year"],
  },
]

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const courseParam = searchParams.get("course")

  const [filteredResources, setFilteredResources] = useState(resources)
  const [selectedCourse, setSelectedCourse] = useState(allCourses[courseParam || ""] || null)

  // Update filtered resources when course parameter changes
  useEffect(() => {
    if (courseParam) {
      setSelectedCourse(allCourses[courseParam] || null)
      setFilteredResources(resources.filter((resource) => resource.course === courseParam))
    } else {
      setSelectedCourse(null)
      setFilteredResources(resources)
    }
  }, [courseParam])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <ResourceSidebar />
        <main className="flex-1 flex flex-col h-full border-l border-[#d8c5e9] dark:border-border shadow-sm">
          <div className="p-6  border-[#d8c5e9] dark:border-border ">
            {selectedCourse ? (
              <>
                <h1 className="text-3xl font-bold">
                  {selectedCourse.code} - {selectedCourse.name}
                </h1>
                <p className="text-muted-foreground mt-1">Instructor: {selectedCourse.instructor}</p>
                <p className="text-muted-foreground mt-2 max-w-3xl">{selectedCourse.description}</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">Resources</h1>
                <p className="text-muted-foreground">Browse and download course materials</p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b ">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredResources.length}</strong> resources
              {selectedCourse && <span> for {selectedCourse.code}</span>}
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
              <Button asChild variant="default" size="sm" className="text-white">
                <Link href="/upload" className="flex items-center gap-1 dark:border-2 hover:border-foreground/20 ">
                  <Upload className="h-4 w-4 " />
                  Upload
                </Link>
              </Button>
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-9 border-2 " />
              </div>
              <FilterDialog/>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg border-[#d8c5e9] shadow-sm bg-background">
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  {selectedCourse
                    ? `There are no resources available for ${selectedCourse.code} yet.`
                    : "No resources match your search criteria."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

