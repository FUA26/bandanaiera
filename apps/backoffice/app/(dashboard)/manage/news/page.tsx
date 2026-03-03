/**
 * News Page
 */

import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { NewsClient } from './news-client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

async function getNews() {
  return prisma.news.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      featuredImage: {
        select: {
          id: true,
          cdnUrl: true,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 50,
  });
}

async function getCategories() {
  return prisma.newsCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

function NewsContent() {
  const news = getNews();
  const categories = getCategories();

  return (
    <NewsClient
      newsPromise={news}
      categoriesPromise={categories}
      header={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">News</h1>
            <p className="text-muted-foreground">
              Manage news articles for the website
            </p>
          </div>
        </div>
      }
    />
  );
}

export default function NewsPage() {
  return (
    <ProtectedRoute permissions={["NEWS_VIEW"]}>
      <NewsContent />
    </ProtectedRoute>
  );
}
