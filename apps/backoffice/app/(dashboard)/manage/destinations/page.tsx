import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { DestinationsClient } from './destinations-client';

async function getDestinations() {
  return prisma.destination.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      coverImage: {
        select: {
          id: true,
          cdnUrl: true,
        },
      },
      facilities: {
        include: {
          facility: true,
        },
      },
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
    take: 50,
  });
}

async function getCategories() {
  return prisma.destinationCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

async function getFacilities() {
  return prisma.destinationFacility.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

export default async function DestinationsPage() {
  const [destinations, categories, facilities] = await Promise.all([
    getDestinations(),
    getCategories(),
    getFacilities(),
  ]);

  return (
    <ProtectedRoute permissions={["DESTINATIONS_VIEW"]}>
      <DestinationsClient
        initialDestinations={destinations}
        categories={categories}
        facilities={facilities}
      />
    </ProtectedRoute>
  );
}
