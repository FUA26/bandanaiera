"use client";

import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut} from "lucide-react";
import {signOut} from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";

// ✅ Custom fetcher with 401 handling
const fetcher = async (url: string) => {
  const res = await fetch(url, {credentials: "include"});

  if (res.status === 401) {
    // 🔴 Refresh token expired → logout otomatis
    console.warn("🔴 Unauthorized, signing out...");
    signOut({callbackUrl: "/auth/login"});
    throw new Error("Unauthorized");
  }

  return res.json();
};

async function handleLogout() {
  try {
    // 🔒 Logout dari Keycloak (hapus sesi via refresh_token)
    const res = await fetch("/api/auth/logout", {method: "POST"});

    if (!res.ok) {
      const error = await res.text();

      console.warn("🔴 Keycloak logout failed:", error);
    }
  } catch (err) {
    console.warn("⚠️ Gagal logout Keycloak:", err);
  } finally {
    // 🧹 Logout NextAuth
    signOut({callbackUrl: "/auth/login"});
  }
}

export function NavUser() {
  const {isMobile} = useSidebar();
  const {data, isLoading, error} = useSWR("/api/me", fetcher);

  if (isLoading || error || !data?.user) return null;

  const {name, email, avatar} = data.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage alt={name} src={avatar} />
                <AvatarFallback className="rounded-lg">{name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage alt={name} src={avatar} />
                  <AvatarFallback className="rounded-lg">{name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link className="flex items-center gap-2" href="/profile">
                  <BadgeCheck />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link className="flex items-center gap-2" href="/change-password">
                  <CreditCard />
                  Ganti Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
