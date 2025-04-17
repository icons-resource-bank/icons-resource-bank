"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function PrivacyContent() {
  const { toast } = useToast();

  // Initial state
  const [settings, setSettings] = useState({
    dataCollection: true,
    thirdPartySharing: false,
  });

  // Backup state for cancel functionality
  const [initialSettings, setInitialSettings] = useState({ ...settings });

  // Save changes
  const handleSave = () => {
    // In a real app, you would send this to an API
    setInitialSettings({ ...settings });
    toast({
      title: "Privacy settings saved",
      description: "Your privacy settings have been updated successfully.",
    });
  };

  // Cancel changes
  const handleCancel = () => {
    setSettings({ ...initialSettings });
    toast({
      title: "Changes discarded",
      description: "Your changes have been reverted.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Privacy and Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Agreements</h3>
              <span>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </span><br/>
              <span>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of Service
                </Link>
              </span>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="code">
                  <AccordionTrigger>Code of Conduct</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      The Engineering Society of Queen's University is committed to providing a welcoming and inclusive
                      environment for all members. This Code of Conduct outlines our expectations for participant
                      behavior as well as the consequences for unacceptable behavior.
                    </p>
                    <p className="mt-2 text-sm text-gray-700">Last updated: March 19, 2024</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
