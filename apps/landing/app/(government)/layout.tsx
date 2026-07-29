import type { Metadata } from "next";
import { TopBar } from "@/components/landing/layout/top-bar";
import { Header } from "@/components/landing/layout/landing-header";
import { Footer } from "@/components/landing/layout/landing-footer";
import { AccessibilityWidget } from "@/components/shared/accessibility-widget";
import { getVisibleServicesGroupedByCategory } from "@/lib/services-data";

// Force dynamic rendering to prevent build-time fetch
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Malang Digital Government - Layanan Digital Kabupaten Malang",
  description:
    "Akses ratusan layanan pemerintahan dengan mudah, cepat, dan aman dalam satu platform digital. Kabupaten Malang menuju digitalisasi pelayanan publik.",
  keywords: [
    "super app",
    "naiera",
    "kabupaten malang",
    "layanan digital",
    "pemerintahan",
    "e-government",
  ],
  openGraph: {
    title: "Malang Digital Government - Layanan Digital Kabupaten Malang",
    description:
      "Akses ratusan layanan pemerintahan dengan mudah, cepat, dan aman dalam satu platform digital.",
    type: "website",
  },
};

export default async function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch services data for this section
  const servicesByCategory = await getVisibleServicesGroupedByCategory();

  return (
    <div className="min-h-screen">
      <TopBar />
      <Header servicesByCategory={servicesByCategory} />
      {children}
      <Footer categories={servicesByCategory} />
      <AccessibilityWidget />
    </div>
  );
}
