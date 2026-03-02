/**
 * News Categories Page
 */

import { redirect } from 'next/navigation';
import { prisma } from '@workspace/db';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Categories</h1>
          <p className="text-muted-foreground">
            Manage news categories for the website
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
