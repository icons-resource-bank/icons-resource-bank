"use client"

import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ExternalLink, FileText, Video, FileAudio, File } from "lucide-react"

// Sample resources data - in a real app, this would be fetched from an API
const resources = [
  {
    id: "1",
    title: "Calculus I - Limits and Continuity",
    course: "APSC 171",
    type: "PDF",
    icon: "FileText",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15",
    downloads: 128,
    tags: ["Lecture Notes", "First Year"],
    description:
      "A comprehensive guide to limits and continuity in calculus. This resource covers the fundamental concepts of limits, including one-sided limits, infinite limits, and continuity of functions. Includes numerous examples and practice problems.",
  },
  {
    id: "2",
    title: "Physics I - Mechanics Problem Set",
    course: "APSC 111",
    type: "PDF",
    icon: "FileText",
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-01-20",
    downloads: 95,
    tags: ["Problem Set", "First Year"],
    link: "https://example.com/physics-problem-set",
    description:
      "A collection of mechanics problems covering Newton's laws, kinematics, work and energy, and momentum. Includes solutions to odd-numbered problems.",
  },
  {
    id: "3",
    title: "Introduction to Computer Programming - Python Basics",
    course: "APSC 141",
    type: "Video",
    icon: "Video",
    uploadedBy: "Alex Johnson",
    uploadedAt: "2024-01-25",
    downloads: 210,
    tags: ["Tutorial", "First Year"],
    link: "https://youtube.com/watch?v=example",
    description:
      "A video tutorial introducing the basics of Python programming for engineering students. Covers variables, data types, control structures, and simple algorithms.",
  },
]

export default function ResourceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const resourceId = params.id as string

  // Find the resource by ID
  const resource = resources.find((r) => r.id === resourceId)

  // Get the icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return FileText
      case "Video":
        return Video
      case "FileAudio":
        return FileAudio
      default:
        return File
    }
  }

  const IconComponent = resource ? getIcon(resource.icon) : File

  if (!resource) {
    return (
      <div className="flex flex-col min-h-screen">
    
        <main className="flex-1 container py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>
          <Card className="border-[#d8c5e9]">
            <CardContent className="p-6">
              <p>Resource not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
    
      <main className="flex-1 container py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>

        <Card className="border-[#d8c5e9]">
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <IconComponent className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{resource.title}</CardTitle>
              <p className="text-lg font-medium mt-1">{resource.course}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Uploaded by {resource.uploadedBy} on {resource.uploadedAt}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-primary border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground">{resource.description}</p>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-md border border-[#d8c5e9]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Resource Type: <span className="text-muted-foreground">{resource.type}</span>
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Downloads: <span className="text-muted-foreground">{resource.downloads}</span>
                  </p>
                </div>
                {resource.link ? (
                  <Button className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open Resource
                    </a>
                  </Button>
                ) : (
                  <Button className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#d8c5e9] pt-6">
            <p className="text-sm text-muted-foreground">
              If you find this resource helpful, please consider uploading your own materials to help other students.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

