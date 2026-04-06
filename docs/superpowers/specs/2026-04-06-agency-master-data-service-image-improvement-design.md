# Agency Master Data & Service Image Improvement Design

**Date:** 2026-04-06
**Status:** Approved
**Author:** Claude Code

## Overview

This document outlines the design for two major features:
1. Master data management for government agencies (Perangkat Daerah)
2. Enhanced image types for services

## 1. Agency (Perangkat Daerah) Master Data

### Purpose

Enable comprehensive management of government agencies with public directory pages and integration with services.

### Data Model

#### Agency Model

```prisma
model Agency {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  nickname    String
  description String

  // Logo
  logoId      String?
  logo        File?    @relation("AgencyLogo", fields: [logoId], references: [id], onDelete: SetNull)

  // Category
  category    AgencyCategory

  // Contact & Location
  address         String?
  contactInfo     Json?    // { phone, email, website }
  operatingHours  String?  // Text description
  location        Json?    // { lat, lng }

  // Social Media
  socialMedia     Json?    // { facebook, twitter, instagram, youtube }

  // Display & Status
  status        AgencyStatus @default(ACTIVE)
  showInMenu    Boolean      @default(true)
  order         Int          @default(0)

  // Audit
  createdById   String
  createdBy     User         @relation("AgencyCreator", fields: [createdById], references: [id])
  updatedById   String?
  updatedBy     User?        @relation("AgencyUpdater", fields: [updatedById], references: [id])
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  // Relations
  activityLogs            AgencyActivityLog[]
  servicesAsOwner         Service[]                 @relation("ServiceAgencyOwner")
  serviceRelatedAgencies  ServiceRelatedAgency[]    @relation("AgencyRelatedServices")

  @@index([category])
  @@index([status])
  @@index([showInMenu])
  @@index([order])
  @@index([slug])
}

enum AgencyCategory {
  BADAN
  DINAS
  KECAMATAN
  DESA
}

enum AgencyStatus {
  ACTIVE
  INACTIVE
}

model AgencyActivityLog {
  id        String   @id @default(cuid())
  agencyId  String
  agency    Agency   @relation(fields: [agencyId], references: [id], onDelete: Cascade)
  userId    String
  action    String
  changes   Json?
  createdAt DateTime @default(now())
  user      User     @relation("AgencyActivityLogs", fields: [userId], references: [id])

  @@index([agencyId])
  @@index([userId])
  @@index([createdAt])
}
```

#### Service Model Updates

Update Service model to add agency relations:

```prisma
model Service {
  // ... existing fields ...

  // Agency Relations
  agencyId              String?
  agency                Agency?                 @relation("ServiceAgencyOwner", fields: [agencyId], references: [id])
  relatedAgencies       ServiceRelatedAgency[]  @relation("ServiceRelatedAgencies")
}
```

#### Join Table for Many-to-Many

```prisma
model ServiceRelatedAgency {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation("ServiceRelatedAgencies", fields: [serviceId], references: [id], onDelete: Cascade)
  agencyId    String
  agency      Agency   @relation("AgencyRelatedServices", fields: [agencyId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([serviceId, agencyId])
  @@index([serviceId])
  @@index([agencyId])
}
```

#### User Model Updates

Add agency relations to User model:

```prisma
model User {
  // ... existing fields ...

  // Agency Management Relations
  createdAgencies      Agency[]               @relation("AgencyCreator")
  updatedAgencies      Agency[]               @relation("AgencyUpdater")
  agencyActivityLogs   AgencyActivityLog[]    @relation("AgencyActivityLogs")
}
```

#### File Model Updates

Add agency logo relation:

```prisma
model File {
  // ... existing fields ...

  // Relations
  avatars           User[]                   @relation("UserAvatar")
  siteLogos         SystemSettings[]         @relation("SiteLogo")
  heroBackgrounds   SystemSettings[]         @relation("HeroBackground")
  newsAsFeaturedImage News[]                 @relation("NewsFeaturedImage")
  eventsAsImage     Event[]                  @relation("EventImage")
  tourismAsImage    TourismDestination[]     @relation("TourismImage")
  services          Service[]                @relation("ServiceImages")
  agencyLogos       Agency[]                 @relation("AgencyLogo")  // NEW
}
```

### Public Interface

#### Landing Page

**New Menu: "Perangkat Daerah"**

- Route: `/perangkat-daerah`
- Features:
  - Search by agency name
  - Filter by category (Badan, Dinas, Kecamatan, Desa)
  - Sort by: Name (A-Z), Newest
- Display: Grid of agency cards showing logo, name, nickname

**Agency Detail Page**

- Route: `/perangkat-daerah/{slug}`
- Content:
  - Logo
  - Name & nickname
  - Description
  - Contact info (phone, email, website)
  - Operating hours
  - Location (map if coordinates available)
  - Social media links
  - Services owned (as Pengampu)
  - Related services (where agency is listed as Terkait)

**Service Page Updates**

- Show "Pengampu: [Agency Name]" with link to agency
- Show "Terkait dengan: [Agency 1, Agency 2, ...]" if any
- Add filter by agency in services listing

#### Backoffice

**Agency Management**

- CRUD operations for agencies
- Form fields:
  - Name (required)
  - Nickname (required)
  - Slug (auto-generated from name, editable)
  - Description (required)
  - Logo upload (required)
  - Category dropdown (Badan, Dinas, Kecamatan, Desa)
  - Address
  - Contact info: Phone, Email, Website
  - Operating hours (text)
  - Location: Latitude, Longitude (optional)
  - Social Media: Facebook, Twitter, Instagram, YouTube
  - Status: ACTIVE/INACTIVE
  - Show in menu toggle
  - Order number
- Activity log for audit trail

**Service Form Updates**

- Add "Pengampu" dropdown (required, select one agency)
- Add "Instansi Terkait" multi-select (optional)
- Display selected agencies in service detail

## 2. Service Image Enhancement

### Purpose

Add image type categorization to support different use cases (banner vs documentation).

### Data Model

Add image type to service-file relation. Since Prisma doesn't support many-to-many with extra fields directly, we'll use a join table:

```prisma
model ServiceImage {
  id        String       @id @default(cuid())
  serviceId String
  service   Service      @relation("ServiceImages", fields: [serviceId], references: [id], onDelete: Cascade)
  fileId    String
  file      File         @relation("ServiceImageFiles", fields: [fileId], references: [id], onDelete: Cascade)
  type      ServiceImageType
  order     Int          @default(0)
  createdAt DateTime     @default(now())

  @@unique([serviceId, fileId])
  @@index([serviceId])
  @@index([fileId])
  @@index([type])
}

enum ServiceImageType {
  BANNER   // Main hero image (max 1 per service)
  DOKUMEN  // Procedure/flow images (unlimited)
}
```

Remove direct many-to-many from Service model:

```prisma
model Service {
  // ... existing fields ...

  // OLD (remove):
  // images    File[]
  // imageIds String[] @default([])

  // NEW (add):
  serviceImages ServiceImage[] @relation("ServiceImages")
}
```

Add relation to File model:

```prisma
model File {
  // ... existing fields ...

  // OLD (remove):
  // services Service[] @relation("ServiceImages")

  // NEW (add):
  serviceImages ServiceImage[] @relation("ServiceImageFiles")
}
```

### Business Rules

- **BANNER**: Maximum 1 per service, automatically marked as primary
- **DOKUMEN**: Unlimited, supports ordering

### Public Interface

#### Landing Page (Service Detail)

- **Banner**: Displayed prominently at the top of service detail page
- **Dokumen**: Displayed in "Dokumen / Alur" section as gallery

#### Backoffice (Service Form)

- Image upload section with type selector (Banner/Dokumen)
- Validation: Prevent adding more than 1 banner
- Drag-and-drop ordering for dokumen images
- Preview images grouped by type

## Implementation Notes

### Migration Strategy

1. Create new models (Agency, AgencyActivityLog, ServiceRelatedAgency, ServiceImage)
2. Add agency relations to existing models (Service, User, File)
3. Migrate existing service images to new ServiceImage table (default type: DOKUMEN)
4. Update forms and UI components
5. Add agency management routes and pages
6. Update service pages to show agency information

### Considerations

- **Slug Generation**: Auto-generate from agency name, handle duplicates
- **Logo**: Required field, use existing File upload system
- **Location**: Optional, only show map if both lat/lng present
- **Agency-Service Migration**: Existing services will have null agencyId, need bulk update or manual assignment
- **Image Migration**: Existing service images should be migrated to ServiceImage table with type DOKUMEN

## Success Criteria

- Agencies can be created, updated, and managed via backoffice
- Agency directory page displays with search, filter, and sort working
- Agency detail pages show complete information and related services
- Services display their owning agency and related agencies
- Services can be filtered by agency
- Service images support BANNER (max 1) and DOKUMEN (unlimited) types
- All existing data migrates successfully without data loss
