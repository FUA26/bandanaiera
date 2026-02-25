/**
 * Services Reorder API Route
 *
 * PATCH /api/services/reorder - Bulk reorder services
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import {
  serviceReorderSchema,
} from "@/lib/services/validations";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * PATCH /api/services/reorder
 * Bulk reorder services
 * Requires: CONTENT_UPDATE_ANY permission
 */
export const PATCH = protectApiRoute({
  permissions: ["CONTENT_UPDATE_ANY"] as Permission[],
  handler: async (request, { user }) => {
    try {
      const body = await request.json();

      // Validate input
      const validatedData = serviceReorderSchema.parse(body);

      // Verify all services exist
      const serviceIds = validatedData.services.map((s) => s.id);
      const existingServices = await prisma.service.findMany({
        where: {
          id: { in: serviceIds },
        },
        select: {
          id: true,
          name: true,
          order: true,
        },
      });

      if (existingServices.length !== serviceIds.length) {
        const foundIds = new Set(existingServices.map((s) => s.id));
        const missingIds = serviceIds.filter((id) => !foundIds.has(id));

        return NextResponse.json(
          {
            error: "Not Found",
            message: "Some services not found",
            missingIds,
          },
          { status: 404 }
        );
      }

      // Perform bulk update using transaction
      const updateOperations = validatedData.services.map((service) =>
        prisma.service.update({
          where: { id: service.id },
          data: {
            order: service.order,
            updatedById: user.id,
          },
          select: {
            id: true,
            name: true,
            order: true,
          },
        })
      );

      const updatedServices = await prisma.$transaction(updateOperations);

      // Create activity log entry for the reorder operation
      // Use the first service ID as reference - we know it exists after validation
      const firstServiceId = validatedData.services[0]!.id; // Non-null assertion - safe after schema validation
      await prisma.serviceActivityLog.create({
        data: {
          serviceId: firstServiceId,
          userId: user.id,
          action: "REORDER",
          changes: {
            servicesReordered: validatedData.services.map((s) => ({
              id: s.id,
              newOrder: s.order,
            })),
          } as Prisma.InputJsonValue,
        },
      });

      return NextResponse.json({
        services: updatedServices,
        message: "Services reordered successfully",
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

      console.error("Error reordering services:", error);

      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: "An error occurred while reordering services",
        },
        { status: 500 }
      );
    }
  },
});
