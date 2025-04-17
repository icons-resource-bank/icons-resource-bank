import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Search, User } from "lucide-react"
import Link from "next/link"

export default function ApprovalConfirmationPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Request Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg">
              Your approval request has been sent to the administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Thank you for submitting your resources for approval. Our team will review your submission and get back to
              you shortly.
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once your request has been processed.
            </p>
            <div className="pt-4">
              <Link href="../upload">
                <Button size="lg">Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

