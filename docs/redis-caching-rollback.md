# Redis Caching Rollback Plan

This document outlines procedures for rolling back the Redis caching feature if issues arise in production.

## Table of Contents

- [Rollback Scenarios](#rollback-scenarios)
- [Immediate Rollback (Feature Flag)](#immediate-rollback-feature-flag)
- [Complete Rollback](#complete-rollback)
- [Post-Rollback Verification](#post-rollback-verification)
- [Monitoring After Rollback](#monitoring-after-rollback)
- [Re-deployment Procedures](#re-deployment-procedures)

## Rollback Scenarios

### When to Use Feature Flag Rollback

Use the feature flag rollback (`REDIS_ENABLED=false`) when:

- Redis is causing application errors
- Cache is serving stale data
- Redis connection issues are affecting performance
- You need to quickly disable caching without redeploying

**Advantages:**
- Instant (no deployment needed)
- Application continues running
- Easy to re-enable

**Disadvantages:**
- Redis container still running (minor resource usage)
- Cache not actively cleared (will expire naturally)

### When to Use Complete Rollback

Use complete rollback when:

- Redis service is causing system-wide issues
- You need to free up resources
- There are security concerns with Redis
- Feature flag rollback is insufficient

**Advantages:**
- Complete removal of Redis dependency
- Frees up all resources

**Disadvantages:**
- Requires deployment
- Longer time to execute

## Immediate Rollback (Feature Flag)

### Step 1: Disable Caching via Environment Variable

**Option A: Docker Compose**

1. Edit `docker/docker-compose.yml`:

```yaml
services:
  backoffice:
    environment:
      - REDIS_ENABLED=false  # Change from true to false
```

2. Restart the backoffice service:

```bash
cd docker
docker-compose restart backoffice
```

**Option B: Kubernetes/Helm**

1. Update your Helm values or ConfigMap:

```yaml
env:
  - name: REDIS_ENABLED
    value: "false"
```

2. Restart the pod:

```bash
kubectl rollout restart deployment/backoffice
```

**Option C: Cloud Platform (Vercel, AWS, etc.)**

Update the environment variable in your platform's dashboard:

```
REDIS_ENABLED=false
```

Then trigger a redeploy or restart the application.

### Step 2: Verify Rollback

1. Check application logs:

```bash
# Should see: [Redis] Caching disabled via REDIS_ENABLED flag
docker-compose logs -f backoffice | grep Redis
```

2. Verify cache stats endpoint:

```bash
curl http://localhost:3001/api/admin/cache/stats
```

Expected response:

```json
{
  "keyCount": 0,
  "memoryUsage": 0,
  "connected": false,
  "redisVersion": "unknown",
  "uptimeSeconds": 0,
  "uptimeFormatted": "not connected"
}
```

3. Test application functionality:

- Make API requests to ensure they work
- Verify database queries are working
- Check that data is fresh (no stale cache)

### Step 3: Monitor Application

Monitor the following for 15-30 minutes:

1. **Error Rates**: Ensure no Redis-related errors
2. **Response Times**: May increase slightly (expected)
3. **Database Load**: May increase (expected)
4. **Application Logs**: Should be clean of Redis errors

## Complete Rollback

### Step 1: Remove Redis from Docker Compose

1. Edit `docker/docker-compose.yml`:

```yaml
# Remove the redis service entirely
# redis:
#   image: redis:7-alpine
#   ...

# Remove redis from dependencies
services:
  landing:
    # Remove: depends_on.redis
    depends_on: []  # or remove depends_on entirely

  backoffice:
    # Remove: depends_on.redis
    depends_on: []
    # Remove or comment out Redis environment variables
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      # - REDIS_HOST=redis
      # - REDIS_PORT=6379
      # - REDIS_ENABLED=true
```

2. Remove Redis volume (optional):

```bash
cd docker
docker-compose down
docker volume rm bandanaiera_redis-data
```

### Step 2: Update Application Code

1. Remove Redis dependencies (optional, but recommended for cleanup):

```bash
cd apps/backoffice
pnpm remove ioredis
```

2. Remove cache-related files (optional):

```bash
# Remove cache implementation
rm -rf lib/cache/
rm -rf app/api/admin/cache/
```

3. Update API routes to remove caching (if not using feature flag):

```typescript
// Before
import { cachedQuery } from '@/lib/cache/cache';

const news = await cachedQuery('cache:news:all', fetchNews);

// After
const news = await fetchNews();
```

### Step 3: Deploy Changes

```bash
# Build and deploy
cd docker
docker-compose build
docker-compose up -d

# Or use your deployment pipeline
git add .
git commit -m "rollback: remove Redis caching"
git push origin main
```

### Step 4: Verify Complete Removal

1. Check that Redis is not running:

```bash
docker ps | grep redis
# Should return nothing
```

2. Check application logs:

```bash
docker-compose logs backoffice | grep -i redis
# Should show: [Redis] Caching disabled via REDIS_ENABLED flag
# OR nothing if code was removed
```

3. Verify application functionality:

- Test all API endpoints
- Check database connectivity
- Verify data freshness

## Post-Rollback Verification

### Health Checklist

- [ ] Application starts without errors
- [ ] All API endpoints respond correctly
- [ ] Database queries working properly
- [ ] No Redis-related errors in logs
- [ ] Response times acceptable (may be slightly slower)
- [ ] Data is fresh and up-to-date
- [ ] No memory leaks or resource issues

### Performance Comparison

After rollback, monitor these metrics:

| Metric | With Cache | Without Cache | Acceptable |
|--------|-----------|---------------|------------|
| API Response Time | 50-100ms | 100-300ms | Yes |
| Database CPU | 10-20% | 20-40% | Yes |
| Database Connections | 5-10 | 10-20 | Yes |
| Error Rate | < 0.1% | < 0.1% | Yes |

If metrics are outside acceptable range, investigate other issues.

## Monitoring After Rollback

### Immediate Monitoring (First Hour)

Check every 5-10 minutes:

1. **Application Logs**
   ```bash
   docker-compose logs -f --tail=100 backoffice
   ```

2. **Database Performance**
   ```bash
   # Check PostgreSQL connections
   docker exec -it <postgres-container> psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

   # Check slow queries
   docker exec -it <postgres-container> psql -U postgres -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
   ```

3. **Response Times**
   ```bash
   # Use curl to measure response time
   time curl http://localhost:3001/api/news
   ```

### Ongoing Monitoring (First 24 Hours)

Monitor these metrics:

1. **Error Rates**: Should remain < 0.1%
2. **Response Times**: Should be < 500ms for p95
3. **Database Load**: CPU < 60%, Connections < 50% max
4. **Memory Usage**: Application memory stable
5. **User Reports**: No complaints about slowness

### Alerting Thresholds

Set up alerts for:

- Error rate > 1%
- Response time p95 > 1000ms
- Database CPU > 80%
- Database connections > 80% max
- Application memory > 90%

## Re-deployment Procedures

### Re-enabling Caching (After Issue Resolution)

Once the issue is resolved, re-enable caching:

1. **Feature Flag Method** (Recommended for testing):

```bash
# Update environment variable
REDIS_ENABLED=true

# Restart service
docker-compose restart backoffice

# Monitor logs
docker-compose logs -f backoffice | grep Redis
```

2. **Full Rollback Method** (If code was removed):

```bash
# Restore previous version
git revert <rollback-commit>
git push origin main

# Or restore from backup
git checkout <commit-before-rollback>
```

### Gradual Rollout

For production, consider gradual rollout:

1. **Canary Deployment**: Enable for 10% of traffic
2. **Monitor**: Watch for issues for 15-30 minutes
3. **Increase**: Gradually increase to 50%, then 100%
4. **Rollback**: Be prepared to rollback if issues arise

## Common Issues and Solutions

### Issue: Application Slow After Rollback

**Cause**: Database queries not optimized for no-cache scenario

**Solution**:
1. Add database indexes
2. Optimize slow queries
3. Implement query result pagination
4. Consider database connection pooling

### Issue: High Database CPU After Rollback

**Cause**: Increased query load

**Solution**:
1. Scale database resources
2. Implement query caching at database level
3. Add read replicas
4. Optimize frequently accessed queries

### Issue: Stale Data Still Showing

**Cause**: Browser caching or CDN caching

**Solution**:
1. Clear CDN cache
2. Add cache-busting headers
3. Verify browser cache is cleared
4. Check for other caching layers

## Emergency Contacts

For rollback assistance:

- **DevOps Lead**: [Contact info]
- **Database Admin**: [Contact info]
- **Backend Lead**: [Contact info]

## Rollback Decision Tree

```
Is Redis causing issues?
│
├─ Yes → Is it critical (errors, crashes)?
│   │
│   ├─ Yes → Use Feature Flag Rollback (immediate)
│   │        ↓
│   │     Monitor for 15 mins
│   │        ↓
│   │     Still issues?
│   │        ↓
│   │     Complete Rollback
│   │
│   └─ No → Monitor and investigate
│            ↓
│         Can you fix it quickly?
│            ↓
│         ├─ Yes → Fix and test
│          └─ No → Feature Flag Rollback
│
└─ No → Continue monitoring
```

## Success Criteria

Rollback is considered successful when:

1. Application is stable without errors
2. All features are working correctly
3. Performance is within acceptable ranges
3. No user complaints about functionality
4. System resources are stable
5. No data loss or corruption

## Documentation Updates

After rollback, update:

1. Runbook with lessons learned
2. This document with actual rollback experience
3. Monitoring dashboards
4. Alert thresholds

## Future Prevention

To prevent future rollbacks:

1. **Staging Testing**: Always test Redis in staging first
2. **Gradual Rollout**: Use feature flags and canary deployments
3. **Monitoring**: Comprehensive monitoring before production
4. **Load Testing**: Test under production-like load
5. **Runbooks**: Have detailed runbooks for common issues
6. **Alerts**: Proactive alerting on issues

## Appendix: Rollback Commands Reference

### Quick Feature Flag Rollback

```bash
# Docker Compose
cd docker && sed -i 's/REDIS_ENABLED=true/REDIS_ENABLED=false/' docker-compose.yml && docker-compose restart backoffice

# Kubernetes
kubectl set env deployment/backoffice REDIS_ENABLED=false

# Verify
curl http://localhost:3001/api/admin/cache/stats
```

### Quick Complete Rollback

```bash
# Stop and remove Redis
cd docker
docker-compose stop redis
docker-compose rm -f redis
docker-compose up -d backoffice

# Remove volume (optional)
docker volume rm bandanaiera_redis-data
```

### Verify Rollback

```bash
# Check logs
docker-compose logs backoffice | grep -i redis

# Test API
curl http://localhost:3001/api/news

# Check stats
curl http://localhost:3001/api/admin/cache/stats
```

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintained By**: DevOps Team
