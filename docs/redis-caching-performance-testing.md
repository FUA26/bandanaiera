# Redis Caching Performance Testing Guide

This document outlines procedures for testing the performance impact of Redis caching.

## Table of Contents

- [Testing Overview](#testing-overview)
- [Prerequisites](#prerequisites)
- [Testing Tools](#testing-tools)
- [Test Scenarios](#test-scenarios)
- [Benchmarking Procedure](#benchmarking-procedure)
- [Analyzing Results](#analyzing-results)
- [Performance Targets](#performance-targets)

## Testing Overview

Performance testing helps validate that Redis caching provides measurable improvements in response times and reduces database load.

### Key Metrics to Measure

1. **Response Time**: Time to complete API requests
2. **Throughput**: Requests per second the system can handle
3. **Cache Hit Rate**: Percentage of requests served from cache
4. **Database Load**: CPU and connection usage
5. **Error Rate**: Failed requests percentage

### Testing Goals

- Quantify performance improvement with caching
- Identify optimal cache TTL values
- Validate system stability under load
- Establish baseline metrics for monitoring

## Prerequisites

### Environment Setup

1. **Staging Environment** (Recommended):
   - Mirror of production configuration
   - Similar data volumes
   - Isolated from production traffic

2. **Local Environment** (For development):
   - Docker Compose setup
   - Sample data set
   - Resource monitoring tools

### Required Tools

Install these tools for testing:

```bash
# Apache Bench (usually pre-installed)
ab -V

# Apache Bench on macOS
brew install httpd

# wrk (modern alternative)
brew install wrk  # macOS
# or
git clone https://github.com/wg/wrk.git && cd wrk && make  # Linux

# hey (Go-based tool)
go install github.com/rakyll/hey@latest
```

### Data Preparation

Ensure adequate test data:

```bash
# For news API
curl -X POST http://localhost:3001/api/news \
  -H "Content-Type: application/json" \
  -d '{"title": "Test News", "content": "..."}'

# Verify data exists
curl http://localhost:3001/api/news | jq '.data | length'
```

## Testing Tools

### Apache Bench (ab)

Basic load testing tool:

```bash
# Basic usage
ab -n 1000 -c 10 http://localhost:3001/api/news

# With headers
ab -n 1000 -c 10 -H "Accept: application/json" http://localhost:3001/api/news

# POST requests
ab -n 100 -c 5 -p data.json -T application/json http://localhost:3001/api/news

# With timeout
ab -n 1000 -c 10 -s 60 http://localhost:3001/api/news
```

Parameters:
- `-n`: Total number of requests
- `-c`: Number of concurrent requests
- `-t`: Timelimit in seconds
- `-p`: POST data file
- `-H`: Custom headers
- `-s`: Max timeout in seconds

### wrk

Modern HTTP benchmarking tool:

```bash
# Basic usage
wrk -t4 -c100 -d30s http://localhost:3001/api/news

# With Lua script for POST
wrk -t4 -c100 -d30s -s post.lua http://localhost:3001/api/news

# With specific throughput
wrk -t4 -c100 -d30s -R 1000 http://localhost:3001/api/news
```

Parameters:
- `-t`: Number of threads
- `-c`: Number of connections
- `-d`: Duration of test
- `-R`: Request rate (requests/second)
- `-s`: Lua script file

### hey

User-friendly HTTP load generator:

```bash
# Basic usage
hey -n 1000 -c 100 http://localhost:3001/api/news

# With metrics
hey -n 1000 -c 100 -m GET -o csv http://localhost:3001/api/news > results.csv

# With custom headers
hey -n 1000 -c 100 -H "Authorization: Bearer token" http://localhost:3001/api/news
```

## Test Scenarios

### Scenario 1: Cold Cache vs Warm Cache

Test the difference between first request (cache miss) and subsequent requests (cache hit).

**Without Cache:**
```bash
# Clear cache
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"all": true}'

# Run benchmark
ab -n 100 -c 10 http://localhost:3001/api/news
```

**With Cache (Warm):**
```bash
# Prime the cache
curl http://localhost:3001/api/news > /dev/null

# Run benchmark
ab -n 100 -c 10 http://localhost:3001/api/news
```

### Scenario 2: Concurrent Load Testing

Test system under concurrent load.

```bash
# Low concurrency
ab -n 1000 -c 10 http://localhost:3001/api/news

# Medium concurrency
ab -n 1000 -c 50 http://localhost:3001/api/news

# High concurrency
ab -n 1000 -c 100 http://localhost:3001/api/news
```

### Scenario 3: Sustained Load Testing

Test system stability over time.

```bash
# 10 minute sustained load
wrk -t4 -c50 -d10m http://localhost:3001/api/news

# Monitor during test
watch -n 5 'curl -s http://localhost:3001/api/admin/cache/stats | jq .'
```

### Scenario 4: Cache Hit Rate Testing

Test effectiveness of caching with realistic access patterns.

```bash
# Sequential requests (same endpoint)
ab -n 1000 -c 10 http://localhost:3001/api/news

# Random requests (different endpoints)
# Create a file with URLs
cat > urls.txt << EOF
http://localhost:3001/api/news
http://localhost:3001/api/tourism
http://localhost:3001/api/events
http://localhost:3001/api/services
EOF

# Run with random selection
while true; do
  curl -s $(shuf -n 1 urls.txt) > /dev/null
done
```

### Scenario 5: Mixed Read/Write Testing

Test cache invalidation during updates.

```bash
# Terminal 1: Read load
ab -n 1000 -c 10 http://localhost:3001/api/news

# Terminal 2: Write load (simultaneous)
while true; do
  curl -X POST http://localhost:3001/api/news \
    -H "Content-Type: application/json" \
    -d '{"title": "Test", "content": "Content"}'
  sleep 1
done
```

## Benchmarking Procedure

### Step 1: Establish Baseline (Without Cache)

1. Disable caching:

```bash
# Set environment variable
export REDIS_ENABLED=false

# Or update docker-compose.yml
cd docker && sed -i 's/REDIS_ENABLED=true/REDIS_ENABLED=false/' docker-compose.yml
docker-compose restart backoffice
```

2. Run baseline tests:

```bash
# Clear any existing cache
curl -X POST http://localhost:3001/api/admin/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"all": true}'

# Run benchmark
ab -n 1000 -c 10 -g baseline.tsv http://localhost:3001/api/news
```

3. Record results:

```bash
# Save results
cat baseline.tsv | tee baseline_results.txt
```

### Step 2: Enable Caching

1. Enable caching:

```bash
# Set environment variable
export REDIS_ENABLED=true

# Or update docker-compose.yml
cd docker && sed -i 's/REDIS_ENABLED=false/REDIS_ENABLED=true/' docker-compose.yml
docker-compose restart backoffice
```

2. Verify connection:

```bash
curl -s http://localhost:3001/api/admin/cache/stats | jq '.connected'
# Should return: true
```

### Step 3: Warm Up Cache

```bash
# Prime the cache with requests
for i in {1..10}; do
  curl http://localhost:3001/api/news > /dev/null
  curl http://localhost:3001/api/tourism > /dev/null
  curl http://localhost:3001/api/events > /dev/null
done

# Verify cache is populated
curl -s http://localhost:3001/api/admin/cache/stats | jq '.keyCount'
```

### Step 4: Run Cached Tests

```bash
# Run same benchmark as baseline
ab -n 1000 -c 10 -g cached.tsv http://localhost:3001/api/news

# Save results
cat cached.tsv | tee cached_results.txt
```

### Step 5: Monitor During Test

In separate terminal, monitor metrics:

```bash
# Watch cache stats
watch -n 2 'curl -s http://localhost:3001/api/admin/cache/stats | jq'

# Monitor database
docker stats <postgres-container>

# Monitor Redis
docker stats <redis-container>

# Application logs
docker-compose logs -f backoffice | grep -E "Cache|Redis"
```

## Analyzing Results

### Apache Bench Output

Key metrics from `ab` output:

```
Concurrency Level:      10
Time taken for tests:   23.456 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      15000000 bytes
Requests per second:    42.63 [#/sec] (mean)
Time per request:       234.56 [ms] (mean)
Time per request:       23.45 [ms] (mean, across all concurrent requests)
Transfer rate:          624.45 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        5    8   2.1      8      15
Processing:    45   220 45.3    210    450
Waiting:       40   210 43.1    200    440
Total:         50   228 46.5    218    465

Percentage of the requests served within a certain time (ms)
  50%    218
  66%    240
  75%    260
  80%    275
  90%    320
  95%    380
  98%    420
  99%    440
 100%    465 (longest request)
```

### Comparison Template

Create a comparison spreadsheet:

| Metric | Without Cache | With Cache | Improvement |
|--------|--------------|------------|-------------|
| Mean Response Time | 228ms | 45ms | 80% faster |
| Median Response Time | 218ms | 40ms | 82% faster |
| 95th Percentile | 380ms | 80ms | 79% faster |
| Requests/Second | 42.63 | 215.43 | 405% increase |
| Failed Requests | 0 | 0 | No change |
| Database CPU | 45% | 12% | 73% reduction |
| Cache Hit Rate | N/A | 95% | N/A |

### Cache Hit Rate Calculation

```bash
# Count cache hits and misses from logs
docker-compose logs backoffice | grep "Cache HIT" | wc -l  # Hits
docker-compose logs backoffice | grep "Cache MISS" | wc -l # Misses

# Calculate hit rate
HIT_RATE = (HITS / (HITS + MISSES)) * 100
```

## Performance Targets

### Response Time Targets

| Endpoint | Without Cache | With Cache | Target |
|----------|--------------|------------|--------|
| GET /api/news | < 300ms | < 100ms | 70% improvement |
| GET /api/tourism | < 300ms | < 100ms | 70% improvement |
| GET /api/events | < 300ms | < 100ms | 70% improvement |
| GET /api/services | < 300ms | < 100ms | 70% improvement |
| POST /api/news | < 500ms | < 500ms | No degradation |

### Throughput Targets

| Concurrency | Without Cache (RPS) | With Cache (RPS) | Target |
|-------------|-------------------|------------------|--------|
| 10 concurrent | > 40 RPS | > 150 RPS | 3x improvement |
| 50 concurrent | > 100 RPS | > 300 RPS | 3x improvement |
| 100 concurrent | > 150 RPS | > 400 RPS | 2.5x improvement |

### Resource Usage Targets

| Resource | Without Cache | With Cache | Target |
|----------|--------------|------------|--------|
| Database CPU | < 60% | < 30% | 50% reduction |
| Database Connections | < 50 | < 25 | 50% reduction |
| Redis Memory | N/A | < 50MB | < 50MB |
| Application Memory | < 500MB | < 550MB | < 10% increase |

### Cache Effectiveness Targets

| Metric | Target |
|--------|--------|
| Cache Hit Rate | > 80% |
| Cache Miss Rate | < 20% |
| Error Rate | < 0.1% |
| Cache Invalidation Time | < 100ms |

## Test Results Template

```markdown
# Performance Test Results

## Test Environment
- Date: 2024-01-15
- Time: 10:00 AM
- Configuration: Staging
- Redis Version: 7.0.0
- Database: PostgreSQL 15

## Test Results

### Response Times
- Without Cache: 228ms (mean)
- With Cache: 45ms (mean)
- Improvement: 80.3%

### Throughput
- Without Cache: 42.63 RPS
- With Cache: 215.43 RPS
- Improvement: 405.5%

### Cache Statistics
- Cache Hit Rate: 95.2%
- Key Count: 42
- Memory Usage: 2MB

### Resource Usage
- Database CPU: 12% (with cache) vs 45% (without)
- Redis Memory: 2MB
- Application Memory: 450MB

## Conclusion
Caching provides significant performance improvements with minimal resource overhead.

## Recommendations
- Implement caching in production
- Monitor cache hit rates
- Set up alerts for low hit rates
```

## Continuous Performance Monitoring

### Set Up Automated Benchmarks

Create a cron job to run regular benchmarks:

```bash
# Add to crontab
0 2 * * * /path/to/benchmark-script.sh
```

Example script:

```bash
#!/bin/bash
# benchmark-script.sh

DATE=$(date +%Y%m%d-%H%M%S)
RESULTS_DIR="/path/to/results"

# Run benchmark
ab -n 1000 -c 10 -g ${RESULTS_DIR}/benchmark-${DATE}.tsv \
  http://localhost:3001/api/news

# Save stats
curl -s http://localhost:3001/api/admin/cache/stats > \
  ${RESULTS_DIR}/stats-${DATE}.json

# Alert if response time > threshold
MEAN_TIME=$(awk 'NR>2 {sum+=$2; count++} END {print sum/count}' \
  ${RESULTS_DIR}/benchmark-${DATE}.tsv)

if (( $(echo "$MEAN_TIME > 100" | bc -l) )); then
  echo "ALERT: Response time ${MEAN_TIME}ms exceeds threshold"
fi
```

### Dashboard Metrics

Track these metrics over time:

1. **Response Time Trends**: Weekly/daily averages
2. **Cache Hit Rate**: Percentage over time
3. **Error Rates**: Failed requests percentage
4. **Resource Usage**: CPU, memory, connections
5. **Throughput**: Requests per second

## Troubleshooting Performance Issues

### Low Cache Hit Rate

**Symptoms**: Hit rate < 80%

**Causes**:
- TTL too short
- Too much cache invalidation
- Poor cache key design

**Solutions**:
- Increase TTL
- Review invalidation logic
- Optimize cache keys

### High Memory Usage

**Symptoms**: Redis memory > 100MB

**Causes**:
- TTL too long
- Too many cached items
- Large response sizes

**Solutions**:
- Reduce TTL
- Implement pagination
- Compress cached data

### Slow Cache Response

**Symptoms**: Cached requests > 100ms

**Causes**:
- Network latency
- Redis CPU saturation
- Large cached objects

**Solutions**:
- Optimize network
- Scale Redis
- Cache smaller objects

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintained By**: Performance Team
