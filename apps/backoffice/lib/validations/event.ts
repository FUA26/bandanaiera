import { z } from 'zod';

// Event Category Schemas
export const eventCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  color: z.string().default('primary'),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const eventCategoryUpdateSchema = eventCategorySchema.partial().extend({
  id: z.string().cuid(),
});

// Event Schemas
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  categoryId: z.string().cuid(),
  date: z.coerce.date(),
  time: z.string().optional(),
  location: z.string().optional(),
  locationUrl: z.string().url().optional().or(z.literal('')),
  type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).default('OFFLINE'),
  imageId: z.preprocess(
    (val) => val === '' || val === null ? undefined : val,
    z.string().cuid().optional()
  ),
  organizer: z.string().min(1, 'Organizer is required').max(100),
  organizerContact: z.string().optional(),
  attendees: z.array(z.string()).optional(),
  registrationRequired: z.boolean().default(false),
  registrationUrl: z.string().url().optional().or(z.literal('')),
  maxAttendees: z.number().int().min(1).optional(),
  featured: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).default('DRAFT'),
});

export const eventUpdateSchema = eventSchema.partial().extend({
  id: z.string().cuid(),
});

export const eventStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
});

export const eventReorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })),
});

// Query schemas
export const eventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
  type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
});
