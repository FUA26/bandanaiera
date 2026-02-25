/**
 * Services Table with Server Actions
 *
 * Server component that fetches services and categories
 * and passes them to the client data table component
 */

import { prisma } from "@/lib/db/prisma";
import { ServicesDataTable } from "@/components/admin/services-data-table";
import { revalidatePath } from "next/cache";

async function getServices() {
  return await prisma.service.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          bgColor: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      updatedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
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

export async function ServicesTableWithActions() {
  const [services, categories] = await Promise.all([getServices(), getCategories()]);

  async function refresh() {
    "use server";
    revalidatePath("/services");
  }

  return <ServicesDataTable services={services} categories={categories} onRefresh={refresh} />;
}
