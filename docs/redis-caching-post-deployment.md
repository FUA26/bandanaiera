# Redis Caching Post-Deployment Monitoring

This document outlines monitoring procedures and success criteria for the Redis caching implementation after deployment.

## Table of Contents

- [Immediate Post-Deployment](#immediate-post-deployment)
- [Monitoring Dashboard](#monitoring-dashboard)
- [Key Metrics](#key-metrics)
- [Alerting](#alerting)
- [Success Criteria](#success-criteria)
- [Issue Response](#issue-response)
- [Routine Maintenance](#routine-maintenance)

## Immediate Post-Deployment

### First 15 Minutes (Critical Period)

**Actions:**
1. Monitor application logs for Redis connection
2. Verify cache stats endpoint is accessible
3. Check for any errors in API responses
4. Monitor database CPU and connections

**Commands:**
```bash
# Watch application logs
docker-compose logs -f --tail=100 backoffice | grep -E "Redis|Cache"

# Check cache stats
watch -n 5 'curl -s http://localhost:3001/api/admin/cache/stats | jq'

# Monitor database
docker stats <postgres-container>

# Monitor Redis
docker stats <redis-container>
```

**Expected Log Messages:**
```
[Redis] Connecting...
[Redis] Connected and ready
[Cache] MISS: cache:news:all
[Cache] SET: cache:news:all (TTL: 300s)
[Cache] HIT: cache:news:all
```

**Warning Signs:**
- `[Redis] Error:` messages
- `[Cache]` errors
- High database CPU (> 80%)
- Application errors increasing

### First Hour (Stabilization Period)

**Actions:**
1. Monitor cache hit rate (should be increasing)
2. Check response times (should be improving)
3. Verify no memory leaks
4. Test cache invalidation

**Commands:**
```bash
# Calculate cache hit rate
HITS=$(docker-compose logs backoffice 2>&1 | grep "Cache HIT" | wc -l)
MISSES=$(docker-compose logs backoffice 2>&1 | grep "Cache MISS" | wc -l)
echo "Hit Rate: $(echo "scale=2; $HITS / ($HITS + $MISSES) * 100" | bc)%"

# Test cache clear
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"type": "news"}'

# Verify response times
time curl http://localhost:3001/api/news
```

**Expected Results:**
- Cache hit rate > 70% by end of hour
- Response times < 200ms for cached endpoints
- No memory leaks in Redis or application
- Cache clear working correctly

### First 24 Hours (Validation Period)

**Actions:**
1. Review all metrics at 1, 6, 12, and 24 hours
2. Compare with pre-deployment baselines
3. Check for any patterns in errors
4. Validate cost savings (database load reduction)

**Monitoring Points:**
| Time | Cache Hit Rate | Avg Response Time | DB CPU | Errors |
|------|---------------|-------------------|--------|--------|
| 1h | > 70% | < 200ms | < 40% | < 0.1% |
| 6h | > 75% | < 150ms | < 35% | < 0.1% |
| 12h | > 80% | < 120ms | < 30% | < 0.1% |
| 24h | > 80% | < 100ms | < 30% | < 0.1% |

## Monitoring Dashboard

### Essential Metrics Display

Create a monitoring dashboard with these panels:

#### 1. Cache Health Panel
```
Status: Connected/Disconnected/Disabled
Keys: 42
Memory: 2.5MB / 100MB
Hit Rate: 85.3%
Uptime: 2d 4h 30m
```

#### 2. Performance Panel
```
Avg Response Time: 85ms (was 250ms)
P95 Response Time: 180ms (was 500ms)
P99 Response Time: 250ms (was 800ms)
Throughput: 250 req/s (was 80 req/s)
```

#### 3. Resource Usage Panel
```
Redis CPU: 5%
Redis Memory: 2.5MB
Database CPU: 28% (was 45%)
DB Connections: 12/100 (was 35/100)
```

#### 4. Error Rate Panel
```
Application Errors: 0.05% (was 0.08%)
Redis Errors: 0%
Cache Failures: 0%
```

### Dashboard Tools

**Option 1: Grafana**
```yaml
# Example Grafana panel queries
# Cache Hit Rate
sum(rate(cache_hits_total[5m])) / sum(rate(cache_requests_total[5m])) * 100

# Response Time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Database CPU
rate(process_cpu_seconds_total{job="postgres"}[5m]) * 100
```

**Option 2: Custom Dashboard**
Use the existing analytics page at `/analytics/cache-stats`

**Option 3: Cloud Monitoring**
- AWS CloudWatch
- Google Cloud Monitoring
- Azure Monitor
- Datadog

## Key Metrics

### 1. Cache Performance Metrics

| Metric | Formula | Target | Alert Threshold |
|--------|---------|--------|-----------------|
| **Cache Hit Rate** | Hits / (Hits + Misses) × 100 | > 80% | < 60% |
| **Cache Miss Rate** | Misses / (Hits + Misses) × 100 | < 20% | > 40% |
| **Avg Response Time** | Mean request duration | < 100ms | > 200ms |
| **P95 Response Time** | 95th percentile duration | < 200ms | > 400ms |
| **P99 Response Time** | 99th percentile duration | < 300ms | > 600ms |

### 2. Resource Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Redis Memory** | < 50MB | > 80MB |
| **Redis CPU** | < 10% | > 30% |
| **Database CPU** | < 35% | > 60% |
| **DB Connections** | < 25 | > 50 |
| **App Memory** | < 550MB | > 700MB |

### 3. Reliability Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Error Rate** | < 0.1% | > 0.5% |
| **Redis Uptime** | > 99.9% | < 99% |
| **Cache Availability** | > 99.9% | < 99% |
| **Failed Invalidations** | 0 | > 0 |

## Alerting

### Alert Rules

Configure these alerts:

#### Critical Alerts (Immediate Action)

1. **Redis Down**
   ```
   Condition: Redis connected = false for > 1 minute
   Severity: Critical
   Action: Page DevOps, consider rollback
   ```

2. **High Error Rate**
   ```
   Condition: Error rate > 1% for > 2 minutes
   Severity: Critical
   Action: Investigate logs, consider rollback
   ```

3. **Memory Exhaustion**
   ```
   Condition: Redis memory > 90MB
   Severity: Critical
   Action: Clear cache, investigate memory leak
   ```

#### Warning Alerts (Monitor)

1. **Low Cache Hit Rate**
   ```
   Condition: Hit rate < 60% for > 15 minutes
   Severity: Warning
   Action: Review cache keys, check TTL settings
   ```

2. **High Response Time**
   ```
   Condition: P95 response time > 300ms for > 5 minutes
   Severity: Warning
   Action: Investigate slow queries, check database
   ```

3. **Database CPU High**
   ```
   Condition: Database CPU > 60% for > 10 minutes
   Severity: Warning
   Action: Check if cache is working, scale DB if needed
   ```

### Alert Channels

- **Critical**: PagerDuty, SMS, Phone call
- **Warning**: Email, Slack
- **Info**: Slack, Dashboard notification

### Alert Suppression

Suppress alerts during:
- Planned maintenance windows
- Known deployments
- Testing periods

## Success Criteria

### Deployment Success Checklist

- [ ] All services started successfully
- [ ] Redis connection established
- [ ] No application errors in first 15 minutes
- [ ] Cache stats endpoint responding
- [ ] First cache miss and hit logged correctly
- [ ] Database CPU decreased by > 30%
- [ ] Response times improved by > 60%
- [ ] No user-reported issues

### Performance Success Criteria

| Metric | Before | After | Target | Met? |
|--------|--------|-------|--------|------|
| Avg Response Time | 250ms | 85ms | < 100ms | ☐ |
| P95 Response Time | 500ms | 180ms | < 200ms | ☐ |
| Throughput | 80 RPS | 250 RPS | > 150 RPS | ☐ |
| Database CPU | 45% | 28% | < 35% | ☐ |
| Cache Hit Rate | N/A | 85% | > 80% | ☐ |
| Error Rate | 0.08% | 0.05% | < 0.1% | ☐ |

### Stability Success Criteria

- [ ] Zero crashes in first 24 hours
- [ ] Zero data corruption issues
- [ ] Zero cache-related bugs reported
- [ ] Cache invalidation working correctly
- [ ] No memory leaks detected
- [ ] Automatic fail-open working (tested)

### Business Success Criteria

- [ ] User experience improved (faster page loads)
- [ ] Database costs reduced (lower CPU usage)
- [ ] Support tickets related to performance decreased
- [ ] No negative user feedback
- [ ] System can handle 2x traffic without issues

## Issue Response

### Issue Severity Levels

#### P0 - Critical (Immediate Action)
- System down or completely unavailable
- Data loss or corruption
- Security breach

**Response Time**: < 5 minutes
**Escalation**: DevOps Lead, Engineering Manager

#### P1 - High (Urgent Action)
- Major functionality broken
- Performance severely degraded
- Significant user impact

**Response Time**: < 15 minutes
**Escalation**: Backend Lead, DevOps

#### P2 - Medium (Planned Action)
- Minor functionality issues
- Some performance degradation
- Limited user impact

**Response Time**: < 1 hour
**Escalation**: Backend Team

#### P3 - Low (Normal Priority)
- Cosmetic issues
- Documentation errors
- Minor improvements

**Response Time**: < 1 day
**Escalation**: None

### Common Issues and Responses

#### Issue: Redis Connection Lost

**Symptoms:**
- `[Redis] Error:` in logs
- Cache stats show `connected: false`
- Response times increased

**Response:**
1. Check Redis container status: `docker ps | grep redis`
2. Check Redis logs: `docker logs <redis-container>`
3. Verify network connectivity
4. If unrecoverable, disable caching: `REDIS_ENABLED=false`

#### Issue: Low Cache Hit Rate

**Symptoms:**
- Hit rate < 60%
- High cache miss rate
- Database CPU still high

**Response:**
1. Review cache keys: `docker exec redis redis-cli KEYS "cache:*"`
2. Check TTL settings
3. Review cache invalidation patterns
4. Consider increasing TTL for frequently accessed data

#### Issue: High Memory Usage

**Symptoms:**
- Redis memory > 80MB
- Memory warnings in logs
- Risk of eviction

**Response:**
1. Check memory usage: `docker exec redis redis-cli INFO memory`
2. Review cache key count
3. Clear cache if needed: `curl -X POST /api/admin/cache/clear`
4. Consider reducing TTL or increasing memory limit

#### Issue: Stale Data

**Symptoms:**
- Users report old data
- Updates not reflecting
- Cache not invalidating

**Response:**
1. Clear affected cache: `curl -X POST /api/admin/cache/clear -d '{"type": "news"}'`
2. Review invalidation logic
3. Check mutation operations
4. Test cache revalidation

### Escalation Matrix

| Issue Type | First Responder | Escalation | Timeline |
|------------|----------------|------------|----------|
| Redis Down | DevOps | DevOps Lead | 5 min |
| App Errors | Backend | Backend Lead | 15 min |
| Performance | Backend | Backend Lead | 30 min |
| Data Issues | Backend | Engineering Manager | 1 hour |

## Routine Maintenance

### Daily Checks (Automated)

- [ ] Cache hit rate > 80%
- [ ] Error rate < 0.1%
- [ ] Response times within target
- [ ] Redis memory < 80MB
- [ ] Database CPU < 40%

### Weekly Reviews

1. **Performance Review**
   - Compare metrics to baseline
   - Identify trends
   - Plan optimizations

2. **Cost Analysis**
   - Calculate database cost savings
   - Review Redis resource costs
   - Assess ROI

3. **Capacity Planning**
   - Review growth trends
   - Plan scaling if needed
   - Adjust TTL if required

### Monthly Tasks

1. **Cache Audit**
   - Review all cached endpoints
   - Assess TTL effectiveness
   - Identify optimization opportunities

2. **Performance Tuning**
   - Analyze slow queries
   - Optimize cache keys
   - Adjust memory limits

3. **Documentation Updates**
   - Update runbooks with lessons learned
   - Document any issues and resolutions
   - Review and update alert thresholds

### Quarterly Reviews

1. **Architecture Review**
   - Assess if caching strategy still meets needs
   - Consider new caching patterns
   - Evaluate alternative solutions

2. **Disaster Recovery Test**
   - Test rollback procedures
   - Validate fail-open behavior
   - Practice Redis recovery

3. **Cost Optimization**
   - Review resource utilization
   - Right-size Redis instance
   - Optimize database connection pool

## Monitoring Commands Reference

### Quick Health Check

```bash
# Overall health
curl -s http://localhost:3001/api/admin/cache/stats | jq '{
  connected: .connected,
  keys: .keyCount,
  memory: .memoryUsage,
  hitRate: (.keyCount > 0 ? "OK" : "LOW")
}'

# Check logs for errors
docker-compose logs backoffice --since 1h | grep -i "error"

# Check response times
time curl -s http://localhost:3001/api/news > /dev/null
```

### Detailed Diagnostics

```bash
# Redis diagnostics
docker exec <redis-container> redis-cli INFO
docker exec <redis-container> redis-cli CLIENT LIST
docker exec <redis-container> redis-cli SLOWLOG GET 10

# Application diagnostics
curl -s http://localhost:3001/api/admin/cache/stats | jq
docker-compose logs backoffice --since 1h | grep -E "Cache|Redis"

# Database diagnostics
docker exec <postgres-container> psql -U postgres -c "
  SELECT count(*), state
  FROM pg_stat_activity
  GROUP BY state;
"
```

### Performance Testing

```bash
# Quick benchmark
ab -n 100 -c 10 http://localhost:3001/api/news

# With cache
curl -X POST http://localhost:3001/api/admin/cache/clear -d '{"all": true}'
ab -n 100 -c 10 http://localhost:3001/api/news

# Without cache
REDIS_ENABLED=false
ab -n 100 -c 10 http://localhost:3001/api/news
```

## Reporting

### Daily Report Template

```markdown
# Redis Cache Daily Report - YYYY-MM-DD

## Summary
- Status: ✅ Healthy / ⚠️ Degraded / ❌ Down
- Uptime: 99.9%
- Cache Hit Rate: 85.3%
- Avg Response Time: 85ms

## Metrics
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Hit Rate | 85.3% | > 80% | ✅ |
| Response Time | 85ms | < 100ms | ✅ |
| DB CPU | 28% | < 35% | ✅ |
| Errors | 0.05% | < 0.1% | ✅ |

## Issues
- No issues reported

## Actions
- None required
```

### Weekly Report Template

```markdown
# Redis Cache Weekly Report - Week of YYYY-MM-DD

## Executive Summary
- Overall Status: Healthy
- Performance Improvement: 66% faster response times
- Cost Savings: 35% reduction in database CPU
- User Impact: Positive (faster page loads)

## Performance Trends
[Include charts for hit rate, response time, DB CPU]

## Issues Resolved
1. Low cache hit rate on Monday - Fixed by adjusting TTL
2. Memory warning on Wednesday - Resolved by clearing old cache

## Upcoming Tasks
1. Review TTL settings for tourism endpoint
2. Consider adding cache for user profile data
3. Plan Redis upgrade to v7.2
```

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintained By**: DevOps Team
**Next Review**: 2024-02-15
