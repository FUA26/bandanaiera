/**
 * Public Services API Route
 *
 * GET /api/public/services - Get list of published services (no auth, CORS enabled)
 */

import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { cachedQuery, generateCacheKey } from "@/lib/cache/cache";

/**
 * CORS headers for public API
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * OPTIONS handler for CORS preflight
 */
export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
};

/**
 * GET /api/public/services
 * Get paginated list of published services
 * No authentication required - returns only PUBLISHED services
 */
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const showInMenu = searchParams.get("showInMenu");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10))
    );
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    const params = { categoryId, search, showInMenu, page, pageSize, sortBy, sortOrder };
    const cacheKey = generateCacheKey('services:list', { params });

    const result = await cachedQuery(
      cacheKey,
      async () => {
        // Build where clause - only PUBLISHED services
        const where: Record<string, unknown> = {
          status: "PUBLISHED",
        };

        if (categoryId) {
          where.categoryId = categoryId;
        }

        if (showInMenu !== null) {
          where.showInMenu = showInMenu === "true";
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
            select: {
              id: true,
              slug: true,
              icon: true,
              name: true,
              description: true,
              detailedDescription: true,
              categoryId: true,
              badge: true,
              stats: true,
              showInMenu: true,
              order: true,
              isIntegrated: true,
              duration: true,
              cost: true,
              requirements: true,
              process: true,
              contactInfo: true,
              faqs: true,
              downloadForms: true,
              relatedServices: true,
              status: true,
              images: true,
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
            },
          }),
          prisma.service.count({ where }),
        ]);

        return {
          services,
          pagination: {
            page,
            pageSize,
            total: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
          },
        };
      },
      300
    );

    return NextResponse.json(result, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching public services:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while fetching services",
      },
      { status: 500, headers: corsHeaders }
    );
  }
};
