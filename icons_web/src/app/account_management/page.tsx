"use client";

import { useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { AccountSidebar } from "@/components/account/sidebar";
import AccountContent from "./account-content/account-content";
import GeneralSettings from "./general-setting/general-settings-content";
import PrivacySettings from "./privacy/privacy-content";

export default function Home() {
  const [activeSection, setActiveSection] = useState("account");

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountContent />;
      case "settings":
        return <GeneralSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return <AccountContent />;
    }
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="container mx-auto flex-1 pt-8">
          <div className="flex flex-col md:flex-row">
            <AccountSidebar activeItem={activeSection} setActiveItem={setActiveSection} />
            {renderContent()}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
