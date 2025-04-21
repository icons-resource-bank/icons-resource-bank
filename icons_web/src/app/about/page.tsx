import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container">
          <h1 className="mb-4 text-center text-4xl font-bold md:text-5xl">About iCons</h1>
          <p className="mx-auto max-w-3xl text-xl">
            Queen's University Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro
            Hall, home of the Integrated Learning Centre (ILC).
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-background py-16 dark:bg-footer">
        <div className="container grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-primary dark:text-white">Who We Are</h2>
            <div className="space-y-4 text-lg">
              <p className="text-muted-foreground">
                The Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro Hall, home of
                the Integrated Learning Centre (ILC).
              </p>
              <p className="text-muted-foreground">
                The iCons operate after ILC administration hours to keep the facility open to students, loan out
                equipment, promote a positive studying and learning atmosphere, and to act as a resource for students.
              </p>
              <p className="text-muted-foreground">
                Our team consists of dedicated engineering students who are passionate about helping their peers succeed
                in their academic journey.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/ilc-icons.jpg"
              alt="Engineering Society"
              className="rounded-lg shadow-lg"
              width={530}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold text-primary dark:text-white">What We Do</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 dark:bg-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Clock className="h-5 w-5 text-primary dark:text-white" />
                  Extended Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We keep the ILC open beyond regular administration hours, providing students with a safe and
                  productive environment to study and work on projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 dark:bg-primary">
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
                <p className="text-muted-foreground">
                  We maintain a comprehensive resource bank with course materials, past exams, and study resources to
                  help students excel in their courses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 dark:bg-primary">
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
                    <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7 6 13 6 13s6-6 6-13z" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                  Equipment Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We provide equipment loans for students working on projects, including tools, electronics, and other
                  resources needed for engineering coursework.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hours of Service Section */}
      <section className="bg-background py-16 dark:bg-footer">
        <div className="container">
          <h2 className="mb-10 text-center text-3xl font-bold text-primary dark:text-white">Hours of Service</h2>

          <div className="grid gap-12 md:grid-cols-2">
            <Card className="border-2 dark:bg-footer">
              <CardHeader>
                <CardTitle>Regular Operating Hours</CardTitle>
                <p className="mb-4 text-muted-foreground">
                  Hours in effect from September to April (excluding holidays and exam periods)
                </p>
              </CardHeader>
              <CardContent>
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

            <Card className="border-2 dark:bg-footer">
              <CardHeader>
                <CardTitle>Exam Season Extended Hours</CardTitle>
                <p className="mb-4 text-muted-foreground">Hours in effect from December 4th to December 21st</p>
              </CardHeader>
              <CardContent>
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
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-primary dark:text-white">Find Us</h2>

          <div className="grid items-center gap-8 md:grid-cols-1">
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
          </div>
        </div>
      </section>
    </div>
  );
}
