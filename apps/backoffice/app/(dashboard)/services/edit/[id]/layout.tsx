import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Edit service details",
};

export default function EditServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
