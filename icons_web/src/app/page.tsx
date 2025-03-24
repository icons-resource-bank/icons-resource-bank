import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Engineering Society Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="text-xs font-semibold leading-tight">
            <div>ENGINEERING SOCIETY</div>
            <div>QUEENS UNIVERSITY</div>
          </div>
        </div>

        <div className="flex items-center">
          <nav className="hidden md:block">
            <ul className="flex bg-[#d9d9d9]">
              {["About", "Get Involved", "Services", "Resources", "Upload"].map((item) => (
                <li key={item}>
                  <Link href="#" className="px-6 py-2 inline-block hover:bg-gray-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="ml-4" aria-label="Search">
            <Search size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Campus Aerial View"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-8xl font-serif text-white">
            <span className="inline-block mr-2">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block"
              >
                <path d="M40 10C25 10 15 25 15 40C15 55 25 70 40 70" stroke="white" strokeWidth="5" />
                <path d="M30 20C20 20 10 30 10 45C10 60 20 70 35 70" stroke="white" strokeWidth="5" />
              </svg>
            </span>
            iCons
          </h1>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#7b06ae] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Engineering Building"
                width={300}
                height={300}
                className="rounded-md"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">About us:</h2>
              <p className="text-lg">
                The Integrated Constables (iCons) is a student-run service that operates in Beamish-Munro Hall, home of
                the Integrated Learning Centre (ILC). The iCons operate after ILC administration hours to keep the
                facility open to students, loan out equipment, promote a positive studying and learning atmosphere, and
                to act as a resource for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Hours Section */}
      <section className="bg-[#fffafa] py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <Link href="#" className="bg-[#d9d9d9] px-8 py-4 text-xl hover:bg-gray-300 transition-colors">
            Upload-hours
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#273655] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <p className="font-bold">Contact us :</p>
            <p>- Email: icon@engsoc.queensu.ca</p>
            <p>- Address : Beamish-Munro Hall 45 Union St, Kingston, ON K7L 3N6</p>

            <div className="pt-4 space-y-1">
              <p>
                -{" "}
                <Link href="#" className="hover:underline">
                  privacy policy
                </Link>
              </p>
              <p>
                -{" "}
                <Link href="#" className="hover:underline">
                  terms of services
                </Link>
              </p>
              <p>
                -{" "}
                <Link href="#" className="hover:underline">
                  accessibility options
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

