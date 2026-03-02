import { z } from 'zod';

// News Category Schemas
export const newsCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  color: z.string().default('primary'),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const newsCategoryUpdateSchema = newsCategorySchema.partial().extend({
  id: z.string().cuid(),
});

// News Schemas
export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().optional(),
  categoryId: z.string().cuid(),
  featuredImageId: z.string().cuid().optional(),
  featured: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  author: z.string().max(100).optional(),
  readTime: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.coerce.date().optional(),
});

export const newsUpdateSchema = newsSchema.partial().extend({
  id: z.string().cuid(),
});

export const newsPublishSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export const newsReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })),
});

// Query schemas
export const newsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
