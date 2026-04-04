import { getRedisClient } from './redis';

/**
 * Cache result interface
 */
export interface CacheResult<T> {
  data: T | null;
  fromCache: boolean;
}

/**
 * Cache key prefix to avoid collisions
 */
const CACHE_PREFIX = 'cache:';

/**
 * Default TTL for cache entries (5 minutes)
 */
const DEFAULT_TTL = 300;

/**
 * Generate a consistent cache key from prefix and params
 * @param prefix - Cache key prefix (e.g., 'news', 'events')
 * @param params - Optional parameters object for cache key variation
 * @returns Consistent cache key string
 */
export function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  const parts = [CACHE_PREFIX, prefix];

  if (params && Object.keys(params).length > 0) {
    // Sort keys alphabetically for consistent keys
    const sortedKeys = Object.keys(params).sort();

    // Filter out undefined/null values and sanitize
    const sanitizedParams = sortedKeys
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map((key) => {
        const sanitizedKey = sanitizeCacheKey(String(key));
        const sanitizedValue = sanitizeCacheKey(String(params[key]));
        return `${sanitizedKey}=${sanitizedValue}`;
      });

    if (sanitizedParams.length > 0) {
      parts.push(sanitizedParams.join('&'));
    }
  }

  return parts.join(':');
}

/**
 * Sanitize cache key to prevent injection attacks
 * @param key - Raw key string
 * @returns Sanitized key string
 */
function sanitizeCacheKey(key: string): string {
  // Remove any characters that aren't alphanumeric, colon, dash, or underscore
  return key.replace(/[^a-zA-Z0-9:_-]/g, '');
}

/**
 * Execute a cached query with fail-open pattern
 * @param key - Cache key
 * @param queryFn - Function to execute on cache miss
 * @param ttl - Time to live in seconds (default: DEFAULT_TTL)
 * @returns Promise with cached or fresh data
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const redis = getRedisClient();

  // Fail-open: if Redis is unavailable, execute query directly
  if (!redis) {
    return queryFn();
  }

  try {
    // Try to get from cache
    const cached = await redis.get(key);

    if (cached !== null) {
      try {
        const parsed = JSON.parse(cached) as T;
        console.log(`[Cache] HIT: ${key}`);
        return parsed;
      } catch (parseError) {
        console.warn(`[Cache] Invalid JSON in cache for key ${key}, executing query`);
        // Fall through to execute query
      }
    }

    console.log(`[Cache] MISS: ${key}`);

    // Cache miss - execute query
    const result = await queryFn();

    // Store result in cache
    try {
      await redis.set(key, JSON.stringify(result), 'EX', ttl);
      console.log(`[Cache] SET: ${key} (TTL: ${ttl}s)`);
    } catch (setError) {
      console.warn(`[Cache] Failed to set cache for key ${key}:`, setError);
      // Don't throw - we still have the result
    }

    return result;
  } catch (error) {
    console.error(`[Cache] Error executing cached query for key ${key}:`, error);
    // Fail-open: execute query directly on error
    return queryFn();
  }
}

/**
 * Clear all cache entries matching a pattern
 * @param pattern - Pattern to match (without CACHE_PREFIX)
 * @returns Promise with number of keys deleted
 */
export async function clearCachePattern(pattern: string): Promise<number> {
  const redis = getRedisClient();

  if (!redis) {
    console.warn('[Cache] Redis unavailable, cannot clear cache pattern');
    return 0;
  }

  try {
    const searchPattern = `${CACHE_PREFIX}${pattern}*`;
    const keys = await redis.keys(searchPattern);

    if (keys.length === 0) {
      console.log(`[Cache] No keys found matching pattern: ${searchPattern}`);
      return 0;
    }

    await redis.del(...keys);
    console.log(`[Cache] Cleared ${keys.length} keys matching pattern: ${searchPattern}`);
    return keys.length;
  } catch (error) {
    console.error(`[Cache] Error clearing cache pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Clear a specific cache key
 * @param key - Full cache key (with or without CACHE_PREFIX)
 * @returns Promise indicating success
 */
export async function clearCacheKey(key: string): Promise<boolean> {
  const redis = getRedisClient();

  if (!redis) {
    console.warn('[Cache] Redis unavailable, cannot clear cache key');
    return false;
  }

  try {
    // Ensure key has prefix
    const fullKey = key.startsWith(CACHE_PREFIX) ? key : `${CACHE_PREFIX}${key}`;

    const result = await redis.del(fullKey);
    const success = result > 0;

    if (success) {
      console.log(`[Cache] Cleared key: ${fullKey}`);
    } else {
      console.log(`[Cache] Key not found: ${fullKey}`);
    }

    return success;
  } catch (error) {
    console.error(`[Cache] Error clearing cache key ${key}:`, error);
    return false;
  }
}

/**
 * Get cache statistics from Redis
 * @returns Promise with cache stats
 */
export async function getCacheStats(): Promise<{
  keyCount: number;
  memoryUsage: number;
  connected: boolean;
}> {
  const redis = getRedisClient();

  if (!redis) {
    return {
      keyCount: 0,
      memoryUsage: 0,
      connected: false,
    };
  }

  try {
    // Get total keys with our prefix
    const keys = await redis.keys(`${CACHE_PREFIX}*`);

    // Get memory usage info
    const info = await redis.info('memory');
    const usedMemoryMatch = info.match(/used_memory:(\d+)/);
    const usedMemoryBytes = usedMemoryMatch ? parseInt(usedMemoryMatch[1], 10) : 0;
    const usedMemoryMB = Math.round(usedMemoryBytes / (1024 * 1024));

    return {
      keyCount: keys.length,
      memoryUsage: usedMemoryMB,
      connected: true,
    };
  } catch (error) {
    console.error('[Cache] Error getting cache stats:', error);
    return {
      keyCount: 0,
      memoryUsage: 0,
      connected: false,
    };
  }
}
