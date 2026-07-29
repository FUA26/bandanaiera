/**
 * Seed Services
 *
 * Run: npx tsx prisma/seed-services.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ServiceSeed = {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  categorySlug: string;
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
  downloadForms: Array<{
    type: 'file' | 'url';
    name: string;
    value: string;
  }>;
  relatedServices: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  operatingHours: Array<{
    days: string;
    hours: string;
  }>;
  serviceLink?: string;
  downloadAppLinks?: Array<{
    platform: string;
    url: string;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
};

const categories = [
  {
    id: 'cat-layanan-umum',
    name: 'Layanan Umum',
    slug: 'layanan-umum',
    icon: 'ClipboardList',
    color: 'slate',
    bgColor: 'bg-slate-50',
    showInMenu: true,
    order: 0,
  },
  {
    id: 'cat-kependudukan',
    name: 'Kependudukan',
    slug: 'kependudukan',
    icon: 'Users',
    color: 'blue',
    bgColor: 'bg-blue-50',
    showInMenu: true,
    order: 1,
  },
  {
    id: 'cat-perizinan',
    name: 'Perizinan',
    slug: 'perizinan',
    icon: 'FileText',
    color: 'purple',
    bgColor: 'bg-purple-50',
    showInMenu: true,
    order: 2,
  },
  {
    id: 'cat-kesehatan',
    name: 'Kesehatan',
    slug: 'kesehatan',
    icon: 'Heart',
    color: 'red',
    bgColor: 'bg-red-50',
    showInMenu: true,
    order: 3,
  },
  {
    id: 'cat-pendidikan',
    name: 'Pendidikan',
    slug: 'pendidikan',
    icon: 'BookOpen',
    color: 'green',
    bgColor: 'bg-green-50',
    showInMenu: true,
    order: 4,
  },
  {
    id: 'cat-transportasi',
    name: 'Transportasi',
    slug: 'transportasi',
    icon: 'Bus',
    color: 'orange',
    bgColor: 'bg-orange-50',
    showInMenu: true,
    order: 5,
  },
  {
    id: 'cat-pertanian',
    name: 'Pertanian',
    slug: 'pertanian',
    icon: 'Leaf',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    showInMenu: true,
    order: 6,
  },
  {
    id: 'cat-sosial',
    name: 'Sosial',
    slug: 'sosial',
    icon: 'HandHeart',
    color: 'teal',
    bgColor: 'bg-teal-50',
    showInMenu: true,
    order: 7,
  },
] as const;

const services: ServiceSeed[] = [
  {
    id: 'srv-pengaduan-masyarakat',
    slug: 'pengaduan-masyarakat',
    icon: 'MessageSquare',
    name: 'Pengaduan Masyarakat',
    description: 'Penyampaian pengaduan, saran, dan aspirasi masyarakat melalui layanan terpadu.',
    categorySlug: 'layanan-umum',
    badge: 'Banyak Dicari',
    stats: '15rb+ aduan',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan untuk menerima pengaduan warga terkait pelayanan publik, fasilitas umum, dan tindak lanjut penanganan keluhan secara terpantau.',
    requirements: [
      'Identitas pelapor',
      'Uraian pengaduan',
      'Bukti pendukung berupa foto atau dokumen jika ada',
      'Nomor kontak aktif',
    ],
    process: [
      'Isi formulir pengaduan',
      'Verifikasi kelengkapan laporan',
      'Pengaduan diteruskan ke unit terkait',
      'Tindak lanjut dan notifikasi status',
    ],
    duration: '3 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Unit Layanan Pengaduan',
      phone: '(0341) 888-100',
      email: 'pengaduan@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Pengaduan Masyarakat',
        value: 'https://example.gov.id/formulir/pengaduan-masyarakat',
      },
    ],
    relatedServices: ['konsultasi-umum', 'surat-keterangan-umum'],
    faqs: [
      {
        question: 'Apakah pengaduan bisa anonim?',
        answer: 'Untuk tindak lanjut yang jelas, identitas pelapor dianjurkan dicantumkan.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/pengaduan-masyarakat',
    downloadAppLinks: [
      { platform: 'Portal Aduan', url: 'https://example.gov.id/app/aduan' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/pemda',
      instagram: 'https://instagram.com/example.pemda',
    },
  },
  {
    id: 'srv-konsultasi-umum',
    slug: 'konsultasi-umum',
    icon: 'HelpCircle',
    name: 'Konsultasi Umum',
    description: 'Layanan konsultasi informasi dasar untuk warga terkait prosedur dan layanan publik.',
    categorySlug: 'layanan-umum',
    stats: '9rb+ sesi',
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription: 'Konsultasi umum membantu warga memahami alur layanan, persyaratan, jam operasional, dan kontak unit terkait tanpa perlu berpindah kanal.',
    requirements: [
      'Pertanyaan atau topik yang ingin dikonsultasikan',
      'Identitas dasar jika diperlukan',
      'Nomor kontak aktif',
    ],
    process: [
      'Ajukan pertanyaan',
      'Petugas memberikan arahan awal',
      'Sistem merekomendasikan layanan terkait',
      'Konsultasi ditutup setelah solusi diberikan',
    ],
    duration: '15 menit',
    cost: 'Gratis',
    contactInfo: {
      office: 'Pusat Informasi Pelayanan',
      phone: '(0341) 888-101',
      email: 'info@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan Konsultasi Umum',
        value: 'https://example.gov.id/panduan/konsultasi-umum',
      },
    ],
    relatedServices: ['pengaduan-masyarakat'],
    faqs: [
      {
        question: 'Apakah konsultasi umum dikenakan biaya?',
        answer: 'Tidak, layanan ini gratis untuk seluruh warga.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.30 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/konsultasi-umum',
    downloadAppLinks: [
      { platform: 'Portal Informasi', url: 'https://example.gov.id/app/informasi' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/pemda',
    },
  },
  {
    id: 'srv-surat-keterangan-umum',
    slug: 'surat-keterangan-umum',
    icon: 'FileSignature',
    name: 'Surat Keterangan Umum',
    description: 'Permohonan surat keterangan umum untuk berbagai kebutuhan administratif warga.',
    categorySlug: 'layanan-umum',
    badge: 'Baru',
    stats: '6rb+ surat',
    showInMenu: true,
    order: 3,
    isIntegrated: true,
    detailedDescription: 'Layanan ini digunakan untuk penerbitan surat keterangan dasar yang sering dibutuhkan dalam urusan administrasi, verifikasi, atau keperluan sekolah dan kerja.',
    requirements: [
      'KTP pemohon',
      'Alasan permohonan',
      'Dokumen pendukung jika ada',
      'Nomor kontak aktif',
    ],
    process: [
      'Ajukan permohonan surat keterangan',
      'Verifikasi identitas dan tujuan',
      'Pemeriksaan dokumen pendukung',
      'Surat diterbitkan',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Pelayanan Terpadu',
      phone: '(0341) 888-102',
      email: 'surat@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Surat Keterangan Umum',
        value: 'https://example.gov.id/formulir/surat-keterangan-umum',
      },
    ],
    relatedServices: ['konsultasi-umum', 'pengaduan-masyarakat'],
    faqs: [
      {
        question: 'Apakah surat ini bisa diproses online?',
        answer: 'Bisa, selama persyaratan sudah lengkap dan verifikasi lolos.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/surat-keterangan-umum',
    downloadAppLinks: [
      { platform: 'Portal Web', url: 'https://example.gov.id/app/surat-keterangan' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/pemda',
      youtube: 'https://youtube.com/@example-pemda',
    },
  },
  {
    id: 'srv-ktp-elektronik',
    slug: 'ktp-elektronik',
    icon: 'IdCard',
    name: 'KTP Elektronik',
    description: 'Pembuatan KTP elektronik baru dan penggantian KTP rusak atau hilang.',
    categorySlug: 'kependudukan',
    badge: 'Populer',
    stats: '48rb+ permohonan',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan untuk perekaman biometrik, penerbitan KTP-el baru, serta penggantian KTP yang hilang atau rusak. Proses dibuat sederhana dan bisa dilacak secara daring.',
    requirements: [
      'Kartu Keluarga asli',
      'Surat pengantar RT/RW',
      'KTP lama jika ada',
      'Dokumen pendukung sesuai kondisi permohonan',
    ],
    process: [
      'Ambil nomor antrean dan verifikasi berkas',
      'Perekaman biometrik dan foto',
      'Validasi data oleh petugas',
      'Cetak bukti perekaman',
      'KTP elektronik dapat diambil setelah selesai diproses',
    ],
    duration: '14 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kependudukan dan Pencatatan Sipil',
      phone: '(0341) 399-744',
      email: 'dispendukcapil@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan Perekaman KTP-el',
        value: 'https://example.gov.id/panduan/ktp-elektronik',
      },
    ],
    relatedServices: ['kk-digital', 'akta-kelahiran', 'surat-pindah'],
    faqs: [
      {
        question: 'Apakah pembuatan KTP dikenakan biaya?',
        answer: 'Tidak. Seluruh proses pembuatan KTP elektronik gratis.',
      },
      {
        question: 'Bisakah saya mengecek status permohonan?',
        answer: 'Bisa, status permohonan dapat dicek melalui portal layanan daring.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
      { days: 'Sabtu', hours: '08.00 - 12.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/ktp-elektronik',
    downloadAppLinks: [
      { platform: 'Portal Web', url: 'https://example.gov.id/app/ktp-elektronik' },
      { platform: 'Android', url: 'https://play.google.com/store/apps/details?id=gov.example.ktp' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dispendukcapil',
      instagram: 'https://instagram.com/example.dispendukcapil',
      youtube: 'https://youtube.com/@example-dispendukcapil',
    },
  },
  {
    id: 'srv-kk-digital',
    slug: 'kk-digital',
    icon: 'Users',
    name: 'Kartu Keluarga Digital',
    description: 'Penerbitan Kartu Keluarga baru, perubahan data, dan cetak ulang KK.',
    categorySlug: 'kependudukan',
    badge: 'Baru',
    stats: '29rb+ keluarga',
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription: 'Layanan administrasi keluarga untuk penerbitan KK baru, perubahan susunan anggota keluarga, dan penggantian dokumen yang rusak.',
    requirements: [
      'Surat pengantar RT/RW',
      'KTP kepala keluarga',
      'Dokumen pendukung perubahan data',
      'Akta nikah atau akta lahir jika diperlukan',
    ],
    process: [
      'Isi formulir permohonan secara daring atau di loket',
      'Unggah/serahkan dokumen pendukung',
      'Verifikasi data oleh petugas',
      'Kartu Keluarga diterbitkan dan dapat diunduh',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kependudukan dan Pencatatan Sipil',
      phone: '(0341) 399-744',
      email: 'dukcapil@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Perubahan KK',
        value: 'https://example.gov.id/formulir/kk-digital',
      },
    ],
    relatedServices: ['ktp-elektronik', 'akta-kelahiran'],
    faqs: [
      {
        question: 'Apakah KK digital bisa dicetak sendiri?',
        answer: 'Bisa, file digital yang diterbitkan dapat dicetak untuk keperluan administrasi.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/kk-digital',
    downloadAppLinks: [
      { platform: 'Portal Web', url: 'https://example.gov.id/app/kk-digital' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dispendukcapil',
      instagram: 'https://instagram.com/example.dispendukcapil',
    },
  },
  {
    id: 'srv-akta-kelahiran',
    slug: 'akta-kelahiran',
    icon: 'Baby',
    name: 'Akta Kelahiran',
    description: 'Penerbitan akta kelahiran untuk bayi baru lahir dan pengajuan terlambat.',
    categorySlug: 'kependudukan',
    stats: '12rb+ permohonan',
    showInMenu: true,
    order: 3,
    isIntegrated: true,
    detailedDescription: 'Layanan pencatatan sipil untuk penerbitan akta kelahiran, termasuk permohonan reguler dan permohonan yang diajukan setelah batas waktu ideal.',
    requirements: [
      'Surat keterangan lahir dari rumah sakit atau bidan',
      'KTP orang tua',
      'Kartu Keluarga',
      'Buku nikah atau akta perkawinan orang tua',
    ],
    process: [
      'Serahkan dokumen persyaratan',
      'Petugas memverifikasi data kelahiran',
      'Data dicatat ke dalam sistem',
      'Akta kelahiran diterbitkan',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kependudukan dan Pencatatan Sipil',
      phone: '(0341) 399-744',
      email: 'akta@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Checklist Akta Kelahiran',
        value: 'https://example.gov.id/formulir/akta-kelahiran',
      },
    ],
    relatedServices: ['ktp-elektronik', 'kk-digital'],
    faqs: [
      {
        question: 'Apakah akta kelahiran bisa dibuat lebih dari 60 hari?',
        answer: 'Bisa. Namun, untuk pengajuan terlambat mungkin diperlukan dokumen tambahan.',
      },
      {
        question: 'Berapa lama proses penerbitan?',
        answer: 'Untuk berkas lengkap, umumnya diterbitkan pada hari kerja yang sama.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/akta-kelahiran',
    downloadAppLinks: [
      { platform: 'Portal Web', url: 'https://example.gov.id/app/akta-kelahiran' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dispendukcapil',
      facebook: 'https://facebook.com/example.dispendukcapil',
    },
  },
  {
    id: 'srv-siup-usaha-mikro',
    slug: 'siup-usaha-mikro',
    icon: 'Briefcase',
    name: 'SIUP Usaha Mikro',
    description: 'Izin usaha perdagangan untuk pelaku usaha mikro dan UMKM skala kecil.',
    categorySlug: 'perizinan',
    badge: 'Prioritas',
    stats: '8rb+ pelaku usaha',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan perizinan usaha untuk pelaku usaha mikro yang membutuhkan legalitas dasar agar dapat mengakses pembiayaan, pendampingan, dan marketplace pemerintah.',
    requirements: [
      'KTP pemohon',
      'NPWP jika ada',
      'Alamat dan foto tempat usaha',
      'Nomor induk berusaha atau dokumen sejenis',
    ],
    process: [
      'Lengkapi data usaha pada portal',
      'Unggah dokumen pendukung',
      'Verifikasi petugas',
      'Izin terbit secara digital',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Perindustrian dan Perdagangan',
      phone: '(0341) 391-676',
      email: 'disperindag@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan SIUP UMKM',
        value: 'https://example.gov.id/panduan/siup-usaha-mikro',
      },
    ],
    relatedServices: ['izin-keramaian'],
    faqs: [
      {
        question: 'Apakah izin ini wajib untuk usaha kecil?',
        answer: 'Untuk berbagai layanan pendukung pemerintah, legalitas usaha sangat disarankan.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.30 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/siup-usaha-mikro',
    downloadAppLinks: [
      { platform: 'Portal OSS', url: 'https://example.gov.id/app/oss' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/disperindag',
      instagram: 'https://instagram.com/example.disperindag',
    },
  },
  {
    id: 'srv-izin-keramaian',
    slug: 'izin-keramaian',
    icon: 'Calendar',
    name: 'Izin Keramaian',
    description: 'Izin penyelenggaraan acara yang melibatkan massa di ruang publik.',
    categorySlug: 'perizinan',
    stats: '4rb+ acara',
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription: 'Layanan izin untuk acara keluarga, pertunjukan, bazar, dan kegiatan publik lain yang memerlukan koordinasi keamanan dan ketertiban umum.',
    requirements: [
      'Surat permohonan dari penyelenggara',
      'Proposal kegiatan',
      'KTP penanggung jawab acara',
      'Surat izin lokasi jika diperlukan',
    ],
    process: [
      'Ajukan permohonan izin',
      'Petugas melakukan verifikasi berkas',
      'Koordinasi dengan aparat terkait',
      'Surat izin diterbitkan',
    ],
    duration: '3 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Penanaman Modal dan PTSP',
      phone: '(0341) 234-567',
      email: 'ptsp@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Izin Keramaian',
        value: 'https://example.gov.id/formulir/izin-keramaian',
      },
    ],
    relatedServices: ['siup-usaha-mikro'],
    faqs: [
      {
        question: 'Berapa lama izin diterbitkan?',
        answer: 'Umumnya 3 hari kerja setelah berkas dan koordinasi dinyatakan lengkap.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/izin-keramaian',
    downloadAppLinks: [
      { platform: 'Portal Perizinan', url: 'https://example.gov.id/app/perizinan' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/ptsp',
      youtube: 'https://youtube.com/@example-ptsp',
    },
  },
  {
    id: 'srv-beasiswa-pelajar',
    slug: 'beasiswa-pelajar',
    icon: 'GraduationCap',
    name: 'Beasiswa Pelajar',
    description: 'Pendaftaran beasiswa bagi siswa dan mahasiswa berprestasi atau kurang mampu.',
    categorySlug: 'pendidikan',
    badge: 'Terbaru',
    stats: '5rb+ penerima',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Program dukungan pendidikan untuk membantu biaya sekolah/kuliah melalui seleksi administrasi, prestasi, dan kondisi ekonomi.',
    requirements: [
      'Kartu identitas pelajar atau mahasiswa',
      'Kartu keluarga',
      'Rapor atau transkrip nilai',
      'Surat keterangan tidak mampu atau bukti prestasi',
    ],
    process: [
      'Isi formulir pendaftaran',
      'Unggah dokumen persyaratan',
      'Verifikasi administrasi',
      'Seleksi akhir dan pengumuman hasil',
    ],
    duration: '7 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Pendidikan',
      phone: '(0341) 393-935',
      email: 'dispendik@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan Beasiswa Pelajar',
        value: 'https://example.gov.id/panduan/beasiswa-pelajar',
      },
    ],
    relatedServices: ['ktp-elektronik', 'kk-digital'],
    faqs: [
      {
        question: 'Siapa yang dapat mendaftar?',
        answer: 'Pelajar atau mahasiswa yang memenuhi syarat prestasi atau kategori bantuan sosial.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/beasiswa-pelajar',
    downloadAppLinks: [
      { platform: 'Portal Pendidikan', url: 'https://example.gov.id/app/beasiswa' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dispendik',
      instagram: 'https://instagram.com/example.dispendik',
    },
  },
  {
    id: 'srv-surat-pindah',
    slug: 'surat-pindah',
    icon: 'MapPin',
    name: 'Surat Pindah Domisili',
    description: 'Pengurusan surat pindah untuk perpindahan domisili antar kecamatan atau antar daerah.',
    categorySlug: 'kependudukan',
    stats: '9rb+ permohonan',
    showInMenu: true,
    order: 4,
    isIntegrated: true,
    detailedDescription: 'Layanan ini digunakan untuk memproses perpindahan domisili penduduk, termasuk verifikasi data keluarga, tujuan pindah, dan penerbitan surat keterangan pindah secara digital.',
    requirements: [
      'KTP pemohon',
      'Kartu Keluarga',
      'Surat pengantar RT/RW jika diperlukan',
      'Alamat tujuan pindah',
    ],
    process: [
      'Ajukan permohonan pindah domisili',
      'Petugas memverifikasi data penduduk',
      'Validasi tujuan pindah dan dokumen pendukung',
      'Surat pindah diterbitkan',
    ],
    duration: '2 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kependudukan dan Pencatatan Sipil',
      phone: '(0341) 399-744',
      email: 'pindah@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Surat Pindah',
        value: 'https://example.gov.id/formulir/surat-pindah',
      },
    ],
    relatedServices: ['kk-digital', 'ktp-elektronik'],
    faqs: [
      {
        question: 'Apakah surat pindah bisa diurus dari rumah?',
        answer: 'Bisa, sepanjang dokumen persyaratan lengkap dan data pemohon valid.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/surat-pindah',
    downloadAppLinks: [
      { platform: 'Portal Web', url: 'https://example.gov.id/app/surat-pindah' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dispendukcapil',
      facebook: 'https://facebook.com/example.dispendukcapil',
    },
  },
  {
    id: 'srv-identitas-pendatang',
    slug: 'identitas-pendatang',
    icon: 'BadgeInfo',
    name: 'Identitas Pendatang',
    description: 'Pendaftaran identitas sementara bagi penduduk pendatang atau perantau baru.',
    categorySlug: 'kependudukan',
    badge: 'Baru',
    stats: '3rb+ pendatang',
    showInMenu: true,
    order: 5,
    isIntegrated: false,
    detailedDescription: 'Layanan untuk pendataan penduduk pendatang agar tercatat secara administratif di wilayah tujuan, memudahkan pelayanan publik dan koordinasi lingkungan.',
    requirements: [
      'KTP asli',
      'Kartu Keluarga',
      'Surat keterangan tinggal sementara',
      'Foto diri ukuran 3x4',
    ],
    process: [
      'Daftar dan isi formulir pendataan',
      'Serahkan dokumen identitas',
      'Verifikasi oleh petugas kelurahan',
      'Kartu identitas sementara diterbitkan',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Kelurahan setempat',
      phone: '(0341) 555-120',
      email: 'kelurahan@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Pendatang Baru',
        value: 'https://example.gov.id/formulir/identitas-pendatang',
      },
    ],
    relatedServices: ['surat-pindah', 'kk-digital'],
    faqs: [
      {
        question: 'Apakah layanan ini wajib?',
        answer: 'Pendaftaran disarankan untuk memudahkan administrasi kependudukan dan pelayanan lingkungan.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.30 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/identitas-pendatang',
    downloadAppLinks: [
      { platform: 'Portal Kelurahan', url: 'https://example.gov.id/app/pendatang' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/kelurahan',
    },
  },
  {
    id: 'srv-izin-umkm',
    slug: 'izin-umkm',
    icon: 'Store',
    name: 'Izin UMKM',
    description: 'Perizinan dasar untuk usaha mikro, kecil, dan menengah dengan proses digital.',
    categorySlug: 'perizinan',
    badge: 'Populer',
    stats: '14rb+ usaha',
    showInMenu: true,
    order: 3,
    isIntegrated: true,
    detailedDescription: 'Izin usaha ini ditujukan untuk pelaku UMKM yang ingin memperoleh legalitas operasional, membuka akses pembiayaan, dan memperluas pasar melalui platform pemerintah.',
    requirements: [
      'KTP pemohon',
      'Nama dan alamat usaha',
      'Foto lokasi usaha',
      'Nomor kontak aktif',
    ],
    process: [
      'Lengkapi data pelaku usaha',
      'Unggah dokumen pendukung',
      'Verifikasi sistem dan petugas',
      'Izin terbit secara digital',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Koperasi dan UMKM',
      phone: '(0341) 321-900',
      email: 'umkm@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan Izin UMKM',
        value: 'https://example.gov.id/panduan/izin-umkm',
      },
    ],
    relatedServices: ['siup-usaha-mikro', 'izin-reklame'],
    faqs: [
      {
        question: 'Apakah izin UMKM sama dengan SIUP?',
        answer: 'Serupa dalam fungsi legalitas dasar, namun bisa berbeda alur tergantung kebijakan layanan daerah.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 16.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/izin-umkm',
    downloadAppLinks: [
      { platform: 'Portal UMKM', url: 'https://example.gov.id/app/umkm' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dinkop',
      instagram: 'https://instagram.com/example.dinkop',
    },
  },
  {
    id: 'srv-izin-reklame',
    slug: 'izin-reklame',
    icon: 'Megaphone',
    name: 'Izin Reklame',
    description: 'Pengajuan izin pemasangan reklame, baliho, dan media promosi di ruang publik.',
    categorySlug: 'perizinan',
    stats: '2rb+ izin',
    showInMenu: true,
    order: 4,
    isIntegrated: false,
    detailedDescription: 'Layanan untuk izin pemasangan media promosi fisik di area publik. Pemohon akan melalui evaluasi lokasi, ukuran, materi, dan durasi pemasangan.',
    requirements: [
      'Identitas pemohon',
      'Desain reklame',
      'Lokasi pemasangan',
      'Surat pernyataan tanggung jawab',
    ],
    process: [
      'Ajukan rencana pemasangan',
      'Petugas menilai kelayakan lokasi',
      'Verifikasi desain dan ukuran reklame',
      'Izin diterbitkan',
    ],
    duration: '4 hari kerja',
    cost: 'Sesuai ketentuan',
    contactInfo: {
      office: 'Dinas Penanaman Modal dan PTSP',
      phone: '(0341) 234-890',
      email: 'reklame@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Izin Reklame',
        value: 'https://example.gov.id/formulir/izin-reklame',
      },
    ],
    relatedServices: ['izin-umkm', 'siup-usaha-mikro'],
    faqs: [
      {
        question: 'Apakah semua reklame perlu izin?',
        answer: 'Ya, terutama untuk pemasangan di ruang publik atau area yang diatur pemerintah daerah.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/izin-reklame',
    downloadAppLinks: [
      { platform: 'Portal Perizinan', url: 'https://example.gov.id/app/reklame' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/ptsp',
      youtube: 'https://youtube.com/@example-ptsp',
    },
  },
  {
    id: 'srv-skrining-kesehatan',
    slug: 'skrining-kesehatan',
    icon: 'Stethoscope',
    name: 'Skrining Kesehatan',
    description: 'Pemeriksaan awal untuk deteksi risiko kesehatan dan rekomendasi tindak lanjut.',
    categorySlug: 'kesehatan',
    badge: 'Rekomendasi',
    stats: '21rb+ skrining',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan skrining kesehatan menyediakan pemeriksaan dasar seperti tekanan darah, indeks massa tubuh, dan riwayat penyakit untuk membantu deteksi dini dan edukasi kesehatan.',
    requirements: [
      'Kartu identitas',
      'Nomor kontak aktif',
      'Riwayat kesehatan jika ada',
    ],
    process: [
      'Daftar layanan skrining',
      'Pemeriksaan dasar oleh tenaga kesehatan',
      'Hasil dan rekomendasi diberikan',
      'Tindak lanjut jika diperlukan',
    ],
    duration: '30 menit',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kesehatan',
      phone: '(0341) 322-777',
      email: 'skrining@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Panduan Skrining Kesehatan',
        value: 'https://example.gov.id/panduan/skrining-kesehatan',
      },
    ],
    relatedServices: ['rujukan-faskes', 'beasiswa-pelajar'],
    faqs: [
      {
        question: 'Apakah hasil skrining langsung keluar?',
        answer: 'Ya, hasil awal biasanya diberikan segera setelah pemeriksaan selesai.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 14.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/skrining-kesehatan',
    downloadAppLinks: [
      { platform: 'Portal Sehat', url: 'https://example.gov.id/app/sehat' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dinkes',
      instagram: 'https://instagram.com/example.dinkes',
    },
  },
  {
    id: 'srv-rujukan-faskes',
    slug: 'rujukan-faskes',
    icon: 'Hospital',
    name: 'Rujukan Faskes',
    description: 'Pengajuan rujukan ke fasilitas kesehatan tingkat lanjutan melalui sistem daring.',
    categorySlug: 'kesehatan',
    stats: '11rb+ rujukan',
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription: 'Layanan untuk memproses rujukan pasien dari fasilitas kesehatan awal menuju faskes tingkat lanjut berdasarkan indikasi medis dan ketersediaan layanan.',
    requirements: [
      'Kartu identitas',
      'Kartu peserta jaminan kesehatan jika ada',
      'Surat keterangan pemeriksaan awal',
      'Nomor kontak aktif',
    ],
    process: [
      'Pemeriksaan awal oleh faskes',
      'Permohonan rujukan diajukan',
      'Verifikasi kebutuhan rujukan',
      'Surat rujukan diterbitkan',
    ],
    duration: '1 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Kesehatan',
      phone: '(0341) 322-777',
      email: 'rujukan@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Rujukan Faskes',
        value: 'https://example.gov.id/formulir/rujukan-faskes',
      },
    ],
    relatedServices: ['skrining-kesehatan'],
    faqs: [
      {
        question: 'Apakah rujukan bisa dipilih faskesnya?',
        answer: 'Pemilihan faskes mengikuti indikasi medis, kelas layanan, dan ketersediaan fasilitas.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/rujukan-faskes',
    downloadAppLinks: [
      { platform: 'Portal Sehat', url: 'https://example.gov.id/app/rujukan' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dinkes',
      youtube: 'https://youtube.com/@example-dinkes',
    },
  },
  {
    id: 'srv-permohonan-jadwal-bus',
    slug: 'permohonan-jadwal-bus',
    icon: 'BusFront',
    name: 'Permohonan Jadwal Bus',
    description: 'Pengajuan jadwal dan trayek bus sekolah atau bus layanan publik.',
    categorySlug: 'transportasi',
    badge: 'Baru',
    stats: '1.8rb+ pengajuan',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan ini membantu masyarakat dan instansi mengajukan penyesuaian jadwal bus, termasuk koordinasi trayek, waktu keberangkatan, dan kapasitas armada.',
    requirements: [
      'Identitas penanggung jawab',
      'Rencana jadwal dan trayek',
      'Dokumen lokasi penjemputan',
      'Nomor kontak aktif',
    ],
    process: [
      'Ajukan permohonan jadwal bus',
      'Petugas memverifikasi kebutuhan',
      'Koordinasi operasional armada',
      'Jadwal disetujui dan diterbitkan',
    ],
    duration: '3 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Perhubungan',
      phone: '(0341) 444-210',
      email: 'dishub@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Jadwal Bus',
        value: 'https://example.gov.id/formulir/jadwal-bus',
      },
    ],
    relatedServices: ['pendaftaran-rute-angkot'],
    faqs: [
      {
        question: 'Apakah layanan ini untuk bus sekolah saja?',
        answer: 'Tidak, layanan juga mencakup kebutuhan transportasi publik tertentu sesuai kewenangan daerah.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.30 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/jadwal-bus',
    downloadAppLinks: [
      { platform: 'Portal Transportasi', url: 'https://example.gov.id/app/transportasi' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dishub',
      instagram: 'https://instagram.com/example.dishub',
    },
  },
  {
    id: 'srv-pendaftaran-rute-angkot',
    slug: 'pendaftaran-rute-angkot',
    icon: 'Route',
    name: 'Pendaftaran Rute Angkot',
    description: 'Pengajuan dan pembaruan rute angkutan kota untuk operator dan koperasi transportasi.',
    categorySlug: 'transportasi',
    stats: '740+ operator',
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription: 'Operator angkutan dapat mengajukan rute baru, penyesuaian jalur, atau pembaruan trayek agar sesuai kebutuhan mobilitas warga dan tata kelola transportasi.',
    requirements: [
      'Surat permohonan operator',
      'Data armada',
      'Dokumen legalitas usaha',
      'Peta rute yang diajukan',
    ],
    process: [
      'Ajukan rute yang diinginkan',
      'Petugas menilai kelayakan trayek',
      'Koordinasi lintas instansi',
      'Rute disahkan',
    ],
    duration: '5 hari kerja',
    cost: 'Sesuai ketentuan',
    contactInfo: {
      office: 'Dinas Perhubungan',
      phone: '(0341) 444-210',
      email: 'trayek@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Rute Angkot',
        value: 'https://example.gov.id/formulir/rute-angkot',
      },
    ],
    relatedServices: ['permohonan-jadwal-bus'],
    faqs: [
      {
        question: 'Apakah semua perubahan rute harus izin?',
        answer: 'Ya, agar penataan trayek tetap tertib dan terkoordinasi.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/rute-angkot',
    downloadAppLinks: [
      { platform: 'Portal Transportasi', url: 'https://example.gov.id/app/rute-angkot' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dishub',
    },
  },
  {
    id: 'srv-bantuan-pupuk',
    slug: 'bantuan-pupuk',
    icon: 'Sprout',
    name: 'Bantuan Pupuk Petani',
    description: 'Pendaftaran bantuan pupuk subsidi dan pendataan kelompok tani penerima.',
    categorySlug: 'pertanian',
    badge: 'Prioritas',
    stats: '6rb+ kelompok tani',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Layanan ini memfasilitasi petani dalam mendapatkan bantuan pupuk sesuai data lahan, kelompok tani, dan kuota yang tersedia.',
    requirements: [
      'KTP petani',
      'Data lahan garapan',
      'Surat rekomendasi kelompok tani',
      'Nomor kontak aktif',
    ],
    process: [
      'Daftar bantuan pupuk',
      'Verifikasi data petani dan lahan',
      'Validasi kelompok tani',
      'Kuota bantuan diproses',
    ],
    duration: '7 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Pertanian',
      phone: '(0341) 555-881',
      email: 'pertanian@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Bantuan Pupuk',
        value: 'https://example.gov.id/formulir/bantuan-pupuk',
      },
    ],
    relatedServices: ['pendataan-petani', 'asuransi-gagal-panen'],
    faqs: [
      {
        question: 'Apakah bantuan pupuk hanya untuk anggota kelompok tani?',
        answer: 'Umumnya ya, karena data penerima mengikuti mekanisme pendataan kelompok tani.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/bantuan-pupuk',
    downloadAppLinks: [
      { platform: 'Portal Tani', url: 'https://example.gov.id/app/tani' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/distan',
      instagram: 'https://instagram.com/example.distan',
    },
  },
  {
    id: 'srv-pendataan-petani',
    slug: 'pendataan-petani',
    icon: 'ClipboardList',
    name: 'Pendataan Petani',
    description: 'Pembaruan data petani, lahan, dan komoditas untuk sinkronisasi program pertanian.',
    categorySlug: 'pertanian',
    stats: '10rb+ data petani',
    showInMenu: true,
    order: 2,
    isIntegrated: false,
    detailedDescription: 'Layanan pendataan petani digunakan untuk memastikan data kelompok tani, luas lahan, dan komoditas tetap akurat sebagai dasar penyaluran program dan bantuan.',
    requirements: [
      'KTP petani',
      'Data lahan',
      'Nama kelompok tani',
      'Bukti kepemilikan atau penguasaan lahan',
    ],
    process: [
      'Isi formulir pendataan',
      'Serahkan dokumen pendukung',
      'Validasi lapangan bila diperlukan',
      'Data petani diperbarui',
    ],
    duration: '2 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Pertanian',
      phone: '(0341) 555-881',
      email: 'data-petani@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Pendataan Petani',
        value: 'https://example.gov.id/formulir/pendataan-petani',
      },
    ],
    relatedServices: ['bantuan-pupuk'],
    faqs: [
      {
        question: 'Apakah data ini dipakai untuk bantuan?',
        answer: 'Ya, data yang valid membantu penyaluran program pertanian lebih tepat sasaran.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/pendataan-petani',
    downloadAppLinks: [
      { platform: 'Portal Tani', url: 'https://example.gov.id/app/pendataan-petani' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/distan',
    },
  },
  {
    id: 'srv-bantuan-sosial-lansia',
    slug: 'bantuan-sosial-lansia',
    icon: 'HeartHandshake',
    name: 'Bantuan Sosial Lansia',
    description: 'Pendaftaran bantuan sosial rutin untuk warga lanjut usia yang memenuhi kriteria.',
    categorySlug: 'sosial',
    badge: 'Rekomendasi',
    stats: '4rb+ penerima',
    showInMenu: true,
    order: 1,
    isIntegrated: true,
    detailedDescription: 'Program bantuan sosial untuk lansia yang membutuhkan dukungan ekonomi atau perawatan dasar, dengan proses verifikasi data keluarga dan kelayakan penerima.',
    requirements: [
      'KTP dan KK',
      'Surat keterangan usia lanjut',
      'Data alamat domisili',
      'Nomor kontak keluarga pendamping',
    ],
    process: [
      'Ajukan pendaftaran bantuan',
      'Verifikasi kondisi ekonomi dan sosial',
      'Validasi lapangan oleh petugas',
      'Penetapan penerima bantuan',
    ],
    duration: '10 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Sosial',
      phone: '(0341) 666-450',
      email: 'sosial@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Bantuan Lansia',
        value: 'https://example.gov.id/formulir/bantuan-lansia',
      },
    ],
    relatedServices: ['bantuan-disabilitas'],
    faqs: [
      {
        question: 'Apakah bantuan diberikan setiap bulan?',
        answer: 'Penyaluran mengikuti jadwal program dan anggaran yang tersedia di daerah.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/bantuan-sosial-lansia',
    downloadAppLinks: [
      { platform: 'Portal Sosial', url: 'https://example.gov.id/app/sosial' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dinsos',
      facebook: 'https://facebook.com/example.dinsos',
    },
  },
  {
    id: 'srv-bantuan-disabilitas',
    slug: 'bantuan-disabilitas',
    icon: 'Accessible',
    name: 'Bantuan Disabilitas',
    description: 'Pendataan dan pengajuan bantuan bagi penyandang disabilitas.',
    categorySlug: 'sosial',
    stats: '2rb+ penerima',
    showInMenu: true,
    order: 2,
    isIntegrated: true,
    detailedDescription: 'Layanan ini memfasilitasi pengajuan bantuan dan pendataan penyandang disabilitas agar dapat menerima dukungan yang sesuai kebutuhan.',
    requirements: [
      'KTP dan KK',
      'Surat keterangan disabilitas',
      'Foto diri terbaru',
      'Data pendamping keluarga',
    ],
    process: [
      'Isi formulir pengajuan',
      'Verifikasi dokumen',
      'Assessment kebutuhan oleh petugas',
      'Penetapan bantuan',
    ],
    duration: '8 hari kerja',
    cost: 'Gratis',
    contactInfo: {
      office: 'Dinas Sosial',
      phone: '(0341) 666-450',
      email: 'disabilitas@malangkab.go.id',
    },
    downloadForms: [
      {
        type: 'url',
        name: 'Formulir Bantuan Disabilitas',
        value: 'https://example.gov.id/formulir/bantuan-disabilitas',
      },
    ],
    relatedServices: ['bantuan-sosial-lansia'],
    faqs: [
      {
        question: 'Apakah ada pendampingan saat daftar?',
        answer: 'Ya, petugas dapat membantu proses pendaftaran dan verifikasi dokumen.',
      },
    ],
    operatingHours: [
      { days: 'Senin - Jumat', hours: '08.00 - 15.00 WIB' },
    ],
    serviceLink: 'https://example.gov.id/layanan/bantuan-disabilitas',
    downloadAppLinks: [
      { platform: 'Portal Sosial', url: 'https://example.gov.id/app/bantuan-disabilitas' },
    ],
    socialMedia: {
      website: 'https://example.gov.id/dinsos',
    },
  },
];

async function seedServices() {
  try {
    console.log('🌱 Seeding services...\n');

    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' },
    });

    if (!adminUser) {
      console.error('❌ Admin user not found! Please run seed-admin.ts first.');
      process.exit(1);
    }

    const categoryRecords: Record<string, { id: string }> = {};

    for (const category of categories) {
      const record = await prisma.serviceCategory.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          icon: category.icon,
          color: category.color,
          bgColor: category.bgColor,
          showInMenu: category.showInMenu,
          order: category.order,
        },
        create: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          color: category.color,
          bgColor: category.bgColor,
          showInMenu: category.showInMenu,
          order: category.order,
        },
      });
      categoryRecords[category.slug] = record;
      console.log('✅ Upserted category: ' + category.name);
    }

    for (const service of services) {
      const category = categoryRecords[service.categorySlug];
      if (!category) {
        throw new Error('Missing category for service ' + service.slug);
      }

      await prisma.service.upsert({
        where: { slug: service.slug },
        update: {
          icon: service.icon,
          name: service.name,
          description: service.description,
          categoryId: category.id,
          badge: service.badge,
          stats: service.stats,
          showInMenu: service.showInMenu,
          order: service.order,
          isIntegrated: service.isIntegrated,
          detailedDescription: service.detailedDescription,
          requirements: service.requirements,
          process: service.process,
          duration: service.duration,
          cost: service.cost,
          contactInfo: service.contactInfo,
          downloadForms: service.downloadForms,
          relatedServices: service.relatedServices,
          faqs: service.faqs,
          operatingHours: service.operatingHours,
          serviceLink: service.serviceLink,
          downloadAppLinks: service.downloadAppLinks,
          socialMedia: service.socialMedia,
          status: 'PUBLISHED',
          updatedById: adminUser.id,
        },
        create: {
          id: service.id,
          slug: service.slug,
          icon: service.icon,
          name: service.name,
          description: service.description,
          categoryId: category.id,
          badge: service.badge,
          stats: service.stats,
          showInMenu: service.showInMenu,
          order: service.order,
          isIntegrated: service.isIntegrated,
          detailedDescription: service.detailedDescription,
          requirements: service.requirements,
          process: service.process,
          duration: service.duration,
          cost: service.cost,
          contactInfo: service.contactInfo,
          downloadForms: service.downloadForms,
          relatedServices: service.relatedServices,
          faqs: service.faqs,
          operatingHours: service.operatingHours,
          serviceLink: service.serviceLink,
          downloadAppLinks: service.downloadAppLinks,
          socialMedia: service.socialMedia,
          status: 'PUBLISHED',
          createdById: adminUser.id,
        },
      });

      console.log('✅ Upserted service: ' + service.name);
    }

    console.log('\n🎉 Services seeding completed successfully!');
    console.log('   Total categories: ' + categories.length);
    console.log('   Total services: ' + services.length);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();
