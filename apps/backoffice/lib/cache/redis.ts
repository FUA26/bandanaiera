import Redis from 'ioredis';

let redis: Redis | null = null;
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Get or create Redis client instance
 * Lazy connection - connects on first use
 */
export function getRedisClient(): Redis | null {
  // Check if Redis is enabled
  if (process.env.REDIS_ENABLED !== 'true') {
    console.log('[Redis] Caching disabled via REDIS_ENABLED flag');
    return null;
  }

  // Return existing client if already connected
  if (redis && isConnected) {
    return redis;
  }

  // Check if we've exceeded max retry attempts
  if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
    console.warn('[Redis] Max retry attempts reached, caching disabled');
    return null;
  }

  try {
    // Create new Redis instance
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        console.log(`[Redis] Retry attempt ${times}, delay ${delay}ms`);
        return delay;
      },
      lazyConnect: true,
      connectTimeout: 10000,
      enableReadyCheck: true,
    });

    // Set up event handlers
    redis.on('connect', () => {
      console.log('[Redis] Connecting...');
    });

    redis.on('ready', () => {
      isConnected = true;
      connectionAttempts = 0;
      console.log('[Redis] Connected and ready');
    });

    redis.on('error', (err: Error) => {
      isConnected = false;
      connectionAttempts++;
      console.error('[Redis] Error:', err.message);
      // Don't throw - allow app to continue without cache
    });

    redis.on('close', () => {
      isConnected = false;
      console.log('[Redis] Connection closed');
    });

    redis.on('reconnecting', () => {
      console.log('[Redis] Reconnecting...');
    });

    // Initiate connection
    redis.connect().catch((err) => {
      console.error('[Redis] Initial connection failed:', err.message);
      isConnected = false;
      connectionAttempts++;
    });

    return redis;
  } catch (error) {
    console.error('[Redis] Failed to create client:', error);
    return null;
  }
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisReady(): boolean {
  return isConnected && redis !== null;
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    isConnected = false;
    console.log('[Redis] Connection closed gracefully');
  }
}

// Export singleton instance getter
export { redis };
