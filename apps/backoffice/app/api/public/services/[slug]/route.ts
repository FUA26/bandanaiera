/**
 * Public Service Detail API Route
 *
 * GET /api/public/services/[slug] - Get single published service details (no auth, CORS enabled)
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
 * GET /api/public/services/[slug]
 * Get single published service details
 * No authentication required - returns only PUBLISHED services
 */
export const GET = async (
  request: Request,
  ...args: unknown[]
) => {
  try {
    const params = await (args[0] as { params: Promise<{ slug: string }> }).params;
    const serviceSlug = params.slug;

    const cacheKey = generateCacheKey('services:item', { slug: serviceSlug });

    const result = await cachedQuery(
      cacheKey,
      async () => {
        const service = await prisma.service.findUnique({
          where: {
            slug: serviceSlug,
            status: "PUBLISHED",
          },
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
            createdAt: true,
            updatedAt: true,
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
        });

        if (!service) {
          return null;
        }

        // Fetch related services if specified
        let relatedServicesData = null;
        if (service.relatedServices && Array.isArray(service.relatedServices) && service.relatedServices.length > 0) {
          const relatedServicesList = await prisma.service.findMany({
            where: {
              id: { in: service.relatedServices as string[] },
              status: "PUBLISHED",
            },
            select: {
              id: true,
              slug: true,
              icon: true,
              name: true,
              description: true,
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
          });
          relatedServicesData = relatedServicesList;
        }

        return {
          service: {
            ...service,
            relatedServices: relatedServicesData,
          },
        };
      },
      300
    );

    if (!result) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Service not found",
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(result, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching public service:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An error occurred while fetching the service",
      },
      { status: 500, headers: corsHeaders }
    );
  }
};
