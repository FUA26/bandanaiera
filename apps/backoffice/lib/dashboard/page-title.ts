import {
  LayoutDashboard,
  SecurityIcon,
  Settings,
  Settings01Icon,
  Settings02Icon,
  Users,
} from "@hugeicons/core-free-icons";

export interface PageTitle {
  title: string;
  icon: unknown; // IconSvgObject from @hugeicons/core-free-icons
}

export function getPageTitle(pathname: string): PageTitle {
  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments[0] !== "dashboard") {
    return { title: "Dashboard", icon: LayoutDashboard };
  }

  if (pathSegments.length === 1) {
    return { title: "Dashboard", icon: LayoutDashboard };
  }

  const secondSegment = pathSegments[1];

  switch (secondSegment) {
    case "manage":
      const manageItem = pathSegments[2];
      switch (manageItem) {
        case "users":
          return { title: "Users", icon: Users };
        case "roles":
          return { title: "Roles", icon: SecurityIcon };
        case "permissions":
          return { title: "Permissions", icon: Settings01Icon };
        case "system-settings":
          return { title: "System Settings", icon: Settings02Icon };
        default:
          return { title: "Management", icon: Settings };
      }
    case "settings":
      return { title: "Settings", icon: Settings };
    default:
      return { title: "Dashboard", icon: LayoutDashboard };
  }
}
