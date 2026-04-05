/**
 * Services API Route
 *
 * GET /api/services - List all services with pagination and filtering
 * POST /api/services - Create a new service
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import {
  serviceCreateSchema,
  serviceQuerySchema,
} from "@/lib/services/validations";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * GET /api/services
 * Get paginated list of services with filtering
 * Requires: CONTENT_READ_ANY permission
 */
export const GET = protectApiRoute({
  permissions: ["CONTENT_READ_ANY"] as Permission[],
  handler: async (request) => {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryValidation = serviceQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: queryValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      categoryId,
      status,
      showInMenu,
      search,
      page,
      pageSize,
      sortBy = "order",
      sortOrder = "asc",
    } = queryValidation.data;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (showInMenu !== undefined) {
      where.showInMenu = showInMenu;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Fetch services with pagination
    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true,
              bgColor: true,
            },
          },
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
          images: true,
        },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      pagination: {
        page,
        pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  },
});

/**
 * POST /api/services
 * Create a new service
 * Requires: CONTENT_CREATE permission
 */
export const POST = protectApiRoute({
  permissions: ["CONTENT_CREATE"] as Permission[],
  handler: async (request, { user }) => {
    try {
      const body = await request.json();

      // Validate input
      const validatedData = serviceCreateSchema.parse(body);

      // Check if slug already exists
      const existingService = await prisma.service.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingService) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: "Service with this slug already exists",
          },
          { status: 409 }
        );
      }

      // Verify category exists
      const category = await prisma.serviceCategory.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          {
            error: "Not Found",
            message: "Category not found",
          },
          { status: 404 }
        );
      }

      // Create service
      const service = await prisma.service.create({
        data: {
          ...validatedData,
          createdById: user.id,
          // Store JSON fields
          requirements: validatedData.requirements || [],
          process: validatedData.process || [],
          contactInfo: (validatedData.contactInfo ?? null) as Prisma.InputJsonValue,
          faqs: validatedData.faqs || [],
          downloadForms: validatedData.downloadForms || [],
          relatedServices: validatedData.relatedServices || [],
          imageIds: body.imageIds || [],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              color: true,
              bgColor: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: true,
        },
      });

      // Create activity log
      await prisma.serviceActivityLog.create({
        data: {
          serviceId: service.id,
          userId: user.id,
          action: "CREATE",
          changes: {
            serviceName: service.name,
          },
        },
      });

      return NextResponse.json(
        {
          service,
          message: "Service created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      // Handle Zod validation errors
      if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: error,
          },
          { status: 400 }
        );
      }

      console.error("Error creating service:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while creating the service",
        },
        { status: 500 }
      );
    }
  },
});
