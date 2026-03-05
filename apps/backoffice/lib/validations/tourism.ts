import { z } from 'zod';

// Tourism Category Schemas
export const tourismCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    color: z.string().default('primary'),
    showInMenu: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
});

export const tourismCategoryUpdateSchema = tourismCategorySchema.partial().extend({
    id: z.string().cuid(),
});

// Tourism Destination Schemas
export const tourismSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().min(1, 'Description is required').max(500),
    content: z.string().optional(),
    categoryId: z.string().cuid(),

    // Specifics
    location: z.string().optional(),
    locationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    price: z.string().optional(),
    openHours: z.string().optional(),
    facilities: z.array(z.string()).optional(),

    // Media
    imageId: z.preprocess(
        (val) => val === '' || val === null ? undefined : val,
        z.string().cuid().optional()
    ),

    // Display options
    featured: z.boolean().default(false),
    showInMenu: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    rating: z.coerce.number().min(0).max(5).default(0),
    reviews: z.coerce.number().int().min(0).default(0),

    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export const tourismUpdateSchema = tourismSchema.partial().extend({
    id: z.string().cuid(),
});

export const tourismPublishSchema = z.object({
    id: z.string().cuid(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export const tourismReorderSchema = z.object({
    items: z.array(z.object({
        id: z.string().cuid(),
        order: z.number().int().min(0),
    })),
});

// Query schemas
export const tourismQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    categoryId: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    featured: z.coerce.boolean().optional(),
    search: z.string().optional(),
});
