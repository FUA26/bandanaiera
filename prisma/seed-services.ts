/**
 * Services Seed Script
 *
 * Run: npx tsx prisma/seed-services.ts
 * Or: npm run seed:services (if added to package.json)
 */

import { PrismaClient, ServiceStatus } from "@prisma/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// Sample service categories
const serviceCategories = [
  {
    id: "cat-001",
    name: "Kependudukan",
    slug: "kependudukan",
    icon: "Users",
    color: "blue",
    bgColor: "bg-blue-50",
    showInMenu: true,
    order: 1,
  },
  {
    id: "cat-002",
    name: "Perizinan",
    slug: "perizinan",
    icon: "FileText",
    color: "purple",
    bgColor: "bg-purple-50",
    showInMenu: true,
    order: 2,
  },
  {
    id: "cat-003",
    name: "Kesehatan",
    slug: "kesehatan",
    icon: "Heart",
    color: "red",
    bgColor: "bg-red-50",
    showInMenu: true,
    order: 3,
  },
  {
    id: "cat-004",
    name: "Pendidikan",
    slug: "pendidikan",
    icon: "BookOpen",
    color: "green",
    bgColor: "bg-green-50",
    showInMenu: true,
    order: 4,
  },
  {
    id: "cat-005",
    name: "Infrastruktur",
    slug: "infrastruktur",
    icon: "Building",
    color: "orange",
    bgColor: "bg-orange-50",
    showInMenu: true,
    order: 5,
  },
  {
    id: "cat-006",
    name: "Sosial",
    slug: "sosial",
    icon: "HandsHelping",
    color: "pink",
    bgColor: "bg-pink-50",
    showInMenu: true,
    order: 6,
  },
];

// Sample services
const services = [
  // Kependudukan
  {
    id: "srv-001",
    slug: "pembuatan-ktp",
    icon: "IdCard",
    name: "Pembuatan KTP Elektronik",
    description: "Layanan pembuatan KTP-el baru bagi warga yang belum memiliki",
    categoryId: "cat-001",
    badge: "Populer",
    stats: "15rb+ permohonan",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "Kartu Tanda Penduduk elektronik (KTP-el) adalah dokumen resmi yang diperlukan untuk berbagai keperluan administratif. Layanan ini mencakup perekaman biometrik, foto, dan penerbitan KTP-el baru.",
    requirements: [
      "Usia minimal 17 tahun atau sudah menikah",
      "Memiliki NIK",
      "Surat pengantar dari RT/RW",
      "Kartu keluarga (KK) asli",
      "Akta kelahiran (bagi yang baru rekam)",
    ],
    process: [
      "Datang ke loket pelayanan dengan berkas lengkap",
      "Isi formulir permohonan",
      "Perekaman data biometrik (sidik jari, foto, iris)",
      "Tanda tangan digital",
      "Ambil bukti perekaman",
      "KTP-el jadi dalam 14 hari kerja",
    ],
    duration: "14 hari kerja",
    cost: "Gratis",
    contactInfo: {
      office: "Dinas Kependudukan dan Catatan Sipil",
      phone: "(021) 1234-5678",
      email: "disdukcapil@kota.go.id",
    },
    faqs: [
      {
        question: "Apakah bisa diwakilkan?",
        answer: "Tidak, perekaman KTP-el harus hadir langsung karena perekaman biometrik.",
      },
      {
        question: "Berapa lama KTP-el jadi?",
        answer: "KTP-el akan jadi dalam waktu 14 hari kerja sejak perekaman.",
      },
    ],
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-002",
    slug: "pembuatan-kk",
    icon: "Users",
    name: "Pembuatan Kartu Keluarga",
    description: "Layanan pembuatan KK baru untuk keluarga yang baru terbentuk",
    categoryId: "cat-001",
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription:
      "Kartu Keluarga (KK) adalah dokumen yang memuat data tentang identitas dan hubungan kekerabatan antar anggota keluarga. Wajib dimiliki setiap keluarga.",
    requirements: [
      "Surat pengantar RT/RW",
      "Buku nikah/akta nikah (bagi yang baru menikah)",
      "KTP suami dan istri",
      "Akta kelahiran anak-anak (jika ada)",
    ],
    process: [
      "Siapkan semua berkas persyaratan",
      "Datang ke kelurahan/kecamatan",
      "Isi formulir permohonan KK",
      "Verifikasi berkas oleh petugas",
      "KK diterbitkan saat itu juga",
    ],
    duration: "1 hari",
    cost: "Gratis",
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-003",
    slug: "surat-pindah",
    icon: "Move3D",
    name: "Surat Keterangan Pindah",
    description: "Dokumen untuk warga yang akan pindah domisili",
    categoryId: "cat-001",
    showInMenu: true,
    order: 3,
    isIntegrated: false,
    detailedDescription:
      "Surat Keterangan Pindah (SKPWNI) diperlukan bagi warga yang akan pindah domisili ke wilayah lain. Dokumen ini menjadi syarat administratif di daerah tujuan.",
    requirements: [
      "KTP asli dan fotokopi",
      "KK asli dan fotokopi",
      "Surat pengantar RT/RW",
      "Alasan pindah (kerja, nikah, dll)",
      "Alamat tujuan pindah",
    ],
    process: [
      "Datang ke kelurahan dengan berkas lengkap",
      "Isi formulir F-1.01 (Formulir Permohonan Pindah WNI)",
      "Wawancara dengan petugas",
      "Verifikasi dokumen",
      "Terbit SKPWNI",
    ],
    duration: "2-3 hari",
    cost: "Gratis",
    status: "PUBLISHED" as ServiceStatus,
  },

  // Perizinan
  {
    id: "srv-004",
    slug: "imb-rumah",
    icon: "Home",
    name: "IMB Rumah Tinggal",
    description: "Izin Mendirikan Bangunan untuk rumah tinggal",
    categoryId: "cat-002",
    badge: "Terintegrasi",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "Izin Mendirikan Bangunan (IMB) adalah izin yang diberikan oleh pemda kepada pemilik bangunan untuk mendirikan bangunan baru. Wajib dimiliki sebelum konstruksi dimulai.",
    requirements: [
      "KTP dan KK pemilik",
      "Sertifikat tanah atau girik",
      "Denah bangunan (rencana)",
      "Foto situasi lokasi",
      "Surat pernyataan tidak sengketa",
    ],
    process: [
      "Upload dokumen melalui sistem PTSP online",
      "Verifikasi administratif",
      "Survey lokasi oleh tim teknis",
      "Pembayaran BPHTB dan retribusi",
      "Terbit IMB",
    ],
    duration: "14 hari kerja",
    cost: "Retribusi sesuai luas bangunan",
    contactInfo: {
      office: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
      phone: "(021) 2345-6789",
      email: "ptsp@kota.go.id",
    },
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-005",
    slug: "siup-mikro",
    icon: "Briefcase",
    name: "SIUP Usaha Mikro",
    description: "Surat Izin Usaha Perdagangan untuk usaha mikro",
    categoryId: "cat-002",
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription:
      "SIUP (Surat Izin Usaha Perdagangan) adalah izin yang diperlukan untuk melakukan kegiatan usaha perdagangan. Untuk usaha mikro dengan omzet di bawah 50 juta rupiah.",
    requirements: [
      "KTP dan KK pemilik",
      "NPWP (jika ada)",
      "Foto tempat usaha",
      "Surat keterangan domisili usaha",
      "Bukti kepemilikan/sewa tempat usaha",
    ],
    process: [
      "Daftar online melalui OSS (Online Single Submission)",
      "Isi data perusahaan dan usaha",
      "Upload dokumen persyaratan",
      "Verifikasi oleh dinas perdagangan",
      "Terbit NIB dan SIUP",
    ],
    duration: "1 hari kerja",
    cost: "Gratis",
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-006",
    slug: "ho-hiburan",
    icon: "Music",
    name: "Izin Usaha Hiburan",
    description: "Izin operasional untuk tempat hiburan malam/karaoke",
    categoryId: "cat-002",
    showInMenu: true,
    order: 3,
    isIntegrated: false,
    detailedDescription:
      "Izin usaha hiburan diperlukan untuk tempat hiburan seperti karaoke, diskotik, live music, dan sejenisnya. Meliputi rekomendasi dari berbagai instansi terkait.",
    requirements: [
      "KTP dan KK pemilik",
      "Akta notaris perusahaan",
      "NPWP perusahaan",
      "Sertifikat lahan/sewa",
      "Denah lokasi",
      "Rekomendasi kepolisian",
      "Rekomendasi pomdam",
      "Analisis dampak lalin (Andalalin)",
    ],
    process: [
      "Kumpulkan semua persyaratan",
      "Ajukan permohonan ke dinas pariwisata",
      "Verifikasi lapangan",
      "Koordinasi dengan instansi terkait",
      "Rapat koordinasi tim teknis",
      "Terbit izin usaha hiburan",
    ],
    duration: "30 hari kerja",
    cost: "Retribusi sesuai klasifikasi",
    status: "PUBLISHED" as ServiceStatus,
  },

  // Kesehatan
  {
    id: "srv-007",
    slug: "bpjs-kesehatan",
    icon: "HeartPulse",
    name: "Pendaftaran BPJS Kesehatan",
    description: "Pendaftaran kepesertaan Jaminan Kesehatan Nasional",
    categoryId: "cat-003",
    badge: "Penting",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "BPJS Kesehatan memberikan perlindungan jaminan kesehatan bagi seluruh rakyat Indonesia. Pendaftaran dapat dilakukan mandiri atau melalui fasilitas kesehatan.",
    requirements: [
      "KTP asli dan fotokopi",
      "KK asli dan fotokopi",
      "Nomor telepon aktif",
      "Foto diri terbaru",
    ],
    process: [
      "Daftar melalui aplikasi JKN atau BPJS Kesehatan Care",
      "Isi data pribadi dan keluarga",
      "Pilih kelas rawat inap (1/2/3)",
      "Bayar iuran pertama",
      "Terbit kartu peserta",
    ],
    duration: "Langsung",
    cost: "Mulai Rp 35.000/bulan (kelas 3)",
    contactInfo: {
      office: "BPJS Kesehatan Cabang",
      phone: "165",
      email: "-",
    },
    faqs: [
      {
        question: "Apakah bayar sendiri atau bisa potong gaji?",
        answer: "Bisa potong gaji bagi PNS/karyawan swasta, atau bayar mandiri untuk pekerja informal.",
      },
      {
        question: "Apakah keluarga bisa ikut?",
        answer: "Ya, satu kepala keluarga bisa mendaftarkan maksimal 5 anggota keluarga.",
      },
    ],
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-008",
    slug: "sktm-kesehatan",
    icon: "FileCheck",
    name: "Surat Keterangan Tidak Mampu",
    description: "SKTM untuk mendapatkan pelayanan kesehatan gratis",
    categoryId: "cat-003",
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription:
      "Surat Keterangan Tidak Mampu (SKTM) diberikan kepada warga kurang mampu untuk mendapatkan keringanan biaya pengobatan di rumah sakit pemerintah.",
    requirements: [
      "Surat pengantar RT/RW",
      "KTP dan KK",
      "Foto rumah (depan dan samping)",
      "Slip gaji/surat keterangan penghasilan",
      "Surat pernyataan tidak mampu bermaterai",
    ],
    process: [
      "Ajukan permohonan ke kelurahan",
      "Wawancara dan verifikasi lapangan",
      "Rekomendasi kelurahan",
      "Verifikasi kecamatan",
      "Terbit SKTM",
    ],
    duration: "3-5 hari kerja",
    cost: "Gratis",
    status: "PUBLISHED" as ServiceStatus,
  },

  // Pendidikan
  {
    id: "srv-009",
    slug: "beasiswa-s1",
    icon: "GraduationCap",
    name: "Beasiswa Pendidikan S1",
    description: "Program beasiswa untuk mahasiswa S1 berprestasi",
    categoryId: "cat-004",
    badge: "Terbatas",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "Beasiswa pemerintah daerah untuk mahasiswa S1 yang berprestasi dan kurang mampu. Mencakup biaya kuliah dan tunjangan hidup.",
    requirements: [
      "Mahasiswa S1 aktif (semester 3-7)",
      "IPK minimal 3.00",
      "KTP dan KK",
      "Transkrip nilai",
      "Surat keterangan aktif kuliah",
      "Essay rencana studi",
    ],
    process: [
      "Pendaftaran online saat periode dibuka",
      "Upload dokumen persyaratan",
      "Seleksi administratif",
      "Tes tertulis (jika diperlukan)",
      "Wawancara",
      "Pengumuman penerima beasiswa",
    ],
    duration: "Periode pendaftaran: 1-2 bulan",
    cost: "Gratis",
    contactInfo: {
      office: "Dinas Pendidikan",
      phone: "(021) 3456-7890",
      email: "beasiswa@diknas.go.id",
    },
    downloadForms: [
      {
        type: "file",
        name: "Formulir Pendaftaran Beasiswa",
        fileId: "file-form-beasiswa",
      },
    ],
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-010",
    slug: "ijazah-hilang",
    icon: "Scroll",
    name: "Surat Keterangan Pengganti Ijazah",
    description: "Dokumen pengganti ijazah yang hilang atau rusak",
    categoryId: "cat-004",
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription:
      "Surat Keterangan Pengganti Ijazah (SKPI) diterbitkan bagi lulusan yang ijazahnya hilang atau rusak. Memiliki kekuatan hukum sama dengan ijazah asli.",
    requirements: [
      "Surat kehilangan dari kepolisian",
      "KTP dan KK",
      "Pas foto terbaru",
      "Surat permohonan penggantian ijazah",
      "Fotokopi ijazah (jika ada)",
    ],
    process: [
      "Buat surat kehilangan di polsek",
      "Ajukan permohonan ke sekolah asal",
      "Verifikasi data siswa di arsip sekolah",
      "Proses pembuatan SKPI",
      "Ambil SKPI di sekolah",
    ],
    duration: "7-14 hari kerja",
    cost: "Gratis (mungkin ada biaya materai)",
    status: "PUBLISHED" as ServiceStatus,
  },

  // Infrastruktur
  {
    id: "srv-011",
    slug: "pengaduan-jalan",
    icon: "Wrench",
    name: "Laporan Kerusakan Jalan",
    description: "Layanan pengaduan kerusakan infrastruktur jalan",
    categoryId: "cat-005",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "Warga dapat melaporkan kerusakan jalan, jembatan, atau infrastruktur publik lainnya. Laporan akan ditindaklanjuti oleh dinas terkait.",
    requirements: [
      "Foto kerusakan",
      "Lokasi jelas (alamat/koordinat)",
      "Deskripsi kerusakan",
      "Nama pelapor",
    ],
    process: [
      "Lapor melalui aplikasi atau call center",
      "Tiket laporan dibuat",
      "Survey lokasi oleh tim teknis",
      "Perbaikan dijadwalkan",
      "Laporan selesai",
    ],
    duration: "Bervariasi tergantung kerusakan",
    cost: "Gratis",
    contactInfo: {
      office: "Dinas Pekerjaan Umum",
      phone: "(021) 4567-8901",
      email: "pengaduan@pu.go.id",
    },
    faqs: [
      {
        question: "Berapa lama respon laporan?",
        answer: "Target respon maksimal 3 hari kerja untuk survey dan penjadwalan.",
      },
    ],
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-012",
    slug: "pemasangan-listrik",
    icon: "Lightbulb",
    name: "Pemasangan Listrik Baru",
    description: "Permohonan pemasangan instalasi listrik PLN",
    categoryId: "cat-005",
    badge: "Populer",
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription:
      "Layanan pemasangan instalasi listrik baru untuk rumah tangga dan bisnis. Bisa diajukan melalui kantor PLN atau online.",
    requirements: [
      "KTP dan KK",
      "Sertifikat tanah/surat sewa",
      "Denah lokasi",
      "Foto rumah/tempat usaha",
    ],
    process: [
      "Daftar melalui aplikasi PLN Mobile atau kantor PLN",
      "Isi formulir permohonan",
      "Survey lokasi oleh petugas",
      "Pembayaran biaya penyambungan",
      "Instalasi dan pemasangan meteran",
      "Listrik menyala",
    ],
    duration: "7-14 hari kerja",
    cost: "Sesuai daya dan jarak dari jaringan",
    contactInfo: {
      office: "PLN Unit Layanan Pelanggan",
      phone: "123",
      email: "info@pln.co.id",
    },
    status: "PUBLISHED" as ServiceStatus,
  },

  // Sosial
  {
    id: "srv-013",
    slug: "bansos-rasta",
    icon: "HandHeart",
    name: "Bantuan Sosial Rasta",
    description: "Bantuan sosial untuk warga tidak mampu",
    categoryId: "cat-006",
    badge: "Program Prioritas",
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription:
      "Bantuan Sosial Raskin (Rice for Poor Families) atau Rastra adalah bantuan beras pemerintah untuk keluarga tidak mampu. Sekarang disalurkan melalui Kartu Keluarga Sejahtera.",
    requirements: [
      "Terdaftar dalam DTKS (Data Terpadu Kesejahteraan Sosial)",
      "Memiliki KKS (Kartu Keluarga Sejahtera)",
      "KTP dan KK",
    ],
    process: [
      "Verifikasi kepesertaan di DTKS",
      "Jika terdaftar, ambil bantuan di agen penyalur",
      "Tunjukkan KKS dan KTP",
      "Terima bantuan beras",
    ],
    duration: "Periode penyaluran: Setiap bulan",
    cost: "Gratis",
    contactInfo: {
      office: "Dinas Sosial",
      phone: "(021) 5678-9012",
      email: "bansos@dinsos.go.id",
    },
    faqs: [
      {
        question: "Bagaimana jika belum terdaftar DTKS?",
        answer: "Bisa mengajukan proposal ke kelurahan/kecamatan untuk verifikasi dan usulan pendaftaran.",
      },
    ],
    status: "PUBLISHED" as ServiceStatus,
  },
  {
    id: "srv-014",
    slug: "panti-asuhan",
    icon: "Baby",
    name: "Rekomendasi Panti Asuhan",
    description: "Surat rekomendasi untuk penitipan anak di panti asuhan",
    categoryId: "cat-006",
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription:
      "Surat rekomendasi dari dinas sosial bagi orang tua/wali yang akan menitipkan anak ke panti asuhan karena keterbatasan ekonomi.",
    requirements: [
      "Surat permohonan penitipan anak",
      "KTP dan KK orang tua/wali",
      "Akte kelahiran anak",
      "Surat keterangan tidak mampu",
      "Surat pernyataan bermaterai",
    ],
    process: [
      "Ajukan permohonan ke dinas sosial",
      "Wawancara sosial",
      "Survey rumah dan verifikasi data",
      "Rekomendasi diterbitkan",
      "Daftar ke panti asuhan yang ditunjuk",
    ],
    duration: "7-14 hari kerja",
    cost: "Gratis",
    status: "PUBLISHED" as ServiceStatus,
  },
];

async function main() {
  console.log("🌱 Starting services seed...\n");

  // Get admin user for createdById
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
  await prisma.serviceActivityLog.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  console.log("✅ Cleaned existing data\n");

  // Seed categories
  console.log("📁 Seeding service categories...");
  for (const category of serviceCategories) {
    await prisma.serviceCategory.create({
      data: category,
    });
    console.log(`  ✓ ${category.name}`);
  }
  console.log(`✅ Created ${serviceCategories.length} categories\n`);

  // Seed services
  console.log("📋 Seeding services...");
  let created = 0;
  for (const service of services) {
    await prisma.service.create({
      data: {
        ...service,
        createdById: admin.id,
      },
    });
    created++;
    console.log(`  ✓ ${service.name}`);
  }
  console.log(`\n✅ Created ${created} services\n`);

  // Create sample activity logs
  console.log("📝 Creating activity logs...");
  const sampleServices = await prisma.service.findMany({
    take: 5,
    where: {
      status: "PUBLISHED",
    },
  });

  for (const service of sampleServices) {
    await prisma.serviceActivityLog.create({
      data: {
        serviceId: service.id,
        userId: admin.id,
        action: "created",
        changes: {
          message: `Service "${service.name}" created via seed script`,
        },
      },
    });
  }
  console.log(`✅ Created ${sampleServices.length} activity logs\n`);

  console.log("✨ Seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`  - Categories: ${serviceCategories.length}`);
  console.log(`  - Services: ${services.length}`);
  console.log(`  - Activity logs: ${sampleServices.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
