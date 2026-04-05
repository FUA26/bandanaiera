/**
 * Service Detail API Route
 *
 * GET /api/services/[id] - Get single service details
 * PUT /api/services/[id] - Update service
 * DELETE /api/services/[id] - Delete service
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import {
  serviceUpdateSchema,
  serviceCreateSchema,
} from "@/lib/services/validations";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { invalidateServicesCache } from "@/lib/cache/revalidate";

/**
 * GET /api/services/[id]
 * Get single service details
 * Requires: CONTENT_READ_ANY permission
 */
export const GET = protectApiRoute({
  permissions: ["CONTENT_READ_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const serviceId = params.id;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
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
    });

    if (!service) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  },
});

/**
 * PUT /api/services/[id]
 * Update service details
 * Requires: CONTENT_UPDATE_ANY permission
 */
export const PUT = protectApiRoute({
  permissions: ["CONTENT_UPDATE_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const serviceId = params.id;

    try {
      const body = await req.json();

      // Validate input - use update schema which has all fields optional except id
      const validatedData = serviceUpdateSchema.parse({
        ...body,
        id: serviceId,
      });

      // Check if service exists
      const existingService = await prisma.service.findUnique({
        where: { id: serviceId },
        select: {
          id: true,
          slug: true,
          name: true,
          categoryId: true,
        },
      });

      if (!existingService) {
        return NextResponse.json(
          {
            error: "Not Found",
            message: "Service not found",
          },
          { status: 404 }
        );
      }

      // If changing slug, check for uniqueness
      if (validatedData.slug && validatedData.slug !== existingService.slug) {
        const slugExists = await prisma.service.findUnique({
          where: { slug: validatedData.slug },
        });

        if (slugExists) {
          return NextResponse.json(
            {
              error: "Conflict",
              message: "Service with this slug already exists",
            },
            { status: 409 }
          );
        }
      }

      // If changing category, verify new category exists
      if (validatedData.categoryId && validatedData.categoryId !== existingService.categoryId) {
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
      }

      // Track changes for activity log
      const changes: Record<string, { from: unknown; to: unknown }> = {};
      if (validatedData.name && validatedData.name !== existingService.name) {
        changes.name = { from: existingService.name, to: validatedData.name };
      }
      if (validatedData.slug && validatedData.slug !== existingService.slug) {
        changes.slug = { from: existingService.slug, to: validatedData.slug };
      }
      if (validatedData.status) {
        changes.status = { from: undefined, to: validatedData.status };
      }

      // Prepare update data - exclude undefined fields
      const updateData: Record<string, unknown> = {
        updatedById: user.id,
      };

      // Only include fields that are provided in the request
      const optionalFields = [
        "slug",
        "icon",
        "name",
        "description",
        "categoryId",
        "badge",
        "stats",
        "showInMenu",
        "order",
        "isIntegrated",
        "detailedDescription",
        "duration",
        "cost",
        "status",
      ] as const;

      for (const field of optionalFields) {
        if (validatedData[field] !== undefined) {
          updateData[field] = validatedData[field];
        }
      }

      // Handle JSON fields
      if (validatedData.requirements !== undefined) {
        updateData.requirements = validatedData.requirements;
      }
      if (validatedData.process !== undefined) {
        updateData.process = validatedData.process;
      }
      if (validatedData.contactInfo !== undefined) {
        updateData.contactInfo = validatedData.contactInfo;
      }
      if (validatedData.faqs !== undefined) {
        updateData.faqs = validatedData.faqs;
      }
      if (validatedData.downloadForms !== undefined) {
        updateData.downloadForms = validatedData.downloadForms;
      }
      if (validatedData.relatedServices !== undefined) {
        updateData.relatedServices = validatedData.relatedServices;
      }
      if (body.imageIds !== undefined) {
        updateData.imageIds = body.imageIds;
      }

      // Update service
      const updatedService = await prisma.service.update({
        where: { id: serviceId },
        data: updateData,
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
      });

      // Create activity log
      await prisma.serviceActivityLog.create({
        data: {
          serviceId: serviceId,
          userId: user.id,
          action: "UPDATE",
          changes: (Object.keys(changes).length > 0 ? changes : { updated: true }) as Prisma.InputJsonValue,
        },
      });

      // Invalidate Redis cache
      await invalidateServicesCache();

      return NextResponse.json({
        service: updatedService,
        message: "Service updated successfully",
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

      console.error("Error updating service:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while updating the service",
        },
        { status: 500 }
      );
    }
  },
});

/**
 * DELETE /api/services/[id]
 * Delete service
 * Requires: CONTENT_DELETE_ANY permission
 */
export const DELETE = protectApiRoute({
  permissions: ["CONTENT_DELETE_ANY"] as Permission[],
  handler: async (req, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const serviceId = params.id;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    // Store service info for activity log before deletion
    const serviceInfo = {
      name: existingService.name,
      status: existingService.status,
    };

    // Delete service (cascade will delete activity logs)
    await prisma.service.delete({
      where: { id: serviceId },
    });

    // Invalidate Redis cache
    await invalidateServicesCache();

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
      deletedService: serviceInfo,
    });
  },
});
