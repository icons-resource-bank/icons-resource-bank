"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/require-auth";
import { AccountSidebar } from "@/components/account/sidebar";
import AccountContent from "./account-content/account-content";
import GeneralSettings from "./general-setting/general-settings-content";
import PrivacySettings from "./privacy/privacy-content";

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(window?.location?.search?.substring?.(1) || "account");

  const renderContent = () => {
    switch (activeSection) {
      case "settings":
        return <GeneralSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return <AccountContent />;
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(section);
    router.push(`/account?${section}`);
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="container mx-auto flex-1 pt-8">
          <div className="flex flex-col md:flex-row">
            <AccountSidebar activeItem={activeSection} setActiveItem={toggleSection} />
            {renderContent()}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
