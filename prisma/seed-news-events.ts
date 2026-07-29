/**
 * News & Events Seed Script
 *
 * Run: DATABASE_URL="..." pnpm seed:news-events
 */

import { EventStatus, EventType, NewsStatus, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

for (const envFile of [
  ".env.local",
  ".env",
  "apps/backoffice/.env.local",
  "apps/backoffice/.env",
]) {
  if (fs.existsSync(path.resolve(process.cwd(), envFile))) {
    dotenv.config({ path: envFile });
  }
}

const prisma = new PrismaClient();

const newsCategories = [
  { id: "ncat-001", name: "Pemerintahan", slug: "pemerintahan", color: "blue", showInMenu: true, order: 1 },
  { id: "ncat-002", name: "Infrastruktur", slug: "infrastruktur", color: "orange", showInMenu: true, order: 2 },
  { id: "ncat-003", name: "Kesehatan", slug: "kesehatan", color: "red", showInMenu: true, order: 3 },
  { id: "ncat-004", name: "Pendidikan", slug: "pendidikan", color: "green", showInMenu: true, order: 4 },
  { id: "ncat-005", name: "Sosial", slug: "sosial", color: "purple", showInMenu: true, order: 5 },
  { id: "ncat-006", name: "Pariwisata", slug: "pariwisata", color: "cyan", showInMenu: true, order: 6 },
];

const news = [
  {
    id: "news-001",
    slug: "pemkab-malang-luncurkan-layanan-aduan-terpadu",
    title: "Pemkab Malang Luncurkan Layanan Aduan Terpadu",
    excerpt:
      "Pemerintah Kabupaten Malang meluncurkan kanal aduan terpadu untuk memudahkan warga menyampaikan laporan layanan publik secara cepat.",
    content: `
# Pemkab Malang Luncurkan Layanan Aduan Terpadu

Pemerintah Kabupaten Malang meluncurkan layanan aduan terpadu sebagai bagian dari peningkatan kualitas pelayanan publik. Kanal baru ini memusatkan laporan warga agar lebih cepat diteruskan ke perangkat daerah terkait.

## Fitur Utama

- Satu pintu untuk laporan masyarakat
- Pelacakan status tindak lanjut
- Integrasi dengan kanal layanan publik daerah
- Notifikasi pembaruan laporan

## Dampak untuk Warga

Layanan ini diharapkan membantu warga memantau penanganan laporan tanpa harus datang langsung ke kantor dinas. Pemkab juga menyiapkan petugas verifikasi untuk memastikan laporan diteruskan ke unit yang tepat.
    `,
    categoryId: "ncat-001",
    featured: true,
    showInMenu: true,
    order: 1,
    author: "Dinas Komunikasi dan Informatika",
    readTime: "4 min",
    tags: ["layanan publik", "aduan warga", "digitalisasi"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-15T03:00:00.000Z"),
    opdKey: "kominfo",
  },
  {
    id: "news-002",
    slug: "normalisasi-drainase-dan-jalan-lingkungan-dikebut",
    title: "Normalisasi Drainase dan Jalan Lingkungan Dikebut",
    excerpt:
      "Program normalisasi drainase dan perbaikan jalan lingkungan dipercepat menjelang musim hujan di sejumlah kecamatan prioritas.",
    content: `
# Normalisasi Drainase dan Jalan Lingkungan Dikebut

Dinas teknis di Kabupaten Malang mempercepat pengerjaan normalisasi drainase dan perbaikan jalan lingkungan di titik-titik rawan genangan. Kegiatan ini diprioritaskan di kawasan permukiman padat dan ruas yang menjadi akses utama warga.

## Kegiatan Pekerjaan

- Pembersihan saluran air
- Perapian bahu jalan lingkungan
- Perbaikan titik rusak ringan
- Peninjauan saluran tersumbat

## Tujuan

Langkah ini dilakukan untuk mengurangi risiko banjir lokal serta meningkatkan kenyamanan mobilitas warga saat musim hujan.
    `,
    categoryId: "ncat-002",
    featured: true,
    showInMenu: true,
    order: 2,
    author: "Dinas Pekerjaan Umum",
    readTime: "3 min",
    tags: ["infrastruktur", "drainase", "jalan lingkungan"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-13T03:00:00.000Z"),
    opdKey: "pu",
  },
  {
    id: "news-003",
    slug: "posyandu-digital-mulai-diterapkan-di-kepanjen",
    title: "Posyandu Digital Mulai Diterapkan di Kepanjen",
    excerpt:
      "Layanan Posyandu di sejumlah titik Kepanjen mulai memakai pencatatan digital untuk mempercepat pemantauan kesehatan balita dan lansia.",
    content: `
# Posyandu Digital Mulai Diterapkan di Kepanjen

Dinas Kesehatan Kabupaten Malang mulai menerapkan pencatatan digital di Posyandu wilayah Kepanjen. Sistem ini membantu kader mencatat data kesehatan secara lebih rapi dan mempercepat rekapitulasi bulanan.

## Manfaat Sistem Baru

- Rekap data lebih cepat
- Histori layanan lebih mudah ditelusuri
- Pemantauan balita dan lansia lebih konsisten
- Mendukung perencanaan intervensi kesehatan

Warga yang datang ke Posyandu tetap mendapatkan layanan pemeriksaan dasar seperti penimbangan, pengukuran tinggi badan, dan konsultasi gizi.
    `,
    categoryId: "ncat-003",
    featured: true,
    showInMenu: true,
    order: 3,
    author: "Dinas Kesehatan",
    readTime: "3 min",
    tags: ["posyandu", "kesehatan", "digital"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-11T03:00:00.000Z"),
    opdKey: "dinkes",
  },
  {
    id: "news-004",
    slug: "beasiswa-prestasi-daerah-dibuka-untuk-mahasiswa",
    title: "Beasiswa Prestasi Daerah Dibuka untuk Mahasiswa",
    excerpt:
      "Pemkab Malang membuka pendaftaran beasiswa prestasi bagi mahasiswa asal Kabupaten Malang dari keluarga kurang mampu.",
    content: `
# Beasiswa Prestasi Daerah Dibuka untuk Mahasiswa

Pemerintah Kabupaten Malang kembali membuka pendaftaran beasiswa prestasi daerah. Program ini ditujukan untuk mahasiswa aktif yang memiliki capaian akademik baik dan berasal dari keluarga kurang mampu.

## Syarat Umum

- Berdomisili di Kabupaten Malang
- Mahasiswa aktif semester berjalan
- Memiliki IPK minimal sesuai ketentuan
- Tidak sedang menerima beasiswa lain

## Dukungan Program

Penerima beasiswa akan mendapatkan bantuan biaya pendidikan dan pendampingan selama masa studi. Program ini menjadi bagian dari upaya meningkatkan kualitas sumber daya manusia daerah.
    `,
    categoryId: "ncat-004",
    featured: false,
    showInMenu: true,
    order: 4,
    author: "Dinas Pendidikan",
    readTime: "4 min",
    tags: ["beasiswa", "mahasiswa", "pendidikan"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-09T03:00:00.000Z"),
    opdKey: "diknas",
  },
  {
    id: "news-005",
    slug: "bantuan-pangan-cadangan-disalurkan-ke-keluarga-rentan",
    title: "Bantuan Pangan Cadangan Disalurkan ke Keluarga Rentan",
    excerpt:
      "Dinas Sosial menyalurkan bantuan pangan cadangan bagi keluarga rentan di beberapa kecamatan prioritas di Kabupaten Malang.",
    content: `
# Bantuan Pangan Cadangan Disalurkan ke Keluarga Rentan

Dinas Sosial Kabupaten Malang menyalurkan bantuan pangan cadangan kepada keluarga rentan dan warga dengan kondisi sosial tertentu. Penyaluran dilakukan bertahap agar tepat sasaran.

## Sasaran Penerima

- Keluarga rentan ekonomi
- Lansia yang membutuhkan dukungan
- Warga terdampak kondisi darurat
- Kelompok penerima sesuai hasil verifikasi lapangan

## Mekanisme

Petugas pendamping dan perangkat desa memastikan data penerima sesuai dengan daftar yang telah diverifikasi sehingga bantuan diterima oleh warga yang berhak.
    `,
    categoryId: "ncat-005",
    featured: false,
    showInMenu: true,
    order: 5,
    author: "Dinas Sosial",
    readTime: "3 min",
    tags: ["bantuan sosial", "pangan", "warga rentan"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-07T03:00:00.000Z"),
    opdKey: "dinsos",
  },
  {
    id: "news-006",
    slug: "festival-kampung-heritage-kepanjen-hidupkan-ekonomi-warga",
    title: "Festival Kampung Heritage Kepanjen Hidupkan Ekonomi Warga",
    excerpt:
      "Festival budaya dan UMKM di Kepanjen menarik banyak pengunjung serta mendorong transaksi produk lokal masyarakat setempat.",
    content: `
# Festival Kampung Heritage Kepanjen Hidupkan Ekonomi Warga

Pemerintah Kabupaten Malang bersama komunitas lokal menggelar festival kampung heritage di Kepanjen. Acara ini menampilkan pertunjukan seni, pameran foto sejarah, dan bazar produk UMKM.

## Isi Kegiatan

- Pameran sejarah lokal
- Pentas seni tradisional
- Bazar UMKM dan kuliner daerah
- Tur edukasi kawasan heritage

## Manfaat

Selain memperkuat identitas budaya, kegiatan ini memberi ruang promosi bagi pelaku UMKM dan mendorong aktivitas ekonomi warga di sekitar lokasi acara.
    `,
    categoryId: "ncat-006",
    featured: true,
    showInMenu: true,
    order: 6,
    author: "Dinas Pariwisata dan Kebudayaan",
    readTime: "4 min",
    tags: ["budaya", "umkm", "pariwisata"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-06-04T03:00:00.000Z"),
    opdKey: "disparbud",
  },
];

const eventCategories = [
  { id: "ecat-001", name: "Pemerintahan", slug: "pemerintahan", color: "blue", showInMenu: true, order: 1 },
  { id: "ecat-002", name: "Sosial", slug: "sosial", color: "purple", showInMenu: true, order: 2 },
  { id: "ecat-003", name: "Budaya", slug: "budaya", color: "violet", showInMenu: true, order: 3 },
  { id: "ecat-004", name: "Kesehatan", slug: "kesehatan", color: "red", showInMenu: true, order: 4 },
  { id: "ecat-005", name: "Pendidikan", slug: "pendidikan", color: "green", showInMenu: true, order: 5 },
  { id: "ecat-006", name: "Olahraga", slug: "olahraga", color: "emerald", showInMenu: true, order: 6 },
  { id: "ecat-007", name: "Pariwisata", slug: "pariwisata", color: "cyan", showInMenu: true, order: 7 },
];

const events = [
  {
    id: "evt-001",
    slug: "musrenbang-kecamatan-kepanjen-2026",
    title: "Musrenbang Kecamatan Kepanjen 2026",
    description:
      "Forum musyawarah perencanaan pembangunan untuk menyusun prioritas program tingkat kecamatan bersama warga dan perangkat daerah.",
    categoryId: "ecat-001",
    date: new Date("2026-06-19"),
    time: "09.00-15.00 WIB",
    location: "Aula Kecamatan Kepanjen",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "BAPPEDA Kabupaten Malang",
    organizerContact: "bappeda@malangkab.go.id",
    registrationRequired: true,
    registrationUrl: "https://malangkab.go.id",
    maxAttendees: 120,
    featured: true,
    showInMenu: true,
    order: 1,
    status: "PUBLISHED" as EventStatus,
    opdKey: "bappeda",
  },
  {
    id: "evt-002",
    slug: "pasar-murah-dan-layanan-adminduk",
    title: "Pasar Murah dan Layanan Adminduk",
    description:
      "Kegiatan layanan terpadu yang menghadirkan pasar murah, konsultasi administrasi kependudukan, dan pengecekan dokumen dasar.",
    categoryId: "ecat-002",
    date: new Date("2026-06-22"),
    time: "08.00-13.00 WIB",
    location: "Lapangan Desa Candirenggo",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Kependudukan dan Pencatatan Sipil",
    organizerContact: "dispendukcapil@malangkab.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: true,
    showInMenu: true,
    order: 2,
    status: "PUBLISHED" as EventStatus,
    opdKey: "dispendukcapil",
  },
  {
    id: "evt-003",
    slug: "festival-kampung-heritage-kepanjen",
    title: "Festival Kampung Heritage Kepanjen",
    description:
      "Festival budaya yang menampilkan seni tradisional, pameran sejarah lokal, dan bazar UMKM dari masyarakat sekitar.",
    categoryId: "ecat-003",
    date: new Date("2026-06-28"),
    time: "10.00-21.00 WIB",
    location: "Alun-alun Kepanjen",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Pariwisata dan Kebudayaan",
    organizerContact: "disparbud@malangkab.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: true,
    showInMenu: true,
    order: 3,
    status: "PUBLISHED" as EventStatus,
    opdKey: "disparbud",
  },
  {
    id: "evt-004",
    slug: "webinar-gizi-balita-dan-pencegahan-stunting",
    title: "Webinar Gizi Balita dan Pencegahan Stunting",
    description:
      "Sesi edukasi kesehatan keluarga mengenai gizi balita, pemantauan tumbuh kembang, dan pencegahan stunting bersama narasumber kesehatan daerah.",
    categoryId: "ecat-004",
    date: new Date("2026-07-02"),
    time: "13.00-15.30 WIB",
    location: "Online (Zoom)",
    locationUrl: "https://zoom.us",
    type: "ONLINE" as EventType,
    organizer: "Dinas Kesehatan Kabupaten Malang",
    organizerContact: "dinkes@malangkab.go.id",
    registrationRequired: true,
    registrationUrl: "https://malangkab.go.id",
    maxAttendees: 500,
    featured: false,
    showInMenu: true,
    order: 4,
    status: "PUBLISHED" as EventStatus,
    opdKey: "dinkes",
  },
  {
    id: "evt-005",
    slug: "lokakarya-literasi-digital-pelajar",
    title: "Lokakarya Literasi Digital Pelajar",
    description:
      "Pelatihan untuk pelajar dan guru mengenai keamanan digital, etika bermedia sosial, serta pemanfaatan teknologi untuk pembelajaran.",
    categoryId: "ecat-005",
    date: new Date("2026-07-06"),
    time: "09.00-16.00 WIB",
    location: "Aula Dinas Pendidikan",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Pendidikan Kabupaten Malang",
    organizerContact: "dispendik@malangkab.go.id",
    registrationRequired: true,
    registrationUrl: "https://malangkab.go.id",
    maxAttendees: 180,
    featured: false,
    showInMenu: true,
    order: 5,
    status: "PUBLISHED" as EventStatus,
    opdKey: "diknas",
  },
  {
    id: "evt-006",
    slug: "gerak-jalan-sehat-hut-kabupaten-malang",
    title: "Gerak Jalan Sehat HUT Kabupaten Malang",
    description:
      "Kegiatan olahraga massal untuk warga dengan rute ringan, doorprize, dan kampanye hidup sehat bagi keluarga.",
    categoryId: "ecat-006",
    date: new Date("2026-07-12"),
    time: "06.00-09.30 WIB",
    location: "Start: Stadion Kanjuruhan",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Pemuda dan Olahraga Kabupaten Malang",
    organizerContact: "dispora@malangkab.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: false,
    showInMenu: true,
    order: 6,
    status: "PUBLISHED" as EventStatus,
    opdKey: "dispora",
  },
  {
    id: "evt-007",
    slug: "expo-pariwisata-dan-umkm-pantai-selatan",
    title: "Expo Pariwisata dan UMKM Pantai Selatan",
    description:
      "Pameran destinasi wisata dan produk UMKM dari wilayah selatan Kabupaten Malang untuk menarik kunjungan wisatawan.",
    categoryId: "ecat-007",
    date: new Date("2026-07-18"),
    time: "10.00-20.00 WIB",
    location: "Balai Desa Sumbermanjing Wetan",
    locationUrl: null,
    type: "HYBRID" as EventType,
    organizer: "Dinas Pariwisata dan Kebudayaan",
    organizerContact: "disparbud@malangkab.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: false,
    showInMenu: true,
    order: 7,
    status: "PUBLISHED" as EventStatus,
    opdKey: "disparbud",
  },
  {
    id: "evt-008",
    slug: "forum-konsultasi-publik-rpjmd-2026",
    title: "Forum Konsultasi Publik RPJMD 2026",
    description:
      "Forum konsultasi publik untuk menyerap masukan warga terhadap arah pembangunan jangka menengah daerah.",
    categoryId: "ecat-001",
    date: new Date("2026-07-24"),
    time: "09.00-14.00 WIB",
    location: "Pendopo Agung Kabupaten Malang",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "BAPPEDA Kabupaten Malang",
    organizerContact: "bappeda@malangkab.go.id",
    registrationRequired: true,
    registrationUrl: "https://malangkab.go.id",
    maxAttendees: 100,
    featured: false,
    showInMenu: true,
    order: 8,
    status: "PUBLISHED" as EventStatus,
    opdKey: "bappeda",
  },
];

async function main() {
  console.log("🌱 Starting news & events seed...\n");

  const admin = await prisma.user.findFirst({
    where: {
      role: {
        name: "ADMIN",
      },
    },
  });

  if (!admin) {
    console.error("❌ Admin user not found.");
    process.exit(1);
  }

  console.log(`👤 Using admin user: ${admin.email} (${admin.id})\n`);

  const [kominfo, pu, dinkes, diknas, dinsos, bappeda, disparbud, disnaker, dispora, dispendukcapil] = await Promise.all([
    prisma.opd.findFirst({ where: { slug: "dinas-komunikasi-dan-informatika" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-pekerjaan-umum" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-kesehatan" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-pendidikan" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-sosial" } }),
    prisma.opd.findFirst({ where: { slug: "bappeda" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-pariwisata-dan-kebudayaan" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-tenaga-kerja" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-pemuda-dan-olahraga" } }),
    prisma.opd.findFirst({ where: { slug: "dinas-kependudukan-dan-pencatatan-sipil" } }),
  ]);

  const opdMap: Record<string, string | undefined> = {
    kominfo: kominfo?.id,
    pu: pu?.id,
    dinkes: dinkes?.id,
    diknas: diknas?.id,
    dinsos: dinsos?.id,
    bappeda: bappeda?.id,
    disparbud: disparbud?.id,
    disnaker: disnaker?.id,
    dispora: dispora?.id,
    dispendukcapil: dispendukcapil?.id,
  };

  console.log("🧹 Cleaning existing data...");
  await prisma.newsActivityLog.deleteMany({});
  await prisma.eventActivityLog.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.newsCategory.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.eventCategory.deleteMany({});
  console.log("✅ Cleaned existing data\n");

  console.log("📁 Seeding news categories...");
  for (const category of newsCategories) {
    await prisma.newsCategory.create({ data: category });
    console.log(`  ✓ ${category.name}`);
  }
  console.log(`✅ Created ${newsCategories.length} news categories\n`);

  console.log("📰 Seeding news articles...");
  for (const article of news) {
    const { opdKey, ...newsData } = article as typeof article & { opdKey?: string };

    await prisma.news.create({
      data: {
        ...newsData,
        createdById: admin.id,
        updatedById: admin.id,
        opdId: opdKey ? opdMap[opdKey] ?? null : null,
      },
    });
    console.log(`  ✓ ${article.title}`);
  }
  console.log(`✅ Created ${news.length} news articles\n`);

  console.log("📁 Seeding event categories...");
  for (const category of eventCategories) {
    await prisma.eventCategory.create({ data: category });
    console.log(`  ✓ ${category.name}`);
  }
  console.log(`✅ Created ${eventCategories.length} event categories\n`);

  console.log("📅 Seeding events...");
  for (const event of events) {
    const { opdKey, ...eventData } = event as typeof event & { opdKey?: string };

    await prisma.event.create({
      data: {
        ...eventData,
        createdById: admin.id,
        updatedById: admin.id,
        opdId: opdKey ? opdMap[opdKey] ?? null : null,
      },
    });
    console.log(`  ✓ ${event.title}`);
  }
  console.log(`✅ Created ${events.length} events\n`);

  console.log("📝 Creating activity logs...");
  const sampleNews = await prisma.news.findMany({
    take: 3,
    where: { status: "PUBLISHED" },
  });

  for (const article of sampleNews) {
    await prisma.newsActivityLog.create({
      data: {
        newsId: article.id,
        userId: admin.id,
        action: "created",
        changes: {
          message: `News "${article.title}" created via seed script`,
        },
      },
    });
  }

  const sampleEvents = await prisma.event.findMany({
    take: 3,
    where: { status: "PUBLISHED" },
  });

  for (const event of sampleEvents) {
    await prisma.eventActivityLog.create({
      data: {
        eventId: event.id,
        userId: admin.id,
        action: "created",
        changes: {
          message: `Event "${event.title}" created via seed script`,
        },
      },
    });
  }

  console.log(`✅ Created ${sampleNews.length + sampleEvents.length} activity logs\n`);

  console.log("✨ Seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`  - News Categories: ${newsCategories.length}`);
  console.log(`  - News Articles: ${news.length}`);
  console.log(`  - Event Categories: ${eventCategories.length}`);
  console.log(`  - Events: ${events.length}`);
  console.log(`  - Activity Logs: ${sampleNews.length + sampleEvents.length}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
