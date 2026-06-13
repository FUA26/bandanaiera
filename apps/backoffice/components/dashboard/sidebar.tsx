"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/lib/rbac-client/provider";
import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Folders,
  Newspaper,
  FolderKanban,
  Calendar,
  Users,
  Shield,
  Key,
  Settings,
  Map,
  Building,
} from "lucide-react";

const navItems = [
  // Overview Group
  { heading: "Ringkasan" },
  { href: "/", label: "Dasbor", icon: LayoutDashboard, permission: null },
  { href: "/analytics", label: "Analitik", icon: BarChart3, permission: null },

  // Layanan Publik Group
  { heading: "Layanan Publik" },
  { href: "/services", label: "Layanan", icon: FolderOpen, permission: "CONTENT_READ_ANY" },
  { href: "/services/categories", label: "Kategori Layanan", icon: Folders, permission: "CONTENT_READ_ANY" },

  // Perangkat Daerah Group
  { heading: "Perangkat Daerah" },
  { href: "/manage/opd", label: "Daftar OPD", icon: Building, permission: "OPD_VIEW" },

  // Informasi Publik Group
  { heading: "Informasi Publik" },
  { href: "/manage/news", label: "Berita", icon: Newspaper, permission: "NEWS_VIEW" },
  { href: "/manage/news-categories", label: "Kategori Berita", icon: FolderKanban, permission: "NEWS_CATEGORIES_MANAGE" },
  { href: "/manage/events", label: "Agenda Kegiatan", icon: Calendar, permission: "EVENTS_VIEW" },
  { href: "/manage/event-categories", label: "Kategori Agenda", icon: FolderKanban, permission: "EVENT_CATEGORIES_MANAGE" },
  { href: "/manage/tourism", label: "Destinasi Wisata", icon: Map, permission: "TOURISM_VIEW" },
  { href: "/manage/tourism-categories", label: "Kategori Wisata", icon: FolderKanban, permission: "TOURISM_CATEGORIES_MANAGE" },

  // Admin Group
  { heading: "Administrasi" },
  { href: "/manage/users", label: "Pengguna", icon: Users, permission: "ADMIN_USERS_MANAGE" },
  { href: "/manage/roles", label: "Peran", icon: Shield, permission: "ADMIN_ROLES_MANAGE" },
  {
    href: "/manage/permissions",
    label: "Izin Akses",
    icon: Key,
    permission: "ADMIN_PERMISSIONS_MANAGE",
  },
  {
    href: "/manage/system-settings",
    label: "Pengaturan Sistem",
    icon: Settings,
    permission: "ADMIN_SYSTEM_SETTINGS_MANAGE",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userPermissions = usePermissions();
  const cityName = process.env.NEXT_PUBLIC_CITY_NAME || "Naiera";

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    // If no permission required, always show
    if (!item.permission) return true;
    // If permission required, check if user has it
    return userPermissions?.permissions.includes(item.permission);
  });

  // Filter out headings if they have no items
  const finalNavItems = filteredNavItems.filter((item, index, array) => {
    if (!("heading" in item)) return true;

    // Keep heading if there are non-heading items after it before the next heading
    const nextHeadingIndex = array.findIndex((i, idx) => idx > index && "heading" in i);

    const itemsAfterHeading = array.slice(
      index + 1,
      nextHeadingIndex === -1 ? undefined : nextHeadingIndex
    );

    return itemsAfterHeading.some((i) => !("heading" in i));
  });

  // Group navigation items by their headings
  const groupedItems = finalNavItems.reduce(
    (groups, item) => {
      if ("heading" in item) {
        groups.push({ heading: item.heading, items: [] });
      } else {
        const currentGroup = groups[groups.length - 1];
        if (currentGroup) {
          currentGroup.items.push(item);
        }
      }
      return groups;
    },
    [] as Array<{ heading?: string; items: typeof navItems }>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-primary">
                  <Image
                    src="/logo.svg"
                    alt="Naiera Logo"
                    width={32}
                    height={32}
                    className="size-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kota {cityName}</span>
                  <span className="truncate text-xs text-muted-foreground">Portal Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groupedItems.map((group, idx) => (
          <SidebarGroup key={idx}>
            {group.heading && <SidebarGroupLabel>{group.heading}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  if ("heading" in item) return null;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
