import { z } from 'zod';

// Category Schemas
export const destinationCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

export const destinationCategoryUpdateSchema = destinationCategorySchema.partial().extend({
  id: z.string().cuid(),
});

// Facility Schemas
export const destinationFacilitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional(),
  order: z.number().int().min(0).default(0),
  categoryId: z.preprocess(
    (val) => val === '' || val === null ? undefined : val,
    z.string().cuid().optional()
  ),
});

export const destinationFacilityUpdateSchema = destinationFacilitySchema.partial().extend({
  id: z.string().cuid(),
});

// Destination Schemas
export const destinationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  locationAddress: z.string().max(255).optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  priceInfo: z.string().max(255).optional(),
  openHours: z.string().max(100).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  isFeatured: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  coverImageId: z.preprocess(
    (val) => val === '' || val === null ? undefined : val,
    z.string().cuid().optional()
  ),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.coerce.date().optional(),
  facilities: z.array(z.string()).optional(), // Facility IDs
  relatedContent: z.array(z.object({
    relatedType: z.enum(['news', 'event']),
    relatedId: z.string().cuid(),
  })).optional(),
});

export const destinationUpdateSchema = destinationSchema.partial().extend({
  id: z.string().cuid(),
});

export const destinationPublishSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export const destinationReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })),
});

// Destination Image Schema
export const destinationImageSchema = z.object({
  imageId: z.string().cuid(),
  caption: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

// Query schemas
export const destinationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isFeatured: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
