"use client";

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
  BarChartIcon,
  LayoutDashboard,
  SecurityIcon,
  Settings01Icon,
  Settings02Icon,
  Users,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { heading: "Overview" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: null },
  { href: "/analytics", label: "Analytics", icon: BarChartIcon, permission: null },
  { heading: "Management" },
  {
    href: "/manage/users",
    label: "Users",
    icon: Users,
    permission: "ADMIN_USERS_MANAGE",
  },
  {
    href: "/manage/roles",
    label: "Roles",
    icon: SecurityIcon,
    permission: "ADMIN_ROLES_MANAGE",
  },
  {
    href: "/manage/permissions",
    label: "Permissions",
    icon: Settings01Icon,
    permission: "ADMIN_PERMISSIONS_MANAGE",
  },
  {
    href: "/manage/system-settings",
    label: "System Settings",
    icon: Settings02Icon,
    permission: "ADMIN_SYSTEM_SETTINGS_MANAGE",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userPermissions = usePermissions();

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    // If no permission required, always show
    if (!item.permission) return true;
    // If permission required, check if user has it
    return userPermissions?.permissions.includes(item.permission);
  });

  // Check if there are any management items
  const hasManagementItems = filteredNavItems.some(
    (item) => item.heading === "Management" || item.permission?.startsWith("ADMIN_")
  );

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
        // Skip management heading if no management items
        if (item.heading === "Management" && !hasManagementItems) {
          return groups;
        }
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
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={LayoutDashboard} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Naiera</span>
                  <span className="truncate text-xs text-muted-foreground">Dashboard</span>
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
                          <HugeiconsIcon icon={item.icon} className="h-5 w-5" />
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
