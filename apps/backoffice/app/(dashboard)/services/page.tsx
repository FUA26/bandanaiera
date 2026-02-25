/**
 * Services Management Page
 *
 * Services management page with full CRUD operations and filtering
 * Requires: CONTENT_READ_ANY permission
 */

import { ServicesTableSkeleton } from "@/components/admin/services-table-skeleton";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
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
        {/* Add New Service Button will be added in Phase 9 */}
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
