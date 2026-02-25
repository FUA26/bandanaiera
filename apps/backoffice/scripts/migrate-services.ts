/**
 * Services Migration Script
 *
 * Migrates services from JSON files to the Prisma database.
 *
 * Usage:
 *   pnpm migrate:services
 *
 * This script:
 * - Reads categories from apps/landing/data/services/categories.json
 * - Reads services from each category JSON file
 * - Upserts categories to ServiceCategory table
 * - Creates services with status='PUBLISHED'
 * - Converts downloadForms from {name, url} to {type: 'url', name, value}
 * - Finds first ADMIN user for createdById
 */

import { config } from "dotenv";
import { PrismaClient, ServiceStatus } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// Load environment variables
config({ path: ".env.local" });

const prisma = new PrismaClient();

// Type definitions for JSON data
interface CategoryJson {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  slug: string;
  showInMenu: boolean;
  order: number;
}

interface DownloadFormJson {
  name: string;
  url: string;
}

interface ServiceJson {
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string;
  stats?: string;
  showInMenu: boolean;
  order: number;
  isIntegrated: boolean;
  detailedDescription: string;
  requirements: string[];
  process: string[];
  duration: string;
  cost: string;
  contactInfo: {
    office: string;
    phone: string;
    email: string;
  };
  downloadForms: DownloadFormJson[];
  relatedServices: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

/**
 * Convert downloadForms from {name, url} to {type: 'url', name, value}
 */
function convertDownloadForms(forms: DownloadFormJson[]): Array<{ type: 'url'; name: string; value: string }> {
  return forms.map(form => ({
    type: 'url' as const,
    name: form.name,
    value: form.url,
  }));
}

/**
 * Find or get the first ADMIN user for createdById
 */
async function getAdminUserId(): Promise<string> {
  // First, try to find a user with ADMIN role
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (adminRole) {
    const adminUser = await prisma.user.findFirst({
      where: { roleId: adminRole.id },
      select: { id: true },
    });

    if (adminUser) {
      return adminUser.id;
    }
  }

  // If no admin user found, get the first user
  const firstUser = await prisma.user.findFirst({
    select: { id: true },
  });

  if (firstUser) {
    return firstUser.id;
  }

  // If no user exists, throw error
  throw new Error('No users found in database. Please create at least one user before running this migration.');
}

/**
 * Main migration function
 */
async function migrateServices() {
  console.log('🚀 Starting services migration...\n');

  try {
    // Get the admin user for createdById
    console.log('📋 Finding admin user...');
    const adminUserId = await getAdminUserId();
    console.log(`  ✅ Using user ID: ${adminUserId}\n`);

    // Read categories JSON
    const categoriesPath = join(process.cwd(), '../landing/data/services/categories.json');
    console.log(`📂 Reading categories from: ${categoriesPath}`);
    const categoriesJson: CategoryJson[] = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
    console.log(`  ✅ Found ${categoriesJson.length} categories\n`);

    // Create a map of categoryId to database category ID
    const categoryMap = new Map<string, string>();

    // Upsert categories
    console.log('📁 Migrating categories...');
    for (const categoryJson of categoriesJson) {
      const category = await prisma.serviceCategory.upsert({
        where: { slug: categoryJson.slug },
        update: {
          name: categoryJson.name,
          icon: categoryJson.icon,
          color: categoryJson.color,
          bgColor: categoryJson.bgColor,
          showInMenu: categoryJson.showInMenu,
          order: categoryJson.order,
        },
        create: {
          name: categoryJson.name,
          slug: categoryJson.slug,
          icon: categoryJson.icon,
          color: categoryJson.color,
          bgColor: categoryJson.bgColor,
          showInMenu: categoryJson.showInMenu,
          order: categoryJson.order,
        },
      });

      categoryMap.set(categoryJson.id, category.id);
      console.log(`  ✅ ${categoryJson.name} (${categoryJson.slug}) -> ID: ${category.id}`);
    }
    console.log(`\n✅ Migrated ${categoryMap.size} categories\n`);

    // Read services directory to find all service JSON files
    const servicesDir = join(process.cwd(), '../landing/data/services');
    const files = readdirSync(servicesDir).filter(f => f.endsWith('.json') && f !== 'categories.json');

    console.log(`📂 Found ${files.length} service files to process\n`);

    let servicesCreated = 0;
    let servicesUpdated = 0;
    let errors: Array<{ file: string; error: string }> = [];

    for (const file of files) {
      const filePath = join(servicesDir, file);
      console.log(`📄 Processing: ${file}`);

      try {
        const servicesJson: ServiceJson[] = JSON.parse(readFileSync(filePath, 'utf-8'));

        for (const serviceJson of servicesJson) {
          const categoryId = categoryMap.get(serviceJson.categoryId);

          if (!categoryId) {
            console.warn(`  ⚠️  Category "${serviceJson.categoryId}" not found for service "${serviceJson.name}"`);
            errors.push({ file, error: `Category "${serviceJson.categoryId}" not found for service "${serviceJson.name}"` });
            continue;
          }

          // Upsert service
          const service = await prisma.service.upsert({
            where: { slug: serviceJson.slug },
            update: {
              icon: serviceJson.icon,
              name: serviceJson.name,
              description: serviceJson.description,
              categoryId,
              badge: serviceJson.badge,
              stats: serviceJson.stats,
              showInMenu: serviceJson.showInMenu,
              order: serviceJson.order,
              isIntegrated: serviceJson.isIntegrated,
              detailedDescription: serviceJson.detailedDescription,
              requirements: serviceJson.requirements,
              process: serviceJson.process,
              duration: serviceJson.duration,
              cost: serviceJson.cost,
              contactInfo: serviceJson.contactInfo,
              downloadForms: convertDownloadForms(serviceJson.downloadForms),
              relatedServices: serviceJson.relatedServices,
              faqs: serviceJson.faqs,
              status: ServiceStatus.PUBLISHED,
              updatedById: adminUserId,
            },
            create: {
              slug: serviceJson.slug,
              icon: serviceJson.icon,
              name: serviceJson.name,
              description: serviceJson.description,
              categoryId,
              badge: serviceJson.badge,
              stats: serviceJson.stats,
              showInMenu: serviceJson.showInMenu,
              order: serviceJson.order,
              isIntegrated: serviceJson.isIntegrated,
              detailedDescription: serviceJson.detailedDescription,
              requirements: serviceJson.requirements,
              process: serviceJson.process,
              duration: serviceJson.duration,
              cost: serviceJson.cost,
              contactInfo: serviceJson.contactInfo,
              downloadForms: convertDownloadForms(serviceJson.downloadForms),
              relatedServices: serviceJson.relatedServices,
              faqs: serviceJson.faqs,
              status: ServiceStatus.PUBLISHED,
              createdById: adminUserId,
              updatedById: adminUserId,
            },
          });

          if (service.createdAt.getTime() === service.updatedAt.getTime()) {
            servicesCreated++;
            console.log(`  ✅ Created: ${serviceJson.name} (${serviceJson.slug})`);
          } else {
            servicesUpdated++;
            console.log(`  🔄 Updated: ${serviceJson.name} (${serviceJson.slug})`);
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ Error processing ${file}: ${errorMsg}`);
        errors.push({ file, error: errorMsg });
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`  Categories migrated: ${categoryMap.size}`);
    console.log(`  Services created:    ${servicesCreated}`);
    console.log(`  Services updated:    ${servicesUpdated}`);
    console.log(`  Errors:              ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(({ file, error }) => {
        console.log(`  • ${file}: ${error}`);
      });
    }

    console.log('\n🎉 Migration completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateServices();
