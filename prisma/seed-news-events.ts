/**
 * News & Events Seed Script
 *
 * Run: DATABASE_URL="..." npx tsx prisma/seed-news-events.ts
 */

import { PrismaClient, NewsStatus, EventStatus, EventType } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// News Categories
const newsCategories = [
  {
    id: "ncat-001",
    name: "Pemerintahan",
    slug: "pemerintahan",
    color: "blue",
    showInMenu: true,
    order: 1,
  },
  {
    id: "ncat-002",
    name: "Pembangunan",
    slug: "pembangunan",
    color: "orange",
    showInMenu: true,
    order: 2,
  },
  {
    id: "ncat-003",
    name: "Kesehatan",
    slug: "kesehatan",
    color: "red",
    showInMenu: true,
    order: 3,
  },
  {
    id: "ncat-004",
    name: "Pendidikan",
    slug: "pendidikan",
    color: "green",
    showInMenu: true,
    order: 4,
  },
  {
    id: "ncat-005",
    name: "Sosial",
    slug: "sosial",
    color: "purple",
    showInMenu: true,
    order: 5,
  },
];

// News Articles
const news = [
  {
    id: "news-001",
    slug: "resmikan-layanan-digital-terpadu",
    title: "Pemerintah Kota Resmikan Layanan Digital Terpadu",
    excerpt:
      "Layanan digital terpadu mempermudah warga mengurus administrasi secara online, mengurangi waktu tunggu hingga 70%.",
    content: `
# Pemerintah Kota Resmikan Layanan Digital Terpadu

Pemerintah Kota hari ini meresmikan sistem layanan digital terpadu yang mengintegrasikan berbagai layanan publik dalam satu platform. Peluncuran ini dilakukan langsung oleh Walikota di Balai Kota.

## Fitur Utama Layanan Digital

Sistem baru ini menawarkan berbagai fitur untuk mempermudah masyarakat:

1. **Single Sign-On (SSO)** - Satu akun untuk semua layanan
2. **Tracking Real-time** - Pantau status permohonan langsung
3. **Notifikasi WhatsApp** - Update status langsung ke HP
4. **Digital Signature** - Tanda tangan digital yang sah
5. **Payment Gateway** - Pembayaran retribusi online

## Layanan yang Tersedia

Saat ini sudah terintegrasi 25 layanan publik, termasuk:
- KTP Elektronik
- Kartu Keluarga
- Izin Mendirikan Bangunan
- Surat Izin Usaha
- Dan layanan lainnya

## Testimoni Warga

> "Sangat membantu! Dulu harus antre berjam-jam di kantor kelurahan, sekarang cukup dari rumah saja."
> — Budi Santoso, 35 tahun, warga Kecamatan Utara

Target akhir tahun 2026, seluruh layanan publik akan terintegrasi dalam sistem ini. Warga dapat mengakses melalui website atau aplikasi mobile yang tersedia di Play Store dan App Store.
    `,
    categoryId: "ncat-001",
    featured: true,
    showInMenu: true,
    order: 1,
    author: "Dinas Komunikasi dan Informatika",
    readTime: "5 min",
    tags: ["digital", "layanan publik", "inovasi"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-03-15T10:00:00Z"),
  },
  {
    id: "news-002",
    slug: "revitalisasi-taman-kota-selesai",
    title: "Revitalisasi Taman Kota Rampung Dikerjakan",
    excerpt:
      "Taman Kota kini hadir dengan wajah baru, lebih hijau dan lengkap dengan fasilitas ramah anak.",
    content: `
# Revitalisasi Taman Kota Rampung Dikerjakan

Taman Kota yang telah menjadi ikon kota ini kini hadir dengan wajah baru setelah menjalani revitalisasi selama 6 bulan. Proyek senilai Rp 2,5 miliar ini mengubah taman menjadi ruang hijau yang lebih modern dan ramah keluarga.

## Fasilitas Baru

Beberapa fasilitas baru yang dapat dinikmati warga:

- **Jogging Track** sepanjang 1,2 km
- **Taman Bermain Anak** dengan alat permainan modern
- **Area Senam** terbuka
- **Free WiFi** di seluruh area taman
- **Food Court** dengan 20 tenant lokal
- **Toilet Umum** yang bersih dan terawat

## Ruang Terbuka Hijau

Penambahan 200 pohon baru membuat taman semakin sejuk. Dipilih jenis pohon yang rindang seperti trembesi, mahoni, dan angsana.

Taman Kota kini buka setiap hari dari pukul 06.00 hingga 22.00 WIB. Tidak ada tiket masuk, gratis untuk seluruh warga.
    `,
    categoryId: "ncat-002",
    featured: true,
    showInMenu: true,
    order: 2,
    author: "Dinas Pekerjaan Umum",
    readTime: "3 min",
    tags: ["infrastruktur", "taman", "revitalisasi"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-03-20T08:00:00Z"),
  },
  {
    id: "news-003",
    slug: "posyandu-balita-lanjut-usia",
    title: "Jadwal Posyandu Balita & Lansia Bulan April",
    excerpt:
      "Cek jadwal dan lokasi posyandu di wilayah Anda. Layanan kesehatan gratis untuk balita dan lansia.",
    content: `
# Jadwal Posyandu Balita & Lansia Bulan April

Dinas Kesehatan Kota mengumumkan jadwal Posyandu Balita dan Lansia untuk bulan April 2026. Warga diharapkan membawa balita dan lansia untuk mendapatkan pelayanan kesehatan gratis.

## Jadwal Posyandu Balita

| Kecamatan | Lokasi | Jadwal | Waktu |
|-----------|--------|--------|-------|
| Utara | Balai RW 05 | Setiap Jumat minggu ke-1 | 08.00-12.00 |
| Selatan | Poskesdes Kelurahan | Setiap Rabu minggu ke-2 | 09.00-13.00 |
| Timur | Balai RW 03 | Setiap Kamis minggu ke-3 | 08.00-12.00 |
| Barat | Aula Kelurahan | Setiap Selasa minggu ke-4 | 09.00-13.00 |

## Layanan Tersedia

- Timbang badan dan ukur tinggi
- Pemberian vitamin A
- Imunisasi lengkap
- Konsultasi gizi
- Pemeriksaan kesehatan dasar

Bawa Kartu Menuju Sehat (KMS) dan buku imunisasi.
    `,
    categoryId: "ncat-003",
    featured: false,
    showInMenu: true,
    order: 3,
    author: "Dinas Kesehatan",
    readTime: "2 min",
    tags: ["kesehatan", "posyandu", "balita"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-04-01T07:00:00Z"),
  },
  {
    id: "news-004",
    slug: "beasiswa-prestasi-2026-dibuka",
    title: "Pendaftaran Beasiswa Prestasi 2026 Dibuka",
    excerpt:
      "Program beasiswa untuk mahasiswa berprestasi kurang mampu. Kuota 500 penerima dengan tunjangan Rp 2 juta/bulan.",
    content: `
# Pendaftaran Beasiswa Prestasi 2026 Dibuka

Pemerintah Kota kembali membuka program Beasiswa Prestasi untuk tahun 2026. Program ini memberikan kesempatan bagi mahasiswa berprestasi dari keluarga kurang mampu untuk melanjutkan pendidikan tinggi.

## Persyaratan Umum

1. Warga kota terbukti dengan KTP domisili
2. Mahasiswa S1 aktif semester 3-7
3. IPK minimal 3.00
4. Penghasilan orang tua maksimal Rp 3 juta/bulan
5. Tidak sedang menerima beasiswa lain

## Benefit Beasiswa

- Uang saku Rp 2.000.000/bulan
- Biaya kuliah ditanggung maksimal Rp 5.000.000/semester
- Pelatihan kepemimpinan dan soft skills
- Prioritas magang di BUMN/BUMD

## Pendaftaran

Pendaftaran dibuka hingga 30 April 2026 melalui website beasiswa.kota.go.id. Pengumuman penerima akan dilakukan pada 15 Mei 2026.
    `,
    categoryId: "ncat-004",
    featured: true,
    showInMenu: true,
    order: 4,
    author: "Dinas Pendidikan",
    readTime: "4 min",
    tags: ["beasiswa", "pendidikan", "mahasiswa"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-03-25T09:00:00Z"),
  },
  {
    id: "news-005",
    slug: "bantuan-sosial-ramadhan",
    title: "Penyaluran Bantuan Sosial Ramadhan",
    excerpt:
      "5.000 paket sembako akan disalurkan kepada keluarga kurang mampu menjelang bulan Ramadhan.",
    content: `
# Penyaluran Bantuan Sosial Ramadhan

Menjelang bulan suci Ramadhan, Pemerintah Kota akan menyalurkan 5.000 paket sembako kepada keluarga kurang mampu. Penyaluran akan dilakukan secara bertahap mulai minggu kedua bulan ini.

## Sasaran Penerima

Bantuan diperuntukkan bagi:
- Keluarga penerima PKH
- Warga terdampak COVID-19
- Kaum duafa yang terdaftar di DTKS
- Lansia dhuafa

## Jadwal Penyaluran

- Minggu 1: Kecamatan Utara & Timur
- Minggu 2: Kecamatan Selatan & Barat
- Minggu 3: Penyaluran siswa & verifikasi lapangan

Penerima dapat mengambil bantuan dengan menunjukkan KTP dan KK di lokasi yang telah ditentukan.
    `,
    categoryId: "ncat-005",
    featured: false,
    showInMenu: true,
    order: 5,
    author: "Dinas Sosial",
    readTime: "2 min",
    tags: ["bansos", "ramadhan", "sembako"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-03-28T10:30:00Z"),
  },
  {
    id: "news-006",
    slug: "festival-kuliner-nusantara",
    title: "Festival Kuliner Nusantara Kembali Digelar",
    excerpt:
      "Sajikan 100+ menu kuliner dari 34 provinsi, festival ini akan berlangsung selama 3 hari di Taman Kota.",
    content: `
# Festival Kuliner Nusantara Kembali Digelar

Setelah sukses tahun lalu, Festival Kuliner Nusantara kembali digelar untuk kedua kalinya. Event ini akan menghadirkan lebih dari 100 menu kuliner tradisional dari 34 provinsi di Indonesia.

## Highlight Festival

- **100+ Menu Kuliner** dari seluruh Indonesia
- **Cooking Demo** oleh chef terkenal
- **Lomba Makan Kerupuk** berhadiah jutaan rupiah
- **Live Music** akustik setiap malam
- **Bazar UMKM** produk lokal

## Tiket & Waktu

- Harga tiket: Rp 20.000 (gratis untuk anak di bawah 5 tahun)
- Tanggal: 15-17 April 2026
- Lokasi: Taman Kota
- Waktu: 10.00-22.00 WIB

Festival ini diharapkan dapat mempromosikan kekayaan kuliner nusantara sekaligus mendukung UMKM lokal.
    `,
    categoryId: "ncat-002",
    featured: true,
    showInMenu: true,
    order: 6,
    author: "Dinas Pariwisata",
    readTime: "3 min",
    tags: ["festival", "kuliner", "pariwisata"],
    status: "PUBLISHED" as NewsStatus,
    publishedAt: new Date("2026-04-02T08:00:00Z"),
  },
];

// Event Categories
const eventCategories = [
  {
    id: "ecat-001",
    name: "Pemerintahan",
    slug: "pemerintahan",
    color: "blue",
    showInMenu: true,
    order: 1,
  },
  {
    id: "ecat-002",
    name: "Budaya",
    slug: "budaya",
    color: "purple",
    showInMenu: true,
    order: 2,
  },
  {
    id: "ecat-003",
    name: "Olahraga",
    slug: "olahraga",
    color: "green",
    showInMenu: true,
    order: 3,
  },
  {
    id: "ecat-004",
    name: "Pendidikan",
    slug: "pendidikan",
    color: "orange",
    showInMenu: true,
    order: 4,
  },
];

// Events
const events = [
  {
    id: "evt-001",
    slug: "musrenbang-2026",
    title: "Musyawarah Perencanaan Pembangunan 2026",
    description:
      "Forum musyawarah antar pemangku kepentingan untuk menyusun rencana pembangunan tahun 2027.",
    categoryId: "ecat-001",
    date: new Date("2026-04-15"),
    time: "09.00-15.00 WIB",
    location: "Aula Balai Kota",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Bappeda Kota",
    organizerContact: "bappeda@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://forms.kota.go.id/musrenbang",
    maxAttendees: 100,
    featured: true,
    showInMenu: true,
    order: 1,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-002",
    slug: "festival-budaya-nusantara",
    title: "Festival Budaya Nusantara 2026",
    description:
      "Pertunjukan seni budaya dari berbagai daerah di Indonesia. Tarian tradisional, musik daerah, dan pameran kerajinan.",
    categoryId: "ecat-002",
    date: new Date("2026-04-20"),
    time: "10.00-22.00 WIB",
    location: "Taman Kota",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Kebudayaan",
    organizerContact: "kebudayaan@kota.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: true,
    showInMenu: true,
    order: 2,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-003",
    slug: "lari-lintas-alam",
    title: "Lomba Lari Lintas Alam 2026",
    description:
      "Kompetisi lari lintas alam dengan jarak 5K dan 10K melalui rute sekitar kota yang indah.",
    categoryId: "ecat-003",
    date: new Date("2026-05-01"),
    time: "06.30-11.00 WIB",
    location: "Start/Finish di Stadion Utama",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Pemuda dan Olahraga",
    organizerContact: "dispora@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://lari.kota.go.id",
    maxAttendees: 500,
    featured: true,
    showInMenu: true,
    order: 3,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-004",
    slug: "seminar-digital-marketing",
    title: "Seminar Digital Marketing untuk UMKM",
    description:
      "Pelatihan digital marketing gratis untuk pelaku UMKM. Topik: SEO, Social Media Marketing, dan E-commerce.",
    categoryId: "ecat-004",
    date: new Date("2026-04-10"),
    time: "09.00-16.00 WIB",
    location: "Grand Ballroom Hotel Merdeka",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Koperasi dan UMKM",
    organizerContact: "diskumkm@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://umkm.kota.go.id/seminar",
    maxAttendees: 200,
    featured: false,
    showInMenu: true,
    order: 4,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-005",
    slug: "webinar-keamanan-siber",
    title: "Webinar: Keamanan Siber di Era Digital",
    description:
      "Webinar interaktif tentang pentingnya keamanan siber dan cara melindungi data pribadi secara online.",
    categoryId: "ecat-004",
    date: new Date("2026-04-18"),
    time: "13.00-15.30 WIB",
    location: "Online (Zoom)",
    locationUrl: "https://zoom.us/j/example",
    type: "ONLINE" as EventType,
    organizer: "Diskominfo & CSIRT",
    organizerContact: "csirt@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://webinar.kota.go.id/cybersecurity",
    maxAttendees: 500,
    featured: false,
    showInMenu: true,
    order: 5,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-006",
    slug: "pameran-ukm-produk-lokal",
    title: "Pameran UMKM Produk Lokal",
    description:
      "Pameran dan bazar produk-produk UMKM lokal. Temukan berbagai produk kreatif dan kuliner khas daerah.",
    categoryId: "ecat-002",
    date: new Date("2026-04-22"),
    time: "10.00-21.00 WIB",
    location: "Hall Mall Kota",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dinas Perdagangan & UMKM",
    organizerContact: "perdagangan@kota.go.id",
    registrationRequired: false,
    registrationUrl: null,
    maxAttendees: null,
    featured: false,
    showInMenu: true,
    order: 6,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-007",
    slug: "turnamen-bola-volli-piala-walikota",
    title: "Turnamen Bola Voli Piala Walikota",
    description:
      "Kompetisi bola voli antar klub se-kota. Total hadiah Rp 10 juta untuk juara 1, 2, dan 3.",
    categoryId: "ecat-003",
    date: new Date("2026-04-25"),
    time: "08.00-17.00 WIB",
    location: "Gelora Sport Hall",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Dispora & PBVSI",
    organizerContact: "dispora@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://voli.kota.go.id",
    maxAttendees: 500,
    featured: false,
    showInMenu: true,
    order: 7,
    status: "PUBLISHED" as EventStatus,
  },
  {
    id: "evt-008",
    slug: "workshop-fotografi-smartphone",
    title: "Workshop Fotografi Smartphone",
    description:
      "Belajar teknik fotografi profesional menggunakan smartphone. Materi: Komposisi, Lighting, dan Editing.",
    categoryId: "ecat-002",
    date: new Date("2026-04-08"),
    time: "09.00-15.00 WIB",
    location: "Creative Hub",
    locationUrl: null,
    type: "OFFLINE" as EventType,
    organizer: "Komunitas Fotografi Kota",
    organizerContact: "fotografi@kota.go.id",
    registrationRequired: true,
    registrationUrl: "https://foto.kota.go.id/workshop",
    maxAttendees: 30,
    featured: false,
    showInMenu: true,
    order: 8,
    status: "PUBLISHED" as EventStatus,
  },
];

async function main() {
  console.log("🌱 Starting news & events seed...\n");

  // Get admin user
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

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.newsActivityLog.deleteMany({});
  await prisma.eventActivityLog.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.newsCategory.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.eventCategory.deleteMany({});
  console.log("✅ Cleaned existing data\n");

  // Seed news categories
  console.log("📁 Seeding news categories...");
  for (const category of newsCategories) {
    await prisma.newsCategory.create({
      data: category,
    });
    console.log(`  ✓ ${category.name}`);
  }
  console.log(`✅ Created ${newsCategories.length} news categories\n`);

  // Seed news
  console.log("📰 Seeding news articles...");
  for (const article of news) {
    await prisma.news.create({
      data: {
        ...article,
        createdById: admin.id,
      },
    });
    console.log(`  ✓ ${article.title}`);
  }
  console.log(`✅ Created ${news.length} news articles\n`);

  // Seed event categories
  console.log("📁 Seeding event categories...");
  for (const category of eventCategories) {
    await prisma.eventCategory.create({
      data: category,
    });
    console.log(`  ✓ ${category.name}`);
  }
  console.log(`✅ Created ${eventCategories.length} event categories\n`);

  // Seed events
  console.log("📅 Seeding events...");
  for (const event of events) {
    await prisma.event.create({
      data: {
        ...event,
        createdById: admin.id,
      },
    });
    console.log(`  ✓ ${event.title}`);
  }
  console.log(`✅ Created ${events.length} events\n`);

  // Create activity logs
  console.log("📝 Creating activity logs...");
  const sampleNews = await prisma.news.findMany({
    take: 3,
    where: {
      status: "PUBLISHED",
    },
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
    where: {
      status: "PUBLISHED",
    },
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

  console.log(
    `✅ Created ${sampleNews.length + sampleEvents.length} activity logs\n`
  );

  console.log("✨ Seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`  - News Categories: ${newsCategories.length}`);
  console.log(`  - News Articles: ${news.length}`);
  console.log(`  - Event Categories: ${eventCategories.length}`);
  console.log(`  - Events: ${events.length}`);
  console.log(`  - Activity Logs: ${sampleNews.length + sampleEvents.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
