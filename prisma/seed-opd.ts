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
    slug: "dinas-komunikasi-dan-informatika",
    name: "Dinas Komunikasi Dan Informatika",
    nickname: "Kominfo",
    description: "Dinas Komunikasi dan Informatika Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. K.H. Agus Salim No. 7 Malang 65119",
    contactInfo: {
      phone: "(0341) 364776",
      email: "kominfo@malangkab.go.id",
      website: "https://kominfo.malangkab.go.id",
    },
  },
  {
    id: "opd-002",
    slug: "dinas-kesehatan",
    name: "Dinas Kesehatan",
    nickname: "Dinkes",
    description: "Dinas Kesehatan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "JL PANJI 120 KEPANJEN",
    contactInfo: {
      phone: "0341391621",
      email: "dinkes@malangkab.go.id",
      website: "https://dinkes.malangkab.go.id",
    },
  },
  {
    id: "opd-003",
    slug: "dinas-pendidikan",
    name: "Dinas Pendidikan",
    nickname: "Dispendik",
    description: "Dinas Pendidikan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl.Panarukan No. 1 Kepanjen",
    contactInfo: {
      phone: "0341393935",
      email: "dispendik@malangkab.go.id",
      website: "https://dispendik.malangkab.go.id",
    },
  },
  {
    id: "opd-004",
    slug: "dinas-pemuda-dan-olahraga",
    name: "Dinas Pemuda Dan Olahraga",
    nickname: "Dispora",
    description: "Dinas Pemuda dan Olahraga Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Jl. Trunojoyo Kompleks Stadion Kanjuruhan Kepanjen",
    contactInfo: {
      phone: "0341399909",
      email: "dispora@malangkab.go.id",
      website: "https://dispora.malangkab.go.id",
    },
  },
  {
    id: "opd-005",
    slug: "dinas-sosial",
    name: "Dinas Sosial",
    nickname: "Dinsos",
    description: "Dinas Sosial Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 5,
    address: "Jl. Majapahit No.5 Malang",
    contactInfo: {
      phone: "0341362601",
      email: "newdinsos@gmail.com",
      website: "https://dinsos.malangkab.go.id",
    },
  },
  {
    id: "opd-006",
    slug: "dinas-tenaga-kerja",
    name: "Dinas Tenaga Kerja",
    nickname: "Disnaker",
    description: "Dinas Tenaga Kerja Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 6,
    address: "Jl.Trunojoyo Kav. 3 Kepanjen Telp. (0341) 393933-34, Fax. 393932",
    contactInfo: {
      phone: "0341393933",
      email: "disnaker@malangkab.go.id",
      website: "https://disnaker.malangkab.go.id",
    },
  },
  {
    id: "opd-007",
    slug: "dinas-perhubungan",
    name: "Dinas Perhubungan Kabupaten Malang",
    nickname: "Dishub",
    description: "Dinas Perhubungan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 7,
    address: "Jl. Raya Talangagung, Kepanjen Telp. / Fax (0341) 3901300",
    contactInfo: {
      phone: "03413901300",
      email: "dishub@malangkab.go.id",
      website: "https://dishub.malangkab.go.id",
    },
  },
  {
    id: "opd-008",
    slug: "dinas-kependudukan-dan-pencatatan-sipil",
    name: "Dinas Kependudukan Dan Pencatatan Sipil",
    nickname: "Dispendukcapil",
    description: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 8,
    address: "Jl. Trunojoyo Kepanjen",
    contactInfo: {
      phone: "Telp. 0341-399-744 / WA. 0858-9545-3153",
      email: "dispendukcapil@malangkab.go.id",
      website: "https://dispendukcapil.malangkab.go.id",
    },
  },
  {
    id: "opd-009",
    slug: "dinas-pariwisata-dan-kebudayaan",
    name: "Dinas Pariwisata Dan Kebudayaan",
    nickname: "Disparbud",
    description: "Dinas Pariwisata dan Kebudayaan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 9,
    address: "Jl. KH. Agus Salim No. 7, Gedung J Lt.1 dan 2, Malang",
    contactInfo: {
      phone: "082132091428",
      email: "disparkabmalang@gmail.com",
      website: "https://disparbud.malangkab.go.id",
    },
  },
  {
    id: "opd-010",
    slug: "dinas-pekerjaan-umum",
    name: "Dinas Pekerjaan Umum Bina Marga",
    nickname: "Bina Marga",
    description: "Dinas Pekerjaan Umum Bina Marga Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 10,
    address:
      "Jl. Jl. Trunojoyo Kavling 6 Kepanjen (Depan Stadion Kanjuruhan, ex Badan Diklat Kabupaten Malang dan Badan lingkungan hidup Kabupaten Malang)",
    contactInfo: {
      phone: "0341393930",
      email: "binamarga.kabmalang@gmail.com",
      website: "https://binamarga.malangkab.go.id",
    },
  },
  {
    id: "opd-011",
    slug: "dinas-pekerjaan-umum-sumber-daya-air",
    name: "Dinas Pekerjaan Umum Sumber Daya Air",
    nickname: "SDA",
    description: "Dinas Pekerjaan Umum Sumber Daya Air Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 11,
    address: "Jl. Kawi No. 1, Kepanjen Telp. (0341) 395025, 393944",
    contactInfo: {
      phone: "0341395025",
      email: "sumberdayaair@malangkab.go.id",
      website: "https://sumberdayaair.malangkab.go.id",
    },
  },
  {
    id: "opd-012",
    slug: "dinas-perumahan-kawasan-permukiman-dan-cipta-karya",
    name: "Dinas Perumahan, Kawasan Permukiman Dan Cipta Karya",
    nickname: "PKPCK",
    description:
      "Dinas Perumahan, Kawasan Permukiman dan Cipta Karya Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 12,
    address:
      "Jl. Trunojoyo kapling 6 Kepanjen Kabupaten Malang Telp. (0341) 391679 Fax: (0341) 391678",
    contactInfo: {
      phone: "0341391679",
      email: "perumahan-ciptakarya@malangkab.go.id",
      website: "https://perumahan-ciptakarya.malangkab.go.id",
    },
  },
  {
    id: "opd-013",
    slug: "dinas-perindustrian-dan-perdagangan",
    name: "Dinas Perindustrian Dan Perdagangan",
    nickname: "Disperindag",
    description: "Dinas Perindustrian dan Perdagangan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 13,
    address: "Jl. PANJI No.119, Kepanjen Telp. (0341) 391676",
    contactInfo: {
      phone: "0341391676",
      email: "disperindag@malangkab.go.id",
      website: "https://disperindag.malangkab.go.id",
    },
  },
  {
    id: "opd-014",
    slug: "dinas-koperasi-dan-usaha-mikro",
    name: "Dinas Koperasi Dan Usaha Mikro",
    nickname: "Dinkop UM",
    description: "Dinas Koperasi dan Usaha Mikro Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 14,
    address: "Jl. Trunojoyo Kav. 1, Kepanjen Telp. (0341) 393921, Fax. 393922",
    contactInfo: {
      phone: "0341393921",
      email: "dinkop@malangkab.go.id",
      website: "https://dinkop.malangkab.go.id",
    },
  },
  {
    id: "opd-015",
    slug: "dinas-tanaman-pangan-hortikultura-dan-perkebunan",
    name: "Dinas Tanaman Pangan, Hortikultura Dan Perkebunan",
    nickname: "Distan",
    description:
      "Dinas Tanaman Pangan, Hortikultura dan Perkebunan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 15,
    address: "Jl.Sumedang No. 28 Kepanjen Telp. (0341) 396893, 395749",
    contactInfo: {
      phone: "0341396893",
      email: "dinas.tanaman.pangan@malangkab.go.id",
      website: "https://tanaman-pangan.malangkab.go.id",
    },
  },
  {
    id: "opd-016",
    slug: "dinas-perikanan",
    name: "Dinas Perikanan",
    nickname: "Perikanan",
    description: "Dinas Perikanan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 16,
    address:
      "Jl. Panji No.119 Kepanjen Malang. Belakang kantor DPRD Telp. (0341) 399755. FAX : (0341) 399755",
    contactInfo: {
      phone: "0341399755",
      email: "perikanankabmalang@gmail.com",
      website: "https://perikanan.malangkab.go.id/",
    },
  },
  {
    id: "opd-017",
    slug: "dinas-ketahanan-pangan",
    name: "Dinas Ketahanan Pangan",
    nickname: "DKP",
    description: "Dinas Ketahanan Pangan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 17,
    address: "Jl. Raya Karangduren No. 1 Pakisaji - Malang",
    contactInfo: {
      phone: "0341804423",
      email: "dkp.malangkab@gmail.com",
      website: "https://ketahanan-pangan.malangkab.go.id",
    },
  },
  {
    id: "opd-018",
    slug: "dinas-peternakan-dan-kesehatan-hewan",
    name: "Dinas Peternakan Dan Kesehatan Hewan",
    nickname: "Disnak Keswan",
    description: "Dinas Peternakan dan Kesehatan Hewan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 18,
    address: "Jl. Trunojoyo Kav. 4 Kepanjen",
    contactInfo: {
      phone: "0341393926",
      email: "disnak-keswan@malangkab.go.id",
      website: "https://disnak-keswan.malangkab.go.id",
    },
  },
  {
    id: "opd-019",
    slug: "dinas-pemberdayaan-perempuan-dan-perlindungan-anak",
    name: "Dinas Pemberdayaan Perempuan Dan Perlindungan Anak",
    nickname: "DP3A",
    description:
      "Dinas Pemberdayaan Perempuan dan Perlindungan Anak Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 19,
    address:
      "Jl. Jend. Ahmad Yani Utara No.384B, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur 65126",
    contactInfo: {
      phone: "0341346682",
      email: "kpppamalang@gmail.com",
      website: "https://dp3a.malangkab.go.id",
    },
  },
  {
    id: "opd-020",
    slug: "dinas-pemberdayaan-masyarakat-dan-desa",
    name: "Dinas Pemberdayaan Masyarakat Dan Desa",
    nickname: "DPMD",
    description: "Dinas Pemberdayaan Masyarakat dan Desa Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 20,
    address: "Jl. Merdeka Timur No. 3 Malang",
    contactInfo: {
      phone: "0341352454",
      email: "dpmd@malangkab.go.id",
      website: "https://pmd.malangkab.go.id",
    },
  },
  {
    id: "opd-021",
    slug: "dinas-pengendalian-penduduk-dan-keluarga-berencana",
    name: "Dinas Pengendalian Penduduk Dan Keluarga Berencana",
    nickname: "DPPKB",
    description:
      "Dinas Pengendalian Penduduk dan Keluarga Berencana Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 21,
    address: "Jalan Raden Panji No. 158 Lantai 6 Kepanjen - Malang",
    contactInfo: {
      phone: "03413905313",
      email: "dinas.kb@malangkab.go.id",
      website: "https://kb.malangkab.go.id",
    },
  },
  {
    id: "opd-022",
    slug: "dinas-perpustakaan-dan-kearsipan",
    name: "Dinas Perpustakaan Dan Kearsipan",
    nickname: "Pusip",
    description: "Dinas Perpustakaan dan Kearsipan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 22,
    address: "Jalan Panglima Sudirman No.19 Kepanjen",
    contactInfo: {
      phone: "0341397789",
      email: "perpus-arsip@malangkab.go.id",
      website: "https://perpus-arsip.malangkab.go.id",
    },
  },
  {
    id: "opd-023",
    slug: "dinas-lingkungan-hidup",
    name: "Dinas Lingkungan Hidup",
    nickname: "DLH",
    description: "Dinas Lingkungan Hidup Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 23,
    address: "Jl. Nusa Barong No. 13, Klojen, Malang",
    contactInfo: {
      phone: "0341392029",
      email: "lh@malangkab.go.id",
      website: "https://lh.malangkab.go.id/",
    },
  },
  {
    id: "opd-024",
    slug: "dinas-pertanahan",
    name: "Dinas Pertanahan",
    nickname: "Pertanahan",
    description: "Dinas Pertanahan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 24,
    address: "Gedung C Lantai 1, Jalan Merdeka Timur Nomor 3 Kota Malang",
    contactInfo: {
      phone: "0341409001",
      email: "pertanahan@malangkab.go.id",
      website: "https://pertanahan.malangkab.go.id",
    },
  },
  {
    id: "opd-025",
    slug: "dinas-penanaman-modal-dan-pelayanan-terpadu-satu-pintu",
    name: "Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu",
    nickname: "DPMPTSP",
    description:
      "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 25,
    address: "Jl. Trunojoyo no. 4, Kedungpedaringan , Kepanjen",
    contactInfo: {
      phone: "0341396633",
      email: "pm-ptsp@malangkab.go.id",
      website: "https://pm-ptsp.malangkab.go.id",
    },
  },
  // BADAN
  {
    id: "opd-026",
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
    id: "opd-027",
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
    id: "opd-028",
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
    id: "opd-029",
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
    id: "opd-030",
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
    id: "opd-031",
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
    id: "opd-032",
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
    id: "opd-033",
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
    id: "opd-034",
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
    id: "opd-035",
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
    id: "opd-036",
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
    id: "opd-037",
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
    id: "opd-038",
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
    id: "opd-039",
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
    id: "opd-040",
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
    id: "opd-041",
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
    id: "opd-042",
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
    id: "opd-043",
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
    id: "opd-044",
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
    id: "opd-045",
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
    id: "opd-046",
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

const malangAgencyUpdates = [
  {
    slug: "bappeda",
    name: "Badan Perencanaan Pembangunan Daerah Kabupaten Malang",
    nickname: "Bappeda",
    description: "Badan Perencanaan Pembangunan Daerah Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0314392322",
      email: "bappeda@malangkab.go.id",
      website: "https://bappeda.malangkab.go.id",
    },
  },
  {
    slug: "badan-kepegawaian-dan-pengembangan-sdm",
    name: "Badan Kepegawaian Dan Pengembangan Sumber Daya Manusia",
    nickname: "BKPSDM",
    description:
      "Badan Kepegawaian Dan Pengembangan Sumber Daya Manusia Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. KH.Agus Salim No.7 Malang",
    contactInfo: {
      phone: "0341364776",
      email: "bkpsdm@malangkab.go.id",
      website: "https://bkpsdm.malangkab.go.id/",
    },
  },
  {
    slug: "badan-pengelolaan-keuangan-dan-aset-daerah",
    name: "Badan Keuangan Dan Aset Daerah",
    nickname: "BKAD",
    description: "Badan Keuangan Dan Aset Daerah Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. KH.Agus Salim No.7 Malang",
    contactInfo: {
      phone: "0341362372",
      email: "bkad@malangkab.go.id",
      website: "https://bkad.malangkab.go.id",
    },
  },
  {
    slug: "badan-kesatuan-bangsa-dan-politik",
    name: "Badan Kesatuan Bangsa Dan Politik",
    nickname: "Bakesbangpol",
    description: "Badan Kesatuan Bangsa Dan Politik Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392031",
      email: "bakesbangpol@malangkab.go.id",
      website: "https://bakesbangpol.malangkab.go.id",
    },
  },
  {
    slug: "badan-penanggulangan-bencana-daerah",
    name: "Badan Penanggulangan Bencana Daerah",
    nickname: "BPBD",
    description: "Badan Penanggulangan Bencana Daerah Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 5,
    address: "Jl. Trunojoyo Kepanjen",
    contactInfo: {
      phone: "+6282244094886",
      email: "bpbd@malangkab.go.id",
      website: "https://bpbd.malangkab.go.id",
    },
  },
  {
    slug: "badan-pendapatan-daerah",
    name: "Badan Pendapatan Daerah",
    nickname: "Bapenda",
    description: "Badan Pendapatan Daerah Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 6,
    address: "Jl. Panji No.158 Kepanjen",
    contactInfo: {
      phone: "03413904898",
      email: "bapenda@malangkab.go.id",
      website: "https://bapenda.malangkab.go.id",
    },
  },
  {
    slug: "badan-riset-dan-inovasi-daerah",
    name: "Badan Riset Dan Inovasi Daerah",
    nickname: "BRIDA",
    description: "Badan Riset Dan Inovasi Daerah Kabupaten Malang",
    category: "BADAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 7,
    address: "Jalan Panji Nomor 158 Kepanjen",
    contactInfo: {
      phone: "0341392023",
      email: "brida@malangkab.go.id",
      website: "https://brida.malangkab.go.id/",
    },
  },
  {
    slug: "dinas-komunikasi-dan-informatika",
    name: "Dinas Komunikasi Dan Informatika",
    nickname: "Kominfo",
    description: "Dinas Komunikasi Dan Informatika Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 8,
    address: "Jl. K.H. Agus Salim No. 7 Malang",
    contactInfo: {
      phone: "0341364776",
      email: "kominfo@malangkab.go.id",
      website: "https://kominfo.malangkab.go.id",
    },
  },
  {
    slug: "dinas-kependudukan-dan-pencatatan-sipil",
    name: "Dinas Kependudukan Dan Pencatatan Sipil",
    nickname: "Dispendukcapil",
    description: "Dinas Kependudukan Dan Pencatatan Sipil Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 9,
    address: "Jl. Trunojoyo Kepanjen",
    contactInfo: {
      phone: "0341399744",
      email: "dispendukcapil@malangkab.go.id",
      website: "https://dispendukcapil.malangkab.go.id",
    },
  },
  {
    slug: "dinas-kesehatan",
    name: "Dinas Kesehatan",
    nickname: "Dinkes",
    description: "Dinas Kesehatan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 10,
    address: "Jl. Panji 120 Kepanjen",
    contactInfo: {
      phone: "0341391621",
      email: "dinkes@malangkab.go.id",
      website: "https://dinkes.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pendidikan",
    name: "Dinas Pendidikan",
    nickname: "Dispendik",
    description: "Dinas Pendidikan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 11,
    address: "Jl.Panarukan No. 1 Kepanjen",
    contactInfo: {
      phone: "0341393935",
      email: "dispendik@malangkab.go.id",
      website: "https://dispendik.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pemuda-dan-olahraga",
    name: "Dinas Pemuda Dan Olahraga",
    nickname: "Dispora",
    description: "Dinas Pemuda Dan Olahraga Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 12,
    address: "Jl. Trunojoyo Kompleks Stadion Kanjuruhan Kepanjen",
    contactInfo: {
      phone: "0341399909",
      email: "dispora@malangkab.go.id",
      website: "https://dispora.malangkab.go.id",
    },
  },
  {
    slug: "dinas-sosial",
    name: "Dinas Sosial",
    nickname: "Dinsos",
    description: "Dinas Sosial Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 13,
    address: "Jl. Majapahit No.5 Malang",
    contactInfo: {
      phone: "0341362601",
      email: "newdinsos@gmail.com",
      website: "https://dinsos.malangkab.go.id",
    },
  },
  {
    slug: "dinas-tenaga-kerja",
    name: "Dinas Tenaga Kerja",
    nickname: "Disnaker",
    description: "Dinas Tenaga Kerja Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 14,
    address: "Jl.Trunojoyo Kav. 3 Kepanjen Telp. (0341) 393933-34, Fax. 393932",
    contactInfo: {
      phone: "0341393933",
      email: "disnaker@malangkab.go.id",
      website: "https://disnaker.malangkab.go.id",
    },
  },
  {
    slug: "dinas-perhubungan",
    name: "Dinas Perhubungan Kabupaten Malang",
    nickname: "Dishub",
    description: "Dinas Perhubungan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 15,
    address: "Jl. Raya Talangagung, Kepanjen Telp. / Fax (0341) 3901300",
    contactInfo: {
      phone: "03413901300",
      email: "dishub@malangkab.go.id",
      website: "https://dishub.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pariwisata-dan-kebudayaan",
    name: "Dinas Pariwisata Dan Kebudayaan",
    nickname: "Disparbud",
    description: "Dinas Pariwisata Dan Kebudayaan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 16,
    address: "Jl. KH. Agus Salim No. 7, Gedung J Lt.1 dan 2, Malang",
    contactInfo: {
      phone: "082132091428",
      email: "disparkabmalang@gmail.com",
      website: "https://disparbud.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pekerjaan-umum-bina-marga",
    name: "Dinas Pekerjaan Umum Bina Marga",
    nickname: "Bina Marga",
    description: "Dinas Pekerjaan Umum Bina Marga Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 17,
    address:
      "Jl. Jl. Trunojoyo Kavling 6 Kepanjen (Depan Stadion Kanjuruhan, ex Badan Diklat Kabupaten Malang dan Badan lingkungan hidup Kabupaten Malang)",
    contactInfo: {
      phone: "0341393930",
      email: "binamarga.kabmalang@gmail.com",
      website: "https://binamarga.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pekerjaan-umum-sumber-daya-air",
    name: "Dinas Pekerjaan Umum Sumber Daya Air",
    nickname: "SDA",
    description: "Dinas Pekerjaan Umum Sumber Daya Air Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 18,
    address: "Jl. Kawi No. 1, Kepanjen Telp. (0341) 395025, 393944",
    contactInfo: {
      phone: "0341395025",
      email: "sumberdayaair@malangkab.go.id",
      website: "https://sumberdayaair.malangkab.go.id",
    },
  },
  {
    slug: "dinas-perumahan-kawasan-permukiman-dan-cipta-karya",
    name: "Dinas Perumahan, Kawasan Permukiman Dan Cipta Karya",
    nickname: "PKPCK",
    description:
      "Dinas Perumahan, Kawasan Permukiman Dan Cipta Karya Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 19,
    address:
      "Jl. Trunojoyo kapling 6 Kepanjen Kabupaten Malang Telp. (0341) 391679 Fax: (0341) 391678",
    contactInfo: {
      phone: "0341391679",
      email: "perumahan-ciptakarya@malangkab.go.id",
      website: "https://perumahan-ciptakarya.malangkab.go.id",
    },
  },
  {
    slug: "dinas-perindustrian-dan-perdagangan",
    name: "Dinas Perindustrian Dan Perdagangan",
    nickname: "Disperindag",
    description: "Dinas Perindustrian Dan Perdagangan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 20,
    address: "Jl. PANJI No.119, Kepanjen Telp. (0341) 391676",
    contactInfo: {
      phone: "0341391676",
      email: "disperindag@malangkab.go.id",
      website: "https://disperindag.malangkab.go.id",
    },
  },
  {
    slug: "dinas-koperasi-dan-usaha-mikro",
    name: "Dinas Koperasi Dan Usaha Mikro",
    nickname: "Dinkop UM",
    description: "Dinas Koperasi Dan Usaha Mikro Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 21,
    address: "Jl. Trunojoyo Kav. 1, Kepanjen Telp. (0341) 393921, Fax. 393922",
    contactInfo: {
      phone: "0341393921",
      email: "dinkop@malangkab.go.id",
      website: "https://dinkop.malangkab.go.id",
    },
  },
  {
    slug: "dinas-tanaman-pangan-hortikultura-dan-perkebunan",
    name: "Dinas Tanaman Pangan, Hortikultura Dan Perkebunan",
    nickname: "Distan",
    description:
      "Dinas Tanaman Pangan, Hortikultura Dan Perkebunan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 22,
    address: "Jl.Sumedang No. 28 Kepanjen Telp. (0341) 396893, 395749",
    contactInfo: {
      phone: "0341396893",
      email: "dinas.tanaman.pangan@malangkab.go.id",
      website: "https://tanaman-pangan.malangkab.go.id",
    },
  },
  {
    slug: "dinas-perikanan",
    name: "Dinas Perikanan",
    nickname: "Perikanan",
    description: "Dinas Perikanan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 23,
    address:
      "Jl. Panji No.119 Kepanjen Malang. Belakang kantor DPRD Telp. (0341) 399755. FAX : (0341) 399755",
    contactInfo: {
      phone: "0341399755",
      email: "perikanankabmalang@gmail.com",
      website: "https://perikanan.malangkab.go.id/",
    },
  },
  {
    slug: "dinas-ketahanan-pangan",
    name: "Dinas Ketahanan Pangan",
    nickname: "DKP",
    description: "Dinas Ketahanan Pangan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 24,
    address: "Jl. Raya Karangduren No. 1 Pakisaji - Malang",
    contactInfo: {
      phone: "0341804423",
      email: "dkp.malangkab@gmail.com",
      website: "https://ketahanan-pangan.malangkab.go.id",
    },
  },
  {
    slug: "dinas-peternakan-dan-kesehatan-hewan",
    name: "Dinas Peternakan Dan Kesehatan Hewan",
    nickname: "Disnak Keswan",
    description: "Dinas Peternakan Dan Kesehatan Hewan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 25,
    address: "Jl. Trunojoyo Kav. 4 Kepanjen",
    contactInfo: {
      phone: "0341393926",
      email: "disnak-keswan@malangkab.go.id",
      website: "https://disnak-keswan.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pemberdayaan-perempuan-dan-perlindungan-anak",
    name: "Dinas Pemberdayaan Perempuan Dan Perlindungan Anak",
    nickname: "DP3A",
    description:
      "Dinas Pemberdayaan Perempuan Dan Perlindungan Anak Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 26,
    address:
      "Jl. Jend. Ahmad Yani Utara No.384B, Arjosari, Kec. Blimbing, Kota Malang, Jawa Timur 65126",
    contactInfo: {
      phone: "0341346682",
      email: "kpppamalang@gmail.com",
      website: "https://dp3a.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pemberdayaan-masyarakat-dan-desa",
    name: "Dinas Pemberdayaan Masyarakat Dan Desa",
    nickname: "DPMD",
    description: "Dinas Pemberdayaan Masyarakat Dan Desa Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 27,
    address: "Jl. Merdeka Timur No. 3 Malang",
    contactInfo: {
      phone: "0341352454",
      email: "dpmd@malangkab.go.id",
      website: "https://pmd.malangkab.go.id",
    },
  },
  {
    slug: "dinas-pengendalian-penduduk-dan-keluarga-berencana",
    name: "Dinas Pengendalian Penduduk Dan Keluarga Berencana",
    nickname: "DPPKB",
    description:
      "Dinas Pengendalian Penduduk Dan Keluarga Berencana Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 28,
    address: "Jalan Raden Panji No. 158 Lantai 6 Kepanjen - Malang",
    contactInfo: {
      phone: "03413905313",
      email: "dinas.kb@malangkab.go.id",
      website: "https://kb.malangkab.go.id",
    },
  },
  {
    slug: "dinas-perpustakaan-dan-kearsipan",
    name: "Dinas Perpustakaan Dan Kearsipan",
    nickname: "Pusip",
    description: "Dinas Perpustakaan Dan Kearsipan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 29,
    address: "Jalan Panglima Sudirman No.19 Kepanjen",
    contactInfo: {
      phone: "0341397789",
      email: "perpus-arsip@malangkab.go.id",
      website: "https://perpus-arsip.malangkab.go.id",
    },
  },
  {
    slug: "dinas-lingkungan-hidup",
    name: "Dinas Lingkungan Hidup",
    nickname: "DLH",
    description: "Dinas Lingkungan Hidup Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 30,
    address: "Jl. Nusa Barong No. 13, Klojen, Malang",
    contactInfo: {
      phone: "0341392029",
      email: "lh@malangkab.go.id",
      website: "https://lh.malangkab.go.id/",
    },
  },
  {
    slug: "dinas-pertanahan",
    name: "Dinas Pertanahan",
    nickname: "Pertanahan",
    description: "Dinas Pertanahan Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 31,
    address: "Gedung C Lantai 1, Jalan Merdeka Timur Nomor 3 Kota Malang",
    contactInfo: {
      phone: "0341409001",
      email: "pertanahan@malangkab.go.id",
      website: "https://pertanahan.malangkab.go.id",
    },
  },
  {
    slug: "dinas-penanaman-modal-dan-pelayanan-terpadu-satu-pintu",
    name: "Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu",
    nickname: "DPMPTSP",
    description:
      "Dinas Penanaman Modal Dan Pelayanan Terpadu Satu Pintu Kabupaten Malang",
    category: "DINAS" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 32,
    address: "Jl. Trunojoyo no. 4, Kedungpedaringan , Kepanjen",
    contactInfo: {
      phone: "0341396633",
      email: "pm-ptsp@malangkab.go.id",
      website: "https://pm-ptsp.malangkab.go.id",
    },
  },
  {
    slug: "bagian-administrasi-pembangunan",
    name: "Bagian Administrasi Pembangunan",
    nickname: "Bag. AP",
    description: "Bagian Administrasi Pembangunan Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Gedung Sekretariat Daerah Lantai 3 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: null,
      email: "bag-ap@malangkab.go.id",
      website: "http://bag-ap.malangkab.go.id",
    },
  },
  {
    slug: "bagian-hukum",
    name: "Bagian Hukum",
    nickname: "Bag. Hukum",
    description: "Bagian Hukum Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Gedung Sekretariat Daerah Lantai 4 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-hukum@malangkab.go.id",
      website: "https://bag-hukum.malangkab.go.id",
    },
  },
  {
    slug: "bagian-kerja-sama",
    name: "Bagian Kerja Sama",
    nickname: "Bag. Kerjasama",
    description: "Bagian Kerja Sama Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Gedung Sekretariat Daerah Lantai 4 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-kerjasama@malangkab.go.id",
      website: "https://bag-kerjasama.malangkab.go.id",
    },
  },
  {
    slug: "bagian-kesejahteraan-rakyat",
    name: "Bagian Kesejahteraan Rakyat",
    nickname: "Bag. Kesra",
    description: "Bagian Kesejahteraan Rakyat Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Gedung Sekretariat Daerah Lantai 4 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-kesra@malangkab.go.id",
      website: "https://bag-kesra.malangkab.go.id",
    },
  },
  {
    slug: "bagian-organisasi",
    name: "Bagian Organisasi",
    nickname: "Bag. Organisasi",
    description: "Bagian Organisasi Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 5,
    address: "Gedung Sekretariat Daerah Lantai 3 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-organisasi@malangkab.go.id",
      website: "https://bag-organisasi.malangkab.go.id",
    },
  },
  {
    slug: "bagian-pengadaan-barang-jasa",
    name: "Bagian Pengadaan Barang/Jasa",
    nickname: "Bag. PBJ",
    description: "Bagian Pengadaan Barang/Jasa Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 6,
    address: "Gedung Sekretariat Daerah Lantai 5 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-pbj@malangkab.go.id",
      website: "https://bag-pbj.malangkab.go.id",
    },
  },
  {
    slug: "bagian-perekonomian",
    name: "Bagian Perekonomian",
    nickname: "Bag. Ekonomi",
    description: "Bagian Perekonomian Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 7,
    address: "Gedung Sekretariat Daerah Lantai 5 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392029",
      email: "bag-ekonomi@malangkab.go.id",
      website: "https://bag-ekonomi.malangkab.go.id",
    },
  },
  {
    slug: "bagian-protokol-dan-komunikasi-pimpinan",
    name: "Bagian Protokol & Komunikasi Pimpinan",
    nickname: "Bag. Prokompim",
    description: "Bagian Protokol & Komunikasi Pimpinan Sekretariat Daerah",
    category: "BAGIAN" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 8,
    address: "Gedung Sekretariat Daerah Lantai 1 Jl. Panji No. 158 Kepanjen",
    contactInfo: {
      phone: "0341392440",
      email: "bag-prokopim@malangkab.go.id",
      website: "https://bag-humas.malangkab.go.id",
    },
  },
  {
    slug: "badan-amil-zakat-nasional-kabupaten-malang",
    name: "Badan Amil Zakat Nasional Kabupaten Malang",
    nickname: "BAZNAS",
    description: "Badan Amil Zakat Nasional Kabupaten Malang",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 1,
    address: "Jl. Trunojoyo Kepanjen",
    contactInfo: {
      phone: "0341392489",
      email: "baznaskab.malang.go.id",
      website: "http://baznas.malangkab.go.id",
    },
  },
  {
    slug: "dewan-perwakilan-rakyat-daerah",
    name: "Dewan Perwakilan Rakyat Daerah",
    nickname: "DPRD",
    description: "Dewan Perwakilan Rakyat Daerah Kabupaten Malang",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 2,
    address: "Jl. Panji No.119 Kepanjen",
    contactInfo: {
      phone: "0341",
      email: "dprd@malangkab.go.id",
      website: "http://dprd.malangkab.go.id/",
    },
  },
  {
    slug: "inspektorat-daerah-kabupaten-malang",
    name: "Inspektorat Daerah Kabupaten Malang",
    nickname: "Inspektorat",
    description: "Inspektorat Daerah Kabupaten Malang",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 3,
    address: "Jl. Raya Mondoroko No 17B Singosari",
    contactInfo: {
      phone: "0341451905",
      email: "inspektorat.malangkab@gmail.com",
      website: "https://inspektorat.malangkab.go.id",
    },
  },
  {
    slug: "puskesmas-ampelgading",
    name: "Puskesmas Ampelgading",
    nickname: "Puskesmas Ampelgading",
    description: "Puskesmas Ampelgading Kabupaten Malang",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 4,
    address: "Jl. Raya Tirtomarto No. 75 Ampelgading",
    contactInfo: {
      phone: "0341851076",
      email: "uptpuskesmasamgad@gmail.com",
      website: "https://puskesmasampelgading.malangkab.go.id",
    },
  },
  {
    slug: "puskesmas-dampit",
    name: "Puskesmas Dampit",
    nickname: "Puskesmas Dampit",
    description: "Puskesmas Dampit Kabupaten Malang",
    category: "ORGANISASI_LAINNYA" as OpdCategory,
    status: "AKTIF" as OpdStatus,
    showInMenu: true,
    order: 5,
    address: "Malang",
    contactInfo: {
      phone: "0341896309",
      email: "puskesmasdampit@malangkab.go.id",
      website: "https://puskesmasdampit.malangkab.go.id",
    },
  },
];

function applyMalangAgencyUpdates() {
  const bySlug = new Map(opds.map((opd, index) => [opd.slug, index]));
  let nextId = opds.length + 1;

  for (const update of malangAgencyUpdates) {
    const index = bySlug.get(update.slug);
    if (index !== undefined) {
      opds[index] = {
        ...opds[index],
        ...update,
      };
      continue;
    }

    opds.push({
      id: `opd-${String(nextId++).padStart(3, "0")}`,
      ...update,
    });
    bySlug.set(update.slug, opds.length - 1);
  }
}

applyMalangAgencyUpdates();

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
  console.log(
    `  - DINAS: ${opds.filter((o) => o.category === "DINAS").length}`,
  );
  console.log(
    `  - BADAN: ${opds.filter((o) => o.category === "BADAN").length}`,
  );
  console.log(
    `  - KECAMATAN: ${opds.filter((o) => o.category === "KECAMATAN").length}`,
  );
  console.log(
    `  - KELURAHAN: ${opds.filter((o) => o.category === "KELURAHAN").length}`,
  );
  console.log(`  - DESA: ${opds.filter((o) => o.category === "DESA").length}`);
  console.log(
    `  - BAGIAN: ${opds.filter((o) => o.category === "BAGIAN").length}`,
  );
  console.log(
    `  - ORGANISASI_LAINNYA: ${opds.filter((o) => o.category === "ORGANISASI_LAINNYA").length}`,
  );
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
