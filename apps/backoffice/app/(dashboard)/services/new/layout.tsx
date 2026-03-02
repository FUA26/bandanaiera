import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Service",
  description: "Create a new service",
};

export default function NewServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
