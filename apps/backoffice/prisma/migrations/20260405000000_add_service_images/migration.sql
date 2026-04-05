-- Add imageIds column to Service table
ALTER TABLE "Service" ADD COLUMN "imageIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- The relation is implicit through the imageIds array, no additional SQL needed
-- The services relation on File model is handled by Prisma's implicit many-to-many
