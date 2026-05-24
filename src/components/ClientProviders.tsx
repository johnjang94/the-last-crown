"use client";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserSettingsProvider } from "@/contexts/UserSettingsContext";
import AppControls from "@/components/AppControls";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <UserSettingsProvider>
        {children}
        <AppControls />
      </UserSettingsProvider>
    </LanguageProvider>
  );
}
