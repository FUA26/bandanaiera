// app/(aplikasi)/layout.tsx

import {ReactNode} from "react";

import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/layout/app/app-sidebar";
import {SidebarInset} from "@/components/ui/sidebar";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {BreadcrumbBuilder} from "@/components/layout/app/breadcrumb-builder";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({children}: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <BreadcrumbBuilder />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
