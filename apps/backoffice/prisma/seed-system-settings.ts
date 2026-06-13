/**
 * System Settings Seed Script
 *
 * Creates default system settings for registration and security.
 * Run this after database migrations to set up system configuration.
 *
 * Usage:
 *   pnpm tsx prisma/seed-system-settings.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedSystemSettings() {
  console.log("🌱 Seeding system settings...\n");

  try {
    // Check if system settings already exist
    const existingSettings = await prisma.systemSettings.findFirst();

    if (existingSettings) {
      console.log("⚠️  System settings already exist. Skipping seed.\n");
      console.log("Current settings:");
      console.log(`  - Allow Registration: ${existingSettings.allowRegistration}`);
      console.log(`  - Require Email Verification: ${existingSettings.requireEmailVerification}`);
      console.log(`  - Default Role ID: ${existingSettings.defaultUserRoleId}`);
      console.log(`  - Site Name: ${existingSettings.siteName}`);
      console.log(`  - Site Description: ${existingSettings.siteDescription}`);
      console.log(`  - Site Subtitle: ${existingSettings.siteSubtitle}`);
      console.log(`  - Citizen Name: ${existingSettings.citizenName}`);
      console.log(`  - Version Number: ${existingSettings.versionNumber}\n`);
      return;
    }

    // Get the USER role as default
    const userRole = await prisma.role.findUnique({
      where: { name: "USER" },
    });

    if (!userRole) {
      console.error("❌ USER role not found. Please run seed-roles.ts first.\n");
      process.exit(1);
    }

    // Create default system settings
    const systemSettings = await prisma.systemSettings.create({
      data: {
        allowRegistration: true,
        requireEmailVerification: true,
        defaultUserRoleId: userRole.id,
        emailVerificationExpiryHours: 24,
        siteName: "Naiera",
        siteDescription: "Platform terpadu untuk layanan publik dan informasi daerah",
        siteSubtitle: "Melayani dengan Sepenuh Hati",
        minPasswordLength: 8,
        requireStrongPassword: false,
        citizenName: "Warga",
        contactAddress: "Jl. Merdeka No. 1, Kota Naiera",
        contactEmails: ["info@naiera.go.id", "layanan@naiera.go.id"],
        contactPhones: ["(0341) 123456", "(0341) 123457"],
        copyrightText: `© ${new Date().getFullYear()} Pemerintah Kota Naiera. Hak Cipta Dilindungi.`,
        socialFacebook: "https://facebook.com/naiera",
        socialInstagram: "https://instagram.com/naiera",
        socialTwitter: "https://twitter.com/naiera",
        socialYouTube: "https://youtube.com/@naiera",
        versionNumber: "1.0.0",
      },
    });

    console.log("✅ System settings created successfully:\n");
    console.log(`  - Allow Registration: ${systemSettings.allowRegistration}`);
    console.log(`  - Require Email Verification: ${systemSettings.requireEmailVerification}`);
    console.log(`  - Default Role: USER (${userRole.id})`);
    console.log(
      `  - Email Verification Expiry: ${systemSettings.emailVerificationExpiryHours} hours`
    );
    console.log(`  - Site Name: ${systemSettings.siteName}`);
    console.log(`  - Site Description: ${systemSettings.siteDescription}`);
    console.log(`  - Site Subtitle: ${systemSettings.siteSubtitle}`);
    console.log(`  - Citizen Name: ${systemSettings.citizenName}`);
    console.log(`  - Contact Address: ${systemSettings.contactAddress}`);
    console.log(`  - Contact Emails: ${JSON.stringify(systemSettings.contactEmails)}`);
    console.log(`  - Contact Phones: ${JSON.stringify(systemSettings.contactPhones)}`);
    console.log(`  - Copyright Text: ${systemSettings.copyrightText}`);
    console.log(`  - Social Facebook: ${systemSettings.socialFacebook}`);
    console.log(`  - Social Instagram: ${systemSettings.socialInstagram}`);
    console.log(`  - Social Twitter: ${systemSettings.socialTwitter}`);
    console.log(`  - Social YouTube: ${systemSettings.socialYouTube}`);
    console.log(`  - Version Number: ${systemSettings.versionNumber}`);
    console.log(`  - Minimum Password Length: ${systemSettings.minPasswordLength}`);
    console.log(`  - Require Strong Password: ${systemSettings.requireStrongPassword}\n`);

    console.log("🎉 System settings seeding completed successfully!\n");
  } catch (error) {
    console.error("❌ Error seeding system settings:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSystemSettings();
