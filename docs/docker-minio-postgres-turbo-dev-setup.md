# MinIO & PostgreSQL Docker Setup for Turbo Dev

**Updated:** 2025-04-03
**Purpose:** Guide untuk menghubungkan turbo dev apps dengan MinIO dan PostgreSQL di docker

## 🎯 Status Setup

### ✅ Docker Services Running

| Service | Container | Status | Ports | Access From Host |
|---------|-----------|--------|-------|-----------------|
| **MinIO** | naiera-minio-dev | ✅ Healthy | 9000 (API), 9001 (Console) | `localhost:9000`, `localhost:9001` |
| **PostgreSQL** | naiera-postgres-dev | ✅ Healthy | 5432 (internal) | `localhost:5432` |

### ✅ MinIO Configuration

- **Bucket Name**: `naiera-uploads-dev`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`
- **Console**: http://localhost:9001
- **API**: http://localhost:9000
- **Public Download**: Enabled
- **Test**: ✅ Upload/Download/Delete berhasil

### ✅ PostgreSQL Configuration

- **Database**: `naiera_dev`
- **User**: `postgres`
- **Password**: `postgres`
- **Host**: `localhost`
- **Port**: `5432`
- **Connection**: ✅ Tested successfully

---

## 📝 Environment Variables untuk Turbo Dev

### `apps/backoffice/.env.local`

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/naiera_dev?pgbouncer=true"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/naiera_dev"

# MinIO Object Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL="false"
MINIO_BUCKET="naiera-uploads-dev"

# NextAuth
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Naiera Backoffice Dev"

# Email (development)
RESEND_API_KEY="test"
EMAIL_FROM="Dev <test@example.com>"

# Landing Integration
LANDING_URL="http://localhost:3002"
LANDING_REVALIDATE_SECRET="dev-secret"
REVALIDATE_SECRET="dev-secret"
```

### `apps/landing/.env.local`

```bash
# Database (jika landing butuh database)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/naiera_dev?pgbouncer=true"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/naiera_dev"

# MinIO Object Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL="false"
MINIO_BUCKET="naiera-uploads-dev"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3002"
NEXT_PUBLIC_APP_NAME="Naiera Dev"
```

---

## 🔒 Security Notes

### Development Environment ✅
- Default credentials acceptable (localhost only)
- No SSL required for local development
- `.env.local` files in `.gitignore`

### Production ❌
- ⚠️ **NEVER** commit production credentials to git
- ⚠️ **MUST** use strong passwords
- ⚠️ **MUST** enable SSL/TLS
- ⚠️ **MUST** use firewall rules

---

## 🧪 Verification Commands

### Test MinIO Connection

```bash
# Health check
curl http://localhost:9000/minio/health/live

# List buckets
docker exec naiera-minio-dev sh -c 'mc ls local/'

# Check bucket
docker exec naiera-minio-dev sh -c 'mc ls local/naiera-uploads-dev/'
```

### Test PostgreSQL Connection

```bash
# From host (if psql client installed)
psql -h localhost -U postgres -d naiera_dev

# From docker container
docker exec naiera-postgres-dev sh -c 'psql -U postgres -d naiera_dev -c "\conninfo"'
```

### Test File Upload

```bash
# Create test file
echo "Test upload" > test.txt

# Upload to MinIO using curl
curl -X PUT http://localhost:9000/naiera-uploads-dev/test.txt \
  --data-binary @test.txt

# Download from MinIO
curl http://localhost:9000/naiera-uploads-dev/test.txt

# Delete test file
curl -X DELETE http://localhost:9000/naiera-uploads-dev/test.txt
```

---

## 🚀 Start/Stop Docker Services

### Start Services

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up -d
```

### Stop Services

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f minio
docker compose logs -f postgres
```

---

## 🐛 Troubleshooting

### MinIO Not Accessible

**Problem**: Cannot connect to MinIO from turbo dev

**Solutions**:
1. Check container status: `docker compose ps`
2. Check MinIO health: `curl http://localhost:9000/minio/health/live`
3. Restart MinIO: `docker compose restart minio`
4. Verify bucket exists: `docker exec naiera-minio-dev sh -c 'mc ls local/naiera-uploads-dev/'`

### PostgreSQL Connection Refused

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
1. Check container status: `docker compose ps`
2. Check PostgreSQL health: `docker compose ps postgres`
3. Test connection: `docker exec naiera-postgres-dev sh -c 'pg_isready -U postgres'`
4. Restart PostgreSQL: `docker compose restart postgres`

### Port Conflicts

**Problem**: Port already in use

**Solutions**:
```bash
# Check what's using the port
lsof -i :9000
lsof -i :5432

# Kill process using the port
kill -9 <PID>

# Or change ports in .env.dev
```

### Bucket Not Found

**Problem**: Upload fails with bucket error

**Solutions**:
```bash
# Create bucket manually
docker exec naiera-minio-dev sh -c 'mc mb local/naiera-uploads-dev'

# Set public policy
docker exec naiera-minio-dev sh -c 'mc anonymous set download local/naiera-uploads-dev/'
```

### Volume Permissions Issues

**Problem**: MinIO cannot write to /data

**Solutions**:
```bash
# Fix volume permissions
docker compose down
docker volume rm docker_minio-data
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up -d
```

---

## 📊 Quick Reference

### Connection Strings

| Service | Protocol | Host | Port | Credentials |
|---------|----------|------|------|-------------|
| MinIO API | HTTP | localhost | 9000 | minioadmin/minioadmin |
| MinIO Console | HTTP | localhost | 9001 | minioadmin/minioadmin |
| PostgreSQL | PostgreSQL | localhost | 5432 | postgres/postgres/naiera_dev |

### Bucket Info

- **Name**: `naiera-uploads-dev`
- **Policy**: Public download enabled
- **URL Format**: `http://localhost:9000/naiera-uploads-dev/<filename>`

---

## ✅ Verification Checklist

Sebelum menggunakan turbo dev, pastikan:

- [ ] MinIO container healthy (`docker compose ps` shows "healthy")
- [ ] PostgreSQL container healthy
- [ ] Bucket `naiera-uploads-dev` exists
- [ ] Can access MinIO Console: http://localhost:9001
- [ ] Can test MinIO API: `curl http://localhost:9000/minio/health/live`
- [ ] `.env.local` files created in apps/backoffice and apps/landing
- [ ] Environment variables set correctly (MINIO_ENDPOINT=localhost, not 172.15.15.15)
- [ ] File upload test successful

---

## 🎯 Next Steps

1. **Stop docker app containers** (biarkan MinIO & PostgreSQL running):
   ```bash
   docker stop naiera-landing-dev naiera-backoffice-dev naiera-nginx-dev
   ```

2. **Start turbo dev**:
   ```bash
   # Terminal 1 - Backoffice
   cd apps/backoffice
   pnpm dev

   # Terminal 2 - Landing
   cd apps/landing
   pnpm dev
   ```

3. **Test file upload** dari backoffice app

4. **Verify files tersimpan di MinIO**:
   ```bash
   docker exec naiera-minio-dev sh -c 'mc ls local/naiera-uploads-dev/'
   ```

---

## 📞 Help

### Docker Commands

```bash
# View all containers
docker ps -a | grep naiera

# View container logs
docker logs naiera-minio-dev -f
docker logs naiera-postgres-dev -f

# Execute command in container
docker exec naiera-minio-dev sh -c '<command>'

# Restart service
docker compose restart minio
```

### MinIO Client Commands

```bash
# Enter MinIO container
docker exec -it naiera-minio-dev sh

# Inside container:
mc alias set local http://localhost:9000 minioadmin minioadmin
mc ls local/
mc ls local/naiera-uploads-dev/
mc tree local/
```

---

**Last Updated**: 2025-04-03
**Maintained by**: Development Team
