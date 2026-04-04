import { NextRequest, NextResponse } from 'next/server';
import { clearCachePattern } from '@/lib/cache/cache';
import {
  invalidateNewsCache,
  invalidateTourismCache,
  invalidateEventsCache,
  invalidateServicesCache,
  invalidateAllCache,
} from '@/lib/cache/revalidate';

/**
 * POST /api/admin/cache/clear
 * Manual cache clear endpoint with support for selective clearing
 *
 * Request body:
 * - all: boolean - Clear all cache (default: true)
 * - type: 'news' | 'tourism' | 'events' | 'services' - Clear specific type
 * - pattern: string - Custom pattern to match
 *
 * Returns:
 * - success: boolean
 * - message: string
 * - cleared: number - Number of keys cleared
 * - timestamp: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { all, type, pattern } = body;

    let cleared = 0;
    let message = '';

    // Handle custom pattern
    if (pattern) {
      cleared = await clearCachePattern(pattern);
      message = `Cleared ${cleared} keys matching pattern: ${pattern}`;
    }
    // Handle specific type
    else if (type) {
      switch (type) {
        case 'news':
          await invalidateNewsCache();
          cleared = -1; // We don't have exact count from invalidate functions
          message = 'Cleared news cache';
          break;
        case 'tourism':
          await invalidateTourismCache();
          cleared = -1;
          message = 'Cleared tourism cache';
          break;
        case 'events':
          await invalidateEventsCache();
          cleared = -1;
          message = 'Cleared events cache';
          break;
        case 'services':
          await invalidateServicesCache();
          cleared = -1;
          message = 'Cleared services cache';
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              message: `Unknown type: ${type}. Valid types: news, tourism, events, services`,
              cleared: 0,
              timestamp: new Date().toISOString(),
            },
            { status: 400 }
          );
      }
    }
    // Default: clear all
    else {
      cleared = await invalidateAllCache();
      message = `Cleared all cache (${cleared} keys)`;
    }

    return NextResponse.json({
      success: true,
      message,
      cleared,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cache Clear] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear cache',
        cleared: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
