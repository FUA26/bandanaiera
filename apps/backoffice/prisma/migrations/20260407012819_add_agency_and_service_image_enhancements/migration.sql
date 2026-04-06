-- Create AgencyCategory enum
DO $$ BEGIN
    CREATE TYPE "AgencyCategory" AS ENUM ('BADAN', 'DINAS', 'KECAMATAN', 'DESA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create AgencyStatus enum
DO $$ BEGIN
    CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create ServiceImageType enum
DO $$ BEGIN
    CREATE TYPE "ServiceImageType" AS ENUM ('BANNER', 'DOKUMEN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Agency table
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoId" TEXT,
    "category" "AgencyCategory" NOT NULL,
    "address" TEXT,
    "contactInfo" JSONB,
    "operatingHours" TEXT,
    "location" JSONB,
    "socialMedia" JSONB,
    "status" "AgencyStatus" NOT NULL DEFAULT 'ACTIVE',
    "showInMenu" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- Create AgencyActivityLog table
CREATE TABLE "AgencyActivityLog" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgencyActivityLog_pkey" PRIMARY KEY ("id")
);

-- Create ServiceRelatedAgency table
CREATE TABLE "ServiceRelatedAgency" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceRelatedAgency_pkey" PRIMARY KEY ("id")
);

-- Create ServiceImage table
CREATE TABLE "ServiceImage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "type" "ServiceImageType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id")
);

-- Add agencyId column to Service table
ALTER TABLE "Service" ADD COLUMN "agencyId" TEXT;

-- Add unique constraints
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_slug_key" UNIQUE ("slug");
ALTER TABLE "ServiceRelatedAgency" ADD CONSTRAINT "ServiceRelatedAgency_serviceId_agencyId_key" UNIQUE ("serviceId", "agencyId");
ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_serviceId_fileId_key" UNIQUE ("serviceId", "fileId");

-- Create indexes for Agency
CREATE INDEX "Agency_category_idx" ON "Agency"("category");
CREATE INDEX "Agency_status_idx" ON "Agency"("status");
CREATE INDEX "Agency_showInMenu_idx" ON "Agency"("showInMenu");
CREATE INDEX "Agency_order_idx" ON "Agency"("order");
CREATE INDEX "Agency_slug_idx" ON "Agency"("slug");

-- Create indexes for AgencyActivityLog
CREATE INDEX "AgencyActivityLog_agencyId_idx" ON "AgencyActivityLog"("agencyId");
CREATE INDEX "AgencyActivityLog_userId_idx" ON "AgencyActivityLog"("userId");
CREATE INDEX "AgencyActivityLog_createdAt_idx" ON "AgencyActivityLog"("createdAt");

-- Create indexes for ServiceRelatedAgency
CREATE INDEX "ServiceRelatedAgency_serviceId_idx" ON "ServiceRelatedAgency"("serviceId");
CREATE INDEX "ServiceRelatedAgency_agencyId_idx" ON "ServiceRelatedAgency"("agencyId");

-- Create indexes for ServiceImage
CREATE INDEX "ServiceImage_serviceId_idx" ON "ServiceImage"("serviceId");
CREATE INDEX "ServiceImage_fileId_idx" ON "ServiceImage"("fileId");
CREATE INDEX "ServiceImage_type_idx" ON "ServiceImage"("type");

-- Create foreign key constraints
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AgencyActivityLog" ADD CONSTRAINT "AgencyActivityLog_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgencyActivityLog" ADD CONSTRAINT "AgencyActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ServiceRelatedAgency" ADD CONSTRAINT "ServiceRelatedAgency_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceRelatedAgency" ADD CONSTRAINT "ServiceRelatedAgency_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Service" ADD CONSTRAINT "Service_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop old imageIds column from Service table
ALTER TABLE "Service" DROP COLUMN IF EXISTS "imageIds";
