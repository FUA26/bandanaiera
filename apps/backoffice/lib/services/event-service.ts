import { prisma, Prisma } from '@/lib/db/prisma';
import { EventStatus, EventType } from '@prisma/client';

export interface EventListOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: EventStatus;
  type?: EventType;
  featured?: boolean;
  search?: string;
}

export interface PaginatedEvents<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const EVENT_INCLUDE = {
  category: true,
  image: true,
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
} as const;

export async function getEventsList(options: EventListOptions = {}): Promise<PaginatedEvents<any>> {
  const { page = 1, pageSize = 20, categoryId, status, type, featured, search } = options;

  const where: Prisma.EventWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: EVENT_INCLUDE,
      orderBy: [
        { featured: 'desc' },
        { date: 'asc' },
        { order: 'asc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: EVENT_INCLUDE,
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: EVENT_INCLUDE,
  });
}

export async function createEvent(data: any, userId: string) {
  const event = await prisma.event.create({
    data: {
      ...data,
      createdById: userId,
    },
    include: EVENT_INCLUDE,
  });

  await eventActivityLog(event.id, userId, 'created', { data });

  return event;
}

export async function updateEvent(id: string, data: any, userId: string) {
  const existing = await getEventById(id);
  if (!existing) {
    throw new Error('Event not found');
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...data,
      updatedById: userId,
    },
    include: EVENT_INCLUDE,
  });

  await eventActivityLog(id, userId, 'updated', {
    before: existing,
    after: event,
  });

  return event;
}

export async function deleteEvent(id: string, userId: string) {
  const existing = await getEventById(id);
  if (!existing) {
    throw new Error('Event not found');
  }

  await eventActivityLog(id, userId, 'deleted', { before: existing });

  await prisma.event.delete({
    where: { id },
  });

  return existing;
}

export async function updateEventStatus(id: string, status: EventStatus, userId: string) {
  const existing = await getEventById(id);
  if (!existing) {
    throw new Error('Event not found');
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      status,
      updatedById: userId,
    },
    include: EVENT_INCLUDE,
  });

  const action = status === 'PUBLISHED' ? 'published' : status === 'CANCELLED' ? 'cancelled' : 'completed';
  await eventActivityLog(id, userId, action, { before: existing, after: event });

  return event;
}

export async function reorderEvents(items: Array<{ id: string; order: number }>, userId: string) {
  const updates = items.map(({ id, order }) =>
    prisma.event.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);

  await eventActivityLog(items[0].id, userId, 'reordered', { items });

  return true;
}

// Event Categories
export async function getEventCategories() {
  return prisma.eventCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { events: true },
      },
    },
  });
}

export async function createEventCategory(data: any) {
  return prisma.eventCategory.create({
    data,
  });
}

export async function updateEventCategory(id: string, data: any) {
  return prisma.eventCategory.update({
    where: { id },
    data,
  });
}

export async function deleteEventCategory(id: string) {
  const count = await prisma.event.count({
    where: { categoryId: id },
  });

  if (count > 0) {
    throw new Error('Cannot delete category with existing events');
  }

  return prisma.eventCategory.delete({
    where: { id },
  });
}

// Activity Logs
export async function getEventActivityLogs(eventId: string) {
  return prisma.eventActivityLog.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Activity log helper
async function eventActivityLog(eventId: string, userId: string, action: string, changes?: any) {
  return prisma.eventActivityLog.create({
    data: {
      eventId,
      userId,
      action,
      changes,
    },
  });
}
