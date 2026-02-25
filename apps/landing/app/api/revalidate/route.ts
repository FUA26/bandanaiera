/**
 * Revalidate API Route
 *
 * POST /api/revalidate - Revalidate cached pages after backoffice updates
 *
 * This endpoint is called by the backoffice when services are updated.
 * It clears the in-memory cache and triggers Next.js ISR revalidation.
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { clearServicesCache } from '@/lib/services-data';

/**
 * Verify the request is from a trusted source
 * Uses a shared secret between backoffice and landing
 */
function verifyRequest(request: NextRequest): boolean {
  const secret = request.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-production';

  return secret === expectedSecret;
}

/**
 * POST /api/revalidate
 * Revalidate cached pages
 *
 * Body: {
 *   paths?: string[] - Optional array of paths to revalidate
 *   type?: 'services' | 'categories' | 'all' - Type of revalidation
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source
    if (!verifyRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid revalidate secret' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { paths, type = 'all' } = body as { paths?: string[]; type?: 'services' | 'categories' | 'all' };

    // Clear in-memory cache
    clearServicesCache();

    // Revalidate specific paths if provided
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }
    } else {
      // Revalidate all service-related paths
      revalidatePath('/layanan');
      revalidatePath('/informasi-publik');

      // Revalidate all service detail pages
      // Note: This requires knowing all service slugs, which we can get from the API
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      now: Date.now(),
      type,
    });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.BACKOFFICE_URL || 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-revalidate-secret',
    },
  });
};
