import { Prisma, ServiceStatus } from "@prisma/client";

/**
 * Service Category interface matching the Prisma ServiceCategory model
 */
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgColor: string;
  showInMenu: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service interface matching the Prisma Service model
 */
export interface Service {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string | null;
  stats?: string | null;
  showInMenu: boolean;
  order: number;
  isIntegrated: boolean;
  detailedDescription?: string | null;
  requirements?: Prisma.JsonValue | null;
  process?: Prisma.JsonValue | null;
  duration?: string | null;
  cost?: string | null;
  contactInfo?: Prisma.JsonValue | null;
  faqs?: Prisma.JsonValue | null;
  downloadForms?: Prisma.JsonValue | null;
  relatedServices?: Prisma.JsonValue | null;
  status: ServiceStatus;
  createdById: string;
  updatedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service Activity Log interface matching the Prisma ServiceActivityLog model
 */
export interface ServiceActivityLog {
  id: string;
  serviceId: string;
  userId: string;
  action: string;
  changes?: Prisma.JsonValue | null;
  createdAt: Date;
}

/**
 * Service with category relation
 */
export interface ServiceWithCategory extends Service {
  category: ServiceCategory;
}

/**
 * Service with full relations
 */
export interface ServiceWithRelations extends Service {
  category: ServiceCategory;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  updatedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

/**
 * Service Activity Log with relations
 */
export interface ServiceActivityLogWithRelations extends ServiceActivityLog {
  service: Service;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

/**
 * Service Category with services relation
 */
export interface ServiceCategoryWithServices extends ServiceCategory {
  services: Service[];
}

/**
 * Input types for creating/updating services
 */
export interface CreateServiceInput {
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string;
  stats?: string;
  showInMenu?: boolean;
  order?: number;
  isIntegrated?: boolean;
  detailedDescription?: string;
  requirements?: Prisma.JsonValue;
  process?: Prisma.JsonValue;
  duration?: string;
  cost?: string;
  contactInfo?: Prisma.JsonValue;
  faqs?: Prisma.JsonValue;
  downloadForms?: Prisma.JsonValue;
  relatedServices?: Prisma.JsonValue;
  status?: ServiceStatus;
  createdById: string;
}

export interface UpdateServiceInput {
  slug?: string;
  icon?: string;
  name?: string;
  description?: string;
  categoryId?: string;
  badge?: string;
  stats?: string;
  showInMenu?: boolean;
  order?: number;
  isIntegrated?: boolean;
  detailedDescription?: string;
  requirements?: Prisma.JsonValue;
  process?: Prisma.JsonValue;
  duration?: string;
  cost?: string;
  contactInfo?: Prisma.JsonValue;
  faqs?: Prisma.JsonValue;
  downloadForms?: Prisma.JsonValue;
  relatedServices?: Prisma.JsonValue;
  status?: ServiceStatus;
  updatedById?: string;
}

/**
 * Input types for creating/updating service categories
 */
export interface CreateServiceCategoryInput {
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgColor: string;
  showInMenu?: boolean;
  order: number;
}

export interface UpdateServiceCategoryInput {
  name?: string;
  slug?: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  showInMenu?: boolean;
  order?: number;
}

/**
 * Input type for creating service activity logs
 */
export interface CreateServiceActivityLogInput {
  serviceId: string;
  userId: string;
  action: string;
  changes?: Prisma.JsonValue;
}

/**
 * Service list query parameters
 */
export interface ServiceListParams {
  categoryId?: string;
  status?: ServiceStatus;
  showInMenu?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "order" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Service category list query parameters
 */
export interface ServiceCategoryListParams {
  showInMenu?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "order" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Re-export ServiceStatus enum from Prisma for convenience
 */
export type { ServiceStatus };

/**
 * Service status values for UI select options
 */
export const SERVICE_STATUS_VALUES: readonly [
  ServiceStatus.DRAFT,
  ServiceStatus.PUBLISHED,
  ServiceStatus.ARCHIVED,
] = [ServiceStatus.DRAFT, ServiceStatus.PUBLISHED, ServiceStatus.ARCHIVED];

/**
 * Service status labels for UI display
 */
export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  [ServiceStatus.DRAFT]: "Draft",
  [ServiceStatus.PUBLISHED]: "Published",
  [ServiceStatus.ARCHIVED]: "Archived",
};

/**
 * Service activity log action types
 */
export type ServiceActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "published"
  | "archived"
  | "restored"
  | "reordered";

/**
 * Service activity log action labels
 */
export const SERVICE_ACTION_LABELS: Record<ServiceActivityAction, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  published: "Published",
  archived: "Archived",
  restored: "Restored",
  reordered: "Reordered",
};
