import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/engsoc.png"
            alt="Engineering Society"
            width={120}
            height={40}
            className="w-30 m-0 h-10 p-0"
          />
        </Link>
        <nav className="flex flex-1 items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/get-involved"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Get Involved
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Services
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Resources
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Upload
          </Link>
        </nav>
        {/* <Button variant="ghost" size="icon" className="ml-auto">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button> */}
      </div>
    </header>
  );
}
