import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { FacilitiesClient } from './facilities-client';

async function getFacilities() {
  return prisma.destinationFacility.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { destinations: true },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

async function getCategories() {
  return prisma.destinationCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

export default async function FacilitiesPage() {
  const [facilities, categories] = await Promise.all([
    getFacilities(),
    getCategories(),
  ]);

  return (
    <ProtectedRoute permissions={["DESTINATIONS_VIEW"]}>
      <FacilitiesClient initialFacilities={facilities} categories={categories} />
    </ProtectedRoute>
  );
}
