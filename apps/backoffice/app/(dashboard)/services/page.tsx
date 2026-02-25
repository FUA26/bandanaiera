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
import { PlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Suspense } from "react";
import { ServicesTableWithActions } from "./services-table-actions";

function ServicesContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage public services, categories, and content</p>
        </div>
        <div className="flex gap-2">
          <Can permissions={["CONTENT_UPDATE_ANY"]}>
            <SyncButton />
          </Can>
          <Can permissions={["CONTENT_CREATE"]}>
            <Link href="/services/new">
              <Button>
                <HugeiconsIcon icon={PlusIcon} className="h-4 w-4 mr-2" />
                New Service
              </Button>
            </Link>
          </Can>
        </div>
      </div>

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
