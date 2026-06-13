# Infrastruktur Docker Compose

Docker compose ini untuk menjalankan PostgreSQL, Redis, dan MinIO dalam port 89xx.

## Port Mapping

| Service | Port Container | Port Host |
|---------|---------------|-----------|
| PostgreSQL | 5432 | 8943 |
| Redis | 6379 | 8937 |
| MinIO API | 9000 | 8900 |
| MinIO Console | 9001 | 8901 |

## Cara Penggunaan

### 1. Copy environment file
```bash
cp docker/.env.infra docker/.env.infra.local
```

### 2. Jalankan services
```bash
cd docker
docker-compose -f docker-compose.infra.yml --env-file .env.infra.local up -d
```

### 3. Cek status services
```bash
docker-compose -f docker-compose.infra.yml ps
```

### 4. Stop services
```bash
docker-compose -f docker-compose.infra.yml down
```

### 5. Stop dan hapus volumes
```bash
docker-compose -f docker-compose.infra.yml down -v
```

## Akses Services

### PostgreSQL
- Host: localhost
- Port: 8943
- User: postgres (default)
- Password: postgres (default)
- Database: naiera_dev (default)

### Redis
- Host: localhost
- Port: 8937
- No auth by default

### MinIO
- API: http://localhost:8900
- Console: http://localhost:8901
- Access Key: minioadmin (default)
- Secret Key: minioadmin (default)

## Connection Strings untuk Aplikasi

Setelah services berjalan, gunakan connection strings berikut:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:8943/naiera_dev?pgbouncer=true"
DIRECT_URL="postgresql://postgres:postgres@localhost:8943/naiera_dev"
REDIS_URL="redis://localhost:8937"
MINIO_ENDPOINT="localhost"
MINIO_PORT="8900"
```
