import { prisma, Prisma } from '@/lib/db/prisma';
import { DestinationStatus } from '@prisma/client';

export interface DestinationListOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: DestinationStatus;
  isFeatured?: boolean;
  search?: string;
}

export interface PaginatedDestinations<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DESTINATION_INCLUDE = {
  category: true,
  coverImage: true,
  facilities: {
    include: {
      facility: true,
    },
  },
  images: {
    include: {
      image: true,
    },
    orderBy: {
      order: 'asc' as Prisma.SortOrder,
    },
  },
  relations: true,
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

export async function getDestinationsList(options: DestinationListOptions = {}): Promise<PaginatedDestinations<any>> {
  const { page = 1, pageSize = 20, categoryId, status, isFeatured, search } = options;

  const where: Prisma.DestinationWhereInput = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status) {
    where.status = status;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { locationAddress: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      include: DESTINATION_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.destination.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getDestinationById(id: string) {
  return prisma.destination.findUnique({
    where: { id },
    include: DESTINATION_INCLUDE,
  });
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
    include: DESTINATION_INCLUDE,
  });
}

export async function createDestination(data: any, userId: string) {
  const { facilities, relatedContent, ...destinationData } = data;

  const destination = await prisma.destination.create({
    data: {
      ...destinationData,
      createdById: userId,
      publishedAt: destinationData.status === 'PUBLISHED' ? new Date() : null,
      facilities: facilities ? {
        create: facilities.map((facilityId: string) => ({
          facility: { connect: { id: facilityId } }
        }))
      } : undefined,
      relations: relatedContent ? {
        create: relatedContent.map((rel: any) => ({
          relatedType: rel.relatedType,
          relatedId: rel.relatedId,
        }))
      } : undefined
    },
    include: DESTINATION_INCLUDE,
  });

  await logDestinationActivity(destination.id, userId, 'created', { data });

  return destination;
}

export async function updateDestination(id: string, data: any, userId: string) {
  const existing = await getDestinationById(id);
  if (!existing) {
    throw new Error('Destination not found');
  }

  const { facilities, relatedContent, ...destinationData } = data;
  const updates: any = { ...destinationData };

  // Set publishedAt when publishing
  if (destinationData.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
    updates.publishedAt = new Date();
  }

  const destination = await prisma.destination.update({
    where: { id },
    data: {
      ...updates,
      updatedById: userId,
      facilities: facilities ? {
        deleteMany: {},
        create: facilities.map((facilityId: string) => ({
          facility: { connect: { id: facilityId } }
        }))
      } : undefined,
      relations: relatedContent ? {
        deleteMany: {},
        create: relatedContent.map((rel: any) => ({
          relatedType: rel.relatedType,
          relatedId: rel.relatedId,
        }))
      } : undefined
    },
    include: DESTINATION_INCLUDE,
  });

  await logDestinationActivity(id, userId, 'updated', {
    before: existing,
    after: destination,
  });

  return destination;
}

export async function deleteDestination(id: string, userId: string) {
  const existing = await getDestinationById(id);
  if (!existing) {
    throw new Error('Destination not found');
  }

  await logDestinationActivity(id, userId, 'deleted', { before: existing });

  await prisma.destination.delete({
    where: { id },
  });

  return existing;
}

export async function publishDestination(id: string, status: DestinationStatus, userId: string) {
  const existing = await getDestinationById(id);
  if (!existing) {
    throw new Error('Destination not found');
  }

  const destination = await prisma.destination.update({
    where: { id },
    data: {
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      updatedById: userId,
    },
    include: DESTINATION_INCLUDE,
  });

  const action = status === 'PUBLISHED' ? 'published' : status === 'ARCHIVED' ? 'archived' : 'unpublished';
  await logDestinationActivity(id, userId, action, { before: existing, after: destination });

  return destination;
}

export async function reorderDestinations(items: Array<{ id: string; order: number }>, userId?: string) {
  const updates = items.map(({ id, order }) =>
    prisma.destination.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);

  if (userId) {
    await logDestinationActivity(items[0].id, userId, 'reordered', { items });
  }

  return true;
}

// Categories
export async function getDestinationCategories() {
  return prisma.destinationCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { destinations: true },
      },
    },
  });
}

export async function createDestinationCategory(data: any) {
  return prisma.destinationCategory.create({
    data,
  });
}

export async function updateDestinationCategory(id: string, data: any) {
  return prisma.destinationCategory.update({
    where: { id },
    data,
  });
}

export async function deleteDestinationCategory(id: string) {
  const count = await prisma.destination.count({
    where: { categoryId: id },
  });

  if (count > 0) {
    throw new Error('Cannot delete category with existing destinations');
  }

  return prisma.destinationCategory.delete({
    where: { id },
  });
}

// Facilities
export async function getAllFacilities() {
  return prisma.destinationFacility.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      category: true,
      _count: {
        select: { destinations: true },
      },
    },
  });
}

export async function createFacility(data: any) {
  return prisma.destinationFacility.create({
    data,
  });
}

export async function updateFacility(id: string, data: any) {
  return prisma.destinationFacility.update({
    where: { id },
    data,
  });
}

export async function deleteFacility(id: string) {
  return prisma.destinationFacility.delete({
    where: { id },
  });
}

// Images
export async function getDestinationImages(destinationId: string) {
  return prisma.destinationImage.findMany({
    where: { destinationId },
    include: {
      image: true,
    },
    orderBy: { order: 'asc' },
  });
}

export async function addDestinationImage(destinationId: string, data: any) {
  return prisma.destinationImage.create({
    data: {
      ...data,
      destinationId,
    },
    include: {
      image: true,
    },
  });
}

export async function removeDestinationImage(id: string) {
  return prisma.destinationImage.delete({
    where: { id },
  });
}

export async function reorderDestinationImages(items: Array<{ id: string; order: number }>) {
  const updates = items.map(({ id, order }) =>
    prisma.destinationImage.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);
  return true;
}

// Activity logging
export async function logDestinationActivity(destinationId: string, userId: string, action: string, changes?: any) {
  return prisma.destinationActivityLog.create({
    data: {
      destinationId,
      userId,
      action,
      changes,
    },
  });
}

export async function getDestinationActivityLogs(destinationId: string) {
  return prisma.destinationActivityLog.findMany({
    where: { destinationId },
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
