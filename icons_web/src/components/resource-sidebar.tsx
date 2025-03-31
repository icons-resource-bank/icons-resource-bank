"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

// Course data structure
export interface Course {
  code: string
  name: string
  instructor: string
  description: string
}

// Fall term courses
const fallTermCourses: Course[] = [
  {
    code: "APSC 101, 102, 103",
    name: "Engineering Practice",
    instructor: "Dr. Brian Frank",
    description:
      "Provides laboratory experience and professional skills fundamental to engineering. Modules: Complex problem solving (Fall), Laboratory Skills (Fall), Engineering Design Project (Winter). Covers team dynamics, presentation skills, data analysis, design methodologies, and workplace safety.",
  },
  {
    code: "APSC 111",
    name: "Physics I",
    instructor: "Tony Noble",
    description:
      "Introduction to Newtonian mechanics: vectors, particle motion/dynamics, work/energy, rigid body statics/dynamics, conservation laws, collisions.",
  },
  {
    code: "APSC 131",
    name: "Chemistry and Materials",
    instructor: "Peter Gilbert",
    description:
      "Thermochemistry, thermodynamics, gas laws, phase equilibria, material bonding/classification, properties of metals/polymers/ceramics.",
  },
  {
    code: "APSC 141",
    name: "Intro to Computer Programming for Engineers 1 (4-week)",
    instructor: "Asli Sari",
    description:
      "Computer programming concepts with microcomputers. Focus: algorithm design, programming style, engineering applications. Part 2 in Winter.",
  },
  {
    code: "APSC 151",
    name: "Earth Systems Engineering",
    instructor: "Mark Diederichs",
    description:
      "Earth System science (geosphere, hydrosphere, atmosphere, biosphere), sustainability, geo-materials, risk assessment, climate change.",
  },
  {
    code: "APSC 162",
    name: "Engineering Graphics",
    instructor: "Gene Zak",
    description:
      "3D visualization, CAD software, orthographic/isometric sketching, dimensioning, product design projects.",
  },
  {
    code: "APSC 171",
    name: "Calculus I",
    instructor: "Alan Ableson",
    description: "Functions, derivatives, optimization, integrals, differential equations, complex numbers.",
  },
]

// Winter term courses
const winterTermCourses: Course[] = [
  {
    code: "APSC 112",
    name: "Physics II",
    instructor: "James Stotz",
    description: "Electricity, oscillations/waves, electric/magnetic fields, circuits, electromagnetic induction.",
  },
  {
    code: "APSC 132",
    name: "Chemistry and Its Applications",
    instructor: "Peter Gilbert",
    description: "Entropy, chemical equilibrium, electrochemistry, kinetics, organic chemistry.",
  },
  {
    code: "APSC 142",
    name: "Intro to Computer Programming for Engineers 2",
    instructor: "Sean Kauffman",
    description: "Continuation of APSC 141. Algorithm design and engineering applications.",
  },
  {
    code: "APSC 172",
    name: "Calculus II",
    instructor: "Ping Li",
    description: "Multivariable functions, partial derivatives, series, integrals (polar/cylindrical).",
  },
  {
    code: "APSC 174",
    name: "Linear Algebra",
    instructor: "Kexue Zhang",
    description: "Linear systems, vector spaces, matrices, eigenvalues, engineering applications.",
  },
  {
    code: "APSC 182",
    name: "Applied Engineering Mechanics",
    instructor: "Neil Hoult",
    description: "Statics, force equilibrium, trusses, shear/bending moments, stress/strain.",
  },
]

// Create a map of all courses for easy lookup
export const allCourses = [...fallTermCourses, ...winterTermCourses].reduce(
  (map, course) => {
    map[course.code] = course
    return map
  },
  {} as Record<string, Course>,
)

export function ResourceSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseParam = searchParams.get("course")

  const [expandedYears, setExpandedYears] = useState<string[]>(["Year 1"])
  const [expandedDisciplines, setExpandedDisciplines] = useState<string[]>(["Year 1-General"])
  const [expandedTerms, setExpandedTerms] = useState<string[]>(["Year 1-General-Fall Term Courses"])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(courseParam)

  // Update selected course when URL parameter changes
  useEffect(() => {
    if (courseParam) {
      setSelectedCourse(courseParam)

      // Auto-expand the relevant sections
      setExpandedYears((prev) => (prev.includes("Year 1") ? prev : [...prev, "Year 1"]))
      setExpandedDisciplines((prev) => (prev.includes("Year 1-General") ? prev : [...prev, "Year 1-General"]))

      // Determine which term to expand based on the course code
      const isFallCourse = fallTermCourses.some((course) => course.code === courseParam)
      if (isFallCourse) {
        setExpandedTerms((prev) =>
          prev.includes("Year 1-General-Fall Term Courses") ? prev : [...prev, "Year 1-General-Fall Term Courses"],
        )
      } else {
        setExpandedTerms((prev) =>
          prev.includes("Year 1-General-Winter Term Courses") ? prev : [...prev, "Year 1-General-Winter Term Courses"],
        )
      }
    }
  }, [courseParam])

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  const toggleDiscipline = (discipline: string) => {
    setExpandedDisciplines((prev) =>
      prev.includes(discipline) ? prev.filter((d) => d !== discipline) : [...prev, discipline],
    )
  }

  const toggleTerm = (term: string) => {
    setExpandedTerms((prev) => (prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]))
  }

  const handleCourseClick = (courseCode: string) => {
    setSelectedCourse(courseCode)
    router.push(`/resources?course=${courseCode}`)
  }

  return (
    <div className="w-64 bg-primary text-white flex-shrink-0 overflow-y-auto border-r border-primary/30 shadow-md">
      <div className="p-4 border-b border-white/20 sticky top-0 bg-primary z-10 shadow-sm">
        <h2 className="text-lg font-semibold">Year</h2>
      </div>
      <nav className="p-2">
        {/* Year 1 */}
        <div className="mb-1">
          <button
            onClick={() => toggleYear("Year 1")}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
          >
            {expandedYears.includes("Year 1") ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Year 1</span>
          </button>

          {expandedYears.includes("Year 1") && (
            <div className="ml-4 mt-1 space-y-1">
              {/* General Discipline */}
              <div>
                <button
                  onClick={() => toggleDiscipline("Year 1-General")}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                >
                  {expandedDisciplines.includes("Year 1-General") ? (
                    <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">General</span>
                </button>

                {expandedDisciplines.includes("Year 1-General") && (
                  <div className="ml-4 mt-1 space-y-1">
                    {/* Fall Term Courses */}
                    <div>
                      <button
                        onClick={() => toggleTerm("Year 1-General-Fall Term Courses")}
                        className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                      >
                        {expandedTerms.includes("Year 1-General-Fall Term Courses") ? (
                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">Fall Term Courses</span>
                      </button>

                      {expandedTerms.includes("Year 1-General-Fall Term Courses") && (
                        <div className="ml-4 mt-1 space-y-1">
                          {fallTermCourses.map((course) => (
                            <button
                              key={course.code}
                              onClick={() => handleCourseClick(course.code)}
                              className={cn(
                                "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors text-left",
                                selectedCourse === course.code && "bg-white/20",
                              )}
                            >
                              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{course.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Winter Term Courses */}
                    <div>
                      <button
                        onClick={() => toggleTerm("Year 1-General-Winter Term Courses")}
                        className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                      >
                        {expandedTerms.includes("Year 1-General-Winter Term Courses") ? (
                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">Winter Term Courses</span>
                      </button>

                      {expandedTerms.includes("Year 1-General-Winter Term Courses") && (
                        <div className="ml-4 mt-1 space-y-1">
                          {winterTermCourses.map((course) => (
                            <button
                              key={course.code}
                              onClick={() => handleCourseClick(course.code)}
                              className={cn(
                                "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors text-left",
                                selectedCourse === course.code && "bg-white/20",
                              )}
                            >
                              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{course.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mechatronics Discipline */}
              <div>
                <button
                  onClick={() => toggleDiscipline("Year 1-Mechatronics")}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                >
                  {expandedDisciplines.includes("Year 1-Mechatronics") ? (
                    <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">Mechatronics</span>
                </button>

                {expandedDisciplines.includes("Year 1-Mechatronics") && (
                  <div className="ml-4 mt-1 space-y-1">
                    <div className="px-3 py-2 text-sm text-white/60 italic">Coming soon</div>
                  </div>
                )}
              </div>

              {/* Computer Engineering Discipline */}
              <div>
                <button
                  onClick={() => toggleDiscipline("Year 1-Computer Engineering")}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                >
                  {expandedDisciplines.includes("Year 1-Computer Engineering") ? (
                    <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">Computer Engineering</span>
                </button>

                {expandedDisciplines.includes("Year 1-Computer Engineering") && (
                  <div className="ml-4 mt-1 space-y-1">
                    <div className="px-3 py-2 text-sm text-white/60 italic">Coming soon</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Year 2 */}
        <div className="mb-1">
          <button
            onClick={() => toggleYear("Year 2")}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
          >
            {expandedYears.includes("Year 2") ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Year 2</span>
          </button>

          {expandedYears.includes("Year 2") && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="px-3 py-2 text-sm text-white/60 italic">Coming soon</div>
            </div>
          )}
        </div>

        {/* Year 3 */}
        <div className="mb-1">
          <button
            onClick={() => toggleYear("Year 3")}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
          >
            {expandedYears.includes("Year 3") ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Year 3</span>
          </button>

          {expandedYears.includes("Year 3") && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="px-3 py-2 text-sm text-white/60 italic">Coming soon</div>
            </div>
          )}
        </div>

        {/* Year 4 */}
        <div className="mb-1">
          <button
            onClick={() => toggleYear("Year 4")}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
          >
            {expandedYears.includes("Year 4") ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Year 4</span>
          </button>

          {expandedYears.includes("Year 4") && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="px-3 py-2 text-sm text-white/60 italic">Coming soon</div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

