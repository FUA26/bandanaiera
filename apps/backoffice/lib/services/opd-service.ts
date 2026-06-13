import { prisma, Prisma } from '@/lib/db/prisma';
import { OpdStatus, OpdCategory } from '@prisma/client';
import type { OpdInput, OpdUpdateInput } from '@/lib/validations/opd';

export interface OpdListOptions {
  page?: number;
  pageSize?: number;
  category?: OpdCategory;
  status?: OpdStatus;
  showInMenu?: boolean;
  search?: string;
}

export interface PaginatedOpd<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const OPD_INCLUDE = {
  logo: true,
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
  _count: {
    select: {
      servicesAsOwner: true,
      serviceRelatedOpds: true,
    },
  },
} as const;

export async function getOpdList(options: OpdListOptions = {}): Promise<PaginatedOpd<any>> {
  const { page = 1, pageSize = 20, category, status, showInMenu, search } = options;

  const where: Prisma.OpdWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (showInMenu !== undefined) {
    where.showInMenu = showInMenu;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nickname: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.opd.findMany({
      where,
      include: OPD_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.opd.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOpdById(id: string) {
  return prisma.opd.findUnique({
    where: { id },
    include: {
      ...OPD_INCLUDE,
      servicesAsOwner: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
      serviceRelatedOpds: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function getOpdBySlug(slug: string) {
  return prisma.opd.findUnique({
    where: { slug },
    include: {
      ...OPD_INCLUDE,
      servicesAsOwner: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
      serviceRelatedOpds: {
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function createOpd(data: OpdInput, userId: string) {
  const opd = await prisma.opd.create({
    data: {
      ...data,
      createdById: userId,
    },
    include: OPD_INCLUDE,
  });

  // Log activity
  await prisma.opdActivityLog.create({
    data: {
      opdId: opd.id,
      userId,
      action: 'CREATE',
      changes: data,
    },
  });

  return opd;
}

export async function updateOpd(id: string, data: OpdUpdateInput, userId: string) {
  const existing = await prisma.opd.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Opd not found');
  }

  const { id: _id, ...updateData } = data as any;

  const opd = await prisma.opd.update({
    where: { id },
    data: {
      ...updateData,
      updatedById: userId,
    },
    include: OPD_INCLUDE,
  });

  // Log activity
  await prisma.opdActivityLog.create({
    data: {
      opdId: opd.id,
      userId,
      action: 'UPDATE',
      changes: {
        before: existing,
        after: opd,
      },
    },
  });

  return opd;
}

export async function deleteOpd(id: string, userId: string) {
  const existing = await prisma.opd.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          servicesAsOwner: true,
          serviceRelatedOpds: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error('Opd not found');
  }

  if (existing._count.servicesAsOwner > 0) {
    throw new Error('Cannot delete opd with associated services');
  }

  // Log activity BEFORE deleting (foreign key constraint)
  await prisma.opdActivityLog.create({
    data: {
      opdId: id,
      userId,
      action: 'DELETE',
      changes: {
        before: existing,
      },
    },
  });

  await prisma.opd.delete({
    where: { id },
  });
}

export async function reorderOpds(opds: Array<{ id: string; order: number }>, userId: string) {
  const updates = opds.map(({ id, order }) =>
    prisma.opd.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);

  // Log activity
  await prisma.opdActivityLog.create({
    data: {
      opdId: opds[0].id, // Log first opd as representative
      userId,
      action: 'REORDER',
      changes: { opds },
    },
  });
}

export async function getOpdActivityLogs(opdId: string, page = 1, pageSize = 20) {
  const [logs, total] = await Promise.all([
    prisma.opdActivityLog.findMany({
      where: { opdId },
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.opdActivityLog.count({ where: { opdId } }),
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
