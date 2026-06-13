/**
 * Seed Services
 *
 * Run: npx tsx prisma/seed-services.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedServices() {
  try {
    console.log("🌱 Seeding services...\n");

    // Get or create category
    let category = await prisma.serviceCategory.findFirst({
      where: { slug: "layanan-umum" },
    });

    if (!category) {
      category = await prisma.serviceCategory.create({
        data: {
          name: "Layanan Umum",
          slug: "layanan-umum",
          icon: "📋",
          color: "primary",
          bgColor: "bg-primary/10",
          showInMenu: true,
          order: 1,
        },
      });
      console.log("✅ Created category: Layanan Umum");
    }

    // Check if services already exist
    const existingServices = await prisma.service.findMany();
    if (existingServices.length > 0) {
      console.log(`\nℹ️  Found ${existingServices.length} existing services. Skipping seed.\n`);
      return;
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    });

    if (!adminUser) {
      console.error("❌ Admin user not found! Please run seed-admin.ts first.");
      process.exit(1);
    }

    // Service 1: KTP Elektronik
    const service1 = await prisma.service.create({
      data: {
        slug: "ktp-elektronik",
        icon: "🪪",
        name: "KTP Elektronik",
        description: "Pembuatan KTP Elektronik baru dan penggalian KTP yang rusak/hilang",
        categoryId: category.id,
        badge: "Populer",
        stats: "50.000+ pemohon",
        showInMenu: true,
        order: 1,
        isIntegrated: true,
        detailedDescription: "Layanan pembuatan KTP Elektronik untuk warga yang belum memiliki atau penggalian untuk KTP yang rusak/hilang.",
        requirements: [
          "Kartu Keluarga (KK) asli",
          "KTP lama (jika ada)",
          "Surat pengantar dari kelurahan",
          "Foto 3x4 sebanyak 2 lembar"
        ],
        process: [
          "Datang ke loket pelayanan dengan berkas lengkap",
          "Verifikasi berkas oleh petugas",
          "Perekaman biometrik (foto, sidik jari, iris)",
          "Tanda tangan digital",
          "Cetak KTP sementara",
          "KTP Elektronik jadi dalam 14 hari kerja"
        ],
        duration: "14 hari kerja",
        cost: "Gratis",
        contactInfo: {
          phone: "(0341) 123456",
          email: "dukcapil@naiera.go.id",
        },
        faqs: [
          {
            question: "Apakah pembuatan KTP dikenakan biaya?",
            answer: "Tidak, pembuatan KTP Elektronik gratis sepenuhnya."
          },
          {
            question: "Berapa lama KTP jadi?",
            answer: "KTP Elektronik akan jadi dalam 14 hari kerja setelah perekaman."
          }
        ],
        status: "PUBLISHED",
        operatingHours: [
          { days: "Senin - Jumat", hours: "08:00 - 16:00" },
          { days: "Sabtu", hours: "08:00 - 12:00" }
        ],
        createdById: adminUser.id,
      },
    });

    console.log("✅ Created service: KTP Elektronik");

    // Service 2: Akta Kelahiran
    const service2 = await prisma.service.create({
      data: {
        slug: "akta-kelahiran",
        icon: "👶",
        name: "Akta Kelahiran",
        description: "Pembuatan Akta Kelahiran untuk bay yang baru lahir",
        categoryId: category.id,
        stats: "10.000+ pemohon",
        showInMenu: true,
        order: 2,
        isIntegrated: true,
        detailedDescription: "Layanan pembuatan Akta Kelahiran untuk bayi yang baru lahir (maksimal 60 hari sejak kelahiran).",
        requirements: [
          "Surat Keterangan Lahir dari RS/Bidan",
          "KTP Orang Tua",
          "Kartu Keluarga (KK)",
          "Buku Nikah Orang Tua (untuk yang menikah)",
          "Surat Keterangan Belum Punya Akta dari Kelurahan"
        ],
        process: [
          "Siapkan semua berkas persyaratan",
          "Datang ke loket pelayanan Dukcapil",
          "Isi formulir permohonan",
          "Verifikasi berkas oleh petugas",
          "Proses pencatatan",
          "Akta Kelahiran jadi (bisa langsung)"
        ],
        duration: "1 hari kerja",
        cost: "Gratis",
        contactInfo: {
          phone: "(0341) 123456",
          email: "dukcapil@naiera.go.id",
        },
        faqs: [
          {
            question: "Apakah ada batas usia untuk pembuatan akta kelahiran?",
            answer: "Idealnya dibuat maksimal 60 hari setelah kelahiran. Lebih dari itu akan dikenakan denda administrasi."
          },
          {
            question: "Apakah pembuatan akta kelahiran gratis?",
            answer: "Ya, pembuatan akta kelahiran pertama gratis."
          }
        ],
        status: "PUBLISHED",
        operatingHours: [
          { days: "Senin - Jumat", hours: "08:00 - 16:00" },
          { days: "Sabtu", hours: "08:00 - 12:00" }
        ],
        createdById: adminUser.id,
      },
    });

    console.log("✅ Created service: Akta Kelahiran");

    console.log("\n🎉 Services seeding completed successfully!");
    console.log(`   Total services: 2`);
  } catch (error) {
    console.error("❌ Error seeding services:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();
