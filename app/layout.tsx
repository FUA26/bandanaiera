// app/layout.tsx

import type {Metadata} from "next";

import React from "react";
import {Inter} from "next/font/google";

import "@/css/globals.css";
import {ThemeProvider} from "next-themes";

import {cn} from "@/lib/utils";
import {SessionWrapper} from "@/components/layout/session-provider";
import {Toaster} from "@/components/ui/sonner";
import AppTour from "@/components/layout/AppTour";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Satu Login - Kabupaten Malang",
  description: "Autentikasi terpusat untuk layanan digital pemerintahan Kabupaten Malang",
  icons: {
    icon: [
      {url: "/images/favicon.ico"},
      {url: "/images/favicon-16x16.png", sizes: "16x16"},
      {url: "/images/favicon-32x32.png", sizes: "32x32"},
      {url: "/images/favicon-96x96.png", sizes: "96x96"},
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <SessionWrapper>
          <ThemeProvider
            disableTransitionOnChange
            enableSystem
            attribute="class"
            defaultTheme="light"
          >
            {children}
            <AppTour /> {/* ⬅️ Tambahkan di sini */}
            <Toaster closeButton richColors position="top-right" />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
