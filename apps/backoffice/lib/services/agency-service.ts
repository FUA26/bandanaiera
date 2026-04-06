import { prisma, Prisma } from '@/lib/db/prisma';
import { AgencyStatus, AgencyCategory } from '@prisma/client';
import type { AgencyInput, AgencyUpdateInput } from '@/lib/validations/agency';

export interface AgencyListOptions {
  page?: number;
  pageSize?: number;
  category?: AgencyCategory;
  status?: AgencyStatus;
  showInMenu?: boolean;
  search?: string;
}

export interface PaginatedAgency<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const AGENCY_INCLUDE = {
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
      serviceRelatedAgencies: true,
    },
  },
} as const;

export async function getAgencyList(options: AgencyListOptions = {}): Promise<PaginatedAgency<any>> {
  const { page = 1, pageSize = 20, category, status, showInMenu, search } = options;

  const where: Prisma.AgencyWhereInput = {};

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
    prisma.agency.findMany({
      where,
      include: AGENCY_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.agency.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAgencyById(id: string) {
  return prisma.agency.findUnique({
    where: { id },
    include: {
      ...AGENCY_INCLUDE,
      servicesAsOwner: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
      serviceRelatedAgencies: {
        include: {
          service: {
            where: { status: 'PUBLISHED' },
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function getAgencyBySlug(slug: string) {
  return prisma.agency.findUnique({
    where: { slug },
    include: {
      ...AGENCY_INCLUDE,
      servicesAsOwner: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      },
      serviceRelatedAgencies: {
        include: {
          service: {
            where: { status: 'PUBLISHED' },
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function createAgency(data: AgencyInput, userId: string) {
  const agency = await prisma.agency.create({
    data: {
      ...data,
      createdById: userId,
    },
    include: AGENCY_INCLUDE,
  });

  // Log activity
  await prisma.agencyActivityLog.create({
    data: {
      agencyId: agency.id,
      userId,
      action: 'CREATE',
      changes: data,
    },
  });

  return agency;
}

export async function updateAgency(id: string, data: AgencyUpdateInput, userId: string) {
  const existing = await prisma.agency.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Agency not found');
  }

  const { id: _id, ...updateData } = data as any;

  const agency = await prisma.agency.update({
    where: { id },
    data: {
      ...updateData,
      updatedById: userId,
    },
    include: AGENCY_INCLUDE,
  });

  // Log activity
  await prisma.agencyActivityLog.create({
    data: {
      agencyId: agency.id,
      userId,
      action: 'UPDATE',
      changes: {
        before: existing,
        after: agency,
      },
    },
  });

  return agency;
}

export async function deleteAgency(id: string, userId: string) {
  const existing = await prisma.agency.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          servicesAsOwner: true,
          serviceRelatedAgencies: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error('Agency not found');
  }

  if (existing._count.servicesAsOwner > 0) {
    throw new Error('Cannot delete agency with associated services');
  }

  await prisma.agency.delete({
    where: { id },
  });

  // Log activity
  await prisma.agencyActivityLog.create({
    data: {
      agencyId: id,
      userId,
      action: 'DELETE',
      changes: {
        before: existing,
      },
    },
  });
}

export async function reorderAgencies(agencies: Array<{ id: string; order: number }>) {
  const updates = agencies.map(({ id, order }) =>
    prisma.agency.update({
      where: { id },
      data: { order },
    })
  );

  await Promise.all(updates);
}

export async function getAgencyActivityLogs(agencyId: string, page = 1, pageSize = 20) {
  const [logs, total] = await Promise.all([
    prisma.agencyActivityLog.findMany({
      where: { agencyId },
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
    prisma.agencyActivityLog.count({ where: { agencyId } }),
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
