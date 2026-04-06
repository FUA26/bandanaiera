import { z } from "zod";

/**
 * ============================================================================
 * Agency Schemas
 * ============================================================================
 */

/**
 * Base agency schema with all validation rules
 */
export const agencySchema = z.object({
  slug: z.string()
    .min(1, "Slug is required")
    .max(200, "Slug must be less than 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  nickname: z.string()
    .min(1, "Nickname is required")
    .max(100, "Nickname must be less than 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  logoId: z.string().min(1, "Logo is required").optional(),
  category: z.enum(["BADAN", "DINAS", "KECAMATAN", "DESA"], {
    required_error: "Category is required",
  }),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  contactInfo: z.object({
    phone: z.string().max(50, "Phone must be less than 50 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    website: z.string().url("Invalid website URL").optional(),
  }).optional(),
  operatingHours: z.string().max(500, "Operating hours must be less than 500 characters").optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], { required_error: "Status is required" }).default("ACTIVE"),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0, "Order must be a non-negative integer").default(0),
});

/**
 * Schema for creating a new agency
 */
export const agencyCreateSchema = agencySchema;

/**
 * Schema for updating an existing agency (all fields optional except id)
 */
export const agencyUpdateSchema = agencySchema.partial().extend({
  id: z.string().min(1, "Invalid agency ID format"),
});

/**
 * Schema for agency list query parameters
 */
export const agencyQuerySchema = z.object({
  category: z.enum(["BADAN", "DINAS", "KECAMATAN", "DESA"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  showInMenu: z.boolean().optional(),
  search: z.string().max(200, "Search query must be less than 200 characters").optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  pageSize: z.coerce.number().int().min(1, "Page size must be at least 1").max(100, "Page size cannot exceed 100").default(20),
  sortBy: z.enum(["name", "order", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Schema for agency reorder
 */
export const agencyReorderSchema = z.object({
  agencies: z.array(
    z.object({
      id: z.string().min(1, "Invalid agency ID format"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ).min(1, "At least one agency is required"),
});

/**
 * ============================================================================
 * TypeScript Type Exports
 * ============================================================================
 */

export type AgencyInput = z.infer<typeof agencyCreateSchema>;
export type AgencyUpdateInput = z.infer<typeof agencyUpdateSchema>;
export type AgencyQueryInput = z.infer<typeof agencyQuerySchema>;
export type AgencyReorderInput = z.infer<typeof agencyReorderSchema>;
