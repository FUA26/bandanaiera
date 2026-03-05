import { prisma } from '@/lib/db/prisma';
import { Prisma, TourismStatus } from '@prisma/client';

export interface TourismListOptions {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    status?: TourismStatus;
    featured?: boolean;
    search?: string;
}

export interface PaginatedTourism<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

const TOURISM_INCLUDE = {
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

export async function getTourismList(options: TourismListOptions = {}): Promise<PaginatedTourism<any>> {
    const { page = 1, pageSize = 20, categoryId, status, featured, search } = options;

    const where: Prisma.TourismDestinationWhereInput = {};

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (status) {
        where.status = status;
    }

    if (featured !== undefined) {
        where.featured = featured;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.tourismDestination.findMany({
            where,
            include: TOURISM_INCLUDE,
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.tourismDestination.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getTourismById(id: string) {
    return prisma.tourismDestination.findUnique({
        where: { id },
        include: TOURISM_INCLUDE,
    });
}

export async function getTourismBySlug(slug: string) {
    return prisma.tourismDestination.findUnique({
        where: { slug },
        include: TOURISM_INCLUDE,
    });
}

export async function createTourism(data: any, userId: string) {
    const destination = await prisma.tourismDestination.create({
        data: {
            ...data,
            createdById: userId,
        },
        include: TOURISM_INCLUDE,
    });

    await tourismActivityLog(destination.id, userId, 'created', { data });

    return destination;
}

export async function updateTourism(id: string, data: any, userId: string) {
    const existing = await getTourismById(id);
    if (!existing) {
        throw new Error('Tourism destination not found');
    }

    const updates: any = { ...data };

    const destination = await prisma.tourismDestination.update({
        where: { id },
        data: {
            ...updates,
            updatedById: userId,
        },
        include: TOURISM_INCLUDE,
    });

    await tourismActivityLog(id, userId, 'updated', {
        before: existing,
        after: destination,
    });

    return destination;
}

export async function deleteTourism(id: string, userId: string) {
    const existing = await getTourismById(id);
    if (!existing) {
        throw new Error('Tourism destination not found');
    }

    await tourismActivityLog(id, userId, 'deleted', { before: existing });

    await prisma.tourismDestination.delete({
        where: { id },
    });

    return existing;
}

export async function publishTourism(id: string, status: TourismStatus, userId: string) {
    const existing = await getTourismById(id);
    if (!existing) {
        throw new Error('Tourism destination not found');
    }

    const destination = await prisma.tourismDestination.update({
        where: { id },
        data: {
            status,
            updatedById: userId,
        },
        include: TOURISM_INCLUDE,
    });

    const action = status === 'PUBLISHED' ? 'published' : status === 'ARCHIVED' ? 'archived' : 'drafted';
    await tourismActivityLog(id, userId, action, { before: existing, after: destination });

    return destination;
}

export async function reorderTourism(items: Array<{ id: string; order: number }>, userId: string) {
    const updates = items.map(({ id, order }) =>
        prisma.tourismDestination.update({
            where: { id },
            data: { order },
        })
    );

    await prisma.$transaction(updates);

    if (items.length > 0) {
        const firstItem = items[0]!;
        await tourismActivityLog(firstItem.id, userId, 'reordered', { items });
    }

    return true;
}

// Tourism Categories
export async function getTourismCategories() {
    return prisma.tourismCategory.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: {
            _count: {
                select: { destinations: true },
            },
        },
    });
}

export async function getVisibleTourismCategories() {
    return prisma.tourismCategory.findMany({
        where: { showInMenu: true },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
}

export async function createTourismCategory(data: any) {
    return prisma.tourismCategory.create({
        data,
    });
}

export async function updateTourismCategory(id: string, data: any) {
    return prisma.tourismCategory.update({
        where: { id },
        data,
    });
}

export async function deleteTourismCategory(id: string) {
    const count = await prisma.tourismDestination.count({
        where: { categoryId: id },
    });

    if (count > 0) {
        throw new Error('Cannot delete category with existing destinations');
    }

    return prisma.tourismCategory.delete({
        where: { id },
    });
}

// Activity Logs
export async function getTourismActivityLogs(destinationId: string) {
    return prisma.tourismActivityLog.findMany({
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

// Activity log helper
async function tourismActivityLog(destinationId: string, userId: string, action: string, changes?: any) {
    return prisma.tourismActivityLog.create({
        data: {
            destinationId,
            userId,
            action,
            changes,
        },
    });
}
