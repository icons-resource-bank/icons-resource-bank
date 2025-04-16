import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      

      {/* Hero Section */}
      <section className="bg-primary text-white py-16 dark:bg-footer">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">About iCons</h1>
          <p className="text-xl max-w-3xl  mx-auto">
            Queen's University Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro
            Hall, home of the Integrated Learning Centre (ILC).
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary dark:text-white">Who We Are</h2>
              <div className="space-y-4 text-lg">
                <p>
                  The Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro Hall, home
                  of the Integrated Learning Centre (ILC).
                </p>
                <p>
                  The iCons operate after ILC administration hours to keep the facility open to students, loan out
                  equipment, promote a positive studying and learning atmosphere, and to act as a resource for students.
                </p>
                <p>
                  Our team consists of dedicated engineering students who are passionate about helping their peers
                  succeed in their academic journey.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image src="/images/iCons-Hub.jpg?height=1080&width=1920" alt="Engineering Society" fill className="h-12 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">What We Do</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#d8c5e9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Clock className="h-5 w-5 text-primary dark:text-white" />
                  Extended Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We keep the ILC open beyond regular administration hours, providing students with a safe and
                  productive environment to study and work on projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#d8c5e9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary dark:text-white"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  Resource Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We maintain a comprehensive resource bank with course materials, past exams, and study resources to
                  help students excel in their courses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#d8c5e9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary dark:text-white"
                  >
                    <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7 6 13 6 13s6-6 6-13z" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                  Equipment Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We provide equipment loans for students working on projects, including tools, electronics, and other
                  resources needed for engineering coursework.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hours of Service Section */}
      <section className="py-16 bg-background ">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Hours of Service</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-[#d8c5e9]">
              <CardHeader>
                <CardTitle>Regular Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
              <p className="mb-4 text-white dark:text-primary">
                  Hours in effect from December 4th, 2023, to December 21st, 2023
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="font-semibold">Monday</div>
                  <div>5:00 PM - 11:00 PM</div>

                  <div className="font-semibold">Tuesday</div>
                  <div>5:00 PM - 11:00 PM</div>

                  <div className="font-semibold">Wednesday</div>
                  <div>5:00 PM - 11:00 PM</div>

                  <div className="font-semibold">Thursday</div>
                  <div>5:00 PM - 11:00 PM</div>

                  <div className="font-semibold">Friday</div>
                  <div>5:00 PM - 11:00 PM</div>

                  <div className="font-semibold">Saturday</div>
                  <div>10:00 AM - 7:00 PM</div>

                  <div className="font-semibold">Sunday</div>
                  <div>10:00 AM - 11:00 PM</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#d8c5e9]">
              <CardHeader>
                <CardTitle>Exam Season Extended Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Hours in effect from December 4th, 2023, to December 21st, 2023
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="font-semibold">Monday</div>
                  <div>5:00 PM - 12:00 AM</div>

                  <div className="font-semibold">Tuesday</div>
                  <div>5:00 PM - 12:00 AM</div>

                  <div className="font-semibold">Wednesday</div>
                  <div>5:00 PM - 12:00 AM</div>

                  <div className="font-semibold">Thursday</div>
                  <div>5:00 PM - 12:00 AM</div>

                  <div className="font-semibold">Friday</div>
                  <div>5:00 PM - 12:00 AM</div>

                  <div className="font-semibold">Saturday</div>
                  <div>10:00 AM - 11:00 PM</div>

                  <div className="font-semibold">Sunday</div>
                  <div>10:00 AM - 11:00 PM</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Find Us</h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1 dark:text-white" />
                <div>
                  <h3 className="font-semibold text-lg ">Location</h3>
                  <p>Beamish-Munro Hall, 45 Union St, Kingston, ON K7L 3N6</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1 dark:text-white" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p>icon@engsoc.queensu.ca</p>
                </div>
              </div>

              <Button asChild className="mt-4 dark:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg w-full h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2859.0978448866!2d-76.49785382346772!3d44.22781777100306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cd2ab0674088ad1%3A0x76a75110ae442196!2s45%20Union%20St%2C%20Kingston%2C%20ON%20K7L%203N6%2C%20Canada!5e0!3m2!1sen!2sus!4v1711166724062!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Beamish-Munro Hall Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

