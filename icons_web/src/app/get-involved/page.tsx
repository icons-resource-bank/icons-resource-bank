import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, Calendar, Mail } from "lucide-react";
import Link from "next/link";

export default function GetInvolvedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white dark:bg-primary">
        <div className="container">
          <h1 className="mb-4 text-center text-4xl font-bold md:text-5xl">Get Involved</h1>
          <p className="mx-auto max-w-3xl text-center text-xl">
            There are multiple ways to contribute to the iCons community and help fellow engineering students succeed.
          </p>
        </div>
      </section>

      {/* Contribute Resources Section */}
      <section className="bg-background py-16 dark:bg-footer">
        <div className="container">
          <div className="grid items-center gap-2 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-primary dark:text-white">Contribute Resources</h2>
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
                    <Link
                      href="/upload"
                      className="flex items-center gap-2 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    >
                      <Upload className="h-5 w-5 dark:text-white" />
                      Upload Resources
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                <Image src="/images/beamish-munro.jpg" alt="Beamish-Munro Hall" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become an iCon Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold text-primary dark:text-white">Become an iCon</h2>

          <div className="mx-auto max-w-3xl">
            <Card className="mb-8 border-2">
              <CardHeader>
                <CardTitle>Join Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Becoming an iCon is a rewarding way to get involved with the engineering community at Queen’s
                  University. As an iCon, you’ll:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>Help maintain the ILC during extended hours</li>
                  <li>Assist fellow students with course questions</li>
                  <li>Contribute to the development and organization of the resource bank</li>
                  <li>Gain valuable leadership and communication skills</li>
                  <li>Build connections within the engineering community</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-white py-16 dark:bg-footer">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-10 text-center text-3xl font-bold text-primary dark:text-white">Application Process</h3>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card className="border-2 dark:bg-footer">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary dark:text-white" />
                  </div>
                  <CardTitle>1. Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Applications for iCons positions typically open at the beginning of each semester. Watch for
                    announcements on our social media!
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
                    Selected applicants will be invited for an interview with the iCons coordinators to discuss their
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
              <p className="mb-6 text-lg">
                Interested in becoming an iCon? For more information about upcoming application periods:
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a
                  href="mailto:icon@engsoc.queensu.ca"
                  className="flex items-center gap-2 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  <Mail className="h-5 w-5 dark:text-white" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-background py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold text-primary dark:text-white">What Our iCons Say</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-3 flex flex-col items-center">
                  <Image
                    src="/images/example-icons-headshot.jpg"
                    alt="iCon Member Headshot"
                    width={72}
                    height={72}
                    className="mb-2 h-18 w-18 rounded-full object-cover"
                  />
                  <h3 className="font-bold">Lucy Jardine</h3>
                  <p className="text-sm">3rd Year Mechanical Engineering</p>
                </div>
                <p className="text-center italic text-muted-foreground">
                  "Being an iCon has been a very valuable experience. I know it can be difficult in first year finding
                  helpful resources, so it has been incredibly rewarding to get to help fellow students even in small
                  ways. I also got to work with some amazing coworkers and made great friends through being an iCon!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-3 flex flex-col items-center">
                <Image
                    src="/images/example-icons-headshot.jpg"
                    alt="iCon Member Headshot"
                    width={72}
                    height={72}
                    className="mb-2 h-18 w-18 rounded-full object-cover"
                  />
                  <h3 className="font-bold">Michael Chen</h3>
                  <p className="text-sm">2nd Year Computer Engineering</p>
                </div>
                <p className="text-center italic text-muted-foreground">
                  "Working as an iCon has given me the opportunity to contribute to the engineering community while
                  building valuable connections and friendships."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="mb-3 flex flex-col items-center">
                  <Image
                    src="/images/example-icons-headshot.jpg"
                    alt="iCon Member Headshot"
                    width={72}
                    height={72}
                    className="mb-2 h-18 w-18 rounded-full object-cover"
                  />
                  <h3 className="font-bold">Current iCon</h3>
                  <p className="text-sm">4th Year Mechanical Engineering</p>
                </div>
                <p className="text-center italic text-muted-foreground">
                  "Being an iCon has been one of my favourite experiences at Queen’s so far! It has been a great way to
                  connect with new people and learn lots of skills. I love being able to support first years in their
                  classes as the iCons were so helpful for me in my first year. The intrapersonal skills I have
                  developed as an iCon also helped me in securing my QUIP internship!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
