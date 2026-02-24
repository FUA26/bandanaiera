"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="landing-theme"
      themes={["light"]}
    >
      {children}
    </ThemeProvider>
  );
}
