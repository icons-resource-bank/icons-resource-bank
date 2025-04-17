"use client"

import { useState } from "react"
import { AccountSidebar } from "../account_management/account-content/account-sidebar"
import  AccountContent  from "../account_management/account-content/account-content"
import { GeneralSettingsContent } from "../account_management/general-setting/general-settings-content"
import { PrivacyContent } from "../account_management/privacy/privacy-content"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Account Information")

  const renderContent = () => {
    switch (activeSection) {
      case "Account Information":
        return <AccountContent />
      case "General Settings":
        return <GeneralSettingsContent />
      case "Privacy and Agreements":
        return <PrivacyContent />
      default:
        return <AccountContent />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto pt-8">
        <div className="flex flex-col md:flex-row">
          <AccountSidebar activeItem={activeSection} setActiveItem={setActiveSection} />
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

