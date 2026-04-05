# Image Upload Components

Comprehensive, production-ready image upload system for Next.js applications with React Hook Form integration, drag-and-drop support, image cropping, and compression.

## Overview

The image upload system provides a complete solution for handling image uploads in your application with features including:

- **Drag-and-drop upload** with visual feedback
- **Client-side compression** to reduce file sizes before upload
- **Image cropping** with aspect ratio support
- **Progress tracking** for upload status
- **Gallery view** with drag-to-reorder
- **TypeScript support** with full type safety
- **React Hook Form integration** for seamless form handling
- **Accessibility** with keyboard navigation and ARIA labels

## Components

### EnhancedImageUploader

The main component that handles the complete image upload workflow.

#### Props

```typescript
interface EnhancedImageUploaderProps {
  value: string[];              // Array of uploaded file IDs
  onChange: (ids: string[]) => void;  // Callback when IDs change
  multiple?: boolean;           // Allow multiple images (default: false)
  category?: string;            // File category for API (default: 'SERVICES')
  maxSize?: number;             // Max file size in bytes (default: 5MB)
  maxWidth?: number;            // Max width for compression (default: 1920px)
  quality?: number;             // Compression quality 0-1 (default: 0.85)
  disabled?: boolean;           // Disable the uploader (default: false)
}
```

#### Features

- **Drag-and-drop**: Drop images directly onto the upload area
- **File validation**: Automatic validation of file type, size, and dimensions
- **Progress tracking**: Real-time upload progress for each image
- **Error handling**: User-friendly error messages for failed uploads
- **Cancellation**: Abort uploads in progress
- **Compression**: Automatic client-side compression for large images

#### Basic Usage

```tsx
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';

function MyForm() {
  const [imageIds, setImageIds] = useState<string[]>([]);

  return (
    <EnhancedImageUploader
      value={imageIds}
      onChange={setImageIds}
      multiple={true}
      category="SERVICES"
      maxSize={5 * 1024 * 1024}  // 5MB
      maxWidth={1920}
      quality={0.85}
    />
  );
}
```

#### React Hook Form Integration

```tsx
import { useForm } from 'react-hook-form';
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  imageIds: z.array(z.string()).min(1, 'At least one image is required'),
});

function MyForm() {
  const { control, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      imageIds: [],
    },
  });

  return (
    <form>
      <EnhancedImageUploader
        value={control._formValues.imageIds || []}
        onChange={(ids) => setValue('imageIds', ids)}
        multiple={true}
      />
    </form>
  );
}
```

### ImageCropperModal

Modal component for cropping images before upload.

#### Props

```typescript
interface ImageCropperModalProps {
  open: boolean;                    // Whether the modal is open
  image: File;                      // The image file to crop
  preview: string;                  // Base64 preview of the image
  onCrop: (croppedBlob: Blob) => void;  // Callback when crop is applied
  onCancel: () => void;             // Callback when modal is cancelled
  aspectRatio?: number | null;      // Optional aspect ratio (e.g., 16/9)
}
```

#### Features

- **Interactive cropping**: Drag to adjust crop area
- **Aspect ratio lock**: Enforce specific aspect ratios
- **Visual feedback**: Real-time preview of crop area
- **Keyboard support**: Escape to cancel, Enter to apply

#### Usage Example

```tsx
import { useState } from 'react';
import { ImageCropperModal } from '@/components/ui/image-upload/image-cropper-modal';
import { generatePreview } from '@/lib/image-upload/compression';

function ImageUploader() {
  const [cropModal, setCropModal] = useState<{
    open: boolean;
    image: File | null;
    preview: string;
  }>({
    open: false,
    image: null,
    preview: '',
  });

  const handleFileSelect = async (file: File) => {
    const preview = await generatePreview(file);
    setCropModal({
      open: true,
      image: file,
      preview,
    });
  };

  const handleCrop = async (croppedBlob: Blob) => {
    // Handle the cropped image
    const croppedFile = new File([croppedBlob], 'cropped.jpg', {
      type: 'image/jpeg',
    });
    // Upload or process the cropped file
    setCropModal({ open: false, image: null, preview: '' });
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />
      <ImageCropperModal
        open={cropModal.open}
        image={cropModal.image!}
        preview={cropModal.preview}
        onCrop={handleCrop}
        onCancel={() => setCropModal({ open: false, image: null, preview: '' })}
        aspectRatio={16 / 9}  // Optional: lock to 16:9 aspect ratio
      />
    </>
  );
}
```

### ImageGallery

Displays uploaded and uploading images with drag-to-reorder support.

#### Props

```typescript
interface ImageGalleryProps {
  uploadedIds: string[];           // Already uploaded file IDs
  uploadingImages: UploadedImage[]; // Currently uploading images
  onRemove?: (id: string) => void;  // Callback when image is removed
  onReorder?: (oldIndex: number, newIndex: number) => void;  // Callback when reordered
  multiple?: boolean;               // Allow multiple images (default: true)
}
```

#### Features

- **Drag-to-reorder**: Reorder images by dragging
- **Upload progress**: Visual progress indicators for uploading images
- **Error display**: Show error messages for failed uploads
- **Remove images**: Delete images with a single click
- **Responsive grid**: Adapts to different screen sizes

#### Usage Example

```tsx
import { ImageGallery } from '@/components/ui/image-upload/image-gallery';
import type { UploadedImage } from '@/lib/image-upload/types';

function MyGallery() {
  const [uploadedIds, setUploadedIds] = useState<string[]>(['file-id-1', 'file-id-2']);
  const [uploadingImages, setUploadingImages] = useState<UploadedImage[]>([]);

  return (
    <ImageGallery
      uploadedIds={uploadedIds}
      uploadingImages={uploadingImages}
      onRemove={(id) => setUploadedIds(prev => prev.filter(imgId => imgId !== id))}
      onReorder={(oldIndex, newIndex) => {
        const newIds = [...uploadedIds];
        const [removed] = newIds.splice(oldIndex, 1);
        newIds.splice(newIndex, 0, removed);
        setUploadedIds(newIds);
      }}
      multiple={true}
    />
  );
}
```

## Utilities

### Validation

Location: `@/lib/image-upload/validation`

```typescript
import { validateImageFile, validateImageDimensions, getImageDimensions } from '@/lib/image-upload/validation';

// Validate file type and size
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Validate image dimensions
const dimensionValidation = await validateImageDimensions(file);
if (!dimensionValidation.valid) {
  console.error(dimensionValidation.error);
}

// Get image dimensions
const dimensions = await getImageDimensions(file);
console.log(`${dimensions.width}x${dimensions.height}`);
```

#### Validation Rules

- **Allowed types**: JPEG, JPG, PNG, WEBP
- **Max file size**: 5MB (configurable)
- **Min dimensions**: 100x100px
- **Max dimensions**: 4000x4000px

### Compression

Location: `@/lib/image-upload/compression`

```typescript
import { compressImage, generatePreview } from '@/lib/image-upload/compression';

// Compress image
const compressed = await compressImage(file, {
  maxSize: 1024 * 1024,      // 1MB
  maxWidth: 1920,             // 1920px
  quality: 0.85,              // 85% quality
});

// Generate base64 preview
const preview = await generatePreview(file);
```

#### Compression Options

```typescript
interface ImageUploadOptions {
  maxSize?: number;      // Maximum file size in bytes (default: 5MB)
  maxWidth?: number;     // Maximum width in pixels (default: 1920)
  maxHeight?: number;    // Maximum height in pixels (default: 1920)
  quality?: number;      // Compression quality 0-1 (default: 0.85)
  outputFormat?: 'original' | 'webp';  // Output format (default: 'original')
}
```

## API Integration

### Upload Endpoint

The components integrate with the `/api/files` endpoint for uploading images.

#### Request

```typescript
POST /api/files
Content-Type: multipart/form-data

{
  file: File,           // The image file
  category: string,     // File category (e.g., 'SERVICES', 'NEWS', 'EVENTS')
  isPublic: string,     // 'true' or 'false'
  expiresAt?: string    // Optional ISO date string
}
```

#### Response

```typescript
{
  file: {
    id: string;         // File ID
    filename: string;   // Original filename
    mimeType: string;   // File MIME type
    size: number;       // File size in bytes
    cdnUrl: string;     // CDN URL
    serveUrl: string;   // Serve URL
    category: string;   // File category
    isPublic: boolean;  // Whether file is public
  }
}
```

#### Authentication

The endpoint requires `FILE_UPLOAD_OWN` permission and is protected by the authentication system.

### Serving Images

Images are served via the `/api/files/{id}/serve` endpoint:

```tsx
<img src={`/api/files/${fileId}/serve`} alt="Uploaded image" />
```

## Integration Examples

### Complete Form Integration

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  imageIds: z.array(z.string()).min(1, 'At least one image is required'),
});

type FormData = z.infer<typeof schema>;

export function ServiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      imageIds: [],
    },
  });

  const imageIds = watch('imageIds');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create service');

      toast.success('Service created successfully');
    } catch (error) {
      toast.error('Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Input id="description" {...register('description')} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label>Images</label>
        <EnhancedImageUploader
          value={imageIds}
          onChange={(ids) => setValue('imageIds', ids)}
          multiple={true}
          category="SERVICES"
        />
        {errors.imageIds && (
          <p className="text-red-500">{errors.imageIds.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Service'}
      </Button>
    </form>
  );
}
```

### With Image Cropping

```tsx
'use client';

import { useState } from 'react';
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';
import { ImageCropperModal } from '@/components/ui/image-upload/image-cropper-modal';
import { generatePreview } from '@/lib/image-upload/compression';

export function ImageUploaderWithCropping() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [cropModal, setCropModal] = useState<{
    open: boolean;
    image: File | null;
    preview: string;
  }>({
    open: false,
    image: null,
    preview: '',
  });

  const handleCrop = async (croppedBlob: Blob) => {
    // Create a new file from the cropped blob
    const croppedFile = new File([croppedBlob], 'cropped.jpg', {
      type: 'image/jpeg',
    });

    // Upload the cropped file
    const formData = new FormData();
    formData.append('file', croppedFile);
    formData.append('category', 'SERVICES');
    formData.append('isPublic', 'true');

    const response = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setImageIds([...imageIds, result.file.id]);

    // Close modal
    setCropModal({ open: false, image: null, preview: '' });
  };

  return (
    <>
      <EnhancedImageUploader
        value={imageIds}
        onChange={setImageIds}
        multiple={true}
      />
      <ImageCropperModal
        open={cropModal.open}
        image={cropModal.image!}
        preview={cropModal.preview}
        onCrop={handleCrop}
        onCancel={() => setCropModal({ open: false, image: null, preview: '' })}
        aspectRatio={16 / 9}
      />
    </>
  );
}
```

## Best Practices

### 1. Error Handling

Always handle errors gracefully and provide user feedback:

```tsx
const handleUpload = async (file: File) => {
  try {
    const result = await uploadFile(file);
    toast.success('Image uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    toast.error(error instanceof Error ? error.message : 'Upload failed');
  }
};
```

### 2. Loading States

Show loading indicators during uploads:

```tsx
{isUploading && (
  <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>Uploading...</span>
  </div>
)}
```

### 3. File Validation

Validate files on the client side before upload:

```tsx
const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    toast.error('Only JPG, PNG, and WEBP files are allowed');
    return false;
  }

  if (file.size > maxSize) {
    toast.error('File size must be less than 5MB');
    return false;
  }

  return true;
};
```

### 4. Cleanup

Always clean up object URLs to prevent memory leaks:

```tsx
useEffect(() => {
  return () => {
    // Cleanup on unmount
    uploadQueue.forEach(img => {
      if (img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
  };
}, [uploadQueue]);
```

### 5. Accessibility

Ensure keyboard navigation and screen reader support:

```tsx
<button
  onClick={handleRemove}
  aria-label="Remove image"
  data-testid="remove-image"
>
  <XIcon />
</button>
```

### 6. Performance

- Compress images before upload
- Use lazy loading for image galleries
- Implement pagination for large galleries
- Use Web Workers for heavy processing

```tsx
// Enable web worker for compression
const compressed = await compressImage(file, {
  maxSize: 1024 * 1024,
  maxWidth: 1920,
  quality: 0.85,
  useWebWorker: true,  // Use web worker for better performance
});
```

## Troubleshooting

### Images not uploading

**Problem**: Images fail to upload with no error message.

**Solution**:
1. Check browser console for network errors
2. Verify `/api/files` endpoint is accessible
3. Check authentication permissions
4. Ensure file size is within limits

```bash
# Check API endpoint
curl -X POST http://localhost:3000/api/files \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.jpg" \
  -F "category=SERVICES" \
  -F "isPublic=true"
```

### Compression not working

**Problem**: Images are not being compressed before upload.

**Solution**:
1. Check if `browser-image-compression` is installed
2. Verify compression options are correct
3. Check browser console for errors
4. Ensure file size exceeds compression threshold

```tsx
// Debug compression
const compressed = await compressImage(file, {
  maxSize: 1024 * 1024,
  maxWidth: 1920,
  quality: 0.85,
});
console.log('Original size:', file.size);
console.log('Compressed size:', compressed.size);
console.log('Compression ratio:', (compressed.size / file.size) * 100, '%');
```

### Cropping issues

**Problem**: Cropped images are low quality or incorrect size.

**Solution**:
1. Check canvas dimensions in `getCroppedImg`
2. Verify scale calculations
3. Ensure output format is correct
4. Check browser support for canvas API

```tsx
// Debug cropping
const canvas = document.createElement('canvas');
console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
console.log('Crop dimensions:', crop.width, 'x', crop.height);
```

### Drag and drop not working

**Problem**: Drag and drop functionality doesn't work.

**Solution**:
1. Ensure event handlers are attached
2. Check `preventDefault()` is called
3. Verify drag events are not being blocked
4. Check CSS pointer-events

```tsx
// Debug drag events
const handleDrop = (e: React.DragEvent) => {
  console.log('Drop event:', e);
  console.log('Files:', e.dataTransfer.files);
  e.preventDefault();
  // ... rest of handler
};
```

### Memory leaks

**Problem**: Application slows down after uploading many images.

**Solution**:
1. Revoke object URLs after use
2. Clean up event listeners
3. Clear upload queue after completion
4. Use React.memo for expensive components

```tsx
useEffect(() => {
  return () => {
    // Cleanup
    previews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  };
}, [previews]);
```

## Performance Considerations

### Client-Side Compression

- **Web Workers**: Compression runs in a web worker to avoid blocking the main thread
- **Threshold**: Only compress images larger than 1MB or wider than 1920px
- **Quality**: Default quality of 0.85 provides good balance between size and quality

### Upload Optimization

- **Parallel uploads**: Multiple images upload simultaneously
- **Cancellation**: Uploads can be aborted to free resources
- **Progress tracking**: Real-time progress updates improve UX
- **Queue management**: Efficient queue system prevents memory issues

### Rendering Performance

- **Virtual scrolling**: For large galleries, consider virtual scrolling
- **Lazy loading**: Images load as needed
- **Memoization**: Components use React.memo to prevent unnecessary re-renders
- **Debouncing**: Search and filter operations are debounced

### Memory Management

- **Object URL cleanup**: All blob URLs are revoked after use
- **Abort controllers**: Uploads are properly cancelled on unmount
- **Queue limits**: Maximum of 10 concurrent uploads
- **Preview size**: Previews are limited to 100KB to reduce memory usage

## Type Definitions

All components are fully typed with TypeScript. Import types from:

```typescript
import type {
  UploadedImage,
  ImageUploadOptions,
  ImageValidationResult,
  ImageUploadStatus,
} from '@/lib/image-upload/types';
```

## Testing

Components are tested with Vitest and React Testing Library. Run tests with:

```bash
npm test
```

See test files in `__tests__/` for examples.

## License

MIT
