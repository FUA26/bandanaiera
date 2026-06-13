/**
 * OPD (Organisasi Perangkat Daerah) Seed Script
 *
 * Run: npx tsx prisma/seed-opd.ts
 * Or: npm run seed:opd (if added to package.json)
 */

import { PrismaClient, OpdCategory, OpdStatus } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// Sample OPD data
const opds = [
  // DINAS
  {
    id: "opd-001",
    slug: "dinas-kesehatan",
    name: "Dinas Kesehatan",
    nickname: "Dinkes",
    description: "Dinas yang menangani bidang kesehatan masyarakat",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Kesehatan No. 1",
    contactInfo: {
      phone: "(0341) 123456",
      email: "dinkes@kotamalang.go.id",
      website: "dinkes.kotamalang.go.id",
    },
    operatingHours: "Senin - Jumat: 08.00 - 16.00 WIB",
    location: {
      latitude: -7.9797,
      longitude: 112.6304,
    },
    socialMedia: {
      facebook: "dinkes.kotamalang",
      instagram: "@dinkes_kotamalang",
      twitter: "@dinkes_malang",
    },
  },
  {
    id: "opd-002",
    slug: "dinas-pendidikan",
    name: "Dinas Pendidikan",
    nickname: "Disdik",
    description: "Dinas yang menangani bidang pendidikan",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. Pendidikan No. 2",
    contactInfo: {
      phone: "(0341) 234567",
      email: "disdik@kotamalang.go.id",
    },
    operatingHours: "Senin - Jumat: 08.00 - 16.00 WIB",
  },
  {
    id: "opd-003",
    slug: "dinas-pemberdayaan-masyarakat-desa",
    name: "Dinas Pemberdayaan Masyarakat dan Desa",
    nickname: "DPMD",
    description: "Dinas yang menangani pemberdayaan masyarakat dan desa",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Pemdes No. 3",
    contactInfo: {
      phone: "(0341) 345678",
      email: "dpmd@kotamalang.go.id",
    },
  },
  {
    id: "opd-004",
    slug: "dinas-pariwisata-dan-kebudayaan",
    name: "Dinas Pariwisata dan Kebudayaan",
    nickname: "Disparbud",
    description: "Dinas yang menangani pariwisata dan kebudayaan",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Jl. Wisata No. 4",
    contactInfo: {
      phone: "(0341) 456789",
      email: "disparbud@kotamalang.go.id",
      website: "pariwisata.kotamalang.go.id",
    },
    socialMedia: {
      instagram: "@wisata_kotamalang",
      facebook: "disparbud.kotamalang",
    },
  },
  {
    id: "opd-005",
    slug: "dinas-perhubungan",
    name: "Dinas Perhubungan",
    nickname: "Dishub",
    description: "Dinas yang menangani bidang perhubungan",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 5,
    address: "Jl. Transportasi No. 5",
    contactInfo: {
      phone: "(0341) 567890",
      email: "dishub@kotamalang.go.id",
    },
  },
  {
    id: "opd-006",
    slug: "dinas-pekerjaan-umum",
    name: "Dinas Pekerjaan Umum",
    nickname: "DPU",
    description: "Dinas yang menangani bidang pekerjaan umum dan infrastruktur",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 6,
    address: "Jl. Infrastruktur No. 6",
    contactInfo: {
      phone: "(0341) 678901",
      email: "pu@kotamalang.go.id",
    },
  },

  // BADAN
  {
    id: "opd-007",
    slug: "bappeda",
    name: "Badan Perencanaan Pembangunan Daerah",
    nickname: "Bappeda",
    description: "Badan yang menangani perencanaan pembangunan daerah",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Perencanaan No. 7",
    contactInfo: {
      phone: "(0341) 789012",
      email: "bappeda@kotamalang.go.id",
    },
  },
  {
    id: "opd-008",
    slug: "badan-kepegawaian-dan-pengembangan-sdm",
    name: "Badan Kepegawaian dan Pengembangan SDM",
    nickname: "BKPSDM",
    description: "Badan yang menangani kepegawaian dan pengembangan SDM",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. Kepegawaian No. 8",
    contactInfo: {
      phone: "(0341) 890123",
      email: "bkpsdm@kotamalang.go.id",
    },
  },
  {
    id: "opd-009",
    slug: "badan-pengelolaan-keuangan-dan-aset-daerah",
    name: "Badan Pengelolaan Keuangan dan Aset Daerah",
    nickname: "BPKAD",
    description: "Badan yang menangani pengelolaan keuangan dan aset daerah",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Keuangan No. 9",
    contactInfo: {
      phone: "(0341) 901234",
      email: "bpkad@kotamalang.go.id",
    },
  },

  // KECAMATAN
  {
    id: "opd-010",
    slug: "kecamatan-sukun",
    name: "Kecamatan Sukun",
    nickname: "Kec. Sukun",
    description: "Kecamatan Sukun",
    category: "KECAMATAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Sukun No. 10",
    contactInfo: {
      phone: "(0341) 012345",
      email: "sukun@kotamalang.go.id",
    },
  },
  {
    id: "opd-011",
    slug: "kecamatan-kedungkandang",
    name: "Kecamatan Kedungkandang",
    nickname: "Kec. Kedungkandang",
    description: "Kecamatan Kedungkandang",
    category: "KECAMATAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. Kedungkandang No. 11",
    contactInfo: {
      phone: "(0341) 123450",
      email: "kedungkandang@kotamalang.go.id",
    },
  },
  {
    id: "opd-012",
    slug: "kecamatan-klojen",
    name: "Kecamatan Klojen",
    nickname: "Kec. Klojen",
    description: "Kecamatan Klojen sebagai pusat kota",
    category: "KECAMATAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Klojen No. 12",
    contactInfo: {
      phone: "(0341) 234501",
      email: "klojen@kotamalang.go.id",
    },
  },

  // KELURAHAN
  {
    id: "opd-013",
    slug: "kelurahan-bunulrejo",
    name: "Kelurahan Bunulrejo",
    nickname: "Kel. Bunulrejo",
    description: "Kelurahan Bunulrejo, Kecamatan Blimbing",
    category: "KELURAHAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 1,
    address: "Jl. Bunulrejo No. 13",
    contactInfo: {
      phone: "(0341) 345012",
    },
  },
  {
    id: "opd-014",
    slug: "kelurahan-polehan",
    name: "Kelurahan Polehan",
    nickname: "Kel. Polehan",
    description: "Kelurahan Polehan, Kecamatan Blimbing",
    category: "KELURAHAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 2,
    address: "Jl. Polehan No. 14",
    contactInfo: {
      phone: "(0341) 450123",
    },
  },
  {
    id: "opd-015",
    slug: "kelurahan-purwantoro",
    name: "Kelurahan Purwantoro",
    nickname: "Kel. Purwantoro",
    description: "Kelurahan Purwantoro, Kecamatan Blimbing",
    category: "KELURAHAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 3,
    address: "Jl. Purwantoro No. 15",
    contactInfo: {
      phone: "(0341) 567890",
    },
  },
  {
    id: "opd-016",
    slug: "kelurahan-blimbing",
    name: "Kelurahan Blimbing",
    nickname: "Kel. Blimbing",
    description: "Kelurahan Blimbing, Kecamatan Blimbing",
    category: "KELURAHAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 4,
    address: "Jl. Blimbing No. 16",
    contactInfo: {
      phone: "(0341) 678901",
    },
  },

  // DESA
  {
    id: "opd-017",
    slug: "desa-babakan",
    name: "Desa Babakan",
    nickname: "Desa Babakan",
    description: "Desa Babakan, Kecamatan Pujon",
    category: "DESA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 1,
    address: "Jl. Babakan No. 17",
    contactInfo: {
      phone: "(0341) 789012",
    },
  },
  {
    id: "opd-018",
    slug: "desa-pujonkidul",
    name: "Desa Pujonkidul",
    nickname: "Desa Pujonkidul",
    description: "Desa Pujonkidul, Kecamatan Pujon",
    category: "DESA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 2,
    address: "Jl. Pujonkidul No. 18",
    contactInfo: {
      phone: "(0341) 890123",
    },
  },
  {
    id: "opd-019",
    slug: "desa-madiredo",
    name: "Desa Madiredo",
    nickname: "Desa Madiredo",
    description: "Desa Madiredo, Kecamatan Pujon",
    category: "DESA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 3,
    address: "Jl. Madiredo No. 19",
    contactInfo: {
      phone: "(0341) 901234",
    },
  },

  // BAGIAN
  {
    id: "opd-020",
    slug: "bagian-umum",
    name: "Bagian Umum",
    nickname: "Bag. Umum",
    description: "Bagian Umum Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Merdeka No. 20",
    contactInfo: {
      phone: "(0341) 561234",
      email: "bagian.umum@kotamalang.go.id",
    },
  },
  {
    id: "opd-021",
    slug: "bagian-organisasi",
    name: "Bagian Organisasi",
    nickname: "Bag. Organisasi",
    description: "Bagian Organisasi Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. Merdeka No. 21",
    contactInfo: {
      phone: "(0341) 612345",
      email: "bagian.org@kotamalang.go.id",
    },
  },
  {
    id: "opd-022",
    slug: "bagian-hukum",
    name: "Bagian Hukum",
    nickname: "Bag. Hukum",
    description: "Bagian Hukum Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Merdeka No. 22",
    contactInfo: {
      phone: "(0341) 712345",
      email: "bagian.hukum@kotamalang.go.id",
    },
  },
  {
    id: "opd-023",
    slug: "bagian-protokol-dan-komunikasi-pimpinan",
    name: "Bagian Protokol dan Komunikasi Pimpinan",
    nickname: "Bag. Prokompim",
    description: "Bagian Protokol dan Komunikasi Pimpinan Setda",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Jl. Merdeka No. 23",
    contactInfo: {
      phone: "(0341) 812345",
      email: "prokompim@kotamalang.go.id",
    },
  },

  // ORGANISASI LAINNYA
  {
    id: "opd-024",
    slug: "rsud-kota",
    name: "Rumah Sakit Umum Daerah Kota",
    nickname: "RSUD Kota",
    description: "Rumah Sakit Umum Daerah milik Pemerintah Kota",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. RSUD No. 24",
    contactInfo: {
      phone: "(0341) 912345",
      email: "rsud@kotamalang.go.id",
      website: "rsud.kotamalang.go.id",
    },
    operatingHours: "24 Jam",
  },
  {
    id: "opd-025",
    slug: "pdam-kota",
    name: "Perusahaan Daerah Air Minum",
    nickname: "PDAM",
    description: "Perusahaan Daerah Air Minum Kota",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. PDAM No. 25",
    contactInfo: {
      phone: "(0341) 1234567",
      email: "pdam@kotamalang.go.id",
    },
    operatingHours: "Senin - Jumat: 08.00 - 16.00 WIB",
  },
  {
    id: "opd-026",
    slug: "pasar-kota",
    name: "Pasar Daerah Kota",
    nickname: "Pasar Kota",
    description: "Pasar Daerah yang dikelola Pemerintah Kota",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Pasar No. 26",
    contactInfo: {
      phone: "(0341) 2345678",
      email: "pasar@kotamalang.go.id",
    },
    operatingHours: "Senin - Sabtu: 06.00 - 18.00 WIB",
  },
  {
    id: "opd-027",
    slug: "parkir-terpadu",
    name: "Unit Pelaksana Teknis Parkir Terpadu",
    nickname: "UPT Parkir",
    description: "UPT Parkir Terpadu Dinas Perhubungan",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: false,
    order: 4,
    address: "Jl. Parkir No. 27",
    contactInfo: {
      phone: "(0341) 3456789",
    },
  },
];

async function main() {
  console.log("🌱 Starting OPD seed...\n");

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: {
      role: {
        name: "ADMIN",
      },
    },
  });

  if (!admin) {
    console.error("❌ Admin user not found. Please run seed-admin.ts first.");
    process.exit(1);
  }

  console.log(`👤 Using admin user: ${admin.email} (${admin.id})\n`);

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.opdActivityLog.deleteMany({});
  await prisma.serviceRelatedOpd.deleteMany({});
  await prisma.opd.deleteMany({});
  console.log("✅ Cleaned existing data\n");

  // Seed OPDs
  console.log("🏢 Seeding OPDs...");
  let created = 0;
  for (const opdData of opds) {
    await prisma.opd.create({
      data: {
        ...opdData,
        createdById: admin.id,
      },
    });
    created++;
    console.log(`  ✓ ${opdData.name} (${opdData.category})`);
  }
  console.log(`\n✅ Created ${created} OPDs\n`);

  // Create sample activity logs
  console.log("📝 Creating activity logs...");
  const sampleOpds = await prisma.opd.findMany({
    take: 5,
    where: {
      status: "AKTIF",
    },
  });

  for (const opd of sampleOpds) {
    await prisma.opdActivityLog.create({
      data: {
        opdId: opd.id,
        userId: admin.id,
        action: "created",
        changes: {
          message: `OPD "${opd.name}" created via seed script`,
        },
      },
    });
  }
  console.log(`✅ Created ${sampleOpds.length} activity logs\n`);

  console.log("✨ OPD seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`  - Total OPDs: ${opds.length}`);
  console.log(`  - DINAS: ${opds.filter((o) => o.category === "DINAS").length}`);
  console.log(`  - BADAN: ${opds.filter((o) => o.category === "BADAN").length}`);
  console.log(`  - KECAMATAN: ${opds.filter((o) => o.category === "KECAMATAN").length}`);
  console.log(`  - KELURAHAN: ${opds.filter((o) => o.category === "KELURAHAN").length}`);
  console.log(`  - DESA: ${opds.filter((o) => o.category === "DESA").length}`);
  console.log(`  - BAGIAN: ${opds.filter((o) => o.category === "BAGIAN").length}`);
  console.log(`  - ORGANISASI_LAINNYA: ${opds.filter((o) => o.category === "ORGANISASI_LAINNYA").length}`);
  console.log(`  - Activity logs: ${sampleOpds.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
