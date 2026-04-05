# Image Upload Enhancement Design

**Date:** 2025-04-04
**Status:** Approved
**Priority:** High

## Overview

Enhance the image upload system across backoffice forms to provide consistent, user-friendly image management with crop, compression, and multiple image support. Focus on Services form (most complex with 25+ fields) while establishing reusable patterns for other content types.

## Problem Statement

**Current Issues:**
1. **Inconsistent UI Patterns**: Services uses mixed Dialog + Full page, other modules use Full page only
2. **Missing Image Upload**: Services (25+ fields) has NO image upload capability
3. **Limited Features**: Existing ImageUploader lacks crop, compression, and multiple image support
4. **UX Threshold Unclear**: No clear guidelines for when to use popup vs full page

**Impact:**
- Services content lacks visual elements
- Inconsistent user experience across modules
- Large images may impact landing page performance
- No image optimization before upload

## Design Goals

1. **Consistency**: Establish clear UI pattern (1-7 fields = popup, 8+ fields = full page)
2. **Visual Content**: Add image upload to Services and improve existing implementations
3. **Performance**: Client-side compression before upload (max 1MB, 1920px width)
4. **User Experience**: Drag-drop, crop preview, progress tracking, error recovery

## Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────┐
│           Enhanced Image Upload Component           │
│  (Single/Multiple, Drag-Drop, Crop, Compression)   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         Image Processing Service (Client)           │
│  • Browser-based crop/resize (react-image-crop)     │
│  • Compression (browser-image-compression)         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Existing Upload API                    │
│  POST /api/files (MinIO → Database)                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                  MinIO Storage                      │
│         bandanaiera-bucket / {userId}/images/       │
└─────────────────────────────────────────────────────┘
```

### Component Structure

- **`EnhancedImageUploader`** - Main component with intermediate features
- **`ImageCropperModal`** - Modal for crop/resize operations
- **`ImageGallery`** - Grid preview for multiple images with drag-to-reorder
- Reuse existing `/api/files` endpoint and MinIO integration

## Features

### Single Image Mode

- Drag & drop zone with visual feedback
- Preview with overlay actions (remove, replace, crop)
- Progress bar during upload
- Error handling with toast notifications
- Crop/resize modal before upload
- Auto-compression (max 1MB, quality 85%)

### Multiple Images Mode

- Grid layout for preview (2-3 columns responsive)
- Drag-to-reorder functionality
- Individual upload (can upload one at a time)
- Batch delete with checkbox selection
- Maximum 10 images per field

### Image Processing

**Compression:**
- Target size: max 1MB per image
- Target dimensions: max 1920px width
- Quality: 85%
- Format: Convert PNG → WEBP if size > 2MB

**Crop Options:**
- Aspect ratios: 16:9, 4:3, 1:1, free
- Max crop size: 4000x4000px
- Min crop size: 100x100px
- Preview before/after crop

### UI Components (Dice UI/Shadcn)

- `Button` - Upload, remove, crop actions
- `Dialog` - Crop modal
- `Progress` - Upload progress indicator
- `Toast` - Success/error notifications
- `Badge` - File size, dimensions info
- `Card` - Image preview container

### File Validation

**Allowed Types:**
- image/jpeg
- image/png
- image/webp

**Size Limits:**
- Max upload: 5MB (before compression)
- Max compressed: 1MB
- Max dimensions: 4000x4000px
- Min dimensions: 100x100px

## Data Flow & State Management

### State Structure

```typescript
interface ImageUploadState {
  images: UploadedImage[];
  uploading: boolean;
  processing: boolean; // for crop/compress
  errors: Record<string, string>;
}

interface UploadedImage {
  id: string; // temporary UUID
  file: File;
  preview: string; // base64 preview
  compressed?: Blob;
  cropped?: Blob;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  serverResponse?: {
    id: string;
    cdnUrl: string;
    serveUrl: string;
  };
}
```

### Upload Flow

1. **User selects file(s)** → Create temp ID, generate base64 preview
2. **Crop (optional)** → User opens crop modal → Apply crop → Update `cropped` blob
3. **Compression** → Auto-compress if size > 1MB or width > 1920px
4. **Upload** → POST to `/api/files` → Update progress → On success, save server response
5. **Form integration** → Parent component receives array of file IDs

### Parent Component Integration

```typescript
// Service Form example
const [imageIds, setImageIds] = useState<string[]>([]);

<EnhancedImageUploader
  value={imageIds}
  onChange={setImageIds}
  multiple={true}
  maxFiles={10}
  onError={(error) => toast.error(error)}
/>
```

## Error Handling

### Validation Layers

**1. Client-side Validation (before upload):**
- File type check: `ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]`
- Size check: `MAX_SIZE = 5 * 1024 * 1024` // 5MB
- Dimension check: `MAX_DIMENSIONS = 4000x4000px`, `MIN_DIMENSIONS = 100x100px`

**2. Processing Validation:**
- Crop: Aspect ratio lockable (16:9, 4:3, 1:1, free)
- Compression: Quality 85%, max 1920px width
- Format conversion: PNG → WEBP (if size > 2MB)

**3. Server Response Handling:**
- 400: Validation error → Show inline error message
- 413: Payload too large → Suggest compress
- 500: Server error → Show retry button
- Network error: Auto-retry 3x with exponential backoff

### Error Display

- Inline error message below upload zone
- Toast notification for critical errors
- Retry button for failed uploads
- Remove button to skip problematic file

### Recovery Options

- **"Skip & Continue"** - Skip failed file, continue with others
- **"Retry All"** - Retry all failed uploads
- **"Clear All"** - Reset and start over

## Implementation Plan

### Phase 1: Enhanced Image Upload Component

**Deliverables:**
1. `EnhancedImageUploader` component with:
   - Single/multiple mode support
   - Drag & drop functionality
   - Image compression
   - Progress tracking
   - Error handling

2. `ImageCropperModal` component with:
   - Aspect ratio presets
   - Zoom and pan
   - Before/after preview

3. `ImageGallery` component with:
   - Grid layout
   - Drag-to-reorder
   - Batch actions

**Dependencies:**
- `react-image-crop` - Cropping functionality
- `browser-image-compression` - Client-side compression
- `@dnd-kit/core` - Drag and drop
- Existing shadcn components

### Phase 2: Services Form Enhancement

**Database Schema Changes:**

```prisma
model Service {
  // ... existing fields

  images        File[]   @relation("ServiceImages")
  imageIds      String[] // Array of file IDs
}

model File {
  // ... existing fields

  services      Service[] @relation("ServiceImages")
}
```

**Form Structure Update:**

```typescript
// Tab 1: Basic
- Icon (select) - existing
- Name - existing
- Slug - existing
- Category - existing
+ **Images (NEW)** - EnhancedImageUploader with multiple=true
- Description - existing
- Badge - existing
- Stats - existing
- Order, ShowInMenu, IsIntegrated, Status - existing
```

**Migration Steps:**
1. Create Prisma migration for `imageIds` field
2. Update Service form UI with image upload field
3. Update Service form validation schema
4. Update API routes to handle image IDs
5. Remove `ServiceDialog` component (keep only full page)
6. Update DataTable "Add" button → Navigate to `/manage/services/new`

### Phase 3: Apply to Other Modules

**Modules to Update:**
1. **News** - Enhance existing ImageUploader with new features
2. **Events** - Enhance existing ImageUploader with new features
3. **Tourism** - Enhance existing ImageUploader with new features

**Categories:**
- No changes (keep color selector only, no image upload per requirement)

## Testing Strategy

### Component Testing (Vitest)

Test cases:
- Upload trigger with file selection
- Drag & drop functionality
- Validation (size, type, dimensions)
- Crop modal open/close
- Compression logic
- Error handling

### Integration Testing

Test cases:
- Upload to `/api/files` endpoint
- Response parsing
- Error recovery
- Multiple images upload sequence

### E2E Testing (Playwright)

Test scenarios:
- Complete flow: Select → Crop → Upload → Success
- Form integration: Images saved to database
- Edit mode: Existing images loaded correctly
- Delete: Images removed from MinIO + DB

### Manual Testing Checklist

- [ ] Upload single image (JPG, 2MB)
- [ ] Upload multiple images (5 files)
- [ ] Crop image before upload
- [ ] Upload large file (4MB) → verify compression
- [ ] Upload invalid type (PDF) → verify error
- [ ] Drag & drop file
- [ ] Remove image
- [ ] Edit existing service → verify images load
- [ ] Delete service → verify images deleted

## Deployment

### Environment Variables

No changes needed - using existing MinIO configuration:

```bash
MINIO_ENDPOINT=localhost:9000
MINIO_BUCKET=bandanaiera-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Deployment Steps

1. Run Prisma migration: `npx prisma migrate deploy`
2. Deploy enhanced `EnhancedImageUploader` component
3. Update Services form component
4. Remove `ServiceDialog` component
5. Restart backoffice server

### Rollback Plan

- Keep `imageIds` field optional (backward compatible)
- If issues: Revert to old Service form
- Can hide image upload field with feature flag

## Documentation

### Documentation to Create

1. **Component README**: `apps/backoffice/components/ui/image-upload/README.md`
   - Usage examples
   - Props documentation
   - Integration guide

2. **Migration Guide**: `docs/migrations/add-service-images.md`
   - Database changes
   - Code changes
   - Testing checklist

3. **User Guide**: `docs/user-guide/content-images.md`
   - How to upload images
   - Crop & compress features
   - Best practices

## Monitoring

**Metrics to Track:**
- Upload success rate
- Average image size after compression
- MinIO storage usage
- Upload duration (p50, p95, p99)

**Alerts:**
- Upload failure rate > 5%
- Average compressed size > 1.5MB
- MinIO storage > 80% capacity

## UI/UX Guidelines

### Popup vs Full Page Decision Tree

**Use Popup (Dialog) when:**
- 1-7 fields
- Simple form structure
- Quick actions (categories, tags)
- No complex validation

**Use Full Page when:**
- 8+ fields
- Complex form structure (tabs, sections)
- Rich content (images, long text)
- Complex validation logic

**Examples:**
- Categories (4-5 fields) → Dialog ✅
- Services (25+ fields) → Full Page ✅
- News (12 fields) → Full Page ✅

## Success Criteria

- [ ] Services form has image upload capability
- [ ] Image compression reduces size by 60-80%
- [ ] Upload success rate > 95%
- [ ] Consistent UI pattern across all modules
- [ ] No regression in existing functionality
- [ ] Average upload time < 3 seconds
- [ ] All tests passing (component, integration, E2E)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large images slow down landing page | High | Auto-compress to max 1MB, lazy loading |
| MinIO storage fills up | Medium | Monitor usage, set retention policy |
| Crop/compress fails on some browsers | Low | Graceful degradation, skip processing |
| Multiple images upload affects performance | Medium | Limit to 10 images, show progress |

## Future Enhancements

- Image gallery management (add captions, alt text)
- Bulk image upload from URL
- Image editing filters (brightness, contrast)
- AI-powered image tagging
- CDN integration for faster delivery
- Image optimization service (Sharp on server)

## References

- Existing ImageUploader: `apps/backoffice/components/news/ImageUploader.tsx`
- Upload API: `apps/backoffice/app/api/files/route.ts`
- Upload Service: `apps/backoffice/lib/file-upload/upload-service.ts`
- MinIO Client: `apps/backoffice/lib/storage/minio-client.ts`
