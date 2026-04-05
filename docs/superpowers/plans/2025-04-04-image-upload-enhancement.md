# Image Upload Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an enhanced image upload component with crop, compression, and multiple images support, then integrate it into the Services form while establishing consistent UI patterns across backoffice.

**Architecture:**
1. Create reusable `EnhancedImageUploader` component using Dice UI/Shadcn components
2. Add client-side image processing (crop with `react-image-crop`, compression with `browser-image-compression`)
3. Integrate with existing MinIO upload infrastructure (`/api/files` endpoint)
4. Add `imageIds` field to Service model and update Services form
5. Remove ServiceDialog component (use full page only per UI guidelines: 8+ fields)

**Tech Stack:**
- UI: Dice UI/Shadcn components (Button, Dialog, Progress, Toast, Badge, Card)
- Image Processing: `react-image-crop`, `browser-image-compression`
- Drag & Drop: `@dnd-kit/core`, `@dnd-kit/sortable`
- Storage: MinIO (existing infrastructure)
- Database: PostgreSQL with Prisma ORM
- Testing: Vitest (unit), Playwright (E2E)

---

## Task 1: Install Required Dependencies

**Files:**
- Modify: `apps/backoffice/package.json`

- [ ] **Step 1: Install image processing dependencies**

```bash
cd apps/backoffice
pnpm add react-image-crop browser-image-compression @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: Packages added to dependencies

- [ ] **Step 2: Install type definitions**

```bash
pnpm add -D @types/react-image-crop
```

Expected: Type definitions installed

- [ ] **Step 3: Verify installation**

```bash
grep -E "react-image-crop|browser-image-compression|@dnd-kit" package.json
```

Expected output:
```
"react-image-crop": "^version",
"browser-image-compression": "^version",
"@dnd-kit/core": "^version",
"@dnd-kit/sortable": "^version",
"@dnd-kit/utilities": "^version"
```

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/package.json apps/backoffice/pnpm-lock.yaml
git commit -m "chore: install image upload dependencies

- react-image-crop: cropping functionality
- browser-image-compression: client-side compression
- @dnd-kit: drag and drop for multiple images"
```

---

## Task 2: Create Image Types and Interfaces

**Files:**
- Create: `apps/backoffice/lib/image-upload/types.ts`

- [ ] **Step 1: Write type definitions file**

```typescript
/**
 * Image Upload Types
 */

export type ImageUploadStatus = 'pending' | 'processing' | 'uploading' | 'success' | 'error';

export interface UploadedImage {
  id: string; // temporary UUID
  file: File;
  preview: string; // base64 preview
  compressed?: Blob;
  cropped?: Blob;
  status: ImageUploadStatus;
  progress: number;
  error?: string;
  serverResponse?: {
    id: string;
    cdnUrl: string;
    serveUrl: string;
  };
}

export interface ImageUploadOptions {
  maxSize?: number; // bytes, default 5MB
  maxWidth?: number; // pixels, default 1920
  maxHeight?: number; // pixels, default 1920
  quality?: number; // 0-1, default 0.85
  outputFormat?: 'original' | 'webp';
}

export interface CropOptions {
  aspectRatio?: number | null;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}
```

- [ ] **Step 2: Create validation utilities file**

```typescript
// apps/backoffice/lib/image-upload/validation.ts

import type { ImageValidationResult } from './types';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSIONS = 4000;
const MIN_DIMENSIONS = 100;

/**
 * Validate file type and size
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Hanya file JPG, PNG, dan WEBP yang diperbolehkan',
    };
  }

  // Check size
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Ukuran file maksimal 5MB',
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  file: File
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;

      if (width < MIN_DIMENSIONS || height < MIN_DIMENSIONS) {
        resolve({
          valid: false,
          error: `Ukuran minimal ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px`,
        });
        return;
      }

      if (width > MAX_DIMENSIONS || height > MAX_DIMENSIONS) {
        resolve({
          valid: false,
          error: `Ukuran maksimal ${MAX_DIMENSIONS}x${MAX_DIMENSIONS}px`,
        });
        return;
      }

      resolve({
        valid: true,
        dimensions: { width, height },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Gagal memuat gambar. Pastikan file tidak corrupt.',
      });
    };

    img.src = url;
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
```

- [ ] **Step 3: Create image processing utilities**

```typescript
// apps/backoffice/lib/image-upload/compression.ts

import imageCompression from 'browser-image-compression';
import type { ImageUploadOptions } from './types';

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.85,
};

/**
 * Compress image on client side
 */
export async function compressImage(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<Blob> {
  const compressionOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    maxSizeMB: options.maxSize ? options.maxSize / (1024 * 1024) : DEFAULT_OPTIONS.maxSizeMB,
    maxWidthOrHeight: options.maxWidth || options.maxHeight || 1920,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Convert file to blob
 */
export function fileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Blob([reader.result], { type: file.type }));
      } else {
        reject(new Error('Failed to convert file to blob'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate base64 preview
 */
export function generatePreview(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to generate preview'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/lib/image-upload/
git commit -m "feat: add image upload types and utilities

- Add types for image upload state management
- Add validation utilities (type, size, dimensions)
- Add compression utilities using browser-image-compression
- Add preview generation utilities"
```

---

## Task 3: Create Image Cropper Modal Component

**Files:**
- Create: `apps/backoffice/components/ui/image-upload/image-cropper-modal.tsx`

- [ ] **Step 1: Write test for cropper modal**

```typescript
// apps/backoffice/components/ui/image-upload/__tests__/image-cropper-modal.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageCropperModal } from '../image-cropper-modal';

describe('ImageCropperModal', () => {
  const mockOnCrop = jest.fn();
  const mockOnCancel = jest.fn();
  const mockImageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPreview = 'data:image/jpeg;base64,test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cropper modal when open', () => {
    render(
      <ImageCropperModal
        open={true}
        image={mockImageFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/crop image/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <ImageCropperModal
        open={false}
        image={mockImageFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText(/crop image/i)).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    render(
      <ImageCropperModal
        open={true}
        image={mockFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel|batal/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/backoffice
pnpm test __tests__/image-cropper-modal.test.tsx
```

Expected: FAIL - Component does not exist

- [ ] **Step 3: Implement ImageCropperModal component**

```typescript
// apps/backoffice/components/ui/image-upload/image-cropper-modal.tsx

"use client";

import { useState, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getCroppedImg } from "../lib/image-upload/crop-utils";

interface ImageCropperModalProps {
  open: boolean;
  image: File;
  preview: string;
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number | null;
}

export function ImageCropperModal({
  open,
  image,
  preview,
  onCrop,
  onCancel,
  aspectRatio = null,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState<string>(preview);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = aspectRatio
      ? makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height
        )
      : {
          unit: '%',
          width: 90,
          height: 90,
          x: 5,
          y: 5,
        };

    setCrop(centerCrop(initialCrop, width, height));
  };

  const handleCrop = useCallback(async () => {
    if (!completedCrop || !imageRef) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageRef, completedCrop);
      onCrop(croppedBlob);
    } catch (error) {
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, imageRef, onCrop]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to select the portion you want to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center bg-muted p-4 rounded-lg">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspectRatio={aspectRatio || undefined}
            keepSelection
          >
            <img
              ref={setImageRef}
              alt="Crop preview"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-w-full max-h-[500px]"
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleCrop} disabled={!completedCrop || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Create crop utility functions**

```typescript
// apps/backoffice/lib/image-upload/crop-utils.ts

import type { PixelCrop } from 'react-image-crop';

/**
 * Get cropped image as blob
 */
export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to crop image'));
      }
    }, 'image/jpeg');
  });
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd apps/backoffice
pnpm test __tests__/image-cropper-modal.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/backoffice/components/ui/image-upload/ apps/backoffice/lib/image-upload/crop-utils.ts
git commit -m "feat: add image cropper modal component

- Add ImageCropperModal with react-image-crop
- Support aspect ratio locking
- Add getCroppedImg utility function
- Add unit tests for cropper modal"
```

---

## Task 4: Create Enhanced Image Uploader Core Component

**Files:**
- Create: `apps/backoffice/components/ui/image-upload/enhanced-image-uploader.tsx`
- Create: `apps/backoffice/components/ui/image-upload/image-gallery.tsx`

- [ ] **Step 1: Write test for enhanced uploader**

```typescript
// apps/backoffice/components/ui/image-upload/__tests__/enhanced-image-uploader.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedImageUploader } from '../enhanced-image-uploader';

// Mock fetch for upload
global.fetch = jest.fn();

describe('EnhancedImageUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        file: {
          id: 'file-123',
          cdnUrl: 'https://cdn.example.com/image.jpg',
          serveUrl: '/api/files/file-123/serve',
        },
      }),
    });
  });

  it('should render upload zone', () => {
    render(
      <EnhancedImageUploader
        value={[]}
        onChange={jest.fn()}
        multiple={false}
      />
    );

    expect(screen.getByText(/upload image/i)).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    const onChange = jest.fn();
    render(
      <EnhancedImageUploader
        value={[]}
        onChange={onChange}
        multiple={false}
      />
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('textbox', { hidden: true }) || screen.querySelector('input[type="file"]');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/backoffice
pnpm test __tests__/enhanced-image-uploader.test.tsx
```

Expected: FAIL - Component does not exist

- [ ] **Step 3: Implement image gallery component**

```typescript
// apps/backoffice/components/ui/image-upload/image-gallery.tsx

"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UploadedImage } from '@/lib/image-upload/types';

interface ImageGalleryProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

function SortableImage({ image, onRemove }: { image: UploadedImage; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="overflow-hidden">
        <img
          src={image.preview}
          alt="Preview"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(image.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 rounded p-1 cursor-grab">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
        {image.status === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs p-1 text-center">
            Uploading {Math.round(image.progress)}%
          </div>
        )}
        {image.status === 'error' && (
          <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-xs p-1 text-center">
            {image.error || 'Upload failed'}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ImageGallery({ images, onRemove, onReorder }: ImageGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <SortableImage key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

- [ ] **Step 4: Implement enhanced image uploader (single file)**

This is a large file. Due to length, I'll provide the core implementation:

```typescript
// apps/backoffice/components/ui/image-upload/enhanced-image-uploader.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadedImage, ImageUploadOptions } from "@/lib/image-upload/types";
import { validateImageFile, validateImageDimensions, generatePreview } from "@/lib/image-upload/validation";
import { compressImage } from "@/lib/image-upload/compression";
import { v4 as uuidv4 } from 'uuid';

interface EnhancedImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  onError?: (error: string) => void;
  className?: string;
}

export function EnhancedImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  onError,
  className,
}: EnhancedImageUploaderProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, tempId: string) => {
    try {
      // Update status to uploading
      setImages((prev) =>
        prev.map((img) =>
          img.id === tempId ? { ...img, status: 'uploading', progress: 0 } : img
        )
      );

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'IMAGE');
      formData.append('isPublic', 'true');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      setImages((prev) =>
        prev.map((img) =>
          img.id === tempId
            ? {
                ...img,
                status: 'success',
                progress: 100,
                serverResponse: {
                  id: data.file.id,
                  cdnUrl: data.file.cdnUrl,
                  serveUrl: data.file.serveUrl,
                },
              }
            : img
        )
      );

      onChange([...value, data.file.id]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setImages((prev) =>
        prev.map((img) =>
          img.id === tempId ? { ...img, status: 'error', error: errorMessage } : img
        )
      );
      onError?.(errorMessage);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (multiple && value.length + fileArray.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    for (const file of fileArray) {
      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        continue;
      }

      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.valid) {
        toast({
          title: "Invalid dimensions",
          description: dimensionValidation.error,
          variant: "destructive",
        });
        continue;
      }

      // Generate preview
      const preview = await generatePreview(file);
      const tempId = uuidv4();

      const newImage: UploadedImage = {
        id: tempId,
        file,
        preview,
        status: 'pending',
        progress: 0,
      };

      setImages((prev) => [...prev, newImage]);

      // Compress if needed
      if (file.size > 1024 * 1024 || dimensionValidation.dimensions?.width && dimensionValidation.dimensions.width > 1920) {
        setImages((prev) => prev.map((img) => img.id === tempId ? { ...img, status: 'processing' } : img));

        try {
          const compressed = await compressImage(file);
          uploadFile(new File([compressed], file.name, { type: compressed.type }), tempId);
        } catch (error) {
          // Upload original if compression fails
          uploadFile(file, tempId);
        }
      } else {
        uploadFile(file, tempId);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      const fileIds = newImages
        .filter((img) => img.serverResponse)
        .map((img) => img.serverResponse!.id);
      onChange(fileIds);
      return newImages;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {images.length > 0 && (
        <ImageGallery
          images={images}
          onRemove={handleRemove}
          onReorder={(oldIndex, newIndex) => {
            const newImages = [...images];
            const [moved] = newImages.splice(oldIndex, 1);
            newImages.splice(newIndex, 0, moved);
            setImages(newImages);
          }}
        />
      )}

      {(!multiple || images.length < maxFiles) && (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Upload Image</p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Run tests**

```bash
cd apps/backoffice
pnpm test __tests__/enhanced-image-uploader.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/backoffice/components/ui/image-upload/
git commit -m "feat: add enhanced image uploader component

- Add EnhancedImageUploader with drag & drop
- Add ImageGallery with drag-to-reorder
- Support single and multiple image modes
- Auto-compression for large images
- Progress tracking and error handling"
```

---

## Task 5: Update Prisma Schema for Service Images

**Files:**
- Modify: `apps/backoffice/prisma/schema.prisma`

- [ ] **Step 1: Add imageIds field to Service model**

```prisma
model Service {
  id                  String               @id @default(cuid())
  slug                String               @unique
  icon                String
  name                String
  description         String
  categoryId          String
  category            ServiceCategory      @relation(fields: [categoryId], references: [id])
  badge               String?
  stats               String?
  showInMenu          Boolean              @default(true)
  order               Int                  @default(0)
  isIntegrated        Boolean              @default(false)
  detailedDescription String?
  requirements        Json?
  process             Json?
  duration            String?
  cost                String?
  contactInfo         Json?
  faqs                Json?
  downloadForms       Json?
  relatedServices     Json?
  status              ServiceStatus        @default(DRAFT)
  createdById         String
  createdBy           User                 @relation("ServiceCreator", fields: [createdById], references: [id])
  updatedById         String?
  updatedBy           User?                @relation("ServiceUpdater", fields: [updatedById], references: [id])
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  activityLogs        ServiceActivityLog[]

  // NEW: Add image support
  images              File[]               @relation("ServiceImages")
  imageIds            String[]             @default([])

  @@index([categoryId])
  @@index([status])
  @@index([showInMenu])
  @@index([order])
}
```

- [ ] **Step 2: Add inverse relation to File model**

```prisma
model File {
  // ... existing fields

  // NEW: Inverse relations for all content types
  services            Service[]            @relation("ServiceImages")
  news                News[]               @relation("NewsImages")
  events              Event[]              @relation("EventImages")
  tourismDestinations  TourismDestination[] @relation("TourismImages")

  // ... rest of File model
}
```

- [ ] **Step 3: Create migration**

```bash
cd apps/backoffice
npx prisma migrate dev --name add_service_images
```

Expected output:
```
The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20250404XXXXXX_add_service_images/
      └─ migration.sql

Running generate...
```

- [ ] **Step 4: Verify migration**

```bash
npx prisma migrate status
```

Expected: All migrations applied

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/prisma/schema.prisma apps/backoffice/prisma/migrations/
git commit -m "feat: add imageIds field to Service model

- Add imageIds string array field
- Add images relation to File model
- Create and apply migration"
```

---

## Task 6: Update Services API Routes

**Files:**
- Modify: `apps/backoffice/app/api/admin/services/route.ts`
- Modify: `apps/backoffice/app/api/admin/services/[id]/route.ts`

- [ ] **Step 1: Update POST route to handle imageIds**

```typescript
// apps/backoffice/app/api/admin/services/route.ts

// Find the POST handler and update the service creation:

export const POST = protectApiRoute({
  permissions: ["SERVICE_CREATE"] as Permission[],
  handler: async (req, { user }) => {
    try {
      const body = await req.json();

      // Add imageIds to the data
      const data = {
        ...body,
        imageIds: body.imageIds || [],
        // ... rest of existing fields
      };

      const service = await prisma.service.create({
        data: {
          ...data,
          createdById: user.id,
        },
        include: {
          category: true,
          images: true, // NEW: Include images
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(service, { status: 201 });
    } catch (error) {
      // ... error handling
    }
  },
});
```

- [ ] **Step 2: Update PATCH route in [id]/route.ts**

```typescript
// apps/backoffice/app/api/admin/services/[id]/route.ts

export const PATCH = protectApiRoute({
  permissions: ["SERVICE_UPDATE"] as Permission[],
  handler: async (req, { user }) => {
    try {
      const { id } = await params;
      const body = await req.json();

      const data = {
        ...body,
        imageIds: body.imageIds || [],
        updatedById: user.id,
      };

      const service = await prisma.service.update({
        where: { id },
        data,
        include: {
          category: true,
          images: true, // NEW: Include images
          createdBy: true,
          updatedBy: true,
        },
      });

      return NextResponse.json(service);
    } catch (error) {
      // ... error handling
    }
  },
});
```

- [ ] **Step 3: Test API endpoints**

```bash
# Test POST
curl -X POST http://localhost:3001/api/admin/services \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "name": "Test Service",
    "slug": "test-service",
    "description": "Test",
    "categoryId": "cat-id",
    "icon": "Users",
    "imageIds": []
  }'

# Test PATCH
curl -X PATCH http://localhost:3001/api/admin/services/service-id \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"imageIds": ["file-id-1", "file-id-2"]}'
```

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/api/admin/services/
git commit -m "feat: update services API to handle imageIds

- Update POST route to accept imageIds array
- Update PATCH route to handle imageIds updates
- Include images in API responses"
```

---

## Task 7: Update Service Form Component

**Files:**
- Modify: `apps/backoffice/components/admin/service-form.tsx`

- [ ] **Step 1: Add EnhancedImageUploader to Service form**

Find the "Basic" tab section in service-form.tsx and add the image upload field after the category field:

```typescript
// apps/backoffice/components/admin/service-form.tsx

import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

// In the Basic tab form, add after category field:

<FormField
  control={form.control}
  name="imageIds"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <EnhancedImageUploader
          value={field.value || []}
          onChange={field.onChange}
          multiple={true}
          maxFiles={10}
          onError={(error) => toast({
            title: "Upload error",
            description: error,
            variant: "destructive",
          })}
        />
      </FormControl>
      <FormDescription>
        Upload up to 10 images. Max 5MB per image. Images will be auto-compressed.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

- [ ] **Step 2: Update form validation schema**

```typescript
// apps/backoffice/components/admin/service-form.tsx

import { z } from "zod";

// Update the serviceFormSchema:
export const serviceFormSchema = z.object({
  // ... existing fields
  imageIds: z.array(z.string()).default([]),
  // ... rest of fields
});

// Update the default values:
const defaultValues: Partial<z.infer<typeof serviceFormSchema>> = {
  // ... existing defaults
  imageIds: [],
  // ... rest
};
```

- [ ] **Step 3: Load existing images in edit mode**

```typescript
// In the ServiceForm component, add useEffect to load images:

useEffect(() => {
  if (initialData?.images) {
    const loadedImages: UploadedImage[] = initialData.images.map((file) => ({
      id: uuidv4(),
      file: new File([], file.originalFilename),
      preview: file.cdnUrl || '',
      status: 'success' as const,
      progress: 100,
      serverResponse: {
        id: file.id,
        cdnUrl: file.cdnUrl || '',
        serveUrl: file.serveUrl || '',
      },
    }));
    setImages(loadedImages);
  }
}, [initialData]);
```

- [ ] **Step 4: Test the form**

```bash
# Start dev server
cd apps/backoffice
pnpm dev

# Navigate to http://localhost:3001/manage/services/new
# Try uploading images
```

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/components/admin/service-form.tsx
git commit -m "feat: add image upload to Service form

- Add EnhancedImageUploader component
- Support multiple images (max 10)
- Auto-compression before upload
- Load existing images in edit mode"
```

---

## Task 8: Remove ServiceDialog Component (Use Full Page Only)

**Files:**
- Delete: `apps/backoffice/components/admin/service-dialog.tsx`
- Modify: `apps/backoffice/components/admin/services-data-table.tsx`

- [ ] **Step 1: Update ServicesDataTable to navigate to full page**

```typescript
// apps/backoffice/components/admin/services-data-table.tsx

// Find the "Add Service" button and change it to navigate:

import { useRouter } from "next/navigation";

export function ServicesDataTable({ ... }: ServicesDataTableProps) {
  const router = useRouter();

  // Replace the dialog trigger with navigation:
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <Button onClick={() => router.push('/manage/services/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>
      {/* ... rest of component */}
    </div>
  );
}
```

- [ ] **Step 2: Delete ServiceDialog component**

```bash
rm apps/backoffice/components/admin/service-dialog.tsx
```

- [ ] **Step 3: Test navigation**

```bash
# Navigate to http://localhost:3001/manage/services
# Click "Add Service" button
# Should navigate to /manage/services/new (not open dialog)
```

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/components/admin/services-data-table.tsx
git rm apps/backoffice/components/admin/service-dialog.tsx
git commit -m "refactor: remove ServiceDialog, use full page only

- Remove ServiceDialog component
- Update ServicesDataTable to navigate to full page
- Consistent with UI guidelines: 8+ fields = full page"
```

---

## Task 9: Add Image Upload to News, Events, Tourism (Enhance Existing)

**Files:**
- Modify: `apps/backoffice/components/news/ImageUploader.tsx`
- Modify: `apps/backoffice/app/(dashboard)/manage/news/components/NewsForm.tsx`
- Modify: `apps/backoffice/app/(dashboard)/manage/events/components/EventForm.tsx`
- Modify: `apps/backoffice/app/(dashboard)/manage/tourism/components/TourismForm.tsx`

- [ ] **Step 1: Replace News ImageUploader with EnhancedImageUploader**

```typescript
// apps/backoffice/app/(dashboard)/manage/news/components/NewsForm.tsx

// Remove old import:
// import { ImageUploader } from "@/components/news/ImageUploader";

// Add new import:
import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

// Replace ImageUploader usage:
<FormField
  control={form.control}
  name="imageId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Featured Image</FormLabel>
      <FormControl>
        <EnhancedImageUploader
          value={field.value ? [field.value] : []}
          onChange={(ids) => field.onChange(ids[0] || null)}
          multiple={false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

- [ ] **Step 2: Update Event form similarly**

```typescript
// apps/backoffice/app/(dashboard)/manage/events/components/EventForm.tsx

import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

// Replace existing ImageUploader with EnhancedImageUploader
// Same pattern as News form
```

- [ ] **Step 3: Update Tourism form similarly**

```typescript
// apps/backoffice/app/(dashboard)/manage/tourism/components/TourismForm.tsx

import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

// Replace existing ImageUploader with EnhancedImageUploader
// Same pattern as News form
```

- [ ] **Step 4: Test all forms**

```bash
# Test each form:
# - http://localhost:3001/manage/news/new
# - http://localhost:3001/manage/events/new
# - http://localhost:3001/manage/tourism/new
# Try uploading images with crop and compression
```

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/app/(dashboard)/manage/news/components/NewsForm.tsx \
        apps/backoffice/app/(dashboard)/manage/events/components/EventForm.tsx \
        apps/backoffice/app/(dashboard)/manage/tourism/components/TourismForm.tsx

git commit -m "feat: enhance image upload in News, Events, Tourism forms

- Replace ImageUploader with EnhancedImageUploader
- Add crop and compression features
- Consistent UI across all content types"
```

---

## Task 10: Write E2E Tests with Playwright

**Files:**
- Create: `apps/backoffice/tests/e2e/image-upload.spec.ts`

- [ ] **Step 1: Write E2E test for image upload**

```typescript
// apps/backoffice/tests/e2e/image-upload.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Image Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should upload single image to service', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/services/new');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg');

    // Wait for upload to complete
    await page.waitForSelector('text=Upload successful', { timeout: 10000 });

    // Fill other required fields
    await page.fill('input[name="name"]', 'Test Service with Image');
    await page.fill('input[name="slug"]', 'test-service-image');
    await page.selectOption('select[name="categoryId"]', '1');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page).toHaveURL(/\/manage\/services/);
    await expect(page.locator('text=Test Service with Image')).toBeVisible();
  });

  test('should upload multiple images', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/services/new');

    const fileInput = page.locator('input[type="file"]');

    // Upload multiple files
    await fileInput.setInputFiles([
      'tests/fixtures/test-image-1.jpg',
      'tests/fixtures/test-image-2.jpg',
      'tests/fixtures/test-image-3.jpg',
    ]);

    // Wait for all uploads
    await page.waitForSelector('text=Upload successful', { timeout: 15000 });

    // Verify 3 images are shown in gallery
    const images = page.locator('[data-testid="image-gallery-item"]');
    await expect(images).toHaveCount(3);
  });

  test('should show validation error for invalid file type', async ({ page }) => {
    await page.goto('http://localhost:3001/manage/services/new');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/test-document.pdf');

    // Verify error message
    await expect(page.locator('text=JPG, PNG, and WEBP only')).toBeVisible();
  });
});
```

- [ ] **Step 2: Create test fixtures**

```bash
mkdir -p apps/backoffice/tests/fixtures
convert -size 800x600 xc:blue apps/backoffice/tests/fixtures/test-image.jpg
convert -size 800x600 xc:red apps/backoffice/tests/fixtures/test-image-1.jpg
convert -size 800x600 xc:green apps/backoffice/tests/fixtures/test-image-2.jpg
convert -size 800x600 xc:yellow apps/backoffice/tests/fixtures/test-image-3.jpg
echo "Test PDF" > apps/backoffice/tests/fixtures/test-document.pdf
```

- [ ] **Step 3: Run E2E tests**

```bash
cd apps/backoffice
pnpm playwright test image-upload.spec.ts
```

Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/tests/e2e/ apps/backoffice/tests/fixtures/
git commit -m "test: add E2E tests for image upload

- Test single image upload
- Test multiple image upload
- Test file validation
- Add test fixtures"
```

---

## Task 11: Create Component Documentation

**Files:**
- Create: `apps/backoffice/components/ui/image-upload/README.md`

- [ ] **Step 1: Write component README**

```markdown
# Enhanced Image Upload Components

Client-side image upload with crop, compression, and multiple file support.

## Components

### EnhancedImageUploader

Main component for uploading images with drag & drop, compression, and progress tracking.

#### Props

```typescript
interface EnhancedImageUploaderProps {
  value: string[];              // Array of uploaded file IDs
  onChange: (value: string[]) => void;
  multiple?: boolean;           // Allow multiple files (default: false)
  maxFiles?: number;            // Max files when multiple (default: 10)
  onError?: (error: string) => void;
  className?: string;
}
```

#### Usage

```tsx
import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

function MyForm() {
  const [imageIds, setImageIds] = useState<string[]>([]);

  return (
    <EnhancedImageUploader
      value={imageIds}
      onChange={setImageIds}
      multiple={true}
      maxFiles={10}
      onError={(error) => console.error(error)}
    />
  );
}
```

#### Features

- Drag & drop file upload
- Client-side compression (max 1MB, 1920px)
- Progress tracking
- Error handling
- Multiple file support (optional)
- Auto-validation (type, size, dimensions)

### ImageCropperModal

Modal for cropping images before upload.

#### Props

```typescript
interface ImageCropperModalProps {
  open: boolean;
  image: File;
  preview: string;
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number | null;  // null = free form
}
```

#### Usage

```tsx
import { ImageCropperModal } from "@/components/ui/image-upload/image-cropper-modal";

<ImageCropperModal
  open={showCropper}
  image={selectedFile}
  preview={previewUrl}
  onCrop={(blob) => {
    // Handle cropped image
  }}
  onCancel={() => setShowCropper(false)}
  aspectRatio={16 / 9}  // Optional: lock aspect ratio
/>
```

### ImageGallery

Gallery component for displaying uploaded images with drag-to-reorder.

#### Props

```typescript
interface ImageGalleryProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}
```

## Utilities

### Validation

```typescript
import { validateImageFile, validateImageDimensions } from "@/lib/image-upload/validation";

// Validate file type and size
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Validate dimensions
const dimValidation = await validateImageDimensions(file);
if (!dimValidation.valid) {
  console.error(dimValidation.error);
}
```

### Compression

```typescript
import { compressImage } from "@/lib/image-upload/compression";

const compressed = await compressImage(file, {
  maxSize: 1024 * 1024,  // 1MB
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
});
```

## Integration with Forms

### React Hook Form

```tsx
import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";
import { useForm } from "react-hook-form";

function MyForm() {
  const { control } = useForm({
    defaultValues: {
      imageIds: [],
    },
  });

  return (
    <FormField
      control={control}
      name="imageIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Images</FormLabel>
          <FormControl>
            <EnhancedImageUploader
              value={field.value}
              onChange={field.onChange}
              multiple={true}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
```

## API Integration

The component uploads to the existing `/api/files` endpoint:

```
POST /api/files
Content-Type: multipart/form-data

{
  file: File,
  category: "IMAGE",
  isPublic: "true"
}

Response:
{
  file: {
    id: string,
    cdnUrl: string,
    serveUrl: string
  }
}
```

## Best Practices

1. **Always validate on server** - Client validation is UX enhancement only
2. **Use multiple mode sparingly** - Multiple images increase complexity
3. **Set reasonable limits** - Default 10 files max, 5MB per file
4. **Show progress** - Upload can take time on slow connections
5. **Handle errors gracefully** - Always provide onError callback
6. **Compress before upload** - Reduces bandwidth and storage costs

## Troubleshooting

### Uploads failing silently

Check browser console for errors. Common issues:
- CORS errors
- File too large
- Invalid file type
- Server error (check `/api/files` logs)

### Compression not working

Ensure `browser-image-compression` is installed. Check browser compatibility (requires modern browser with Web Worker support).

### Crop modal not showing

Ensure `react-image-crop` CSS is imported:

```tsx
import "react-image-crop/dist/ReactCrop.css";
```

## Performance Considerations

- **Compression**: Runs in Web Worker, doesn't block UI
- **Preview generation**: Uses FileReader, can be slow for large files
- **Multiple uploads**: Uploads sequentially to avoid server overload
- **Gallery rendering**: Virtualize for >20 images (not implemented)
```

- [ ] **Step 2: Commit**

```bash
git add apps/backoffice/components/ui/image-upload/README.md
git commit -m "docs: add comprehensive component documentation

- Usage examples for all components
- Integration guides
- Best practices
- Troubleshooting section"
```

---

## Task 12: Create Migration Guide

**Files:**
- Create: `docs/migrations/add-service-images.md`

- [ ] **Step 1: Write migration guide**

```markdown
# Service Images Migration Guide

## Overview

This migration adds image upload capability to the Services module.

## Database Changes

### Schema Changes

```prisma
model Service {
  // ... existing fields

  images  File[]   @relation("ServiceImages")
  imageIds String[] @default([])
}

model File {
  // ... existing fields

  services Service[] @relation("ServiceImages")
}
```

### Migration

```bash
cd apps/backoffice
npx prisma migrate dev --name add_service_images
```

## Code Changes

### 1. Service Form

**Before:**
```tsx
// No image upload
```

**After:**
```tsx
import { EnhancedImageUploader } from "@/components/ui/image-upload/enhanced-image-uploader";

<FormField
  control={form.control}
  name="imageIds"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <EnhancedImageUploader
          value={field.value || []}
          onChange={field.onChange}
          multiple={true}
          maxFiles={10}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

### 2. API Routes

**Before:**
```typescript
// No imageIds handling
```

**After:**
```typescript
const data = {
  ...body,
  imageIds: body.imageIds || [],
};
```

### 3. ServiceDialog Removal

**Before:**
```tsx
import { ServiceDialog } from "@/components/admin/service-dialog";

<ServiceDialog open={showDialog} onClose={() => setShowDialog(false)} />
```

**After:**
```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
<Button onClick={() => router.push('/manage/services/new')}>
  Add Service
</Button>
```

## Testing Checklist

- [ ] Migration applies successfully
- [ ] Can create service with images
- [ ] Can edit service and add/remove images
- [ ] Images display on landing page
- [ ] ServiceDialog removed
- [ ] Navigation goes to full page form
- [ ] Image compression works
- [ ] Multiple image upload works
- [ ] Drag & drop works

## Rollback Plan

If issues occur:

1. Revert code changes:
   ```bash
   git revert <commit-hash>
   ```

2. Rollback migration:
   ```bash
   npx prisma migrate resolve --rolled-back add_service_images
   ```

3. Restart servers

## Post-Migration

1. **Update documentation** - Add image upload to user guide
2. **Monitor storage** - Check MinIO usage
3. **Train users** - Demo new image upload features
4. **Clean up old code** - Remove deprecated imports

## Known Issues

- Large images (>5MB) rejected before upload
- Crop modal requires CSS import
- Compression not supported in very old browsers

## Future Enhancements

- [ ] Image gallery management (captions, alt text)
- [ ] Bulk upload from URL
- [ ] Image editing filters
- [ ] AI-powered tagging
```

- [ ] **Step 2: Commit**

```bash
git add docs/migrations/add-service-images.md
git commit -m "docs: add migration guide for service images

- Database changes
- Code changes with before/after examples
- Testing checklist
- Rollback procedures"
```

---

## Task 13: Update Public API to Include Service Images

**Files:**
- Modify: `apps/backoffice/app/api/public/services/[slug]/route.ts`
- Modify: `apps/backoffice/app/api/public/services/route.ts`

- [ ] **Step 1: Update public service detail API**

```typescript
// apps/backoffice/app/api/public/services/[slug]/route.ts

export const GET = protectApiRoute({
  permissions: [] as Permission[],
  handler: async (req) => {
    try {
      const { slug } = await params;

      const service = await prisma.service.findUnique({
        where: { slug },
        include: {
          category: true,
          images: true,  // NEW: Include images
        },
      });

      if (!service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      return NextResponse.json(service);
    } catch (error) {
      // ... error handling
    }
  },
});
```

- [ ] **Step 2: Update public service list API**

```typescript
// apps/backoffice/app/api/public/services/route.ts

export const GET = protectApiRoute({
  permissions: [] as Permission[],
  handler: async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      // ... existing code

      const services = await prisma.service.findMany({
        where,
        include: {
          category: true,
          images: true,  // NEW: Include images
        },
        orderBy,
        take: limit,
        skip: (page - 1) * pageSize,
      });

      return NextResponse.json({
        services,
        pagination: { page, pageSize, total },
      });
    } catch (error) {
      // ... error handling
    }
  },
});
```

- [ ] **Step 3: Test public APIs**

```bash
# Test public API with images
curl http://localhost:3001/api/public/services?showInMenu=true | jq '.services[0].images'

curl http://localhost:3001/api/public/services/some-slug | jq '.images'
```

Expected: Images array included in response

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/api/public/services/
git commit -m "feat: include images in public services API

- Update service detail API to include images
- Update service list API to include images
- Landing page can now display service images"
```

---

## Task 14: Update Landing Page to Display Service Images

**Files:**
- Modify: `apps/landing/lib/services-data.ts` (or equivalent data fetching)
- Modify: `apps/landing/components/landing/sections/services-section-client.tsx`

- [ ] **Step 1: Update service data fetching to include images**

```typescript
// apps/landing/lib/services-data.ts

// When fetching services from API, ensure images are included:
const response = await fetch(`${BACKOFFICE_URL}/api/public/services?showInMenu=true`);
const data = await response.json();

// Services should now have images array
```

- [ ] **Step 2: Update service card to display images**

```typescript
// apps/landing/components/landing/sections/services-section-client.tsx

function ServiceCard({ service, index, tAccess }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <a href={service.href} className="...">
      {/* If service has images, display first image */}
      {service.images && service.images.length > 0 && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={service.images[0].cdnUrl}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Rest of card content */}
      <div className="p-6">
        <div className="bg-primary-lighter text-primary mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
          <Icon size={28} strokeWidth={2} />
        </div>
        {/* ... */}
      </div>
    </a>
  );
}
```

- [ ] **Step 3: Test landing page display**

```bash
# Navigate to landing page
# Services with images should display them
# Services without images should show icon only
```

- [ ] **Step 4: Commit**

```bash
git add apps/landing/
git commit -m "feat: display service images on landing page

- Update service data fetching to include images
- Display first image in service card
- Fallback to icon if no images"
```

---

## Task 15: Final Integration Testing

**Files:**
- No new files

- [ ] **Step 1: Run full test suite**

```bash
cd apps/backoffice

# Unit tests
pnpm test

# E2E tests
pnpm playwright test

# Type checking
pnpm tsc --noEmit
```

Expected: All tests pass, no type errors

- [ ] **Step 2: Manual testing checklist**

```
Service Form:
- [ ] Create new service with single image
- [ ] Create service with multiple images
- [ ] Crop image before upload
- [ ] Upload large image (>1MB) - verify compression
- [ ] Remove image
- [ ] Reorder images (drag & drop)
- [ ] Edit existing service - images load correctly
- [ ] Delete service - images removed

News/Events/Tourism Forms:
- [ ] Upload image with crop
- [ ] Compression works
- [ ] Edit mode loads images

Landing Page:
- [ ] Services display images correctly
- [ ] Services without images show icons
- [ ] Images load quickly (compressed)

API:
- [ ] Public API includes images
- [ ] Admin API handles imageIds
- [ ] File upload works
```

- [ ] **Step 3: Performance check**

```bash
# Check MinIO storage
docker exec minio mc ls bandanaiera-bucket/

# Check average image size
# Should be < 1MB after compression
```

- [ ] **Step 4: Create release notes**

```markdown
# Image Upload Enhancement - Release Notes

## Features Added

- Enhanced image upload component with crop and compression
- Multiple image support (up to 10 images)
- Drag & drop file upload
- Client-side image compression (max 1MB, 1920px)
- Image gallery with drag-to-reorder
- Integrated with Services, News, Events, and Tourism forms

## UI Improvements

- Removed ServiceDialog (use full page only)
- Consistent UI pattern: 1-7 fields = popup, 8+ fields = full page
- Better upload progress feedback
- Improved error messages

## Performance

- Images auto-compressed before upload
- Reduced bandwidth usage
- Faster landing page load times

## Breaking Changes

- ServiceDialog component removed
- Service form now uses full page only
- imageIds field added to Service model (optional)

## Migration Required

- Run Prisma migration: `npx prisma migrate deploy`
- Update any custom Service forms to use full page

## Documentation

- Component README: `apps/backoffice/components/ui/image-upload/README.md`
- Migration Guide: `docs/migrations/add-service-images.md`
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: complete image upload enhancement

- All tests passing
- Manual testing complete
- Documentation updated
- Ready for production"
```

---

## Task 16: Tag Release

**Files:**
- No new files

- [ ] **Step 1: Create git tag**

```bash
git tag -a v1.1.0-image-upload -m "Image Upload Enhancement

Features:
- Enhanced image upload with crop and compression
- Multiple image support
- Services form with images
- Consistent UI patterns
- Performance improvements"
```

- [ ] **Step 2: Push tag**

```bash
git push origin main --tags
```

- [ ] **Step 3: Deploy to production**

```bash
# Deploy instructions (project-specific)
# Example:
# kubectl apply -f k8s/
# or
# ./deploy.sh production
```

---

## Completion Checklist

- [ ] All dependencies installed
- [ ] Image types and utilities created
- [ ] ImageCropperModal component implemented
- [ ] EnhancedImageUploader component implemented
- [ ] Prisma schema updated and migrated
- [ ] Services API routes updated
- [ ] Service form updated with image upload
- [ ] ServiceDialog removed (full page only)
- [ ] News, Events, Tourism forms enhanced
- [ ] E2E tests written and passing
- [ ] Component documentation complete
- [ ] Migration guide created
- [ ] Public APIs updated
- [ ] Landing page displays service images
- [ ] Full test suite passing
- [ ] Manual testing complete
- [ ] Release tagged

---

## Success Criteria

✅ Services form has image upload capability
✅ Image compression reduces size by 60-80%
✅ Upload success rate > 95%
✅ Consistent UI pattern across all modules (1-7 fields = popup, 8+ = full page)
✅ No regression in existing functionality
✅ Average upload time < 3 seconds
✅ All tests passing (component, integration, E2E)
