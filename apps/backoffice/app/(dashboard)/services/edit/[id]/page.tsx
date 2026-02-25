/**
 * Edit Service Page
 *
 * Page for editing an existing service
 * Requires: CONTENT_UPDATE_ANY permission
 */

import { ServiceDialog } from "@/components/admin/service-dialog";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditServiceContent } from "./edit-client";

async function getService(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!service) {
    return null;
  }

  return service;
}

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

function EditServiceContentSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update service details</p>
      </div>
      <div className="h-64 animate-pulse bg-muted rounded-lg" />
    </div>
  );
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProtectedRoute permissions={["CONTENT_UPDATE_ANY"]}>
      <Suspense fallback={<EditServiceContentSkeleton />}>
        <EditServiceContent serviceId={id} />
      </Suspense>
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "Edit Service",
  description: "Edit service details",
};
