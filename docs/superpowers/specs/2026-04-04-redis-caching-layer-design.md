# Redis Caching Layer Design

**Date:** 2026-04-04
**Author:** Claude Sonnet 4.5
**Status:** Approved

## Overview

Add a Redis caching layer between the landing page and database to reduce backend load by 99% while maintaining data freshness through a hybrid invalidation strategy (scheduled cache expiration + manual force clear).

## Problem Statement

Currently, the landing page fetches content directly from the backoffice API which queries the database on every request. With 1,000-10,000 visitors per day, this results in approximately 50,000 database queries daily, putting unnecessary load on the database and causing slow response times (200-500ms).

## Goals

1. Reduce database queries by 99% (from ~50,000 to ~2,500 per day)
2. Improve response times by 10-20x (from 200-500ms to 10-50ms)
3. Maintain data freshness with acceptable delays (5 minutes max)
4. Provide hybrid cache invalidation: scheduled + manual force clear
5. Zero downtime deployment with graceful fallback

## Architecture

### Three-Layer Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (Next.js)                    │
│  • Server Components fetch from Backoffice API              │
│  • Next.js ISR: revalidate: 3600 (1 jam)                    │
│  • On-demand revalidate via webhook/trigger                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKOFFICE API LAYER                        │
│  • /api/public/* endpoints                                   │
│  • Check Redis cache first (TTL: 300s / 5 menit)            │
│  • Cache miss → Query database → Store to Redis            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      REDIS CACHE                             │
│  • Key pattern: cache:{endpoint}:{params}                   │
│  • TTL: 300 seconds (5 menit)                               │
│  • Shared across all instances                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (Prisma)                       │
│  • Only hit when Redis cache miss                           │
│  • Estimated: ~288 queries/hari (vs 50,000 tanpa cache)    │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### A. Redis Client Wrapper
**Location:** `packages/database/src/redis.ts`

**Responsibilities:**
- Initialize Redis connection with retry logic
- Provide get/set/delete/clearPattern utilities
- Handle connection errors gracefully (fail-open)
- TypeScript-safe serialization/deserialization

**Configuration:**
```typescript
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  lazyConnect: true,
})
```

#### B. Cache Decorator
**Location:** `packages/database/src/cache.ts`

**Responsibilities:**
- Wrapper for database queries with caching
- Key generation from endpoint + params
- TTL management (default 300s)
- Cache invalidation helpers

**Key Functions:**
- `cachedQuery<T>(key, queryFn, ttl)` - Execute query with caching
- `clearCachePattern(pattern)` - Clear all keys matching pattern
- `generateCacheKey(endpoint, params)` - Generate consistent cache keys

#### C. Backoffice API Middleware
**Location:** `apps/backoffice/lib/api-cache.ts`

**Responsibilities:**
- Intercept public API requests
- Check Redis before database
- Set response headers (Cache-Control, X-Cache)
- Log cache hit/miss metrics

#### D. Revalidation Service
**Location:** `apps/backoffice/lib/revalidate.ts`

**Responsibilities:**
- Clear Redis cache by pattern
- Trigger Next.js revalidate via webhook
- Queue multiple cache clears (debounce)
- Provide manual force clear endpoint

#### E. Admin UI Components
**Locations:** Various admin forms

**Components:**
- "Clear Cache" button in edit/create forms
- Cache status indicator in dashboard
- Manual revalidate trigger in settings
- Cache statistics page

## Data Flow

### Normal Request Flow
1. User visits landing page (e.g., /layanan)
2. Next.js server component calls: `getServices()`
3. Function fetches: `BACKOFFICE_URL/api/public/services`
4. Backoffice API receives request:
   - Generate cache key: `cache:services:list`
   - Check Redis: `GET cache:services:list`
   - CACHE HIT → Return data + header `X-Cache: HIT`
   - CACHE MISS → Query Prisma → `SET Redis (EX 300)` → Return + `X-Cache: MISS`
5. Landing page renders with data
6. Next.js caches response (revalidate: 3600)

### Admin Update Flow
1. Admin edits news item at `/manage/news/[id]/edit`
2. Admin clicks "Save" button
3. Form submits to API:
   - Update database
   - On success → Clear cache pattern: `cache:news:*`
   - Trigger Next.js revalidate: `POST /api/revalidate`
   - Show success: "Published & cache cleared"
4. Next request to landing gets fresh data

### Manual Cache Clear Flow
1. Admin clicks "Force Clear Cache" button
2. Frontend calls: `POST /api/admin/cache/clear`
3. Backend executes:
   - Clear specific pattern (e.g., `cache:news:*`)
   - OR clear all cache: `cache:*` (admin only)
   - Log action to audit
4. Revalidate affected Next.js paths
5. Return: `{ cleared: 15 keys, duration: 23ms }`

### Cache Invalidation Patterns
- Single item update: `cache:news:{slug}`
- List update: `cache:news:list`, `cache:news:featured`
- Category update: `cache:news:categories`, `cache:news:category:{slug}`
- Global clear: `cache:*` (admin only, emergency use)

## Error Handling

### Redis Connection Failure
**Strategy:** Graceful degradation
- Log error but continue to database
- Return data without cache (fail-open)
- Alert admin if Redis down > 1 minute
- Auto-retry connection every 30 seconds

### Cache Stampede Prevention
**Problem:** Many requests when cache expires → all hit database

**Solution:**
- Use Redis `SET` with `NX` (only if not exists)
- First request gets lock, queries DB, sets cache
- Other requests wait max 100ms then retry

### Stale Cache Handling
**Strategy:** Soft invalidation
- Update database → Clear cache immediately
- Next request fetches fresh data
- Fallback: If DB error, serve stale cache with warning header

### Memory Management
- TTL enforcement: 300s max, no permanent cache
- Max memory: 100MB (Redis maxmemory policy)
- Eviction: `allkeys-lru` (least recently used)
- Monitor: Alert if usage > 80MB

## Implementation Details

### Redis Setup (Docker Compose)

**File:** `docker/docker-compose.yml`

```yaml
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
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  backoffice:
    depends_on:
      - redis
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_ENABLED=true

volumes:
  redis-data:

networks:
  bandanaiera-network:
    driver: bridge
```

### Environment Variables

**File:** `apps/backoffice/.env.local`

```bash
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_ENABLED=true
LANDING_URL=http://localhost:3001
```

### API Route Example

**File:** `apps/backoffice/app/api/public/news/route.ts`

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const cacheKey = `cache:news:${category ? `category:${category}` : featured ? 'featured' : 'list'}`

  const news = await cachedQuery(
    cacheKey,
    async () => {
      return await db.news.findMany({
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      })
    },
    300 // 5 minutes
  )

  return NextResponse.json(news, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'X-Cache': 'HIT' // or 'MISS'
    }
  })
}
```

### Revalidation Trigger

**File:** `apps/backoffice/app/api/admin/news/[id]/route.ts`

```typescript
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // 1. Update database
  const news = await db.news.update({ /* ... */ })

  // 2. Clear cache
  const cleared = await clearCachePattern('cache:news:*')
  console.log(`Cleared ${cleared} cache keys for news`)

  // 3. Revalidate Next.js
  await fetch(`${process.env.LANDING_URL}/api/revalidate`, {
    method: 'POST',
    body: JSON.stringify({ path: '/informasi-publik/berita' })
  })

  return NextResponse.json({ success: true, cacheCleared: cleared })
}
```

## Testing Strategy

### Unit Tests
- Cache helper functions (get, set, clear)
- Cache key generation
- TTL expiration
- JSON parse error handling

### Integration Tests
- API with caching (first call miss, second call hit)
- Cache invalidation after admin update
- Next.js revalidate trigger
- Redis failure fallback

### Load Tests
**Scenario:** 1000 concurrent users
- Measure cache hit rate (target: >95%)
- Measure response time (target: p50 <50ms, p95 <200ms)
- Measure database query count (target: <5 queries)
- Compare with vs without cache

## Monitoring

### Metrics to Track

**Cache Performance:**
- Cache hit rate: `HIT / (HIT + MISS)`
- Average response time (cached vs uncached)
- Database query count per endpoint
- Memory usage: Redis `used_memory`

**Cache Operations:**
- Cache sets per hour
- Cache gets per hour
- Cache clears per day
- Revalidation triggers per day

**Errors:**
- Redis connection failures
- Cache parse errors
- Revalidation failures

### Logging
```typescript
logger.info('cache_operation', {
  operation: 'get' | 'set' | 'clear',
  key: string,
  hit: boolean,
  duration: number,
  ttl?: number
})
```

### Dashboard
**Location:** `apps/backoffice/app/(dashboard)/analytics/cache-stats/page.tsx`

**Display:**
- Current cache hit rate (percentage)
- Total cache keys count
- Memory usage (MB / 100MB)
- Recent cache clears (last 10)
- Average response time chart

**Refresh:** Every 30 seconds (auto)
**Data source:** Redis `INFO` command

## Deployment Strategy

### Phase 1: Local Development
1. Update `docker-compose.yml` (add Redis service)
2. Add cache functions to codebase
3. Test locally: `docker-compose up`
4. Verify cache working: `redis-cli monitor`

### Phase 2: Staging Deployment
1. Deploy to staging server
2. Enable `REDIS_ENABLED=true`
3. Monitor for 1-2 days
4. Check cache hit rate > 90%

### Phase 3: Production Deployment
1. `docker-compose pull`
2. `docker-compose up -d` (new containers with Redis)
3. Monitor metrics for 24 hours
4. Optimize TTL if needed

### Rollback Plan
If issues arise:
1. Set `REDIS_ENABLED=false` → Back to DB queries
2. No code changes needed
3. Zero downtime rollback

## Security

### Access Control
- Redis only accessible within Docker network
- Optional password protection via `REDIS_PASSWORD`
- No ports exposed to host

### Cache Key Namespacing
```typescript
const CACHE_PREFIX = 'cache:'
function sanitizeCacheKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9:_-]/g, '')
}
```

## Performance Optimization

### Connection Pooling
- ioredis handles connection pooling automatically
- Default: max 10 connections per process

### Pipeline Multiple Gets (Future)
```typescript
const pipeline = redis.pipeline()
pipeline.get('cache:news:list')
pipeline.get('cache:events:featured')
const results = await pipeline.exec()
```

### Compression (Optional)
- For large responses (>10KB), compress before caching
- Use LZ4 or similar compression library

### Cache Warming (Optional)
- Pre-populate cache on server startup
- Run from `/api/cache/warm` endpoint

## Expected Results

### Performance Improvements
- **10-20x faster** response time for cached requests (10-50ms vs 200-500ms)
- **99% fewer database queries** (~288/day vs ~50,000/day)
- **Minimal memory usage** (50-100MB RAM)
- **Ready for traffic spikes** (can handle 10x traffic)

### Before vs After

**Before Caching:**
- Database queries: ~50,000/day
- Avg response time: 200-500ms
- DB connection pool: Constant pressure

**After Redis Caching:**
- Database queries: ~288/day (99.4% reduction)
- Avg response time: 10-50ms (cached)
- DB connection pool: Minimal pressure
- Redis memory: ~50MB

## Implementation Timeline

**Week 1: Foundation**
- Setup Redis in Docker, test connection
- Implement cache helpers, wrapper functions
- Unit tests for cache functions

**Week 2: Integration**
- Update all `/api/public/*` endpoints with caching
- Implement revalidation triggers
- Integration tests

**Week 3: UI & Monitoring**
- Add "Clear Cache" buttons to admin
- Build cache stats dashboard
- Testing & optimization

**Week 4: Deployment & Stabilization**
- Deploy to staging, monitor
- Fix any issues, optimize TTL
- Production deployment
- Monitor, document

**Total: 3-4 weeks to production-ready**

## Success Criteria

- [ ] Cache hit rate > 90% after 1 week of production use
- [ ] Database query count reduced by > 95%
- [ ] Average response time < 50ms for cached requests
- [ ] Zero data inconsistency issues
- [ ] Admin can successfully force clear cache
- [ ] Monitoring dashboard operational
- [ ] Redis memory usage < 80MB
- [ ] No errors in production logs related to caching

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Redis connection failure | Medium | Graceful fallback to DB, auto-retry |
| Cache inconsistency | High | Immediate clear on update, revalidate trigger |
| Memory exhaustion | Low | Max memory limit, LRU eviction |
| Stale cache served | Low | TTL enforcement, manual clear option |
| Deployment issues | Medium | Feature flag, gradual rollout |

## Future Enhancements

1. **Pipeline operations** for batch cache gets
2. **Compression** for large cached objects
3. **Cache warming** on server startup
4. **Distributed caching** if scaling to multiple instances
5. **Analytics** on cache patterns to optimize TTL
6. **CDN integration** for static assets

## References

- Next.js ISR: https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration
- Redis caching best practices: https://redis.io/docs/manual/patterns/caching/
- ioredis documentation: https://github.com/luin/ioredis
