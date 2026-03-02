/**
 * Edit Service Page
 *
 * Page for editing an existing service
 * Requires: CONTENT_UPDATE_ANY permission
 */

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

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [service, categories] = await Promise.all([
    getService(id),
    getCategories(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <ProtectedRoute permissions={["CONTENT_UPDATE_ANY"]}>
      <Suspense fallback={<EditServiceContentSkeleton />}>
        <EditServiceContent
          serviceId={id}
          initialService={service as any}
          categories={categories}
        />
      </Suspense>
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "Edit Service",
  description: "Edit service details",
};
