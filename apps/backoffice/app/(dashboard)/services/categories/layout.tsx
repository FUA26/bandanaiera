import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Categories",
  description: "Manage service categories",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
