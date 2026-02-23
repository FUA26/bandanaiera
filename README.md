# Bandanaiera Monorepo

Monorepo for landing and backoffice applications built with Turborepo, Next.js, and shadcn/ui.

## 📁 Structure

- `apps/landing` - Landing page application
- `apps/backoffice` - Backoffice/admin application
- `packages/ui` - Shared UI components (shadcn/ui)
- `packages/api` - Shared API client
- `packages/utils` - Shared utilities
- `packages/types` - Shared TypeScript types
- `packages/hooks` - Shared React hooks
- `packages/logger` - Shared logging utilities

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Run specific app
pnpm --filter landing dev    # http://localhost:3000
pnpm --filter backoffice dev # http://localhost:3001
```

## 📚 Documentation

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development instructions.

## 🐳 Docker

> ⚠️ **Note**: Docker configuration needs further testing and refinement.
> See `docker/` directory for Docker deployment configuration.

### Quick Docker Commands

```bash
cd docker
docker compose build
docker compose up -d
docker compose down
```

### Domain Routing

- `http://bandanaiera.local` or `http://landing.bandanaiera.local` → Landing app
- `http://admin.bandanaiera.local` → Backoffice app

Add to your `/etc/hosts`:
```
127.0.0.1 bandanaiera.local landing.bandanaiera.local admin.bandanaiera.local
```

## 📦 Packages

### @workspace/ui
Shared UI components powered by shadcn/ui.

```bash
# Add new shadcn components
npx shadcn@latest add button
npx shadcn@latest add input
```

### @workspace/api
API client for backend communication.

### @workspace/utils
Common utility functions.

```typescript
import { formatCurrency } from '@workspace/utils'
```

### @workspace/types
Shared TypeScript types.

```typescript
import type { User, PaginatedResponse } from '@workspace/types'
```

### @workspace/hooks
Custom React hooks.

```typescript
import { useCounter } from '@workspace/hooks'
```

### @workspace/logger
Logging utilities.

```typescript
import { logger } from '@workspace/logger'
logger.info('Application started')
```

## 🛠️ Development

### Build

```bash
# Build all
pnpm build

# Build specific app
pnpm --filter landing build
pnpm --filter backoffice build
```

### Lint

```bash
# Lint all
pnpm lint

# Lint specific app
pnpm --filter landing lint
```

## 📝 License

Private project - All rights reserved.
