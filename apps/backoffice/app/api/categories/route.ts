/**
 * Categories API Route
 *
 * GET /api/categories - List all categories with pagination and filtering
 * POST /api/categories - Create a new category
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import {
  serviceCategoryCreateSchema,
  serviceCategoryQuerySchema,
} from "@/lib/services/validations";
import { NextResponse } from "next/server";

/**
 * GET /api/categories
 * Get paginated list of categories with filtering
 * Requires: CONTENT_READ_ANY permission
 */
export const GET = protectApiRoute({
  permissions: ["CONTENT_READ_ANY"] as Permission[],
  handler: async (request) => {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryValidation = serviceCategoryQuerySchema.safeParse(
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
      showInMenu,
      search,
      page,
      pageSize,
      sortBy = "order",
      sortOrder = "asc",
    } = queryValidation.data;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (showInMenu !== undefined) {
      where.showInMenu = showInMenu;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Fetch categories with pagination
    const [categories, totalCount] = await Promise.all([
      prisma.serviceCategory.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              services: true,
            },
          },
        },
      }),
      prisma.serviceCategory.count({ where }),
    ]);

    return NextResponse.json({
      categories,
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
 * POST /api/categories
 * Create a new category
 * Requires: CONTENT_CREATE permission
 */
export const POST = protectApiRoute({
  permissions: ["CONTENT_CREATE"] as Permission[],
  handler: async (request, { user }) => {
    try {
      const body = await request.json();

      // Validate input
      const validatedData = serviceCategoryCreateSchema.parse(body);

      // Check if slug already exists
      const existingCategory = await prisma.serviceCategory.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: "Category with this slug already exists",
          },
          { status: 409 }
        );
      }

      // Create category
      const category = await prisma.serviceCategory.create({
        data: validatedData,
      });

      return NextResponse.json(
        {
          category,
          message: "Category created successfully",
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

      console.error("Error creating category:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while creating the category",
        },
        { status: 500 }
      );
    }
  },
});
