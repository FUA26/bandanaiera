# News Image Management Design

**Date:** 2026-03-04
**Status:** Approved
**Approach:** Single Upload Component (Pendekatan 1)

## Overview

Add image upload and display functionality for news articles in both backoffice and landing page. Users can upload a featured image when creating/editing news, and the image will be displayed on the landing page.

## Requirements

- Upload image via drag & drop or file browser in backoffice news form
- Display images on landing page (featured section and list cards)
- Fallback to gradient placeholder if no image
- Support common image formats (JPG, PNG, WEBP)
- Max file size: 5MB

## Architecture

### Backoffice: ImageUploader Component

**Location:** `apps/backoffice/components/news/ImageUploader.tsx`

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ Featured Image                                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  or  [Browse Files]           │
│  │     Drag & Drop         │                                │
│  │    image here           │                                │
│  └─────────────────────────┘                                │
│  Supports: JPG, PNG, WEBP (max 5MB)                         │
│  [Remove]                                                   │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Drag & drop or click to browse files
- On file select: upload to `POST /api/files` (category: "NEWS_IMAGE")
- Show progress bar during upload
- Show preview with "Remove" button after success
- Store `fileId` in form state (`featuredImageId`)
- Validate file type and size before upload

**Error Handling:**
- File too large (>5MB): toast error
- Invalid type: toast error
- Upload failed: toast with retry option

### API Changes

**Files to modify:**
- `apps/backoffice/app/api/public/news/route.ts`
- `apps/backoffice/app/api/public/news/[slug]/route.ts`

**Change:** Ensure response includes `image` field:

```typescript
{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  image: string | null;  // from featuredImage.cdnUrl
  date: string;
  author: string | null;
  readTime: string | null;
  featured: boolean;
  tags: string[];
}
```

### Landing Page: Image Rendering

**Files to modify:**
1. `apps/landing/app/informasi-publik/berita-terkini/berita-terkini-client.tsx`
2. `apps/landing/app/informasi-publik/berita-terkini/[slug]/news-detail-client.tsx`

**Render Logic:**
```tsx
{article.image ? (
  <NextImage
    src={article.image}
    width={400}
    height={225}
    className="object-cover"
    alt={article.title}
  />
) : (
  <GradientPlaceholder />  // existing gradient fallback
)}
```

**Featured Section (Berita Utama):**
- Full width card with `aspect-[16/9]`
- Use `object-cover` for proper crop

**List Cards:**
- Thumbnail: `w-40 h-28` (~16:9 aspect ratio)
- Gradient fallback if no image

## Data Flow

```
User Action          → Component        → API              → Database
────────────────────────────────────────────────────────────────────────
Drag image           → ImageUploader    → POST /api/files  → File (new)
                                         returns fileId
                                         ↓
                                       featuredImageId
User submits form    → news-client      → PUT /api/news/*   → News (updated)
                                         ↓
                                       featuredImageId = file_id
────────────────────────────────────────────────────────────────────────
Landing fetch        → getAllNews()     → GET /api/public   → News + File
                                       → /news             → join
                                         ↓
                                       image = cdnUrl
                                         ↓
Render with NextImage → berita-terkini   → <Image src={...} />
```

## File Structure

```
apps/
├── backoffice/
│   ├── components/
│   │   └── news/
│   │       └── ImageUploader.tsx           ← NEW
│   ├── app/(dashboard)/manage/news/
│   │   └── news-client.tsx                 ← MODIFY (add uploader)
│   └── app/api/public/news/
│       ├── route.ts                        ← MODIFY (add image to response)
│       └── [slug]/route.ts                 ← MODIFY (same)
│
└── landing/
    └── app/informasi-publik/berita-terkini/
        ├── berita-terkini-client.tsx       ← MODIFY (render images)
        └── [slug]/news-detail-client.tsx   ← MODIFY (render hero image)
```

## Implementation Notes

1. Use existing `POST /api/files` endpoint with category "NEWS_IMAGE"
2. `NewsArticle` type already has `image: string | null` field
3. News model already has `featuredImageId` field
4. Use Next.js `Image` component with proper dimensions
5. Handle image load errors gracefully (fallback to gradient)

## Testing Checklist

- [ ] Upload image via drag & drop
- [ ] Upload image via file browser
- [ ] Show progress during upload
- [ ] Display preview after upload
- [ ] Remove image functionality
- [ ] File size validation (>5MB)
- [ ] File type validation (only JPG, PNG, WEBP)
- [ ] Display image on landing page featured section
- [ ] Display image on landing page list cards
- [ ] Display image on news detail page
- [ ] Show gradient fallback when no image
- [ ] Handle broken image URLs gracefully
