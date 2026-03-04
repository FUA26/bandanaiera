import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "./globals.css";
import { Providers } from "@/components/providers";
import { getPublicSettings } from "@/lib/settings-data";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  return {
    title: {
      default: settings?.siteName || "Super App Naiera",
      template: `%s | ${settings?.siteName || "Super App Naiera"}`,
    },
    description: settings?.siteDescription || "Layanan Digital Pemerintahan Kabupaten Naiera",
    icons: {
      icon: settings?.siteLogoUrl || "/icon.png",
      apple: settings?.siteLogoUrl || "/apple-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const settings = await getPublicSettings();

  return (
    <html lang={locale} className="light">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers settings={settings}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
