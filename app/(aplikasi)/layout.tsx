"use client";

import {usePathname} from "next/navigation";
import React from "react";

import {AppSidebar} from "@/components/layout/app/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Optional: mapping untuk mengganti label path tertentu
const PATH_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  me: "Pengaturan",
  profile: "Profil Saya",
};

function formatSegment(segment: string): string {
  return PATH_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Layout({children}: LayoutProps) {
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <Breadcrumb>
              <BreadcrumbList>{segments}</BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
