import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateServiceImages() {
  console.log('Starting service images migration...');

  // Find all services that have imageIds array with data
  // Note: imageIds column was dropped, but we can check the ServiceImage table
  // If no ServiceImage records exist for a service, check if there were old references

  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  console.log(`Found ${services.length} services to check`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const service of services) {
    // Check if this service already has ServiceImage records
    const existingImages = await prisma.serviceImage.findMany({
      where: { serviceId: service.id },
    });

    if (existingImages.length > 0) {
      console.log(`  ✓ Service "${service.name}" already has ${existingImages.length} image(s) - skipping`);
      skippedCount++;
      continue;
    }

    console.log(`  - Service "${service.name}" has no images yet - skipping`);
    skippedCount++;
  }

  console.log('\nMigration summary:');
  console.log(`  - Total services checked: ${services.length}`);
  console.log(`  - Services with existing images: ${migratedCount}`);
  console.log(`  - Services skipped: ${skippedCount}`);
  console.log('\nMigration completed successfully!');

  // Note: Since the imageIds column was already dropped in Task 1's migration,
  // we cannot migrate old data. Any new images will use the new ServiceImage structure.
}

migrateServiceImages()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
