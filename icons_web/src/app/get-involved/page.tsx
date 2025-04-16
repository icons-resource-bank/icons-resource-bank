import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Users, Calendar, Mail } from "lucide-react"
import Link from "next/link"

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      

      {/* Hero Section */}
      <section className="bg-primary text-white py-16 dark:bg-primary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl text-center font-bold mb-4">Get Involved</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            There are multiple ways to contribute to the iCons community and help fellow engineering students succeed.
          </p>
        </div>
      </section>

      {/* Contribute Resources Section */}
      <section className="py-16 bg-background dark:bg-footer">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary dark:text-white">Contribute Resources</h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  Our resource bank thrives on contributions from students like you. By sharing your notes, study
                  guides, practice problems, or other educational materials, you can help fellow students succeed in
                  their courses.
                </p>
                <p className="text-lg text-muted-foreground">
                  Contributing is easy! Simply use our upload form to submit your resources. All submissions are
                  reviewed by our team before being added to the resource bank.
                </p>
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 dark:text-white">
                    <Link href="/upload" className="flex items-center gap-2 dark:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                      <Upload className="h-5 w-5 dark:text-white" />
                      Upload Resources
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/beamish-munro.jpg?height=600&width=800"
                  alt="Contributing Resources"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become an iCon Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Become an iCon</h2>

          <div className="max-w-3xl mx-auto">
            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle>Join Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Becoming an iCon is a rewarding way to get involved with the engineering community at Queen's
                  University. As an iCon, you'll:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Help maintain the ILC during extended hours</li>
                  <li>Assist fellow students with accessing resources</li>
                  <li>Contribute to the development and organization of the resource bank</li>
                  <li>Gain valuable leadership and communication skills</li>
                  <li>Build connections within the engineering community</li>
                  <li>Receive compensation for your time</li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white dark:bg-footer">
        <div className="container">
        

          <div className="max-w-3xl mx-auto">
          

            <h3 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Application Process</h3>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-2 dark:bg-footer">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary dark:text-white" />
                  </div>
                  <CardTitle>1. Application Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Applications for iCon positions typically open at the beginning of each semester. Watch for
                    announcements on our social media and the Engineering Society website.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 dark:bg-footer">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary dark:text-white" />
                  </div>
                  <CardTitle>2. Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Selected applicants will be invited for an interview with the iCon coordinators to discuss their
                    interest, availability, and qualifications.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 dark:bg-footer">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary dark:text-white"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <CardTitle>3. Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Successful applicants will receive training on ILC procedures, resource management, and other
                    responsibilities before starting their role.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-lg mb-6">
                Interested in becoming an iCon? Contact us for more information about upcoming application periods.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 ">
                <a href="mailto:icon@engsoc.queensu.ca" className="flex items-center gap-2 dark:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20">
                  <Mail className="h-5 w-5 dark:text-white" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">What Our iCons Say</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="font-bold">Alex Johnson</h3>
                  <p className="text-sm">3rd Year Mechanical Engineering</p>
                </div>
                <p className="text-center italic text-muted-foreground">
                  "Being an iCon has been one of the most rewarding experiences of my university career. I've met
                  amazing people and developed skills that will help me in my future career."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="font-bold">Sarah Williams</h3>
                  <p className="text-sm">4th Year Electrical Engineering</p>
                </div>
                <p className="text-center italic text-muted-foreground">
                  "I joined the iCons team in my second year, and it's been incredible to help fellow students while
                  also deepening my understanding of engineering concepts."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mb-4"></div>
                  <h3 className="font-bold">Michael Chen</h3>
                  <p className="text-sm">2nd Year Computer Engineering</p>
                </div>
                <p className="text-center italic  text-muted-foreground">
                  "Working as an iCon has given me the opportunity to contribute to the engineering community while
                  building valuable connections and friendships."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

