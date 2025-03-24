import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Clock, BookOpen, Users, Upload } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="/images/queens-campus.webp?height=1080&width=1920"
          alt="Queen's University Campus"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              <span className="text-7xl">i</span>Cons
            </h1>
            <p className="max-w-2xl text-xl text-white/90 mb-8">
              The Integrated Constables at the ILC
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-[#4B0082] hover:bg-[#4B0082]/90">
                <Link href="/resources">Browse Resources</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              >
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#4B0082] py-16 text-white">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src="/images/beamish-munro.jpg?height=600&width=800"
              alt="Beamish-Munro Hall"
              width={640}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">About Us</h2>
            <p className="text-lg text-white/90">
              The Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro Hall, home of
              the Integrated Learning Centre (ILC). The iCons operate after ILC administration hours to keep the
              facility open to students, loan out equipment, promote a positive studying and learning atmosphere, and to
              act as a resource for students 😊.
            </p>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold mb-3">Operating Hours</h3>
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
            </div>

            <Button asChild variant="outline" className="mt-4 bg-white/10 border-white/20 hover:bg-white/20 hover:text-white">
              <Link href="/about">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="container mt-12">
          <div className="rounded-lg overflow-hidden shadow-lg w-full h-[300px]">
            <iframe
              src="https://maps.google.com/maps?q=Beamish-Munro%20Hall%2045%20Union%20St%20Kingston%2C%20ON%20K7L%203N6&#038;t=m&#038;z=16&#038;output=embed&#038;iwloc=near"
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
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B0082]/10">
                  <Clock className="h-6 w-6 text-[#4B0082]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Extended Hours</h3>
                <p className="text-muted-foreground">
                  Access to the ILC facilities outside of regular administration hours.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B0082]/10">
                  <BookOpen className="h-6 w-6 text-[#4B0082]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Resource Bank</h3>
                <p className="text-muted-foreground">Access to course materials, past exams, and study resources.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B0082]/10">
                  <Users className="h-6 w-6 text-[#4B0082]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tutoring</h3>
                <p className="text-muted-foreground">Peer tutoring services for engineering courses.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Contribute to Our Resource Bank</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Help fellow students by sharing your notes, study guides, or practice problems.
          </p>
          <Button asChild size="lg" className="bg-[#4B0082] hover:bg-[#4B0082]/90">
            <Link href="/upload">
              <Upload className="mr-2 h-5 w-5" />
              Upload Resources
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
