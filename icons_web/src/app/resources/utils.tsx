import { File, FileAudio, FileText, ExternalLink, Video } from "lucide-react";
import { type Resource, ResourceType } from "@/lib/api";

export function getIcon(resource: Resource) {
  if (resource.ftype === "default" && resource.type === ResourceType.URL) return ExternalLink;
  switch (resource.ftype.toLowerCase()) {
    case "pdf":
    case "docx":
    case "doc":
    case "pptx":
    case "ppt":
    case "xlsx":
    case "xls":
    case "txt":
      return FileText;
    case "video":
    case "mp4":
    case "mov":
      return Video;
    case "audio":
    case "mp3":
    case "wav":
      return FileAudio;
    default:
      return File;
  }
}
