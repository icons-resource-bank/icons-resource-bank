"use client";

import Link from "next/link";
import { Mail, MapPin, Instagram } from "lucide-react";

export function SiteFooter() {
  const toggleUserWay = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // @ts-ignore
    UserWay.widgetToggle();
  };

  return (
    <footer className="bg-[#273655] py-12 text-white">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <Link href="mailto:icon@engsoc.queensu.ca" className="hover:underline">
                  icon@engsoc.queensu.ca
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 flex-shrink-0" />
                <Link href="https://instagram.com/queensicons" className="hover:underline" target="_blank">
                  @queensicons
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>
                  <Link
                    href="https://www.queensu.ca/facilities/accessibility/building-directory/beamish-munro-hall"
                    className="hover:underline"
                    target="_blank"
                  >
                    Beamish-Munro Hall
                  </Link>{" "}
                  45 Union St, Kingston, ON K7L 3N6
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline" onClick={toggleUserWay}>
                  Accessibility Options
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} Engineering Society of Queen's University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
