import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { CategoriesClient } from './categories-client';

async function getCategories() {
  return prisma.destinationCategory.findMany({
    include: {
      _count: {
        select: { destinations: true },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

export default async function DestinationCategoriesPage() {
  const categories = await getCategories();

  return (
    <ProtectedRoute permissions={["DESTINATION_CATEGORIES_MANAGE"]}>
      <CategoriesClient initialCategories={categories} />
    </ProtectedRoute>
  );
}
