/**
 * New Service Page
 *
 * Page for creating a new service
 * Requires: CONTENT_CREATE permission
 */

import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { prisma } from "@/lib/db/prisma";
import { NewServiceClient } from "./new-client";
import { Loader2 } from "lucide-react";

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

function NewServiceSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="h-96 animate-pulse bg-muted rounded-lg" />
    </div>
  );
}

export default async function NewServicePage() {
  const categories = await getCategories();

  return (
    <ProtectedRoute permissions={["CONTENT_CREATE"]}>
      <NewServiceClient categories={categories} />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "New Service",
  description: "Create a new service",
};
