"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function GeneralSettingsContent() {
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    language: "english",
  });

  // Backup state for cancel functionality
  const [initialSettings, setInitialSettings] = useState({ ...settings });

  const handleSelectChange = (field: string) => (value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  // Save changes
  const handleSave = () => {
    if (JSON.stringify(settings) === JSON.stringify(initialSettings)) return;
    setInitialSettings({ ...settings });
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully",
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
          <CardTitle className="text-primary dark:text-white">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Interface Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language" className="text-base">
                      Language
                    </Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select value={settings.language} onValueChange={handleSelectChange("language")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
