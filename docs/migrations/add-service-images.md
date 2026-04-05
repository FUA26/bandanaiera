# Migration Guide: Add Service Images

## Overview

This migration adds image upload functionality to the Service model, allowing services to have multiple associated images. This enhancement improves service presentation and provides better visual context for users.

### What's Added

- **Database Schema**: Added `imageIds` array field to Service model
- **Image Relations**: Added many-to-many relation between Service and File models
- **Form Enhancement**: Updated service form with image upload capability
- **API Updates**: Modified service API routes to handle image associations
- **UI Changes**: Removed ServiceDialog in favor of full-page navigation

### Migration Date

2026-04-05

### Related Commits

- `cb7d5ac` - feat: add imageIds field to Service model
- `8f8643a` - feat: update services API to handle imageIds
- `e43728c` - feat: add image upload to Service form
- `4ef9ad8` - refactor: remove ServiceDialog, use full page only

---

## Database Changes

### Schema Changes

The migration adds the following fields to the database:

#### Service Model

```prisma
model Service {
  // ... existing fields ...

  // NEW: Add image support
  images              File[]               @relation("ServiceImages")
  imageIds            String[]             @default([])

  // ... existing fields ...
}
```

#### File Model

```prisma
model File {
  // ... existing fields ...

  // Relations
  services Service[] @relation("ServiceImages")

  // ... existing fields ...
}
```

### Migration SQL

**Migration File**: `20260405000000_add_service_images/migration.sql`

```sql
-- Add imageIds column to Service table
ALTER TABLE "Service" ADD COLUMN "imageIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- The relation is implicit through the imageIds array, no additional SQL needed
-- The services relation on File model is handled by Prisma's implicit many-to-many
```

### How to Run Migration

```bash
# Navigate to backoffice app
cd apps/backoffice

# Run database migration
npx prisma migrate dev

# Or if using production
npx prisma migrate deploy
```

### Verification

After running the migration, verify the changes:

```bash
# Check if migration was applied
npx prisma migrate status

# Verify schema in Prisma Studio
npx prisma studio
```

---

## Code Changes

### 1. Service Form Component

**Before** (without image upload):

```tsx
// apps/backoffice/components/admin/service-form.tsx

export function ServiceForm({ mode, initialData, onSubmit }: ServiceFormProps) {
  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceCreateSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Basic fields */}
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input {...form.register("name")} />
      </Field>

      {/* Other fields... */}
    </form>
  );
}
```

**After** (with image upload):

```tsx
// apps/backoffice/components/admin/service-form.tsx

import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

export function ServiceForm({ mode, initialData, onSubmit }: ServiceFormProps) {
  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceCreateSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Basic fields */}
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input {...form.register("name")} />
      </Field>

      {/* NEW: Image upload section */}
      <Field>
        <FieldLabel>Images</FieldLabel>
        <FieldContent>
          <EnhancedImageUploader
            images={form.watch("imageIds")}
            onChange={(imageIds) => form.setValue("imageIds", imageIds)}
            maxImages={5}
            aspectRatio="any"
          />
        </FieldContent>
      </Field>

      {/* Other fields... */}
    </form>
  );
}
```

### 2. API Routes - Create Service

**Before** (without image handling):

```typescript
// apps/backoffice/app/api/services/route.ts

export async function POST(req: Request) {
  const data = await req.json();

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      // ... other fields
    },
  });

  return Response.json(service);
}
```

**After** (with image handling):

```typescript
// apps/backoffice/app/api/services/route.ts

export async function POST(req: Request) {
  const data = await req.json();

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      imageIds: data.imageIds || [], // NEW: Handle image IDs
      // ... other fields
    },
  });

  // NEW: Update file reference counts
  if (data.imageIds && data.imageIds.length > 0) {
    await prisma.file.updateMany({
      where: {
        id: { in: data.imageIds },
      },
      data: {
        referenceCount: { increment: 1 },
        category: "SERVICE_IMAGE",
      },
    });
  }

  return Response.json(service);
}
```

### 3. API Routes - Update Service

**Before** (without image handling):

```typescript
// apps/backoffice/app/api/services/[id]/route.ts

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name: data.name,
      description: data.description,
      // ... other fields
    },
  });

  return Response.json(service);
}
```

**After** (with image handling):

```typescript
// apps/backoffice/app/api/services/[id]/route.ts

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();

  // NEW: Get existing service to compare imageIds
  const existingService = await prisma.service.findUnique({
    where: { id: params.id },
    select: { imageIds: true },
  });

  if (!existingService) {
    return Response.json({ error: "Service not found" }, { status: 404 });
  }

  // NEW: Calculate added and removed images
  const addedImages = data.imageIds?.filter(
    (id: string) => !existingService.imageIds.includes(id)
  ) || [];
  const removedImages = existingService.imageIds.filter(
    (id: string) => !data.imageIds?.includes(id)
  );

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name: data.name,
      description: data.description,
      imageIds: data.imageIds || [], // NEW: Handle image IDs
      // ... other fields
    },
  });

  // NEW: Update reference counts for added images
  if (addedImages.length > 0) {
    await prisma.file.updateMany({
      where: { id: { in: addedImages } },
      data: {
        referenceCount: { increment: 1 },
        category: "SERVICE_IMAGE",
      },
    });
  }

  // NEW: Update reference counts for removed images
  if (removedImages.length > 0) {
    await prisma.file.updateMany({
      where: { id: { in: removedImages } },
      data: { referenceCount: { decrement: 1 } },
    });
  }

  return Response.json(service);
}
```

### 4. API Routes - Get Service with Images

**Before** (without images):

```typescript
// apps/backoffice/app/api/services/[id]/route.ts

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
  });

  return Response.json(service);
}
```

**After** (with images):

```typescript
// apps/backoffice/app/api/services/[id]/route.ts

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    include: {
      // NEW: Include images
      images: true,
    },
  });

  return Response.json(service);
}
```

### 5. ServiceDialog Removal

**Before** (using dialog):

```tsx
// apps/backoffice/components/admin/service-dialog.tsx (DELETED)

export function ServiceDialog({ mode, service, open, onOpenChange }: ServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Service" : "Edit Service"}</DialogTitle>
        </DialogHeader>
        <ServiceForm mode={mode} initialData={service} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
```

**After** (navigate to full page):

```tsx
// apps/backoffice/app/dashboard/services/page.tsx

import { useRouter } from "next/navigation";

export function ServicesTable() {
  const router = useRouter();

  const handleCreate = () => {
    // Navigate to full page instead of opening dialog
    router.push("/dashboard/services/new");
  };

  const handleEdit = (serviceId: string) => {
    // Navigate to full page instead of opening dialog
    router.push(`/dashboard/services/${serviceId}/edit`);
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create Service</Button>
      {/* Table with edit buttons calling handleEdit */}
    </div>
  );
}
```

---

## Testing Checklist

### Pre-Migration Tests

- [ ] Backup database before running migration
- [ ] Verify all existing services have no image data
- [ ] Test migration on staging environment first

### Post-Migration Tests

#### Database Tests

- [ ] Verify `imageIds` column exists in Service table
- [ ] Verify default value is empty array `[]`
- [ ] Check that Prisma schema is in sync with database
- [ ] Test migration rollback procedure

#### API Tests

- [ ] **Create Service**
  - [ ] Create service without images (should work)
  - [ ] Create service with single image (should work)
  - [ ] Create service with multiple images (should work)
  - [ ] Create service with more than 5 images (should fail validation)

- [ ] **Update Service**
  - [ ] Add images to existing service
  - [ ] Remove images from service
  - [ ] Replace all images
  - [ ] Update service without changing images

- [ ] **Get Service**
  - [ ] Get service includes images array
  - [ ] Get service with images returns full File objects
  - [ ] Get service without images returns empty array

- [ ] **Delete Service**
  - [ ] Delete service decrements image reference counts
  - [ ] Orphaned images are marked for cleanup

#### Form Tests

- [ ] Service form renders without errors
- [ ] Image uploader displays current images
- [ ] Can add new images
- [ ] Can remove images
- [ ] Can reorder images (drag and drop)
- [ ] Form validation works for image limits
- [ ] Form submission includes imageIds
- [ ] Toast notifications appear on success/error

#### UI/UX Tests

- [ ] Navigate to create page works
- [ ] Navigate to edit page works
- [ ] Back button returns to services list
- [ ] Page title is correct
- [ ] Breadcrumb navigation works

#### Integration Tests

- [ ] Image upload flow works end-to-end
- [ ] Image cropping works correctly
- [ ] Image preview displays correctly
- [ ] File size validation works
- [ ] File type validation works

#### Performance Tests

- [ ] Service creation with images completes in < 3s
- [ ] Service update with images completes in < 3s
- [ ] Service list page loads in < 2s
- [ ] Service detail page with images loads in < 2s

### E2E Tests

Run the E2E test suite:

```bash
cd apps/backoffice
npm run test:e2e
```

Expected tests:
- [ ] `service.spec.ts` - Service CRUD operations with images
- [ ] `service-image-upload.spec.ts` - Image upload functionality
- [ ] `service-form.spec.ts` - Form validation and submission

---

## Rollback Plan

### If Migration Fails

1. **Stop the deployment**
   ```bash
   # Kill any running processes
   pkill -f "next dev"
   ```

2. **Revert database migration**
   ```bash
   cd apps/backoffice
   npx prisma migrate resolve --rolled-back 20260405000000_add_service_images
   ```

3. **Restore database from backup** (if migration was partially applied)
   ```bash
   # If using PostgreSQL
   pg_restore -d your_database -U your_user /path/to/backup.sql

   # If using other backup methods, follow your backup restoration procedure
   ```

4. **Revert code changes**
   ```bash
   # Revert to commit before migration
   git revert cb7d5ac..HEAD

   # Or reset to specific commit
   git reset --hard <commit-hash-before-migration>
   ```

5. **Restart application**
   ```bash
   cd apps/backoffice
   npm run dev
   ```

### If Post-Migration Issues Occur

#### Option 1: Disable Image Feature (Code-Level Rollback)

1. **Revert API changes** to ignore imageIds:
   ```typescript
   // In service routes, ignore imageIds field
   const { imageIds, ...serviceData } = data;
   ```

2. **Hide image upload in form**:
   ```tsx
   {/* Comment out EnhancedImageUploader */}
   {/* <EnhancedImageUploader ... /> */}
   ```

3. **Keep database schema** (no rollback needed)

#### Option 2: Full Rollback

Follow the "If Migration Fails" steps above.

### Rollback Verification

After rollback, verify:

- [ ] Services can be created without errors
- [ ] Services can be edited without errors
- [ ] Service list page loads correctly
- [ ] No image-related errors in logs
- [ ] Database schema matches pre-migration state

---

## Post-Migration

### Immediate Actions

1. **Verify Migration Success**
   ```bash
   cd apps/backoffice
   npx prisma migrate status
   ```

2. **Update Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

4. **Run Database Seed** (if needed)
   ```bash
   npm run seed
   ```

### Data Migration (if needed)

If you need to migrate existing service images from another system:

```typescript
// Example: Migrate images from legacy system
// apps/backoffice/scripts/migrate-service-images.ts

import { prisma } from "@/lib/db";

async function migrateServiceImages() {
  const services = await prisma.service.findMany();

  for (const service of services) {
    // Assuming legacy data has image URLs in a JSON field
    const legacyImages = service.legacyData?.images || [];

    for (const imageUrl of legacyImages) {
      // Create File record
      const file = await prisma.file.create({
        data: {
          originalFilename: imageUrl.split("/").pop(),
          storedFilename: generateStoredFilename(imageUrl),
          mimeType: "image/jpeg",
          size: 0, // Unknown size
          category: "SERVICE_IMAGE",
          uploadedById: service.createdById,
          storagePath: `services/${service.id}`,
        },
      });

      // Add to service imageIds
      await prisma.service.update({
        where: { id: service.id },
        data: {
          imageIds: { push: file.id },
        },
      });
    }
  }
}
```

### Monitoring

Monitor the following metrics after deployment:

1. **Error Rates**
   - Check logs for image-related errors
   - Monitor API error rates

2. **Performance**
   - Service creation/update response times
   - Database query performance
   - Image upload success rates

3. **Storage**
   - Monitor storage usage growth
   - Check for orphaned files

### User Communication

Notify users about the new feature:

1. **Add to changelog**
2. **Update user documentation**
3. **Create tutorial/demo video**
4. **Send notification to service managers**

---

## Known Issues

### Current Limitations

1. **Image Limits**
   - Maximum 5 images per service
   - Maximum file size: 5MB per image
   - Supported formats: JPEG, PNG, WebP

2. **Performance**
   - Large images may slow down form loading
   - No lazy loading for image previews in form

3. **Missing Features**
   - No bulk image upload
   - No image auto-tagging
   - No image search/filter
   - No image alt text support yet

### Bugs to Fix

1. **Image Reordering**
   - Drag-and-drop reordering may not persist order in database
   - **Workaround**: Manually edit imageIds array

2. **Image Preview**
   - Very large images (>4000px) may crash the browser
   - **Workaround**: Pre-process images before upload

3. **Reference Counting**
   - Race conditions possible in reference count updates
   - **Workaround**: Use database transactions

### Compatibility Issues

1. **Browser Support**
   - IE11 not supported (uses modern JavaScript)
   - Mobile browsers may have issues with cropper

2. **Database**
   - Requires PostgreSQL with array support
   - Not compatible with MySQL or SQLite

---

## Future Enhancements

### Planned Features

1. **Image Management**
   - [ ] Bulk image upload
   - [ ] Image drag-and-drop reordering
   - [ ] Image alt text and captions
   - [ ] Image tagging system
   - [ ] Image search and filter

2. **Image Processing**
   - [ ] Automatic image optimization
   - [ ] WebP conversion
   - [ ] Responsive image generation
   - [ ] Thumbnail generation
   - [ ] Watermarking

3. **UX Improvements**
   - [ ] Image gallery view
   - [ ] Lightbox for full-size preview
   - [ ] Image zoom and pan
   - [ ] Before/after comparison
   - [ ] Image version history

4. **Performance**
   - [ ] Lazy loading for images
   - [ ] Image CDN integration
   - [ ] Progressive image loading
   - [ ] Image caching strategy

5. **Analytics**
   - [ ] Image view counts
   - [ ] Image click tracking
   - [ ] Most used images report
   - [ ] Unused images detection

### Timeline

- **Phase 1** (Next Sprint): Bulk upload, image reordering
- **Phase 2** (Next Month): Image optimization, thumbnails
- **Phase 3** (Q2 2026): Gallery view, analytics
- **Phase 4** (Q3 2026): Advanced features (AI tagging, search)

### Related Projects

- Image Upload Enhancement (News, Events, Tourism)
- Media Library System
- CDN Integration
- Image Processing Pipeline

---

## Additional Resources

### Documentation

- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Image Upload Component Docs](../../components/ui/image-upload/README.md)
- [Service API Documentation](../../api/services/README.md)

### Related Files

- Migration: `apps/backoffice/prisma/migrations/20260405000000_add_service_images/`
- Schema: `apps/backoffice/prisma/schema.prisma`
- Form: `apps/backoffice/components/admin/service-form.tsx`
- API Routes: `apps/backoffice/app/api/services/`

### Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with "migration" label
3. Contact tech lead for database issues
4. Check #dev-ops channel for deployment issues

---

## Changelog

### 2026-04-05
- Initial migration guide created
- Documented schema changes
- Added code examples
- Created testing checklist
- Documented rollback procedures

### Future Updates
- Add troubleshooting section
- Update with real-world migration issues
- Add performance benchmarks
- Include user feedback
