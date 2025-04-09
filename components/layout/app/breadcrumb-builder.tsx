// components/layout/BreadcrumbBuilder.tsx
"use client";

import {usePathname} from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  me: "Pengaturan",
  profile: "Profil Saya",
};

function formatSegment(segment: string): string {
  return PATH_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function BreadcrumbBuilder() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/");
      const isLast = index === array.length - 1;
      const label = formatSegment(segment);

      return isLast ? (
        <BreadcrumbItem key={href}>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem key={href}>
          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
      );
    });

  return (
    <Breadcrumb>
      <BreadcrumbList>{segments}</BreadcrumbList>
    </Breadcrumb>
  );
}
