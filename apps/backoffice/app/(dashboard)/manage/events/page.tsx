/**
 * Events Page
 */

import { prisma } from '@/lib/db/prisma';
import { ProtectedRoute } from '@/components/rbac/ProtectedRoute';
import { EventsClient } from './events-client';

async function getEvents() {
  return prisma.event.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      image: {
        select: {
          id: true,
          cdnUrl: true,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { date: 'asc' },
      { order: 'asc' },
    ],
    take: 50,
  });
}

async function getCategories() {
  return prisma.eventCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

function EventsContent() {
  const events = getEvents();
  const categories = getCategories();

  return (
    <EventsClient
      eventsPromise={events}
      categoriesPromise={categories}
      header={
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
            <p className="text-muted-foreground text-sm">
              Kelola agenda dan acara untuk website
            </p>
          </div>
        </div>
      }
    />
  );
}

export default function EventsPage() {
  return (
    <ProtectedRoute permissions={["EVENTS_VIEW"]}>
      <EventsContent />
    </ProtectedRoute>
  );
}
