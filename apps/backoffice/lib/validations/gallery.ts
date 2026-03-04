import { z } from 'zod';

// Album Schemas
export const albumSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  coverImageId: z.preprocess(
    (val) => val === '' || val === null ? undefined : val,
    z.string().cuid().optional()
  ),
  order: z.number().int().min(0).default(0),
});

export const albumUpdateSchema = albumSchema.partial().extend({
  id: z.string().cuid(),
});

// Tag Schemas
export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export const tagUpdateSchema = tagSchema.partial().extend({
  id: z.string().cuid(),
});

// Photo Schemas
export const photoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  albumId: z.preprocess(
    (val) => val === '' || val === null ? undefined : val,
    z.string().cuid().optional()
  ),
  imageId: z.string().cuid(),
  location: z.string().max(200).optional(),
  photographer: z.string().max(100).optional(),
  isFeatured: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const photoUpdateSchema = photoSchema.partial().extend({
  id: z.string().cuid(),
});

export const photoPublishSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export const photoReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })),
});

export const albumReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })),
});

// Query schemas
export const photoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  albumId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isFeatured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  tags: z.string().optional(),
});

export const albumQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});
