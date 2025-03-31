import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Video, FileAudio, File, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ResourceCardProps {
  resource: {
    id: number
    title: string
    course: string
    type: string
    icon?: any
    uploadedBy: string
    uploadedAt: string
    downloads: number
    tags: string[]
    link?: string
  }
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Determine the icon based on the resource type
  const getIcon = () => {
    switch (resource.type.toLowerCase()) {
      case "pdf":
      case "docx":
      case "doc":
      case "pptx":
      case "xlsx":
        return FileText
      case "video":
      case "mp4":
      case "mov":
        return Video
      case "audio":
      case "mp3":
      case "wav":
        return FileAudio
      default:
        return resource.icon || File
    }
  }

  const IconComponent = getIcon()

  const cardContent = (
    <>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold line-clamp-2">{resource.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{resource.course}</p>
            <p className="text-xs text-muted-foreground mt-1">{resource.downloads} downloads</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-3 flex items-center justify-between border-t border-[#d8c5e9]">
        <div className="text-xs text-muted-foreground">Uploaded {resource.uploadedAt}</div>
        {resource.link ? (
          <Button size="sm" className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20" asChild>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only md:not-sr-only">Link</span>
            </a>
          </Button>
        ) : (
          <Button size="sm" className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
            <Download className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Download</span>
          </Button>
        )}
      </CardFooter>
    </>
  )

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-[#d8c5e9] dark:border-gray-700 bg-card shadow-sm group cursor-pointer resource-card dark:hover:border-primary/70">
      <Link
        href={`/resources/${resource.id}`}
        className="block h-full transition-colors hover:text-primary dark:hover:text-primary/90 resource-card-link"
      >
        {cardContent}
      </Link>
    </Card>
  )
}

