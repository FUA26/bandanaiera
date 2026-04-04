# Redis Caching Setup Guide

This guide covers setting up and configuring Redis caching for the Bandanaiera application.

## Table of Contents

- [Overview](#overview)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses Redis for caching API responses to improve performance and reduce database load. The caching layer implements a **fail-open** pattern, meaning if Redis is unavailable, the application continues to function by querying the database directly.

### Key Features

- **Automatic caching**: Common queries are cached with configurable TTL
- **Selective invalidation**: Cache entries can be cleared by pattern or specific key
- **Fail-safe**: Application continues working if Redis is down
- **Feature flag**: Can be enabled/disabled via environment variable
- **Monitoring**: Built-in stats endpoint for cache health

## Local Development Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and pnpm

### Step 1: Start Redis

Start Redis using Docker Compose:

```bash
cd docker
docker-compose up -d redis
```

### Step 2: Verify Redis is Running

Check that Redis is running and accessible:

```bash
# Find the Redis container
docker ps | grep redis

# Test connection
docker exec -it <redis-container> redis-cli ping
# Should return: PONG

# Check logs
docker logs <redis-container>
```

### Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Redis Configuration
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty for local development
```

### Step 4: Start the Application

```bash
pnpm dev
```

You should see the following log message when Redis connects successfully:

```
[Redis] Connecting...
[Redis] Connected and ready
```

### Step 5: Verify Caching is Working

1. Make a request to a cached endpoint (e.g., `/api/news`)
2. Check the logs for cache messages:
   - First request: `[Cache] MISS: cache:news:...`
   - Second request: `[Cache] HIT: cache:news:...`
3. Check cache stats:
   ```bash
   curl http://localhost:3001/api/admin/cache/stats
   ```

## Production Deployment

### Docker Compose Setup

The production `docker-compose.yml` includes Redis as a service:

```yaml
services:
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 100mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
```

### Environment Variables

Configure these environment variables in your production environment:

```env
REDIS_ENABLED=true
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password  # Set this in production!
```

### Redis Password Security

1. Generate a secure password:

```bash
openssl rand -base64 32
```

2. Update `docker-compose.yml`:

```yaml
services:
  redis:
    command: redis-server --requirepass your-password --maxmemory 100mb --maxmemory-policy allkeys-lru
```

3. Update environment variables:

```env
REDIS_PASSWORD=your-password
```

### Deployment Steps

1. Build and start services:

```bash
cd docker
docker-compose up -d
```

2. Verify Redis is running:

```bash
docker-compose logs redis
docker-compose exec redis redis-cli -a your-password ping
```

3. Monitor application logs for Redis connection:

```bash
docker-compose logs backoffice | grep Redis
```

## Configuration

### Cache TTL Configuration

Default TTL is 5 minutes (300 seconds). To customize:

```typescript
import { cachedQuery } from '@/lib/cache/cache';

// Custom TTL in seconds
const result = await cachedQuery(
  'cache:news:latest',
  fetchLatestNews,
  600 // 10 minutes
);
```

### Memory Limits

Redis is configured with a 100MB memory limit using the `allkeys-lru` eviction policy. To adjust:

```yaml
# docker-compose.yml
services:
  redis:
    command: redis-server --maxmemory 200mb --maxmemory-policy allkeys-lru
```

Available eviction policies:
- `allkeys-lru`: Evict least recently used keys (recommended)
- `allkeys-lfu`: Evict least frequently used keys
- `volatile-ttl`: Evict keys with shortest TTL first
- `noeviction`: Return errors when memory limit reached

### Feature Flag

To disable caching without removing Redis:

```env
REDIS_ENABLED=false
```

## Monitoring

### Cache Stats Endpoint

Get real-time cache statistics:

```bash
curl http://localhost:3001/api/admin/cache/stats
```

Response:

```json
{
  "keyCount": 42,
  "memoryUsage": 2,
  "connected": true,
  "redisVersion": "7.0.0",
  "uptimeSeconds": 3600,
  "uptimeFormatted": "1h 0m 0s",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Clear Cache Endpoint

Clear cache manually or by pattern:

```bash
# Clear all cache
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"all": true}'

# Clear specific type
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "news"}'

# Clear custom pattern
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"pattern": "news:page=1"}'
```

### Monitoring Logs

Key log messages to watch:

```
[Redis] Connected and ready        # Successful connection
[Cache] HIT: cache:news:test       # Cache hit
[Cache] MISS: cache:news:test      # Cache miss
[Cache] SET: cache:news:test       # Cache write
[Cache] Cleared 5 keys matching... # Cache invalidation
[Redis] Error: Connection lost     # Connection issue
```

### Redis CLI Monitoring

Monitor Redis in real-time:

```bash
# Monitor all commands
docker exec -it <redis-container> redis-cli MONITOR

# Check memory usage
docker exec -it <redis-container> redis-cli INFO memory

# Check key count
docker exec -it <redis-container> redis-cli DBSIZE

# Check cache keys
docker exec -it <redis-container> redis-cli KEYS "cache:*"
```

## Troubleshooting

### Issue: Redis Connection Refused

**Symptoms:**
- Logs show `[Redis] Error: connect ECONNREFUSED`
- Cache stats show `"connected": false`

**Solutions:**

1. Check if Redis is running:
   ```bash
   docker ps | grep redis
   ```

2. Check Redis logs:
   ```bash
   docker logs <redis-container>
   ```

3. Verify environment variables:
   ```bash
   echo $REDIS_HOST
   echo $REDIS_PORT
   ```

4. Test connection manually:
   ```bash
   docker exec -it <redis-container> redis-cli PING
   ```

### Issue: High Memory Usage

**Symptoms:**
- `memoryUsage` in stats is high
- Redis eviction messages in logs

**Solutions:**

1. Check current memory usage:
   ```bash
   docker exec -it <redis-container> redis-cli INFO memory
   ```

2. Reduce cache TTL in code
3. Increase Redis memory limit in `docker-compose.yml`
4. Clear cache:
   ```bash
   curl -X POST http://localhost:3001/api/admin/cache/clear \
     -H "Content-Type: application/json" \
     -d '{"all": true}'
   ```

### Issue: Cache Not Working

**Symptoms:**
- All requests show `Cache MISS`
- No `Cache HIT` messages

**Solutions:**

1. Verify feature flag:
   ```bash
   echo $REDIS_ENABLED  # Should be "true"
   ```

2. Check Redis connection:
   ```bash
   curl http://localhost:3001/api/admin/cache/stats
   ```

3. Check for errors in application logs

### Issue: Stale Data

**Symptoms:**
- Updated data not showing
- Old data persisting after updates

**Solutions:**

1. Clear the cache:
   ```bash
   # Clear all
   curl -X POST http://localhost:3001/api/admin/cache/clear \
     -H "Content-Type: application/json" \
     -d '{"all": true}'

   # Clear specific type
   curl -X POST http://localhost:3001/api/admin/cache/clear \
     -H "Content-Type: application/json" \
     -d '{"type": "news"}'
   ```

2. Verify cache invalidation is called in mutation functions

### Issue: Performance Degradation

**Symptoms:**
- Slower response times with caching enabled
- High CPU usage on Redis

**Solutions:**

1. Check Redis slow log:
   ```bash
   docker exec -it <redis-container> redis-cli SLOWLOG GET 10
   ```

2. Monitor cache hit rate (should be > 80%)
3. Consider increasing TTL for frequently accessed data
4. Check network latency between app and Redis

## Performance Best Practices

1. **Cache Hit Rate**: Aim for > 80% hit rate
2. **TTL Configuration**: Use shorter TTL for frequently updated data
3. **Memory Usage**: Monitor and keep under 80% of limit
4. **Connection Pooling**: Already configured in `ioredis`
5. **Pattern Matching**: Use specific patterns for invalidation

## Security Considerations

1. **Password Protection**: Always use `REDIS_PASSWORD` in production
2. **Network Isolation**: Redis should not be exposed publicly
3. **Environment Variables**: Use secrets management for passwords
4. **Docker Network**: Use internal networks (already configured)

## Maintenance

### Regular Tasks

1. **Monitor memory usage**: Check stats endpoint weekly
2. **Review cache hit rates**: Look for patterns in cache misses
3. **Clear stale data**: Periodic cache clears if needed
4. **Update Redis**: Pull latest images for security patches

### Backup Redis Data

Redis data is persisted to Docker volume. To backup:

```bash
# Create backup
docker run --rm \
  -v bandanaiera_redis-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/redis-backup.tar.gz /data

# Restore from backup
docker run --rm \
  -v bandanaiera_redis-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/redis-backup.tar.gz -C /
```

## Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [Docker Redis Image](https://hub.docker.com/_/redis)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
