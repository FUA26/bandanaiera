/**
 * Public Categories API Route
 *
 * GET /api/public/services/categories - Get list of categories (no auth, CORS enabled)
 * Query params:
 *   - showInMenu: filter by showInMenu status (true/false/all). Default: all categories
 *   - search: search in name/slug
 *   - sortBy: sort field (default: order)
 *   - sortOrder: asc/desc (default: asc)
 */

import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

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
 * GET /api/public/services/categories
 * Get list of categories
 * No authentication required
 */
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const search = searchParams.get("search");
    const showInMenuParam = searchParams.get("showInMenu");
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter by showInMenu only if explicitly requested
    if (showInMenuParam === "true") {
      where.showInMenu = true;
    } else if (showInMenuParam === "false") {
      where.showInMenu = false;
    }
    // If showInMenu is "all" or not provided, don't filter by it

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ];
    }

    // Fetch categories
    const categories = await prisma.serviceCategory.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
        bgColor: true,
        showInMenu: true,
        order: true,
        _count: {
          select: {
            services: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        categories: categories.map((cat) => ({
          ...cat,
          serviceCount: cat._count.services,
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching public categories:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while fetching categories",
      },
      { status: 500, headers: corsHeaders }
    );
  }
};
