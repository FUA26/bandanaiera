import { z } from "zod";

/**
 * ============================================================================
 * Service Category Schemas
 * ============================================================================
 */

/**
 * Base service category schema with all validation rules
 */
export const serviceCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required").max(50, "Color must be less than 50 characters"),
  bgColor: z.string().min(1, "Background color is required").max(50, "Background color must be less than 50 characters"),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0, "Order must be a non-negative integer").default(0),
});

/**
 * Schema for creating a new service category
 */
export const serviceCategoryCreateSchema = serviceCategorySchema;

/**
 * Schema for updating an existing service category (all fields optional except id)
 */
export const serviceCategoryUpdateSchema = serviceCategorySchema.partial().extend({
  id: z.string().min(1, "Invalid category ID format"),
});

/**
 * ============================================================================
 * Contact Info Schema (Nested Object)
 * ============================================================================
 */

/**
 * Contact information schema for service details
 * All fields are optional, but if provided should be valid
 */
export const contactInfoSchema = z.object({
  office: z.string().max(200, "Office name must be less than 200 characters").optional(),
  phone: z.string().max(50, "Phone must be less than 50 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

/**
 * ============================================================================
 * FAQ Schema (Nested Object)
 * ============================================================================
 */

/**
 * Individual FAQ item schema
 */
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
  answer: z.string().min(1, "Answer is required").max(2000, "Answer must be less than 2000 characters"),
});

/**
 * ============================================================================
 * Download Form Schema (Nested Object)
 * ============================================================================
 */

/**
 * Download form item schema (for file or URL type downloads)
 */
export const downloadFormSchema = z.object({
  type: z.enum(["file", "url"], { required_error: "Type is required" }),
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  value: z.string().min(1, "URL or file ID is required").max(500, "Value must be less than 500 characters"),
  fileId: z.string().min(1, "Invalid file ID format").optional(),
});

/**
 * ============================================================================
 * Service Schemas
 * ============================================================================
 */

/**
 * Base service schema with all validation rules
 */
export const serviceSchema = z.object({
  slug: z.string()
    .min(1, "Slug is required")
    .max(200, "Slug must be less than 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  icon: z.string().min(1, "Icon is required").max(100, "Icon must be less than 100 characters"),
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  categoryId: z.string().min(1, "Invalid category ID format"),
  badge: z.string().max(50, "Badge must be less than 50 characters").optional(),
  stats: z.string().max(100, "Stats must be less than 100 characters").optional(),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0, "Order must be a non-negative integer").default(0),
  isIntegrated: z.boolean().default(false),
  detailedDescription: z.string().max(5000, "Detailed description must be less than 5000 characters").optional(),
  requirements: z.array(z.string().max(500, "Requirement must be less than 500 characters")).optional(),
  process: z.array(z.string().max(500, "Process step must be less than 500 characters")).optional(),
  duration: z.string().max(100, "Duration must be less than 100 characters").optional(),
  cost: z.string().max(200, "Cost must be less than 200 characters").optional(),
  contactInfo: contactInfoSchema.optional(),
  faqs: z.array(faqSchema).optional(),
  downloadForms: z.array(downloadFormSchema).optional(),
  relatedServices: z.array(z.string().min(1, "Invalid related service ID format")).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], { required_error: "Status is required" }).default("DRAFT"),
});

/**
 * Schema for creating a new service
 */
export const serviceCreateSchema = serviceSchema;

/**
 * Schema for updating an existing service (all fields optional)
 * id is handled separately from form data
 */
export const serviceUpdateSchema = z.object({
  slug: z.string().optional(),
  icon: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  badge: z.string().optional(),
  stats: z.string().optional(),
  showInMenu: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isIntegrated: z.boolean().optional(),
  detailedDescription: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  process: z.array(z.string()).optional(),
  duration: z.string().optional(),
  cost: z.string().optional(),
  contactInfo: z.object({
    office: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  faqs: z.array(z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  })).optional(),
  downloadForms: z.array(z.object({
    type: z.enum(["file", "url"]).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    fileId: z.string().min(1).optional(),
  })).optional(),
  relatedServices: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

/**
 * ============================================================================
 * Service Reorder Schema (Bulk Reorder)
 * ============================================================================
 */

/**
 * Schema for bulk reordering services
 */
export const serviceReorderSchema = z.object({
  services: z.array(
    z.object({
      id: z.string().min(1, "Invalid service ID format"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ).min(1, "At least one service is required"),
});

/**
 * ============================================================================
 * Query Parameter Schemas
 * ============================================================================
 */

/**
 * Schema for service list query parameters
 */
export const serviceQuerySchema = z.object({
  categoryId: z.string().min(1, "Invalid category ID format").optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  showInMenu: z.boolean().optional(),
  search: z.string().max(200, "Search query must be less than 200 characters").optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  pageSize: z.coerce.number().int().min(1, "Page size must be at least 1").max(100, "Page size cannot exceed 100").default(20),
  sortBy: z.enum(["name", "order", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Schema for service category list query parameters
 */
export const serviceCategoryQuerySchema = z.object({
  showInMenu: z.boolean().optional(),
  search: z.string().max(200, "Search query must be less than 200 characters").optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
  pageSize: z.coerce.number().int().min(1, "Page size must be at least 1").max(100, "Page size cannot exceed 100").default(20),
  sortBy: z.enum(["name", "order", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * ============================================================================
 * TypeScript Type Exports
 * ============================================================================
 */

/**
 * inferred types from Zod schemas
 */
export type ServiceCategoryInput = z.infer<typeof serviceCategoryCreateSchema>;
export type ServiceCategoryUpdateInput = z.infer<typeof serviceCategoryUpdateSchema>;
export type ServiceInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type DownloadFormInput = z.infer<typeof downloadFormSchema>;
export type ServiceReorderInput = z.infer<typeof serviceReorderSchema>;
export type ServiceQueryInput = z.infer<typeof serviceQuerySchema>;
export type ServiceCategoryQueryInput = z.infer<typeof serviceCategoryQuerySchema>;
