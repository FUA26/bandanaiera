import { prisma, Prisma } from '@workspace/db';
import { NewsStatus } from '@prisma/client';

export interface NewsListOptions {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  status?: NewsStatus;
  featured?: boolean;
  search?: string;
}

export interface PaginatedNews<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const NEWS_INCLUDE = {
  category: true,
  featuredImage: true,
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

export async function getNewsList(options: NewsListOptions = {}): Promise<PaginatedNews<any>> {
  const { page = 1, pageSize = 20, categoryId, status, featured, search } = options;

  const where: Prisma.NewsWhereInput = {};

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
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      include: NEWS_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getNewsById(id: string) {
  return prisma.news.findUnique({
    where: { id },
    include: NEWS_INCLUDE,
  });
}

export async function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
    include: NEWS_INCLUDE,
  });
}

export async function createNews(data: any, userId: string) {
  const news = await prisma.news.create({
    data: {
      ...data,
      createdById: userId,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    },
    include: NEWS_INCLUDE,
  });

  await newsActivityLog(news.id, userId, 'created', { data });

  return news;
}

export async function updateNews(id: string, data: any, userId: string) {
  const existing = await getNewsById(id);
  if (!existing) {
    throw new Error('News not found');
  }

  const updates: any = { ...data };

  // Set publishedAt when publishing
  if (data.status === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
    updates.publishedAt = new Date();
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      ...updates,
      updatedById: userId,
    },
    include: NEWS_INCLUDE,
  });

  await newsActivityLog(id, userId, 'updated', {
    before: existing,
    after: news,
  });

  return news;
}

export async function deleteNews(id: string, userId: string) {
  const existing = await getNewsById(id);
  if (!existing) {
    throw new Error('News not found');
  }

  await newsActivityLog(id, userId, 'deleted', { before: existing });

  await prisma.news.delete({
    where: { id },
  });

  return existing;
}

export async function publishNews(id: string, status: NewsStatus, userId: string) {
  const existing = await getNewsById(id);
  if (!existing) {
    throw new Error('News not found');
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      updatedById: userId,
    },
    include: NEWS_INCLUDE,
  });

  const action = status === 'PUBLISHED' ? 'published' : status === 'ARCHIVED' ? 'archived' : 'unpublished';
  await newsActivityLog(id, userId, action, { before: existing, after: news });

  return news;
}

export async function reorderNews(items: Array<{ id: string; order: number }>, userId: string) {
  const updates = items.map(({ id, order }) =>
    prisma.news.update({
      where: { id },
      data: { order },
    })
  );

  await prisma.$transaction(updates);

  await newsActivityLog(items[0].id, userId, 'reordered', { items });

  return true;
}

// News Categories
export async function getNewsCategories() {
  return prisma.newsCategory.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { news: true },
      },
    },
  });
}

export async function getVisibleNewsCategories() {
  return prisma.newsCategory.findMany({
    where: { showInMenu: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });
}

export async function createNewsCategory(data: any) {
  return prisma.newsCategory.create({
    data,
  });
}

export async function updateNewsCategory(id: string, data: any) {
  return prisma.newsCategory.update({
    where: { id },
    data,
  });
}

export async function deleteNewsCategory(id: string) {
  // Check if category has news
  const count = await prisma.news.count({
    where: { categoryId: id },
  });

  if (count > 0) {
    throw new Error('Cannot delete category with existing news');
  }

  return prisma.newsCategory.delete({
    where: { id },
  });
}

// Activity Logs
export async function getNewsActivityLogs(newsId: string) {
  return prisma.newsActivityLog.findMany({
    where: { newsId },
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
async function newsActivityLog(newsId: string, userId: string, action: string, changes?: any) {
  return prisma.newsActivityLog.create({
    data: {
      newsId,
      userId,
      action,
      changes,
    },
  });
}
