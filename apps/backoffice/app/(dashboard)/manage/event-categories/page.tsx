/**
 * Event Categories Page
 */

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { EventCategoriesClient } from './event-categories-client';

async function getEventCategories() {
  return prisma.eventCategory.findMany({
    include: {
      _count: {
        select: { events: true },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

function EventCategoriesContent() {
  const categories = getEventCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Categories</h1>
          <p className="text-muted-foreground">
            Manage event categories for the website
          </p>
        </div>
      </div>

      <EventCategoriesClient categoriesPromise={categories} />
    </div>
  );
}

export default function EventCategoriesPage() {
  return (
    <ProtectedRoute permissions={["EVENT_CATEGORIES_MANAGE"]}>
      <EventCategoriesContent />
    </ProtectedRoute>
  );
}
