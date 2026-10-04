"use client";

import { CompareProvider } from "./CompareProvider";
import { FirewiseProvider } from "./FirewiseProvider";
import { SavedProvider } from "./SavedProvider";
import { SettingsProvider } from "./SettingsProvider";

/**
 * Application context root. Kept separate from the AppShell so the four providers can be
 * composed and tested independently of the layout.
 */
export function AppProviders({ children }) {
  return (
    <SettingsProvider>
      <SavedProvider>
        <CompareProvider>
          <FirewiseProvider>{children}</FirewiseProvider>
        </CompareProvider>
      </SavedProvider>
    </SettingsProvider>
  );
}
