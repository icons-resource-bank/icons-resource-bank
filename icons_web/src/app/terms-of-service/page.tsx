import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-bold text-primary dark:text-white">Terms of Service</h1>

          <div className="space-y-8">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Welcome to the iCons Resource Bank. These Terms of Service ("Terms") govern your access to and use of
                  our website and services. Please read these Terms carefully before using our services.
                </p>
                <p>
                  By accessing or using the iCons Resource Bank, you agree to be bound by these Terms and our Privacy
                  Policy. If you do not agree to these Terms, you may not access or use our services.
                </p>
                <p>
                  The iCons Resource Bank is a service provided by the Engineering Society of Queen's University
                  ("EngSoc") and operates in accordance with Queen's University policies and regulations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The iCons Resource Bank is primarily intended for use by Queen's University students, faculty, and
                  staff. To access certain features of our services, you must:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Be a current student, faculty member, or staff of Queen's University</li>
                  <li>Have a valid Queen's University email address</li>
                  <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
                <p>
                  We reserve the right to refuse service, terminate accounts, or restrict access to anyone for any
                  reason at any time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information. You
                  are responsible for:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  We are not liable for any loss or damage arising from your failure to comply with these obligations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>User Content and Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our services allow you to upload, submit, store, and share content, including documents, notes, and
                  other materials ("User Content"). You retain ownership of your User Content, but by uploading or
                  submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use,
                  reproduce, modify, adapt, publish, translate, and distribute your User Content for the purpose of
                  providing and improving our services.
                </p>
                <p>You represent and warrant that:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>You own or have the necessary rights to your User Content</li>
                  <li>
                    Your User Content does not infringe upon the intellectual property rights or other rights of any
                    third party
                  </li>
                  <li>Your User Content complies with these Terms and all applicable laws, including copyright laws</li>
                </ul>
                <p>You agree not to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Upload or share content that is illegal, harmful, threatening, abusive, defamatory, or otherwise
                    objectionable
                  </li>
                  <li>Upload or share content that contains personal information of others without their consent</li>
                  <li>
                    Upload or share content that violates Queen's University's{" "}
                    <a
                      href="https://www.queensu.ca/secretariat/policies/senate/code-conduct"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline dark:text-white"
                    >
                      Code of Conduct
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://www.queensu.ca/academicintegrity/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline dark:text-white"
                    >
                      Academic Integrity Policy
                    </a>
                  </li>
                  <li>Use our services for any illegal or unauthorized purpose</li>
                  <li>Interfere with or disrupt the integrity or performance of our services or third-party data</li>
                </ul>
                <p>
                  We reserve the right to remove any User Content that violates these Terms or that we find
                  objectionable for any reason, without prior notice.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The iCons Resource Bank and its original content, features, and functionality are owned by the
                  Engineering Society of Queen's University and are protected by international copyright, trademark, and
                  other intellectual property laws.
                </p>
                <p>
                  Our name, logo, and all related names, logos, product and service names, designs, and slogans are
                  trademarks of the Engineering Society of Queen's University or its affiliates. You may not use these
                  marks without our prior written permission.
                </p>
                <p>
                  All materials provided through our services are intended for educational and informational purposes
                  only. Users must respect the intellectual property rights of others when using our services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Academic Integrity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The iCons Resource Bank is committed to upholding Queen's University's principles of academic
                  integrity. Users are expected to:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Use resources ethically and in accordance with course guidelines</li>
                  <li>Properly cite and attribute all sources used in their work</li>
                  <li>Not use our services to engage in plagiarism, cheating, or other forms of academic dishonesty</li>
                  <li>
                    Respect the intellectual property rights of content creators, including professors and fellow
                    students
                  </li>
                </ul>
                <p>
                  Violations of academic integrity may result in account termination and may be reported to Queen's
                  University for further action.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Disclaimer of Warranties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our services are provided on an "as is" and "as available" basis, without any warranties of any kind,
                  either express or implied. We do not guarantee that our services will be uninterrupted, secure, or
                  error-free.
                </p>
                <p>
                  We do not warrant that the content available through our services is accurate, complete, reliable,
                  current, or error-free. The content is provided for general information purposes only and should not
                  be relied upon as the sole source of information for academic work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To the fullest extent permitted by applicable law, the Engineering Society of Queen's University and
                  its officers, directors, employees, and agents shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including but not limited to, loss of profits, data, or
                  use, arising out of or in connection with your use of our services.
                </p>
                <p>
                  In no event shall our total liability to you for all claims arising from or relating to these Terms or
                  your use of our services exceed the amount paid by you, if any, for accessing our services during the
                  twelve (12) months immediately preceding the date of the claim.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may revise these Terms from time to time. The most current version will always be posted on our
                  website. If we make material changes to these Terms, we will notify you by email or through a notice
                  on our website.
                </p>
                <p>
                  Your continued use of our services after the revised Terms are posted constitutes your acceptance of
                  the changes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario
                  and the federal laws of Canada applicable therein, without giving effect to any principles of
                  conflicts of law.
                </p>
                <p>
                  Any legal action or proceeding arising out of or relating to these Terms or your use of our services
                  shall be brought exclusively in the courts located in Kingston, Ontario, and you consent to the
                  personal jurisdiction of such courts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have any questions about these Terms, please contact us at:{" "}
                  <a href="mailto:icon@engsoc.queensu.ca" className="text-primary hover:underline dark:text-white">
                    icon@engsoc.queensu.ca
                  </a>
                </p>
              </CardContent>
            </Card>

            <div className="pt-6 text-center text-sm text-muted-foreground">
              <p>Last Updated: April 15, 2024</p>
              <p className="mt-2">
                <Link href="/privacy-policy" className="text-primary hover:underline dark:text-white">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
