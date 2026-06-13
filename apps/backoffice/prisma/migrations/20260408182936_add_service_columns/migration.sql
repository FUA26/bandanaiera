-- AlterService
ALTER TABLE "Service" ADD COLUMN "logoImageId" TEXT,
ADD COLUMN "bannerImageId" TEXT,
ADD COLUMN "operatingHours" JSONB,
ADD COLUMN "serviceLink" TEXT,
ADD COLUMN "downloadAppLinks" JSONB,
ADD COLUMN "socialMedia" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Service_logoImageId_key" ON "Service"("logoImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_bannerImageId_key" ON "Service"("bannerImageId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_logoImageId_fkey" FOREIGN KEY ("logoImageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_bannerImageId_fkey" FOREIGN KEY ("bannerImageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
