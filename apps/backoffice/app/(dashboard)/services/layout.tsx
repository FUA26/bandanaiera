import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Manage services",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
