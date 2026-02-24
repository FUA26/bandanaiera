import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Providers } from "@/components/shared/providers";
import { auth } from "@/lib/auth/config";
import { PermissionProvider } from "@/lib/rbac-client/provider";
import { loadUserPermissions } from "@/lib/rbac-server/loader";
import { redirect } from "next/navigation";
// Import NextAuth type extensions
import "@/lib/auth/types";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Load permissions on server-side to avoid client-side fetching
  const permissions = await loadUserPermissions(session.user.id);

  // Fetch full user data including role
  const { prisma } = await import("@/lib/db/prisma");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      avatarId: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <PermissionProvider initialPermissions={permissions}>
      <Providers>
        <DashboardLayout user={user ?? session.user}>{children}</DashboardLayout>
      </Providers>
    </PermissionProvider>
  );
}
