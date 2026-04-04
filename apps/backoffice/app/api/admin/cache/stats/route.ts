import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cache/cache';
import { getRedisClient } from '@/lib/cache/redis';

/**
 * Format uptime in seconds to human-readable string
 * @param seconds - Uptime in seconds
 * @returns Formatted uptime string (e.g., "2d 3h 45m 12s")
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * GET /api/admin/cache/stats
 * Cache statistics endpoint
 *
 * Returns:
 * - keyCount: number - Total cache keys
 * - memoryUsage: number - Memory usage in MB
 * - connected: boolean - Redis connection status
 * - redisVersion: string - Redis server version
 * - uptimeSeconds: number - Server uptime in seconds
 * - uptimeFormatted: string - Human-readable uptime
 * - timestamp: string
 */
export async function GET() {
  try {
    const redis = getRedisClient();

    // Get basic cache stats
    const stats = await getCacheStats();

    // Get additional Redis info if connected
    let redisVersion = 'unknown';
    let uptimeSeconds = 0;
    let uptimeFormatted = 'not connected';

    if (redis && stats.connected) {
      try {
        // Get Redis server info
        const info = await redis.info('server');
        const versionMatch = info.match(/redis_version:([^\r\n]+)/);
        const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/);

        if (versionMatch && versionMatch[1]) {
          redisVersion = versionMatch[1];
        }

        if (uptimeMatch && uptimeMatch[1]) {
          uptimeSeconds = parseInt(uptimeMatch[1], 10);
          uptimeFormatted = formatUptime(uptimeSeconds);
        }
      } catch (error) {
        console.error('[Cache Stats] Error getting Redis info:', error);
      }
    }

    return NextResponse.json({
      keyCount: stats.keyCount,
      memoryUsage: stats.memoryUsage,
      connected: stats.connected,
      redisVersion,
      uptimeSeconds,
      uptimeFormatted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cache Stats] Error:', error);
    return NextResponse.json(
      {
        keyCount: 0,
        memoryUsage: 0,
        connected: false,
        redisVersion: 'unknown',
        uptimeSeconds: 0,
        uptimeFormatted: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Failed to get cache stats',
      },
      { status: 500 }
    );
  }
}
