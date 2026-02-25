/**
 * New Service Page
 *
 * Page for creating a new service
 * Requires: CONTENT_CREATE permission
 */

import { ServiceDialog } from "@/components/admin/service-dialog";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense } from "react";
import { NewServiceContent } from "./new-client";

async function getCategories() {
  return await prisma.serviceCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { order: "asc" },
  });
}

function NewServiceContentSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Service</h1>
        <p className="text-muted-foreground">Add a new service to the system</p>
      </div>
      <div className="h-64 animate-pulse bg-muted rounded-lg" />
    </div>
  );
}

export default function NewServicePage() {
  return (
    <ProtectedRoute permissions={["CONTENT_CREATE"]}>
      <Suspense fallback={<NewServiceContentSkeleton />}>
        <NewServiceContent />
      </Suspense>
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "New Service",
  description: "Create a new service",
};
