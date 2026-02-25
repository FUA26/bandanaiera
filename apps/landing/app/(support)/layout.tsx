import type { Metadata } from "next";
import { TopBar } from "@/components/landing/layout/top-bar";
import { Header } from "@/components/landing/layout/landing-header";
import { Footer } from "@/components/landing/layout/landing-footer";
import { AccessibilityWidget } from "@/components/shared/accessibility-widget";
import { getVisibleServicesGroupedByCategory } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Support - Super App Naiera",
  description: "Dapatkan bantuan dan dukungan untuk layanan digital Kabupaten Naiera",
};

export default async function SupportLayout({
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
      <Footer />
      <AccessibilityWidget />
    </div>
  );
}
