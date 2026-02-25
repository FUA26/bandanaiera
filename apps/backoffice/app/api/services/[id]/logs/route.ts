/**
 * Service Activity Logs API Route
 *
 * GET /api/services/[id]/logs - Get activity logs for a service
 */

import { prisma } from "@/lib/db/prisma";
import { protectApiRoute } from "@/lib/rbac-server/api-protect";
import { Permission } from "@/lib/rbac/types";
import { NextResponse } from "next/server";

/**
 * GET /api/services/[id]/logs
 * Get activity logs for a service with pagination
 * Requires: CONTENT_READ_ANY permission
 */
export const GET = protectApiRoute({
  permissions: ["CONTENT_READ_ANY"] as Permission[],
  handler: async (request, { user }, ...args) => {
    const params = await (args[0] as { params: Promise<{ id: string }> }).params;
    const serviceId = params.id;

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const limit = Math.min(pageSize, 100); // Cap at 100
    const skip = (page - 1) * limit;

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
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

    // Fetch activity logs with pagination
    const [logs, totalCount] = await Promise.all([
      prisma.serviceActivityLog.findMany({
        where: {
          serviceId: serviceId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.serviceActivityLog.count({
        where: {
          serviceId: serviceId,
        },
      }),
    ]);

    return NextResponse.json({
      logs,
      service: {
        id: service.id,
        name: service.name,
      },
      pagination: {
        page,
        pageSize: limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  },
});
