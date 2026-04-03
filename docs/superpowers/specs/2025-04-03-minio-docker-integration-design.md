# MinIO Docker Integration Design

**Date:** 2025-04-03
**Status:** Approved
**Author:** Claude Sonnet
**Version:** 1.0

## Overview

Menambahkan MinIO object storage ke docker-compose untuk development environment, menggantikan setup MinIO manual yang saat ini running sebagai container terpisah.

## Problem Statement

### Current Issues

1. **Manual Setup**: MinIO containers running independently (naiera-admin-minio, naiera-support-minio, naiera-minio) tanpa konfigurasi terpusat
2. **No Version Control**: Docker setup tidak ter-track di git, sulit untuk reproduksi environment
3. **Complex Management**: 3 container terpisah tanpa orchestration yang jelas
4. **No Integration**: Apps tidak terintegrasi dengan MinIO dalam docker-compose flow
5. **Environment Parity**: Sulit memastikan development dan production environment konsisten

### Goals

1. ✅ Single source of truth untuk infrastructure (docker-compose)
2. ✅ Easy startup: `docker-compose up -d` untuk semua services
3. ✅ Proper health checks dan service dependencies
4. ✅ Data persistence dengan volumes
5. ✅ Environment parity antara dev dan prod
6. ✅ Version controlled infrastructure

## Solution Architecture

### High-Level Design

```
Development Environment (docker-compose.dev.yml)
├── MinIO (port 9000 API, 9001 Console)
│   ├── Bucket: naiera-uploads-dev
│   └── Volumes: minio-data, minio-config
├── PostgreSQL (port 5432)
│   └── Database: naiera_dev
│   └── Volume: postgres-data
├── Landing App (port 3002)
├── Backoffice App (port 3000)
└── Nginx (port 8080)
```

### File Structure

```
docker/
├── docker-compose.yml           # Base: volumes & networks
├── docker-compose.dev.yml       # Development services
├── docker-compose.prod.yml      # Production services (future)
├── Dockerfile.landing           # Existing
├── Dockerfile.backoffice        # Existing
├── nginx.conf                    # Existing
├── .env.dev                     # Development environment
└── .env.prod                    # Production environment (future)
```

## Technical Design

### 1. Base Configuration (docker-compose.yml)

**Purpose**: Shared configuration untuk semua environments

**Components**:
- Networks: `bandanaiera-network` (bridge driver)
- Volumes: `postgres-data`, `minio-data`, `minio-config`

**Why Separate**:
- DRY principle - volumes dan networks shared
- Easy extension untuk environment-specific overrides
- Clean separation of concerns

### 2. MinIO Service Configuration

**Image**: `minio/minio:latest`

**Command**:
```bash
server /data --console-address ":9001"
```

**Environment Variables**:
- `MINIO_ROOT_USER`: Admin username (default: minioadmin)
- `MINIO_ROOT_PASSWORD`: Admin password (default: minioadmin)
- `MINIO_DEFAULT_BUCKETS`: Auto-create bucket on startup

**Ports**:
- `9000:9000` - S3 API compatible endpoint
- `9001:9001` - Web console UI

**Volumes**:
- `minio-data:/data` - Object storage data
- `minio-config:/root/.minio` - MinIO configuration

**Health Check**:
```yaml
test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
interval: 30s
timeout: 20s
retries: 3
```

**Rationale**:
- Default credentials untuk development (bisa di-override via env)
- Auto-create bucket mempermudah setup awal
- Health check memastikan MinIO ready sebelum apps start
- Volume persistence untuk data safety

### 3. PostgreSQL Service Configuration

**Image**: `postgres:16-alpine`

**Environment Variables**:
- `POSTGRES_USER`: Database user (default: postgres)
- `POSTGRES_PASSWORD`: Database password (default: postgres)
- `POSTGRES_DB`: Database name (dev: naiera_dev, prod: naiera)

**Volumes**:
- `postgres-data:/var/lib/postgresql/data`

**Health Check**:
```yaml
test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
interval: 10s
timeout: 5s
retries: 5
```

**Rationale**:
- PostgreSQL 16 stable dan production-ready
- Alpine image untuk size efficiency
- Health check memastikan database ready

### 4. Application Services

#### Landing App

**Build**:
```yaml
build:
  context: ..
  dockerfile: docker/Dockerfile.landing
```

**Ports**: `3002:3000` (host:container)

**MinIO Configuration**:
```yaml
MINIO_ENDPOINT=minio  # Docker network hostname
MINIO_PORT=9000
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-minioadmin}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-minioadmin}
MINIO_USE_SSL=false
MINIO_BUCKET=${MINIO_BUCKET:-naiera-uploads-dev}
```

**Key Change**:
- **Before**: `MINIO_ENDPOINT=localhost` atau IP `172.15.15.15`
- **After**: `MINIO_ENDPOINT=minio` (docker service name)

**Why**: Docker network resolution menggunakan service name

#### Backoffice App

**Ports**: `3000:3000`

**Same MinIO Configuration** as landing app

**Additional Services**:
- NextAuth
- Email (Resend)
- Landing integration

### 5. Service Dependencies

```yaml
depends_on:
  postgres:
    condition: service_healthy
  minio:
    condition: service_healthy
```

**Benefits**:
- Apps wait untuk postgres dan minio healthy
- Prevent connection errors
- Graceful startup sequence

### 6. Environment Files

#### .env.dev (Development)

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=naiera_dev
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/naiera_dev?pgbouncer=true
DIRECT_URL=postgresql://postgres:postgres@postgres:5432/naiera_dev

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=naiera-uploads-dev
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false

# NextAuth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=Naiera Dev

# Email (development)
RESEND_API_KEY=test
EMAIL_FROM=Dev <test@example.com>

# Landing Integration
LANDING_URL=http://localhost:3002
LANDING_REVALIDATE_SECRET=dev-secret
REVALIDATE_SECRET=dev-secret
```

**Security Notes**:
- Default credentials untuk development HANYA
- Production credentials MUST be secure
- `.env.dev.local` untuk overrides personal (gitignored)
- `.env.prod` untuk production (secret, tidak di-commit)

## Implementation Plan

### Phase 1: Preparation

1. Stop existing MinIO containers:
   ```bash
   docker stop naiera-admin-minio naiera-support-minio naiera-minio
   docker rm naiera-admin-minio naiera-support-minio naiera-minio
   ```

2. Backup existing data (optional):
   ```bash
   # If needed, backup from old containers
   docker exec naiera-admin-minio mc mirror old/data ./backup
   ```

### Phase 2: Create Configuration Files

1. Update `docker/docker-compose.yml` with base config
2. Create `docker/docker-compose.dev.yml` with full stack
3. Create `docker/.env.dev` with development defaults
4. Update `.gitignore` for environment files

### Phase 3: Start Services

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up -d
```

### Phase 4: Verification

1. Check services status:
   ```bash
   docker-compose ps
   ```

2. Access MinIO Console:
   - URL: http://localhost:9001
   - Username: minioadmin
   - Password: minioadmin

3. Verify bucket created:
   ```bash
   docker exec naiera-minio-dev mc ls local
   ```

4. Test file upload from backoffice

5. Check file stored in MinIO

### Phase 5: Update Documentation

1. Update README with docker-compose instructions
2. Add migration notes
3. Document environment variables

## Migration Strategy

### From Old Setup to New Setup

**Before**:
- 3 independent MinIO containers
- Manual port mapping (9000, 9002, 9100, 9102, etc.)
- No health checks
- No service dependencies

**After**:
- 1 orchestrated MinIO service
- Consistent port mapping (9000, 9001)
- Health checks enabled
- Proper dependencies

**Steps**:
1. Stop old containers
2. Pull latest code with new docker-compose
3. Start new environment
4. Update application `.env` files if needed
5. Test upload functionality

## Error Handling

### Common Issues

1. **Port Conflicts**
   - **Symptom**: `Error: bind: address already in use`
   - **Solution**: Stop old containers or change ports in `.env.dev`

2. **Bucket Not Found**
   - **Symptom**: Upload fails with bucket error
   - **Solution**: Check `MINIO_DEFAULT_BUCKETS` env var, MinIO should auto-create

3. **Connection Refused**
   - **Symptom**: Apps can't connect to MinIO
   - **Solution**: Verify MinIO healthy: `docker exec naiera-minio-dev mc admin info`

4. **Volume Permissions**
   - **Symptom**: MinIO can't write to /data
   - **Solution**: Check volume permissions, recreate if needed

## Security Considerations

### Development Environment

- ✅ Default credentials acceptable (localhost only)
- ✅ No SSL required for local development
- ✅ Environment files in `.gitignore`
- ⚠️ Never commit production secrets

### Production Environment (Future)

- ✅ Strong passwords required
- ✅ SSL/TLS enabled
- ✅ Secrets from secure vault (not git)
- ✅ Firewall rules
- ✅ Regular backups

## Testing Strategy

### Unit Tests

1. MinIO client initialization
2. Bucket creation
3. File upload/download
4. URL generation

### Integration Tests

1. App → MinIO connection
2. Upload flow end-to-end
3. File serving from MinIO
4. Database + MinIO operations

### Manual Testing Checklist

- [ ] MinIO console accessible
- [ ] Bucket created automatically
- [ ] Upload file from backoffice
- [ ] File appears in MinIO browser
- [ ] File accessible via public URL
- [ ] Landing app can access files
- [ ] Restart services without data loss

## Rollback Plan

If issues occur:

1. **Stop new services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
   ```

2. **Restore old containers**:
   ```bash
   docker start naiera-admin-minio naiera-support-minio
   ```

3. **Revert code changes**:
   ```bash
   git reset --hard HEAD~1
   ```

4. **Investigate logs**:
   ```bash
   docker-compose logs minio
   docker-compose logs postgres
   docker-compose logs backoffice
   ```

## Future Enhancements

1. **Production Environment**: Create `docker-compose.prod.yml`
2. **SSL/TLS**: Enable HTTPS for MinIO in production
3. **Monitoring**: Add Prometheus/Grafana
4. **Backup**: Automated MinIO backup to external storage
5. **CI/CD**: Integrate with GitHub Actions
6. **Multi-Instance**: MinIO cluster for high availability

## Success Criteria

- ✅ All services start with single command
- ✅ MinIO console accessible at localhost:9001
- ✅ Apps can upload files to MinIO successfully
- ✅ Files persist across container restarts
- ✅ Environment reproducible from git
- ✅ No manual container management needed
- ✅ Health checks pass for all services

## Appendix

### A. Quick Start Commands

```bash
# Start development environment
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Restart single service
docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart minio
```

### B. Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `POSTGRES_USER` | postgres | ${POSTGRES_USER} | Database user |
| `POSTGRES_PASSWORD` | postgres | ${POSTGRES_PASSWORD} | Database password |
| `POSTGRES_DB` | naiera_dev | naiera | Database name |
| `MINIO_ROOT_USER` | minioadmin | ${MINIO_ROOT_USER} | MinIO admin |
| `MINIO_ROOT_PASSWORD` | minioadmin | ${MINIO_ROOT_PASSWORD} | MinIO password |
| `MINIO_ACCESS_KEY` | minioadmin | ${MINIO_ACCESS_KEY} | S3 access key |
| `MINIO_SECRET_KEY` | minioadmin | ${MINIO_SECRET_KEY} | S3 secret key |
| `MINIO_BUCKET` | naiera-uploads-dev | naiera-uploads | Bucket name |
| `MINIO_ENDPOINT` | minio | minio | Service hostname |
| `MINIO_PORT` | 9000 | 9000 | API port |
| `MINIO_USE_SSL` | false | ${MINIO_USE_SSL} | SSL enabled |

### C. Port Reference

| Service | Development | Production | Internal |
|---------|-------------|------------|---------|
| MinIO API | 9000 | - | 9000 |
| MinIO Console | 9001 | - | 9001 |
| PostgreSQL | - | - | 5432 |
| Landing App | 3002 | 3000 | 3000 |
| Backoffice App | 3000 | 3001 | 3000 |
| Nginx | 8080 | 80, 443 | 80 |

### D. Troubleshooting Guide

#### MinIO not starting
```bash
# Check logs
docker-compose logs minio

# Check health status
docker exec naiera-minio-dev curl http://localhost:9000/minio/health/live

# Restart MinIO
docker-compose restart minio
```

#### Apps can't connect to MinIO
```bash
# Check network
docker network inspect docker_bandanaiera-network

# Check MinIO from within app container
docker exec naiera-backoffice-dev ping minio

# Verify environment variables
docker exec naiera-backoffice-dev env | grep MINIO
```

#### Data not persisting
```bash
# Check volumes
docker volume ls | grep minio

# Inspect volume
docker volume inspect docker_minio-data

# Check volume mount
docker inspect naiera-minio-dev | grep Mounts
```

---

**Document Status**: Ready for review
**Next Step**: User review → Implementation plan creation
