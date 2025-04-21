import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-primary dark:text-white">Privacy Policy</h1>

          <div className="space-y-8">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The iCons Resource Bank ("we", "our", or "us") is committed to protecting the privacy and security of
                  your personal information. This Privacy Policy describes how we collect, use, and disclose your
                  personal information in accordance with the Freedom of Information and Protection of Privacy Act
                  (FIPPA) and other applicable laws.
                </p>
                <p>
                  By using our website and services, you consent to the data practices described in this policy. This
                  policy applies to information we collect through our website, in email, text, and other electronic
                  messages between you and this website.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We may collect several types of information from and about users of our website, including:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>Personal Information:</strong> Information that identifies you as an individual, such as
                    your name, email address, and Queen’s University student ID when you register for an account or
                    submit resources.
                  </li>
                  <li>
                    <strong>Usage Information:</strong> Information about your connection to our services, including
                    your IP address, browser type, operating system, and the pages you visit.
                  </li>
                  <li>
                    <strong>User Contributions:</strong> Information and content you provide when uploading resources,
                    including files, descriptions, and metadata.
                  </li>
                </ul>
                <p>
                  We collect this information directly from you when you provide it to us, automatically as you navigate
                  through the site, and from third parties such as Queen’s University for verification purposes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use information that we collect about you or that you provide to us:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To verify your identity and eligibility to use our services</li>
                  <li>To process and manage your account and user profile</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send you important information regarding our services, changes to our terms, and policies</li>
                  <li>To monitor and analyze usage patterns and trends</li>
                  <li>To protect our services and users from unauthorized access or activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Disclosure of Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We may disclose personal information that we collect or you provide:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>To Queen’s University officials and Engineering Society representatives as necessary</li>
                  <li>To contractors, service providers, and other third parties we use to support our services</li>
                  <li>To comply with any court order, law, or legal process</li>
                  <li>
                    To enforce our Terms of Service and other agreements, including for billing and collection purposes
                  </li>
                  <li>
                    If we believe disclosure is necessary to protect the rights, property, or safety of the iCons
                    Resource Bank, our users, or others
                  </li>
                </ul>
                <p>
                  We do not sell, trade, or otherwise transfer your personally identifiable information to outside
                  parties except as described above.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none dark:bg-transparent">
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We have implemented measures designed to secure your personal information from accidental loss and
                  from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored
                  on secure servers behind firewalls.
                </p>
                <p>
                  The safety and security of your information also depends on you. We urge you to be careful about
                  sharing your account credentials and to maintain appropriate security over your devices and accounts.
                </p>
                <p>
                  Unfortunately, the transmission of information via the internet is not completely secure. Although we
                  do our best to protect your personal information, we cannot guarantee the security of your personal
                  information transmitted to our website. Any transmission of personal information is at your own risk.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Access, update, or delete your personal information</li>
                  <li>Object to the processing of your personal information</li>
                  <li>Request that we restrict the processing of your personal information</li>
                  <li>Request the transfer of your personal information to another party</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:icon@engsoc.queensu.ca" className="text-primary hover:underline dark:text-white">
                    icon@engsoc.queensu.ca
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Changes to Our Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may update our Privacy Policy from time to time. If we make material changes to how we treat our
                  users’ personal information, we will notify you through a notice on the website home page or via
                  email.
                </p>
                <p>
                  The date the Privacy Policy was last revised is identified at the bottom of this page. You are
                  responsible for periodically visiting our website and this Privacy Policy to check for any changes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To ask questions or comment about this Privacy Policy and our privacy practices, contact us at:{" "}
                  <a href="mailto:icon@engsoc.queensu.ca" className="text-primary hover:underline dark:text-white">
                    icon@engsoc.queensu.ca
                  </a>
                </p>
                <p>
                  For more information about Queen’s University’s privacy practices, please visit the{" "}
                  <a
                    href="https://www.queensu.ca/accessandprivacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline dark:text-white"
                  >
                    Queen’s University Access and Privacy Office
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <div className="pt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: April 20, 2025</p>
              <p className="mt-2">
                <Link href="/terms-of-service" className="text-primary hover:underline dark:text-blue-400">
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
