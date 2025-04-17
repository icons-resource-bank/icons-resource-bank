"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, User, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Define the source data type
type SourceData = {
  name: string
  discipline: string
  class: string
  url: string
  description: string
  fileName: string
}

// Initialize with empty values
const emptySourceData: SourceData = {
  name: "",
  discipline: "",
  class: "",
  url: "",
  description: "",
  fileName: "",
}

export default function NewSourcePage() {
  const router = useRouter()

  // Get stored form data from localStorage if it exists
  const [formData, setFormData] = useState<SourceData>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("sourceFormData")
      return savedData ? JSON.parse(savedData) : emptySourceData
    }
    return emptySourceData
  })

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    localStorage.setItem("sourceFormData", JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id.replace("source", "").toLowerCase()]: value,
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name
      setFormData((prev) => ({
        ...prev,
        fileName,
      }))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`)
      setSearchQuery("")
    }
    setSearchOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Form submitted with data:", formData)

    // Save the current form data to localStorage before redirecting
    localStorage.setItem("sourceFormData", JSON.stringify(formData))

    // Redirect to the upload page
    router.push("/")
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="relative">
          <Link href="/" className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </Link>

          <CardContent className="pt-6">
            <div className="mb-8 flex justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EngineeringSociety-63wpLvOloWd1CZsMW6l4ImAHEPm1j4.webp"
                alt="The Engineering Society Logo"
                className="h-auto w-48"
              />
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="sourceName">Name of Source</Label>
                <Input
                  id="sourceName"
                  placeholder="Enter source name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline - Year</Label>
                  <Select
                    value={formData.discipline}
                    onValueChange={(value) => handleSelectChange("discipline", value)}
                  >
                    <SelectTrigger id="discipline">
                      <SelectValue placeholder="Select discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CE-1">CE - 1</SelectItem>
                      <SelectItem value="E-1">E - 1</SelectItem>
                      <SelectItem value="MRE-1">MRE - 1</SelectItem>
                      <SelectItem value="ECEI-1">ECEI - 1</SelectItem>
                      <SelectItem value="MECH-2">MECH - 2</SelectItem>
                      <SelectItem value="COMP-2">COMP - 2</SelectItem>
                      <SelectItem value="ELEC-2">ELEC - 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Select Class</Label>
                  <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics1">Physics I</SelectItem>
                      <SelectItem value="physics2">Physics II</SelectItem>
                      <SelectItem value="calculus1">Calculus I</SelectItem>
                      <SelectItem value="calculus2">Calculus II</SelectItem>
                      <SelectItem value="linearAlgebra">Linear Algebra</SelectItem>
                      <SelectItem value="chemistry1">Chemistry I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input id="sourceUrl" placeholder="https://" value={formData.url} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceDescription">Source Description</Label>
                <Textarea
                  id="sourceDescription"
                  placeholder="Enter a description of the source"
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload from computer</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative"
                    onClick={() => document.getElementById("fileUpload")?.click()}
                  >
                    Browse Files
                    <input id="fileUpload" type="file" className="sr-only" onChange={handleFileChange} />
                  </Button>
                  {formData.fileName && <span className="text-sm text-muted-foreground">{formData.fileName}</span>}
                </div>
              </div>

              <div className="flex justify-center pt-4">
              <Link href="/upload/approval_confirmation">
                <Button type="submit" size="lg">
                  Save
                </Button>
              </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

