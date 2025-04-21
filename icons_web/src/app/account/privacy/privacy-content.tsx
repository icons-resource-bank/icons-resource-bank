"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { hasFlag, UserFlags } from "@/lib/flags";

export default function PrivacyContent() {
  const { toast } = useToast();
  const { user, update } = useAuthStore();

  const [settings, setSettings] = useState({
    analytics: !hasFlag(user?.flags ?? 0, UserFlags.AnalyticsOptOut),
  });

  const [initialSettings, setInitialSettings] = useState({ ...settings });

  const handleSave = async () => {
    if (JSON.stringify(settings) === JSON.stringify(initialSettings)) return;
    await userApi.toggleUserConsents(settings.analytics).then(update);
    setInitialSettings({ ...settings });
    toast({
      title: "Privacy settings saved",
      description: "Your privacy settings have been updated successfully",
    });
  };

  const handleCancel = () => {
    if (JSON.stringify(settings) === JSON.stringify(initialSettings)) return;
    setSettings({ ...initialSettings });
    toast({
      title: "Changes discarded",
      description: "Your changes have been reverted",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary dark:text-white">Privacy and Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="agreements">
                  <AccordionTrigger>Agreements</AccordionTrigger>
                  <AccordionContent>
                    <span>
                      <Link href="/terms-of-service" className="text-primary hover:underline dark:text-blue-400">
                        Terms of Service
                      </Link>
                    </span>
                    <br />
                    <span>
                      <Link href="/privacy-policy" className="text-primary hover:underline dark:text-blue-400">
                        Privacy Policy
                      </Link>
                    </span>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="code">
                  <AccordionTrigger>Code of Conduct</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      The Engineering Society of Queen's University is committed to providing a welcoming and inclusive
                      environment for all members. We do not tolerate harassment of any kind, including but not limited
                      to harassment based on protected characteristics such as race, ethnicity, religion, gender, sexual
                      orientation, gender identity, disability, age, or any other status outlined by applicable human
                      rights legislation.
                      <br />
                      <br />
                      By using this platform, you agree to abide by our Code of Conduct and report any violations to the
                      Engineering Society. We reserve the right to remove any content or user that violates this policy.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Analytics Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Allow collection of usage data to improve the app experience
                </p>
              </div>
              <Switch
                checked={settings.analytics}
                onCheckedChange={(value) => setSettings((prev) => ({ ...prev, analytics: value }))}
                className="dark:data-[state=checked]:bg-white/90 dark:data-[state=unchecked]:bg-white/10"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
