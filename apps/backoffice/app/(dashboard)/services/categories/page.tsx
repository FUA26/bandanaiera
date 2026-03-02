/**
 * Categories Management Page
 *
 * Service categories management page with full CRUD operations
 * Requires: CONTENT_READ_ANY permission
 */

import { Suspense } from "react";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { CategoriesContent } from "./categories-content";
import { CategoriesTableSkeleton } from "./categories-table-client";

/**
 * Server-side permission check wrapper
 */
export default function CategoriesPage() {
  return (
    <ProtectedRoute permissions={["CONTENT_READ_ANY"]}>
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
