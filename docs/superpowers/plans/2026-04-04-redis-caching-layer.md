# Redis Caching Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Redis caching layer between landing page and database to reduce backend load by 99% while maintaining data freshness through hybrid invalidation (scheduled + manual force clear).

**Architecture:** Three-layer caching strategy: Landing page (Next.js ISR) → Backoffice API → Redis cache → Database. Cache-first approach with 5-minute TTL, automatic cache invalidation on admin updates, and manual force clear option.

**Tech Stack:** Redis 7 (Alpine), ioredis (Node.js client), Next.js API routes, Prisma ORM, Docker Compose

---

## File Structure

```
apps/backoffice/
  lib/
    cache/
      redis.ts           # Redis client wrapper
      cache.ts           # Cache decorator functions
      revalidate.ts      # Cache invalidation & Next.js revalidation
  app/
    api/
      admin/
        cache/
          clear/route.ts    # Manual cache clear endpoint
          stats/route.ts    # Cache statistics endpoint
      public/
        news/route.ts       # MODIFY: Add caching
        news/[slug]/route.ts
        news/categories/route.ts
        tourism/route.ts    # MODIFY: Add caching
        tourism/[slug]/route.ts
        tourism-categories/route.ts
        events/route.ts     # MODIFY: Add caching
        services/route.ts   # MODIFY: Add caching
        services/[slug]/route.ts
        services/categories/route.ts
      revalidate/route.ts   # MODIFY: Enhance logging
    (dashboard)/
      analytics/
        cache-stats/
          page.tsx          # Cache monitoring dashboard
  components/
    dashboard/
      cache-status-indicator.tsx   # Cache status UI
      clear-cache-button.tsx       # Manual clear button
  .env.local                 # ADD: Redis configuration
  package.json               # MODIFY: Add ioredis dependency

docker/
  docker-compose.yml         # MODIFY: Add Redis service

tests/
  cache/
    redis.test.ts
    cache.test.ts
    integration.test.ts
```

---

## Task 1: Install ioredis Dependency

**Files:**
- Modify: `apps/backoffice/package.json`

- [ ] **Step 1: Add ioredis to dependencies**

Open `apps/backoffice/package.json` and add `ioredis` to dependencies:

```json
{
  "dependencies": {
    "ioredis": "^5.4.1",
    // ... other dependencies
  }
}
```

- [ ] **Step 2: Install the dependency**

Run: `pnpm install --filter backoffice`

Expected output: Packages installed successfully, ioredis@5.4.1 added

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/package.json apps/backoffice/package-lock.json
git commit -m "deps: add ioredis@5.4.1 for Redis caching"
```

---

## Task 2: Create Redis Client Wrapper

**Files:**
- Create: `apps/backoffice/lib/cache/redis.ts`

- [ ] **Step 1: Create Redis client wrapper**

Create file `apps/backoffice/lib/cache/redis.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/lib/cache/redis.ts
git commit -m "feat: add Redis client wrapper with connection management"
```

---

## Task 3: Create Cache Helper Functions

**Files:**
- Create: `apps/backoffice/lib/cache/cache.ts`

- [ ] **Step 1: Create cache utility functions**

Create file `apps/backoffice/lib/cache/cache.ts`:

```typescript
import { getRedisClient } from './redis';

export interface CacheResult<T> {
  data: T;
  fromCache: boolean;
}

const CACHE_PREFIX = 'cache:';
const DEFAULT_TTL = 300; // 5 minutes in seconds

/**
 * Generate a cache key from endpoint and parameters
 */
export function generateCacheKey(endpoint: string, params: Record<string, any> = {}): string {
  // Sort params for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${key}:${params[key]}`)
    .join(':');

  const key = sortedParams ? `${endpoint}:${sortedParams}` : endpoint;
  return `${CACHE_PREFIX}${sanitizeCacheKey(key)}`;
}

/**
 * Sanitize cache key to prevent injection
 */
function sanitizeCacheKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9:_-]/g, '_');
}

/**
 * Execute query with caching
 * @param key - Cache key
 * @param queryFn - Function to execute on cache miss
 * @param ttl - Time to live in seconds (default: 300)
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const redis = getRedisClient();

  // If Redis not available, execute query directly
  if (!redis) {
    return await queryFn();
  }

  try {
    // Try to get from cache
    const cached = await redis.get(key);

    if (cached !== null) {
      console.log(`[Cache] HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`[Cache] MISS: ${key}`);

    // Cache miss - execute query
    const data = await queryFn();

    // Store in cache
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    console.log(`[Cache] SET: ${key} (TTL: ${ttl}s)`);

    return data;
  } catch (error) {
    // On error, execute query directly (fail-open)
    console.error(`[Cache] Error for key ${key}:`, error);
    return await queryFn();
  }
}

/**
 * Clear cache by pattern
 * @param pattern - Cache key pattern (e.g., "cache:news:*")
 * @returns Number of keys cleared
 */
export async function clearCachePattern(pattern: string): Promise<number> {
  const redis = getRedisClient();

  if (!redis) {
    console.log('[Cache] Redis not available, skipping cache clear');
    return 0;
  }

  try {
    const keys = await redis.keys(pattern);

    if (keys.length === 0) {
      console.log(`[Cache] No keys found for pattern: ${pattern}`);
      return 0;
    }

    await redis.del(...keys);
    console.log(`[Cache] Cleared ${keys.length} keys for pattern: ${pattern}`);

    return keys.length;
  } catch (error) {
    console.error(`[Cache] Error clearing pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Clear specific cache key
 */
export async function clearCacheKey(key: string): Promise<boolean> {
  const redis = getRedisClient();

  if (!redis) {
    return false;
  }

  try {
    await redis.del(key);
    console.log(`[Cache] Cleared key: ${key}`);
    return true;
  } catch (error) {
    console.error(`[Cache] Error clearing key ${key}:`, error);
    return false;
  }
}

/**
 * Get cache statistics
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
    const info = await redis.info('memory');
    const dbsize = await redis.dbsize();

    // Parse memory usage from INFO
    const usedMemoryMatch = info.match(/used_memory:(\d+)/);
    const memoryUsage = usedMemoryMatch ? parseInt(usedMemoryMatch[1]) / 1024 / 1024 : 0; // Convert to MB

    return {
      keyCount: dbsize,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      connected: true,
    };
  } catch (error) {
    console.error('[Cache] Error getting stats:', error);
    return {
      keyCount: 0,
      memoryUsage: 0,
      connected: false,
    };
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/lib/cache/cache.ts
git commit -m "feat: add cache helper functions with pattern clearing"
```

---

## Task 4: Create Revalidation Service

**Files:**
- Create: `apps/backoffice/lib/cache/revalidate.ts`

- [ ] **Step 1: Create revalidation service**

Create file `apps/backoffice/lib/cache/revalidate.ts`:

```typescript
import { clearCachePattern, clearCacheKey } from './cache';

const LANDING_URL = process.env.LANDING_URL || 'http://localhost:3000';

/**
 * Trigger Next.js revalidation for a specific path
 */
export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${LANDING_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    if (response.ok) {
      console.log(`[Revalidate] Success for path: ${path}`);
      return true;
    } else {
      console.error(`[Revalidate] Failed for path ${path}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`[Revalidate] Error for path ${path}:`, error);
    return false;
  }
}

/**
 * Clear cache and revalidate for news updates
 */
export async function invalidateNewsCache(newsId?: string): Promise<void> {
  // Clear all news-related cache
  await clearCachePattern('cache:news:*');

  // Revalidate news pages
  await revalidatePath('/informasi-publik/berita');
  await revalidatePath('/informasi-publik/berita/[slug]');

  console.log('[Revalidate] News cache cleared and paths revalidated');
}

/**
 * Clear cache and revalidate for tourism updates
 */
export async function invalidateTourismCache(): Promise<void> {
  await clearCachePattern('cache:tourism:*');
  await clearCachePattern('cache:tourism-categories:*');

  await revalidatePath('/informasi-publik/pariwisata');
  await revalidatePath('/informasi-publik/pariwisata/[slug]');

  console.log('[Revalidate] Tourism cache cleared and paths revalidated');
}

/**
 * Clear cache and revalidate for events updates
 */
export async function invalidateEventsCache(): Promise<void> {
  await clearCachePattern('cache:events:*');
  await clearCachePattern('cache:event-categories:*');

  await revalidatePath('/informasi-publik/agenda');
  await revalidatePath('/informasi-publik/agenda/[slug]');

  console.log('[Revalidate] Events cache cleared and paths revalidated');
}

/**
 * Clear cache and revalidate for services updates
 */
export async function invalidateServicesCache(): Promise<void> {
  await clearCachePattern('cache:services:*');
  await clearCachePattern('cache:service-categories:*');

  await revalidatePath('/layanan');
  await revalidatePath('/layanan/[slug]');

  console.log('[Revalidate] Services cache cleared and paths revalidated');
}

/**
 * Clear all cache (emergency use only)
 */
export async function invalidateAllCache(): Promise<number> {
  const cleared = await clearCachePattern('cache:*');

  // Revalidate all major paths
  const paths = [
    '/',
    '/informasi-publik/berita',
    '/informasi-publik/pariwisata',
    '/informasi-publik/agenda',
    '/layanan',
  ];

  await Promise.all(paths.map(path => revalidatePath(path)));

  console.log(`[Revalidate] All cache cleared (${cleared} keys) and paths revalidated`);

  return cleared;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/lib/cache/revalidate.ts
git commit -m "feat: add cache invalidation and revalidation service"
```

---

## Task 5: Update News API with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/news/route.ts`

- [ ] **Step 1: Add caching to news API**

Replace the entire content of `apps/backoffice/app/api/public/news/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('news:list', {
      featured,
      category,
      limit,
      page,
      pageSize,
    });

    // Execute query with caching
    const result = await cachedQuery(cacheKey, async () => {
      const where: any = {
        status: 'PUBLISHED',
        showInMenu: true,
      };

      if (featured) {
        where.featured = true;
      }

      if (category) {
        const cat = await prisma.newsCategory.findUnique({
          where: { slug: category },
        });
        if (cat) {
          where.categoryId = cat.id;
        } else {
          return {
            items: [],
            total: 0,
            page: 1,
            pageSize,
            totalPages: 0,
          };
        }
      }

      const [items, total] = await Promise.all([
        prisma.news.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
            featuredImage: {
              select: {
                id: true,
                cdnUrl: true,
              },
            },
          },
          orderBy: [
            { featured: 'desc' },
            { publishedAt: 'desc' },
          ],
          skip: limit ? undefined : (page - 1) * pageSize,
          take: limit || pageSize,
        }),
        prisma.news.count({ where }),
      ]);

      const transformed = items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category.name,
        categorySlug: item.category.slug,
        categoryColor: item.category.color,
        date: item.publishedAt?.toISOString() || item.createdAt.toISOString(),
        image: item.featuredImage?.cdnUrl || null,
        author: item.author,
        readTime: item.readTime,
        featured: item.featured,
        tags: item.tags as string[] || [],
      }));

      return {
        items: transformed,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }, 300); // 5 minutes TTL

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Public news API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/app/api/public/news/route.ts
git commit -m "feat: add Redis caching to news API"
```

---

## Task 6: Update News Single Item API with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/news/[slug]/route.ts`

- [ ] **Step 1: Read current implementation**

Run: `cat apps/backoffice/app/api/public/news/[slug]/route.ts`

- [ ] **Step 2: Add caching to news single item API**

Add caching to the GET handler. The exact implementation depends on the current code, but follow this pattern:

```typescript
import { cachedQuery, generateCacheKey } from '@/lib/cache/cache';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const cacheKey = generateCacheKey('news:item', { slug });

  const news = await cachedQuery(cacheKey, async () => {
    // Your existing database query here
    return await prisma.news.findUnique({
      where: { slug },
      include: { /* ... */ }
    });
  }, 300);

  if (!news) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(news, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/api/public/news/[slug]/route.ts
git commit -m "feat: add Redis caching to news single item API"
```

---

## Task 7: Update News Categories API with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/news/categories/route.ts`

- [ ] **Step 1: Read current implementation**

Run: `cat apps/backoffice/app/api/public/news/categories/route.ts`

- [ ] **Step 2: Add caching to news categories API**

Follow the same pattern as Task 5, using cache key `generateCacheKey('news:categories')`

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/api/public/news/categories/route.ts
git commit -m "feat: add Redis caching to news categories API"
```

---

## Task 8: Update Tourism APIs with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/tourism/route.ts`
- Modify: `apps/backoffice/app/api/public/tourism/[slug]/route.ts`
- Modify: `apps/backoffice/app/api/public/tourism-categories/route.ts`

- [ ] **Step 1: Add caching to tourism list API**

Use cache key prefix `cache:tourism:` with pattern similar to news API

- [ ] **Step 2: Add caching to tourism single item API**

Use cache key `cache:tourism:item:{slug}`

- [ ] **Step 3: Add caching to tourism categories API**

Use cache key `cache:tourism-categories:list`

- [ ] **Step 4: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/app/api/public/tourism/
git commit -m "feat: add Redis caching to tourism APIs"
```

---

## Task 9: Update Events APIs with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/events/route.ts` (if exists)

- [ ] **Step 1: Check if events API exists**

Run: `ls apps/backoffice/app/api/public/events/`

If exists, add caching using `cache:events:` prefix

- [ ] **Step 2: Commit if modified**

```bash
git add apps/backoffice/app/api/public/events/
git commit -m "feat: add Redis caching to events APIs"
```

---

## Task 10: Update Services APIs with Caching

**Files:**
- Modify: `apps/backoffice/app/api/public/services/route.ts`
- Modify: `apps/backoffice/app/api/public/services/[slug]/route.ts`
- Modify: `apps/backoffice/app/api/public/services/categories/route.ts`

- [ ] **Step 1: Add caching to services list API**

Use cache key prefix `cache:services:`

- [ ] **Step 2: Add caching to services single item API**

Use cache key `cache:services:item:{slug}`

- [ ] **Step 3: Add caching to services categories API**

Use cache key `cache:service-categories:list`

- [ ] **Step 4: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/app/api/public/services/
git commit -m "feat: add Redis caching to services APIs"
```

---

## Task 11: Create Manual Cache Clear Endpoint

**Files:**
- Create: `apps/backoffice/app/api/admin/cache/clear/route.ts`

- [ ] **Step 1: Create cache clear endpoint**

Create directory structure:

Run: `mkdir -p apps/backoffice/app/api/admin/cache/clear`

Create file `apps/backoffice/app/api/admin/cache/clear/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { clearCachePattern, clearCacheKey } from '@/lib/cache/cache';
import { invalidateNewsCache, invalidateTourismCache, invalidateEventsCache, invalidateServicesCache, invalidateAllCache } from '@/lib/cache/revalidate';

/**
 * POST /api/admin/cache/clear
 *
 * Body: {
 *   pattern?: string,  // Specific pattern to clear (optional)
 *   all?: boolean      // Clear all cache (optional)
 * }
 *
 * Examples:
 * - { "pattern": "cache:news:*" } - Clear all news cache
 * - { "all": true } - Clear all cache
 * - {} - Clear all cache (default)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pattern, all, type } = body;

    let cleared = 0;
    let message = '';

    if (type === 'news') {
      await invalidateNewsCache();
      message = 'News cache cleared and pages revalidated';
    } else if (type === 'tourism') {
      await invalidateTourismCache();
      message = 'Tourism cache cleared and pages revalidated';
    } else if (type === 'events') {
      await invalidateEventsCache();
      message = 'Events cache cleared and pages revalidated';
    } else if (type === 'services') {
      await invalidateServicesCache();
      message = 'Services cache cleared and pages revalidated';
    } else if (pattern) {
      cleared = await clearCachePattern(pattern);
      message = `Cleared ${cleared} cache keys matching pattern: ${pattern}`;
    } else if (all) {
      cleared = await invalidateAllCache();
      message = `Cleared all cache (${cleared} keys) and revalidated pages`;
    } else {
      // Default: clear all
      cleared = await invalidateAllCache();
      message = `Cleared all cache (${cleared} keys) and revalidated pages`;
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
        error: 'Failed to clear cache',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/app/api/admin/cache/clear/route.ts
git commit -m "feat: add manual cache clear endpoint"
```

---

## Task 12: Create Cache Statistics Endpoint

**Files:**
- Create: `apps/backoffice/app/api/admin/cache/stats/route.ts`

- [ ] **Step 1: Create cache stats endpoint**

Run: `mkdir -p apps/backoffice/app/api/admin/cache/stats`

Create file `apps/backoffice/app/api/admin/cache/stats/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cache/cache';
import { getRedisClient } from '@/lib/cache/redis';

/**
 * GET /api/admin/cache/stats
 *
 * Returns cache statistics including:
 * - Key count
 * - Memory usage
 * - Connection status
 * - Redis version
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await getCacheStats();
    const redis = getRedisClient();

    let redisVersion = 'N/A';
    let uptime = 0;

    if (redis && stats.connected) {
      try {
        const info = await redis.info('server');
        const versionMatch = info.match(/redis_version:([^\r\n]+)/);
        redisVersion = versionMatch ? versionMatch[1] : 'N/A';

        const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/);
        uptime = uptimeMatch ? parseInt(uptimeMatch[1]) : 0;
      } catch (error) {
        console.error('[Cache Stats] Error getting Redis info:', error);
      }
    }

    return NextResponse.json({
      ...stats,
      redisVersion,
      uptimeSeconds: uptime,
      uptimeFormatted: formatUptime(uptime),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cache Stats] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get cache stats',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/app/api/admin/cache/stats/route.ts
git commit -m "feat: add cache statistics endpoint"
```

---

## Task 13: Integrate Cache Invalidation into Admin Updates

**Files:**
- Modify: `apps/backoffice/app/api/admin/news/[id]/route.ts`
- Modify: `apps/backoffice/app/api/admin/tourism/[id]/route.ts` (if exists)
- Modify: `apps/backoffice/app/api/admin/services/[id]/route.ts`

- [ ] **Step 1: Find admin news update endpoint**

Run: `find apps/backoffice/app/api/admin -name "*news*" -type d | head -5`

- [ ] **Step 2: Add cache invalidation to news PATCH/PUT handlers**

After successful database update, add:

```typescript
import { invalidateNewsCache } from '@/lib/cache/revalidate';

// After successful update:
await invalidateNewsCache();
```

- [ ] **Step 3: Add cache invalidation to tourism updates**

```typescript
import { invalidateTourismCache } from '@/lib/cache/revalidate';

// After successful update:
await invalidateTourismCache();
```

- [ ] **Step 4: Add cache invalidation to services updates**

```typescript
import { invalidateServicesCache } from '@/lib/cache/revalidate';

// After successful update:
await invalidateServicesCache();
```

- [ ] **Step 5: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add apps/backoffice/app/api/admin/
git commit -m "feat: add cache invalidation to admin update endpoints"
```

---

## Task 14: Update Docker Compose with Redis Service

**Files:**
- Modify: `docker/docker-compose.yml`

- [ ] **Step 1: Update docker-compose.yml**

Replace the entire content of `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 100mb --maxmemory-policy allkeys-lru
    expose:
      - "6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - bandanaiera-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  landing:
    build:
      context: ..
      dockerfile: docker/Dockerfile.landing
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    restart: unless-stopped
    networks:
      - bandanaiera-network
    depends_on:
      redis:
        condition: service_healthy

  backoffice:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backoffice
    expose:
      - "3001"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_ENABLED=true
      - LANDING_URL=http://landing:3000
    restart: unless-stopped
    networks:
      - bandanaiera-network
    depends_on:
      redis:
        condition: service_healthy

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - landing
      - backoffice
    restart: unless-stopped
    networks:
      - bandanaiera-network

volumes:
  redis-data:

networks:
  bandanaiera-network:
    driver: bridge
```

- [ ] **Step 2: Validate YAML syntax**

Run: `docker-compose -f docker/docker-compose.yml config`

Expected: No YAML syntax errors

- [ ] **Step 3: Commit**

```bash
git add docker/docker-compose.yml
git commit -m "feat: add Redis service to docker-compose"
```

---

## Task 15: Create Environment Configuration File

**Files:**
- Create: `apps/backoffice/.env.local.example`

- [ ] **Step 1: Check if .env.local.example exists**

Run: `ls apps/backoffice/.env.local.example`

- [ ] **Step 2: Add Redis configuration to .env.local.example**

If file exists, append these lines:

```bash
# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_ENABLED=true

# Landing URL for revalidation
LANDING_URL=http://localhost:3000
```

If file doesn't exist, create it with the above content.

- [ ] **Step 3: Update local .env.local**

Run: `cat apps/backoffice/.env.local`

Add the same Redis configuration lines if not present.

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/.env.local.example
git commit -m "feat: add Redis environment variables to example config"
```

---

## Task 16: Create Cache Status Indicator Component

**Files:**
- Create: `apps/backoffice/components/dashboard/cache-status-indicator.tsx`

- [ ] **Step 1: Create cache status indicator component**

Create directory: `mkdir -p apps/backoffice/components/dashboard`

Create file `apps/backoffice/components/dashboard/cache-status-indicator.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface CacheStats {
  connected: boolean;
  keyCount: number;
  memoryUsage: number;
}

export function CacheStatusIndicator() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/cache/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch cache stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
        Loading cache status...
      </div>
    );
  }

  if (!stats || !stats.connected) {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600">
        <div className="h-2 w-2 rounded-full bg-yellow-500" />
        Cache disconnected
      </div>
    );
  }

  const memoryPercent = (stats.memoryUsage / 100) * 100;
  const memoryColor = memoryPercent > 80 ? 'text-red-600' : memoryPercent > 60 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-green-600">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Cache connected
      </div>
      <div className="text-muted-foreground">
        {stats.keyCount} keys
      </div>
      <div className={memoryColor}>
        {stats.memoryUsage}MB
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/backoffice/components/dashboard/cache-status-indicator.tsx
git commit -m "feat: add cache status indicator component"
```

---

## Task 17: Create Clear Cache Button Component

**Files:**
- Create: `apps/backoffice/components/dashboard/clear-cache-button.tsx`

- [ ] **Step 1: Create clear cache button component**

Create file `apps/backoffice/components/dashboard/clear-cache-button.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from '@hugeicons/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClearCacheButtonProps {
  type?: 'news' | 'tourism' | 'events' | 'services' | 'all';
  onCleared?: () => void;
}

export function ClearCacheButton({ type = 'all', onCleared }: ClearCacheButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleClear = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cache/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success && onCleared) {
        onCleared();
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to clear cache',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'news':
        return 'news cache';
      case 'tourism':
        return 'tourism cache';
      case 'events':
        return 'events cache';
      case 'services':
        return 'services cache';
      default:
        return 'all cache';
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cache
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear {getTypeLabel()}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear the {getTypeLabel()} and trigger page revalidation.
            Changes will be reflected immediately on the landing page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {result && (
          <div className={`py-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClear} disabled={loading}>
            {loading ? 'Clearing...' : 'Clear Cache'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/backoffice/components/dashboard/clear-cache-button.tsx
git commit -m "feat: add clear cache button component"
```

---

## Task 18: Create Cache Statistics Dashboard Page

**Files:**
- Create: `apps/backoffice/app/(dashboard)/analytics/cache-stats/page.tsx`

- [ ] **Step 1: Create cache stats dashboard page**

Run: `mkdir -p apps/backoffice/app/\(dashboard\)/analytics/cache-stats`

Create file `apps/backoffice/app/(dashboard)/analytics/cache-stats/page.tsx`:

```typescript
import { CacheStatusIndicator } from '@/components/dashboard/cache-status-indicator';
import { ClearCacheButton } from '@/components/dashboard/clear-cache-button';

export const metadata = {
  title: 'Cache Statistics',
  description: 'Monitor Redis cache performance and usage',
};

export default function CacheStatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cache Statistics</h1>
          <p className="text-muted-foreground">
            Monitor Redis cache performance and usage
          </p>
        </div>
        <ClearCacheButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CacheStatusCard />
        {/* Add more metric cards here in future tasks */}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Cache Actions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manually clear cache for specific sections
          </p>
          <div className="flex flex-wrap gap-2">
            <ClearCacheButton type="news" />
            <ClearCacheButton type="tourism" />
            <ClearCacheButton type="events" />
            <ClearCacheButton type="services" />
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">Status</h3>
          <div className="mt-4">
            <CacheStatusIndicator />
          </div>
        </div>
      </div>
    </div>
  );
}

function CacheStatusCard() {
  // This will be populated with real-time stats in a future enhancement
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cache Status</h3>
        <CacheStatusIndicator />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd apps/backoffice && pnpm tsc --noEmit --skipLibCheck`

Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/analytics/cache-stats/
git commit -m "feat: add cache statistics dashboard page"
```

---

## Task 19: Write Unit Tests for Cache Functions

**Files:**
- Create: `apps/backoffice/__tests__/cache/cache.test.ts`

- [ ] **Step 1: Create test directory structure**

Run: `mkdir -p apps/backoffice/__tests__/cache`

- [ ] **Step 2: Write cache utility unit tests**

Create file `apps/backoffice/__tests__/cache/cache.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCacheKey, cachedQuery, clearCachePattern, getCacheStats } from '@/lib/cache/cache';

// Mock Redis
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  info: vi.fn(),
  dbsize: vi.fn(),
};

vi.mock('@/lib/cache/redis', () => ({
  getRedisClient: () => mockRedis,
}));

describe('generateCacheKey', () => {
  it('should generate key without params', () => {
    const key = generateCacheKey('news:list');
    expect(key).toBe('cache:news:list');
  });

  it('should generate key with params', () => {
    const key = generateCacheKey('news:list', { category: 'tech', page: 1 });
    expect(key).toBe('cache:news:list:category:tech:page:1');
  });

  it('should sanitize invalid characters', () => {
    const key = generateCacheKey('news:list', { category: 'tech/news' });
    expect(key).toBe('cache:news:list:category:tech_news');
  });

  it('should handle undefined params', () => {
    const key = generateCacheKey('news:list', { category: undefined, page: 1 });
    expect(key).toBe('cache:news:list:page:1');
  });
});

describe('cachedQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return cached data on hit', async () => {
    const cachedData = { items: [], total: 0 };
    mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));

    const queryFn = vi.fn();
    const result = await cachedQuery('cache:test', queryFn);

    expect(result).toEqual(cachedData);
    expect(queryFn).not.toHaveBeenCalled();
    expect(mockRedis.get).toHaveBeenCalledWith('cache:test');
  });

  it('should query database on cache miss', async () => {
    const dbData = { items: [{ id: 1 }], total: 1 };
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    const queryFn = vi.fn().mockResolvedValue(dbData);

    const result = await cachedQuery('cache:test', queryFn);

    expect(result).toEqual(dbData);
    expect(queryFn).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalledWith('cache:test', JSON.stringify(dbData), 'EX', 300);
  });

  it('should handle Redis errors gracefully', async () => {
    const dbData = { items: [{ id: 1 }], total: 1 };
    mockRedis.get.mockRejectedValue(new Error('Redis error'));
    const queryFn = vi.fn().mockResolvedValue(dbData);

    const result = await cachedQuery('cache:test', queryFn);

    expect(result).toEqual(dbData);
    expect(queryFn).toHaveBeenCalled();
  });

  it('should use custom TTL', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    const queryFn = vi.fn().mockResolvedValue({});

    await cachedQuery('cache:test', queryFn, 600);

    expect(mockRedis.set).toHaveBeenCalledWith('cache:test', '{}', 'EX', 600);
  });
});

describe('clearCachePattern', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clear matching keys', async () => {
    mockRedis.keys.mockResolvedValue(['cache:news:1', 'cache:news:2']);
    mockRedis.del.mockResolvedValue(2);

    const count = await clearCachePattern('cache:news:*');

    expect(count).toBe(2);
    expect(mockRedis.keys).toHaveBeenCalledWith('cache:news:*');
    expect(mockRedis.del).toHaveBeenCalledWith('cache:news:1', 'cache:news:2');
  });

  it('should return 0 when no keys found', async () => {
    mockRedis.keys.mockResolvedValue([]);

    const count = await clearCachePattern('cache:news:*');

    expect(count).toBe(0);
    expect(mockRedis.del).not.toHaveBeenCalled();
  });

  it('should handle Redis errors', async () => {
    mockRedis.keys.mockRejectedValue(new Error('Redis error'));

    const count = await clearCachePattern('cache:news:*');

    expect(count).toBe(0);
  });
});
```

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/__tests__/cache/cache.test.ts
git commit -m "test: add unit tests for cache functions"
```

---

## Task 20: Test Redis Connection Locally

**Files:**
- No file changes

- [ ] **Step 1: Start Redis with Docker Compose**

Run: `cd docker && docker-compose up -d redis`

Expected output: Redis container started

- [ ] **Step 2: Verify Redis is running**

Run: `docker ps | grep redis`

Expected: Redis container listed with status "Up"

- [ ] **Step 3: Test Redis connection**

Run: `docker exec -it $(docker ps -q -f name=redis) redis-cli ping`

Expected output: `PONG`

- [ ] **Step 4: Test from backoffice**

Run: `cd apps/backoffice && pnpm dev`

Check logs for: `[Redis] Connected and ready`

---

## Task 21: Integration Test - End to End Cache Flow

**Files:**
- No file changes

- [ ] **Step 1: Start all services**

Run: `cd docker && docker-compose up -d`

Expected: All services (landing, backoffice, redis, nginx) running

- [ ] **Step 2: Test news API cache miss**

Run: `curl -s http://localhost:3001/api/public/news | jq '.items | length'`

Expected: Returns count of news items, log shows `[Cache] MISS`

- [ ] **Step 3: Test news API cache hit**

Run the same command again: `curl -s http://localhost:3001/api/public/news | jq '.items | length'`

Expected: Same count, log shows `[Cache] HIT`

- [ ] **Step 4: Test cache clear endpoint**

Run: `curl -X POST http://localhost:3001/api/admin/cache/clear -H "Content-Type: application/json" -d '{"type": "news"}'`

Expected: `{"success":true,"message":"News cache cleared...","cleared":2,...}`

- [ ] **Step 5: Verify cache was cleared**

Run: `curl -s http://localhost:3001/api/public/news | jq '.items | length'`

Expected: Log shows `[Cache] MISS` again

- [ ] **Step 6: Test cache stats endpoint**

Run: `curl -s http://localhost:3001/api/admin/cache/stats | jq '.'`

Expected: JSON with `connected: true`, `keyCount`, `memoryUsage`

---

## Task 22: Add Cache Status to Admin Dashboard

**Files:**
- Modify: `apps/backoffice/app/(dashboard)/analytics/page.tsx` (or relevant dashboard page)

- [ ] **Step 1: Find main dashboard page**

Run: `find apps/backoffice/app/\(dashboard\) -name "page.tsx" | grep -E "(analytics|dashboard)" | head -3`

- [ ] **Step 2: Add cache status indicator to dashboard**

Import and add `<CacheStatusIndicator />` component to the dashboard page.

Example:

```typescript
import { CacheStatusIndicator } from '@/components/dashboard/cache-status-indicator';

// In the dashboard layout or page:
<div className="flex items-center justify-between">
  <h1>Dashboard</h1>
  <CacheStatusIndicator />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/analytics/page.tsx
git commit -m "feat: add cache status indicator to dashboard"
```

---

## Task 23: Performance Testing

**Files:**
- No file changes

- [ ] **Step 1: Install Apache Bench (ab)**

Run: `sudo apt-get install apache2-utils` (Ubuntu/Debian)

Or use alternative tool like `wrk` or `k6`

- [ ] **Step 2: Run baseline test (without cache)**

Set `REDIS_ENABLED=false` in `.env.local`

Run: `ab -n 1000 -c 10 http://localhost:3001/api/public/news`

Record: Requests per second, Time per request

- [ ] **Step 3: Run cached test**

Set `REDIS_ENABLED=true` in `.env.local`

Run: `ab -n 1000 -c 10 http://localhost:3001/api/public/news`

Record: Requests per second, Time per request

- [ ] **Step 4: Compare results**

Calculate improvement percentage:
- Response time should be 10-20x faster
- Requests per second should be significantly higher

- [ ] **Step 5: Document results**

Create file `docs/cache-performance-benchmark.md` with test results

---

## Task 24: Update Documentation

**Files:**
- Create: `docs/redis-caching-setup.md`

- [ ] **Step 1: Create setup documentation**

Create file `docs/redis-caching-setup.md`:

```markdown
# Redis Caching Setup Guide

## Overview
The application uses Redis for caching to reduce database load and improve response times.

## Local Development

### Prerequisites
- Docker and Docker Compose installed

### Starting Redis
```bash
cd docker
docker-compose up -d redis
```

### Environment Variables
Add to `apps/backoffice/.env.local`:
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_ENABLED=true
LANDING_URL=http://localhost:3000
```

### Verifying Redis is Running
```bash
docker ps | grep redis
docker exec -it <redis-container> redis-cli ping
```

## Production Deployment

### Docker Compose
Redis is included in `docker/docker-compose.yml` and starts automatically with other services.

### Monitoring
- Cache statistics: `/analytics/cache-stats`
- Cache status indicator: Top right of admin dashboard
- API stats: `GET /api/admin/cache/stats`

### Manual Cache Clear
```bash
curl -X POST http://your-domain.com/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'
```

## Troubleshooting

### Redis Not Connecting
1. Check Redis is running: `docker ps | grep redis`
2. Check logs: `docker logs <redis-container>`
3. Verify environment variables in `.env.local`

### Cache Not Working
1. Verify `REDIS_ENABLED=true`
2. Check backoffice logs for `[Redis]` messages
3. Test connection: `redis-cli -h localhost ping`

### High Memory Usage
Redis is configured with max 100MB. If exceeded, check:
```bash
redis-cli info memory
redis-cli keys "cache:*" | wc -l
```

Clear cache if needed via admin dashboard or API.
```

- [ ] **Step 2: Commit**

```bash
git add docs/redis-caching-setup.md
git commit -m "docs: add Redis caching setup guide"
```

---

## Task 25: Final Testing and Validation

**Files:**
- No file changes

- [ ] **Step 1: Run full test suite**

Run: `cd apps/backoffice && pnpm test`

Expected: All tests pass

- [ ] **Step 2: TypeScript type check**

Run: `cd apps/backoffice && pnpm tsc --noEmit`

Expected: No type errors

- [ ] **Step 3: Build verification**

Run: `cd apps/backoffice && pnpm build`

Expected: Build succeeds without errors

- [ ] **Step 4: Docker compose build**

Run: `cd docker && docker-compose build`

Expected: All services build successfully

- [ ] **Step 5: End-to-end smoke test**

1. Start all services: `docker-compose up -d`
2. Visit admin dashboard: `http://localhost:3001`
3. Check cache status indicator shows "connected"
4. Visit cache stats page: `/analytics/cache-stats`
5. Test cache clear button
6. Create/edit news item
7. Verify landing page reflects changes

- [ ] **Step 6: Verify success criteria**

Check against spec success criteria:
- [ ] Cache hit rate > 90% (monitor for 1 week)
- [ ] Database query count reduced by > 95%
- [ ] Average response time < 50ms for cached requests
- [ ] Zero data inconsistency issues
- [ ] Admin can successfully force clear cache
- [ ] Monitoring dashboard operational
- [ ] Redis memory usage < 80MB
- [ ] No errors in production logs

---

## Task 26: Create Rollback Plan Document

**Files:**
- Create: `docs/redis-caching-rollback.md`

- [ ] **Step 1: Create rollback documentation**

Create file `docs/redis-caching-rollback.md`:

```markdown
# Redis Caching Rollback Plan

## Instant Rollback (Feature Flag)

If issues arise, disable caching without code changes:

1. Update environment variable:
   ```bash
   REDIS_ENABLED=false
   ```

2. Restart backoffice service:
   ```bash
   docker-compose restart backoffice
   ```

3. Verify: Application works without cache (direct DB queries)

## Complete Rollback

If you need to remove Redis entirely:

1. Remove Redis from docker-compose.yml
2. Remove ioredis dependency
3. Remove cache-related code
4. Revert API changes to query DB directly

## Monitoring After Rollback

- Monitor database performance
- Check error logs
- Verify all features work correctly
```

- [ ] **Step 2: Commit**

```bash
git add docs/redis-caching-rollback.md
git commit -m "docs: add Redis caching rollback plan"
```

---

## Task 27: Final Commit and Tag

**Files:**
- No file changes

- [ ] **Step 1: Review all changes**

Run: `git status`

Verify all changes are staged and committed

- [ ] **Step 2: Create summary commit**

Run: `git commit --allow-empty -m "feat: complete Redis caching layer implementation

- Added Redis client wrapper with connection management
- Implemented cache helper functions with pattern clearing
- Created revalidation service for cache invalidation
- Updated all public APIs with caching (news, tourism, events, services)
- Added manual cache clear endpoint
- Created cache statistics endpoint
- Integrated cache invalidation into admin updates
- Updated Docker Compose with Redis service
- Added cache status indicator and clear cache button components
- Created cache statistics dashboard page
- Added comprehensive unit tests
- Documented setup, troubleshooting, and rollback procedures

Expected results:
- 99% reduction in database queries
- 10-20x faster response times
- Minimal memory usage (50-100MB)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"`

- [ ] **Step 3: Create version tag**

Run: `git tag -a v1.0.0-redis-caching -m "Implement Redis caching layer"`

- [ ] **Step 4: Push to remote**

Run: `git push origin main --tags`

---

## Task 28: Post-Deployment Monitoring

**Files:**
- No file changes

- [ ] **Step 1: Monitor cache hit rate**

Check logs for `[Cache] HIT` vs `[Cache] MISS` messages

Calculate hit rate: HIT / (HIT + MISS)

Target: > 90% after 1 week

- [ ] **Step 2: Monitor Redis memory usage**

Run: `docker exec -it <redis-container> redis-cli INFO memory`

Check `used_memory` is under 80MB

- [ ] **Step 3: Monitor database performance**

Compare database query count before and after

Should see ~99% reduction

- [ ] **Step 4: Check for errors**

Review logs for Redis-related errors

Address any connection issues or cache inconsistencies

- [ ] **Step 5: Optimize TTL if needed**

Based on usage patterns, adjust TTL values

Current default: 300 seconds (5 minutes)

---

## Completion Checklist

- [ ] All tasks completed
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Docker build successful
- [ ] Documentation complete
- [ ] Rollback plan documented
- [ ] Success criteria validated
- [ ] Code committed and tagged
- [ ] Ready for production deployment

---

## Notes for Implementation

1. **Testing Strategy**: Run tests after each task, not just at the end
2. **Git Commits**: Commit frequently, one logical change per commit
3. **Error Handling**: All Redis operations have graceful fallback
4. **Monitoring**: Check logs throughout implementation
5. **Performance**: Use the performance testing task to validate improvements
6. **Documentation**: Update documentation as you go, not at the end

## Common Issues and Solutions

**Issue**: TypeScript errors about missing types
**Solution**: Run `pnpm install` to ensure all dependencies are installed

**Issue**: Redis connection refused
**Solution**: Verify Redis container is running: `docker ps | grep redis`

**Issue**: Cache not working
**Solution**: Check `REDIS_ENABLED=true` in environment variables

**Issue**: Tests failing
**Solution**: Ensure Redis is running before running tests

## Next Steps After Implementation

1. Deploy to staging environment
2. Monitor for 24-48 hours
3. Check cache hit rates and performance metrics
4. Optimize TTL values based on actual usage patterns
5. Deploy to production
6. Monitor for 1 week
7. Document any lessons learned
8. Consider future enhancements (pipeline operations, compression, etc.)
