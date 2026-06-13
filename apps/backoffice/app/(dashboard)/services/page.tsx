/**
 * Services Management Page
 *
 * Services management page with full CRUD operations and filtering
 * Requires: CONTENT_READ_ANY permission
 */

import { ServicesTableSkeleton } from "@/components/admin/services-table-skeleton";
import { SyncButton } from "@/components/admin/sync-button";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { Can } from "@/components/rbac/Can";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Suspense } from "react";
import { ServicesTableWithActions } from "./services-table-actions";

function ServicesContent() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground text-sm">
              Manage public services, categories, and content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Can permissions={["CONTENT_UPDATE_ANY"]}>
              <SyncButton />
            </Can>
            <Can permissions={["CONTENT_CREATE"]}>
              <Link href="/services/new">
                <Button size="default" className="gap-2">
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
                  New Service
                </Button>
              </Link>
            </Can>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/services/categories"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <Suspense fallback={<ServicesTableSkeleton />}>
        <ServicesTableWithActions />
      </Suspense>
    </div>
  );
}

/**
 * Server-side permission check wrapper
 */
export default function ServicesPage() {
  return (
    <ProtectedRoute permissions={["CONTENT_READ_ANY"]}>
      <ServicesContent />
    </ProtectedRoute>
  );
}
