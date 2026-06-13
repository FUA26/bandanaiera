/**
 * News Categories Page
 */

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { NewsCategoriesClient } from './news-categories-client';

async function getNewsCategories() {
  return prisma.newsCategory.findMany({
    include: {
      _count: {
        select: { news: true },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

function NewsCategoriesContent() {
  const categories = getNewsCategories();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kategori Berita</h1>
          <p className="text-muted-foreground text-sm">
            Kelola kategori berita untuk website
          </p>
        </div>
      </div>

      <NewsCategoriesClient categoriesPromise={categories} />
    </div>
  );
}

export default function NewsCategoriesPage() {
  return (
    <ProtectedRoute permissions={["NEWS_CATEGORIES_MANAGE"]}>
      <NewsCategoriesContent />
    </ProtectedRoute>
  );
}
