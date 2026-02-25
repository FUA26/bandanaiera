/**
 * Category Detail API Route
 *
 * GET /api/categories/[id] - Get single category details
 * PUT /api/categories/[id] - Update category
 * DELETE /api/categories/[id] - Delete category
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import {
  serviceCategoryUpdateSchema,
} from "@/lib/services/validations";
import { NextResponse } from "next/server";

/**
 * GET /api/categories/[id]
 * Get single category details
 * Requires: CONTENT_READ_ANY permission
 */
export const GET = protectApiRoute({
  permissions: ["CONTENT_READ_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const categoryId = params.id;

    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
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

    return NextResponse.json({ category });
  },
});

/**
 * PUT /api/categories/[id]
 * Update category details
 * Requires: CONTENT_UPDATE_ANY permission
 */
export const PUT = protectApiRoute({
  permissions: ["CONTENT_UPDATE_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const categoryId = params.id;

    try {
      const body = await req.json();

      // Validate input - use update schema which has all fields optional except id
      const validatedData = serviceCategoryUpdateSchema.parse({
        ...body,
        id: categoryId,
      });

      // Check if category exists
      const existingCategory = await prisma.serviceCategory.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          slug: true,
          name: true,
        },
      });

      if (!existingCategory) {
        return NextResponse.json(
          {
            error: "Not Found",
            message: "Category not found",
          },
          { status: 404 }
        );
      }

      // If changing slug, check for uniqueness
      if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
        const slugExists = await prisma.serviceCategory.findUnique({
          where: { slug: validatedData.slug },
        });

        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "Category with this slug already exists",
            },
            { status: 409 }
          );
        }
      }

      // Prepare update data - exclude undefined fields
      const updateData: Record<string, unknown> = {};

      // Only include fields that are provided in the request
      const optionalFields = [
        "slug",
        "icon",
        "name",
        "color",
        "bgColor",
        "showInMenu",
        "order",
      ] as const;

      for (const field of optionalFields) {
        if (validatedData[field] !== undefined) {
          updateData[field] = validatedData[field];
        }
      }

      // Update category
      const updatedCategory = await prisma.serviceCategory.update({
        where: { id: categoryId },
        data: updateData,
      });

      return NextResponse.json({
        category: updatedCategory,
        message: "Category updated successfully",
      });
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

      console.error("Error updating category:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while updating the category",
        },
        { status: 500 }
      );
    }
  },
});

/**
 * DELETE /api/categories/[id]
 * Delete category
 * Requires: CONTENT_DELETE_ANY permission
 */
export const DELETE = protectApiRoute({
  permissions: ["CONTENT_DELETE_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const categoryId = params.id;

    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    // Check if category has services
    if (existingCategory._count.services > 0) {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "Cannot delete category with existing services. Please reassign or delete the services first.",
          serviceCount: existingCategory._count.services,
        },
        { status: 409 }
      );
    }

    // Store category info before deletion
    const categoryInfo = {
      name: existingCategory.name,
    };

    // Delete category
    await prisma.serviceCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory: categoryInfo,
    });
  },
});
