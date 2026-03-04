# News Image Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add image upload functionality to backoffice news form and display images on landing page

**Architecture:** Single upload component in backoffice that uploads to existing `/api/files` endpoint, stores `featuredImageId` on News model, and serves via `cdnUrl` in public API

**Tech Stack:** Next.js 15, React Hook Form, Prisma, MinIO/S3, Next.js Image component

---

## Task 1: Create ImageUploader Component

**Files:**
- Create: `apps/backoffice/components/news/ImageUploader.tsx`

**Step 1: Create the ImageUploader component**

```tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string | null;
  onChange: (fileId: string | null) => void;
  onError?: (error: string) => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploader({ value, onChange, onError }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, and WEBP files are allowed";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      onError?.(error);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "NEWS_IMAGE");
    formData.append("isPublic", "true");

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onChange(data.file.id);
      setPreviewUrl(data.file.cdnUrl);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      uploadFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      uploadFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Featured Image</label>

      {!value && !previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Drag & drop image here</p>
              <p className="text-xs text-muted-foreground">or click to browse</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (max 5MB)</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Export from index**

Create: `apps/backoffice/components/news/index.ts`

```ts
export { ImageUploader } from "./ImageUploader";
```

**Step 3: Commit**

```bash
git add apps/backoffice/components/news/
git commit -m "feat: add ImageUploader component for news images"
```

---

## Task 2: Integrate ImageUploader into News Form

**Files:**
- Modify: `apps/backoffice/app/(dashboard)/manage/news/news-client.tsx`

**Step 1: Add import**

Find the import section (around line 40-45) and add:

```tsx
import { ImageUploader } from "@/components/news";
```

**Step 2: Add state for preview URL**

After `[tagInput, setTagInput]` state (around line 113), add:

```tsx
const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
```

**Step 3: Load existing image on edit**

In the `openEditDialog` function, after `form.reset(...)` call (around line 180), add:

```tsx
setImagePreviewUrl(newsItem.featuredImage?.cdnUrl || null);
```

In the `openCreateDialog` function, after `setTags([])` (around line 159), add:

```tsx
setImagePreviewUrl(null);
```

**Step 4: Add ImageUploader to form**

Find the form content section (after the excerpt field, around line 423) and add:

```tsx
              <ImageUploader
                value={form.watch('featuredImageId')}
                onChange={(id) => form.setValue('featuredImageId', id || '')}
                onError={(error) => toast.error(error)}
              />
```

**Step 5: Clear preview on successful save**

In the `onSubmit` function, after `toast.success(...)` (around line 203), add:

```tsx
setImagePreviewUrl(null);
```

**Step 6: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/manage/news/news-client.tsx
git commit -m "feat: integrate ImageUploader into news form"
```

---

## Task 3: Update Public API to Include Image URL

**Files:**
- Modify: `apps/backoffice/app/api/public/news/route.ts`

**Step 1: Read the current file to understand structure**

Run: `cat apps/backoffice/app/api/public/news/route.ts`

**Step 2: Update the response mapping**

Find the select/query section and ensure the image field is mapped. The response should include:

```typescript
image: item.featuredImage?.cdnUrl || null,
```

**Step 3: Do the same for single news endpoint**

Modify: `apps/backoffice/app/api/public/news/[slug]/route.ts`

Ensure the same `image` field mapping exists.

**Step 4: Commit**

```bash
git add apps/backoffice/app/api/public/news/route.ts apps/backoffice/app/api/public/news/\[slug\]/route.ts
git commit -m "fix: include image url in public news API response"
```

---

## Task 4: Update Landing Page - Featured Section

**Files:**
- Modify: `apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx`

**Step 1: Add NextImage import**

At the top of the file, add:

```tsx
import Image from "next/image";
```

**Step 2: Update featured news card rendering**

Find the featured news section (around line 150-180). Replace the gradient placeholder div with:

```tsx
                  <div className="aspect-[16/9] w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="from-primary to-primary-hover absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                        <Newspaper className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                  </div>
```

**Step 3: Commit**

```bash
git add apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx
git commit -m "feat: render images in featured news section"
```

---

## Task 5: Update Landing Page - List Cards

**Files:**
- Modify: `apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx`

**Step 1: Update list card thumbnail**

Find the article list section (around line 240-245). Replace the thumbnail div with:

```tsx
                      <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lighter to-primary-light">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Newspaper className="h-9 w-9 text-primary/60" />
                          </div>
                        )}
                      </div>
```

**Step 2: Commit**

```bash
git add apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx
git commit -m "feat: render images in news list cards"
```

---

## Task 6: Update News Detail Page

**Files:**
- Modify: `apps/landing/app/informasi-publik/berita-terkini/[slug]/news-detail-client.tsx`

**Step 1: Read the current file structure**

Run: `cat apps/landing/app/informasi-publik/berita-terkini/[slug]/news-detail-client.tsx`

**Step 2: Add NextImage import**

```tsx
import Image from "next/image";
```

**Step 3: Add hero image section**

After the breadcrumb/title section, add a hero image that displays when `article.image` exists:

```tsx
      {/* Hero Image */}
      {article.image && (
        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto -mt-6 mb-8 overflow-hidden rounded-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>
      )}
```

**Step 4: Commit**

```bash
git add apps/landing/app/informasi-publik/berita-terkini/\[slug\]/news-detail-client.tsx
git commit -m "feat: render hero image on news detail page"
```

---

## Task 7: Update Next.js Image Config

**Files:**
- Modify: `apps/landing/next.config.ts`

**Step 1: Add backoffice URL to image domains**

Find the `images` configuration and add the backoffice URL:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '9000', // MinIO default port
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '**.amazonaws.com', // S3
    },
    // Add your production MinIO/CDN domain here
  ],
},
```

**Step 2: Commit**

```bash
git add apps/landing/next.config.ts
git commit -m "config: add image domains for news images"
```

---

## Task 8: Add Error Handling for Broken Images

**Files:**
- Modify: `apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx`

**Step 1: Create ImageWithFallback component**

Add before the main component:

```tsx
interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function ImageWithFallback({ src, alt, fill, className, sizes, priority }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null; // Let parent render fallback
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
```

**Step 2: Replace Image with ImageWithFallback**

Update both featured section and list cards to use `ImageWithFallback` instead of `Image`.

**Step 3: Commit**

```bash
git add apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx
git commit -m "feat: add fallback for broken news images"
```

---

## Testing Checklist

After completing all tasks:

```bash
# 1. Start backoffice
cd apps/backoffice && npm run dev

# 2. Start landing
cd apps/landing && npm run dev

# 3. Test upload flow:
#    - Navigate to /manage/news
#    - Click "New News"
#    - Drag & drop an image (JPG/PNG/WEBP under 5MB)
#    - Verify preview appears
#    - Fill other fields and submit
#    - Verify image appears in table

# 4. Test landing page:
#    - Navigate to /informasi-publik/berita-terkini
#    - Verify image shows in featured section (if featured=true)
#    - Verify image shows in list cards
#    - Click to detail page, verify hero image

# 5. Test fallback:
#    - Create news without image
#    - Verify gradient placeholder shows

# 6. Test error handling:
#    - Try uploading >5MB file
#    - Try uploading invalid file type
#    - Verify toast errors appear
```

---

## Summary

This plan implements image upload and display for news articles in 8 bite-sized tasks:

1. Create reusable ImageUploader component
2. Integrate into backoffice news form
3. Update public API to return image URLs
4. Display images in featured news section
5. Display images in list cards
6. Display hero image on detail page
7. Configure Next.js image domains
8. Add error handling for broken images
