import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Search, User } from "lucide-react";
import Link from "next/link";

export default function ApprovalConfirmationPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg">Your approval request has been sent to the team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Thank you for submitting your resource for approval. Our team will review your submission as soon as
              possible.
            </p>
            <div className="pt-4">
              <Link href="/upload">
                <Button size="lg">Return to Upload</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
