import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, BookOpen, Users, Upload } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
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
            <h1 className="mb-6 text-6xl font-bold text-white">
              <span className="text-7xl">i</span>Cons
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-white/90">The Integrated Constables at the ILC</p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/85">
                <Link href="/resources">Browse Resources</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container grid items-center gap-8 md:grid-cols-2">
          <div>
            <Image
              src="/images/beamish-munro.jpg?height=600&width=800"
              alt="Beamish-Munro Hall"
              width={690}
              height={500}
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

            <div className="mt-6 border-t border-white/20 pt-6">
              <h3 className="mb-3 text-xl font-bold">Operating Hours</h3>
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

            <Button asChild variant="outline" className="mt-4 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href="/about">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="container mt-12">
          <div className="h-[300px] w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=Beamish-Munro%20Hall%2045%20Union%20St%20Kingston%2C%20ON%20K7L%203N6&#038;t=m&#038;z=16&#038;output=embed&#038;iwloc=near"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(var(--maps-invert)) hue-rotate(var(--maps-hue-rotate))" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Beamish-Munro Hall Map"
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="dark:bg-footer py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="dark:rounded-sm dark:border-2">
              <CardContent className="dark:bg-footer pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/30">
                  <Clock className="h-6 w-6 text-primary dark:text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Extended Hours</h3>
                <p className="text-muted-foreground">
                  Access to the ILC facilities outside of regular administration hours.
                </p>
              </CardContent>
            </Card>
            <Card className="dark:rounded-sm dark:border-2">
              <CardContent className="dark:bg-footer pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/30">
                  <Users className="h-6 w-6 text-primary dark:text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Equipment</h3>
                <p className="text-muted-foreground">Need a calculator, laptop, or charger? iCons has you covered.</p>
              </CardContent>
            </Card>
            <Card className="dark:rounded-sm dark:border-2">
              <CardContent className="dark:bg-footer pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/30">
                  <BookOpen className="h-6 w-6 text-primary dark:text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Resource Bank</h3>
                <p className="text-muted-foreground">Access to course materials, past exams, and study resources.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold">Contribute to Our Resource Bank</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Help fellow students by sharing your notes, study guides, or practice problems.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <Link href="/upload">
              <Upload className="mr-2 h-5 w-5" />
              Upload Resources
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
