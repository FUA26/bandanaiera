/**
 * Service Publish API Route
 *
 * PATCH /api/services/[id]/publish - Publish or unpublish a service
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * PATCH /api/services/[id]/publish
 * Publish or unpublish a service
 * Requires: CONTENT_PUBLISH permission
 */
export const PATCH = protectApiRoute({
  permissions: ["CONTENT_PUBLISH"] as Permission[],
  handler: async (request, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const serviceId = params.id;

    try {
      const body = await request.json();

      // Validate request body
      const { published } = body;

      if (typeof published !== "boolean") {
        return NextResponse.json(
          {
            error: "Validation Error",
            message: "'published' field is required and must be a boolean",
          },
          { status: 400 }
        );
      }

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

      const newStatus = published ? "PUBLISHED" : "DRAFT";

      // If already in the desired state, return early
      if (existingService.status === newStatus) {
        return NextResponse.json(
          {
            error: "Conflict",
            message: `Service is already ${published ? "published" : "unpublished"}`,
          },
          { status: 409 }
        );
      }

      // Update service status
      const updatedService = await prisma.service.update({
        where: { id: serviceId },
        data: {
          status: newStatus,
          updatedById: user.id,
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
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create activity log
      await prisma.serviceActivityLog.create({
        data: {
          serviceId: serviceId,
          userId: user.id,
          action: published ? "PUBLISH" : "UNPUBLISH",
          changes: {
            from: existingService.status,
            to: newStatus,
          } as Prisma.InputJsonValue,
        },
      });

      return NextResponse.json({
        service: updatedService,
        message: `Service ${published ? "published" : "unpublished"} successfully`,
      });
    } catch (error) {
      console.error("Error updating service publish status:", error);

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
