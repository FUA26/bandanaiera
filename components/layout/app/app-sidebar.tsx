/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";

import * as React from "react";
import {BookOpen, Bot, Command, SquareTerminal} from "lucide-react";
import {Session} from "next-auth";

import {NavMain} from "./nav-main";
import {NavUser} from "./nav-user";
import {SidebarOptInForm} from "./sidebar-opt-in-form";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session?: Session;
}

const navItems = [
  {
    title: "Aplikasi",
    url: "dashboard",
    icon: SquareTerminal,
    items: [],
  },
  {
    title: "Pengajuan Integrasi",
    url: "pengajuan",
    icon: Bot,
    items: [],
  },
  {
    title: "Log Aktifitas",
    url: "logs",
    icon: BookOpen,
    items: [],
  },
];

export function AppSidebar({session, ...props}: AppSidebarProps) {
  const user = session?.user;

  // console.log("USERRRR", user);
  const userName = user?.name || "Pengguna";
  const userEmail = user?.email || "";

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Single Sign On</span>
                  <span className="truncate text-xs">Kabupaten Malang</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavUser email={session?.user?.email ?? ""} name={session?.user?.name ?? "Pengguna"} />
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarOptInForm />
      </SidebarFooter>
    </Sidebar>
  );
}
