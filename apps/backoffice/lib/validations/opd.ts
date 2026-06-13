import { z } from "zod";

/**
 * ============================================================================
 * OPD Schemas
 * ============================================================================
 */

/**
 * Base OPD schema with all validation rules
 */
export const opdSchema = z.object({
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
  category: z.enum(["DINAS", "BADAN", "KECAMATAN", "KELURAHAN", "DESA", "BAGIAN", "ORGANISASI_LAINNYA"], {
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
  status: z.enum(["AKTIF", "NONAKTIF"], { required_error: "Status is required" }),
  showInMenu: z.boolean(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
});

/**
 * Schema for creating a new OPD
 */
export const opdCreateSchema = opdSchema;

/**
 * Schema for updating an existing OPD (all fields optional except id)
 */
export const opdUpdateSchema = opdSchema.partial().extend({
  id: z.string().min(1, "Invalid OPD ID format"),
});

/**
 * Schema for OPD list query parameters
 */
export const opdQuerySchema = z.object({
  category: z.enum(["DINAS", "BADAN", "KECAMATAN", "KELURAHAN", "DESA", "BAGIAN", "ORGANISASI_LAINNYA"]).optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).optional(),
  showInMenu: z.boolean().optional(),
  search: z.string().max(200, "Search query must be less than 200 characters").optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  pageSize: z.coerce.number().int().min(1, "Page size must be at least 1").max(100, "Page size cannot exceed 100").default(20),
  sortBy: z.enum(["name", "order", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Schema for OPD reorder
 */
export const opdReorderSchema = z.object({
  opds: z.array(
    z.object({
      id: z.string().min(1, "Invalid OPD ID format"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ).min(1, "At least one OPD is required"),
});

/**
 * ============================================================================
 * TypeScript Type Exports
 * ============================================================================
 */

export type OpdInput = z.infer<typeof opdCreateSchema>;
export type OpdUpdateInput = z.infer<typeof opdUpdateSchema>;
export type OpdQueryInput = z.infer<typeof opdQuerySchema>;
export type OpdReorderInput = z.infer<typeof opdReorderSchema>;
