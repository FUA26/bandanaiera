"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Landmark, History, Target, Map as MapIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KabupatenMalangMap = dynamic(
  () =>
    import("@/components/landing/sections/kabupaten-malang-map").then(
      (module) => module.KabupatenMalangMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted flex h-[360px] items-center justify-center rounded-2xl border sm:h-[420px]">
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <MapIcon className="h-5 w-5" />
          Memuat peta wilayah Kabupaten Malang...
        </div>
      </div>
    ),
  },
);

const historyParagraphs = [
  "Kabupaten Malang adalah salah satu kabupaten di Provinsi Jawa Timur yang memiliki wilayah sangat luas dan ragam bentang alam yang kuat, mulai dari kawasan pegunungan, dataran tinggi, hingga pesisir selatan. Dalam konteks regional, Kabupaten Malang dikenal sebagai kabupaten terluas kedua di Jawa Timur setelah Banyuwangi dan memiliki peran penting dalam perkembangan ekonomi, budaya, dan pariwisata di wilayah selatan provinsi.",
  "Akar sejarah Kabupaten Malang dapat ditelusuri sejak masa Kerajaan Kanjuruhan dan Singhasari. Dalam perjalanan sejarahnya, kawasan Tumapel memegang peranan besar ketika pusat kekuasaan beralih dari Kediri menuju Singhasari. Jejak perubahan itu melekat kuat dalam identitas sejarah Malang, terutama melalui tokoh-tokoh dan peristiwa yang membentuk dinamika politik Jawa Timur pada masa awal kerajaan-kerajaan besar.",
  "Sisa-sisa kejayaan masa lampau masih dapat ditemukan melalui nama tempat dan peninggalan sejarah yang tersebar di berbagai wilayah. Candi Kidal di Tumpang, Candi Singhasari di Singosari, dan Candi Jago di Tumpang menjadi bukti penting bahwa kawasan Malang telah lama menjadi ruang hidup peradaban yang maju, baik dalam tradisi keagamaan, kebudayaan, maupun pemerintahan.",
  "Pada masa-masa berikutnya, wilayah Malang mengalami pergantian pengaruh dari masa Majapahit, Mataram, hingga era VOC. Ketika pemerintahan kolonial menguat, Malang kemudian dipimpin oleh para bupati, dengan Raden Tumenggung Notodiningrat I sebagai Bupati Malang pertama pada awal abad ke-19. Fase ini menandai bentuk pemerintahan modern yang kemudian berkembang menjadi struktur kabupaten seperti yang dikenal sekarang.",
  "Prasasti Dinoyo menjadi salah satu rujukan paling penting dalam penetapan hari jadi Kabupaten Malang. Berdasarkan prasasti tersebut, tanggal 28 November 760 ditetapkan sebagai hari jadi daerah. Sejak tahun 1984, Pendopo Kabupaten Malang juga rutin menampilkan upacara bernuansa Kerajaan Kanjuruhan sebagai bentuk penghormatan terhadap akar sejarah dan identitas budaya daerah.",
];

const geographyFacts = [
  {
    label: "Luas Wilayah",
    value: "2.977,05 km²",
  },
  {
    label: "Jumlah Penduduk",
    value: "2.544.315 jiwa",
  },
  {
    label: "Kecamatan",
    value: "33",
  },
  {
    label: "Desa",
    value: "378",
  },
  {
    label: "Kelurahan",
    value: "12",
  },
];

const geographyHighlights = [
  "Utara berbatasan dengan Kabupaten Pasuruan dan Kabupaten Mojokerto.",
  "Timur berbatasan dengan Kabupaten Probolinggo dan Kabupaten Lumajang.",
  "Barat berbatasan dengan Kabupaten Blitar dan Kabupaten Kediri.",
  "Selatan berbatasan langsung dengan Samudra Indonesia.",
];

const missionItems = [
  "Mewujudkan Peningkatan Kesejahteraan Sosial, Peningkatan Kualitas SDM dan Pemenuhan Kebutuhan Dasar",
  "Mewujudkan Pembangunan Ekonomi Inklusif dan Produktif yang Berkelanjutan serta Ramah Lingkungan",
  "Mewujudkan Tata Kelola Pemerintahan dalam Pembangunan Berkesinambungan",
  "Memantapkan Stabilitas Ketentraman Ketertiban Umum dan Perlindungan Masyarakat serta Ketahanan Sosial Budaya",
  "Mewujudkan Pembangunan Kewilayahan dan Infrastruktur yang Merata, Berkeadilan, Berkualitas, Ramah Lingkungan untuk Mewujudkan Kesinambungan Pembangunan",
];

const symbolItems = [
  "Perisai segi lima melambangkan jiwa nasional dan Pancasila.",
  "Kubah melambangkan papan atau tempat bernaung kehidupan rohani dan jasmani.",
  "Bintang melambangkan Ketuhanan Yang Maha Esa.",
  "Padi dan kapas melambangkan masyarakat adil dan makmur.",
  "Gunung berapi, asap, laut, dan keris melambangkan potensi alam, semangat, kekayaan, dan jiwa kepahlawanan.",
  "Pita bertuliskan Satata Gama Kartaraharja melambangkan masyarakat adil dan makmur materiil dan spirituil.",
];

const contentTextClass = "space-y-4 text-base leading-8 text-muted-foreground";

export default function ProfilePage() {
  const t = useTranslations("Government.profile");

  return (
    <main className="bg-muted min-h-screen">
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Landmark className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/80">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="history" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList className="h-auto flex-wrap justify-center gap-2 bg-white/60 p-2 backdrop-blur-sm">
              <TabsTrigger value="history" className="gap-2 px-4 py-2">
                <History className="h-4 w-4" />
                {t("tabs.history")}
              </TabsTrigger>
              <TabsTrigger value="vision" className="gap-2 px-4 py-2">
                <Target className="h-4 w-4" />
                {t("tabs.visionMission")}
              </TabsTrigger>
              <TabsTrigger value="geography" className="gap-2 px-4 py-2">
                <MapIcon className="h-4 w-4" />
                {t("tabs.geography")}
              </TabsTrigger>
              <TabsTrigger value="symbols" className="gap-2 px-4 py-2">
                <Landmark className="h-4 w-4" />
                {t("symbols")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
              <CardHeader className="border-b bg-white/70">
                <CardTitle className="text-2xl text-foreground">
                  {t("history")}
                </CardTitle>
              </CardHeader>
              <CardContent className={`${contentTextClass} p-6 sm:p-8`}>
                {historyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision">
            <div className="grid gap-6">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="border-b bg-white/70">
                  <CardTitle className="text-2xl text-foreground">
                    {t("vision")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <blockquote className="border-primary text-foreground border-l-4 pl-4 text-xl leading-9 font-medium italic">
                    Terwujudnya Kabupaten Malang yang Maju, Sejahtera, Berdaya
                    Saing dan Berkelanjutan dengan Semangat Gotong Royong
                    berdasarkan Pancasila dalam Negara Kesatuan Republik
                    Indonesia yang Bhineka Tunggal Ika.
                  </blockquote>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="border-b bg-white/70">
                  <CardTitle className="text-2xl text-foreground">
                    {t("mission")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <p className="text-muted-foreground mb-4 text-base leading-7">
                    Dalam rangka mewujudkan visi tersebut, ditetapkan 5 misi
                    sebagai berikut:
                  </p>
                  <ul className="text-muted-foreground list-disc space-y-3 pl-5 text-base leading-8">
                    {missionItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
              <CardHeader className="border-b bg-white/70">
                <CardTitle className="text-2xl text-foreground">
                  {t("geography")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6 sm:p-8">
                <KabupatenMalangMap />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {geographyFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-center"
                    >
                      <p className="text-sm font-medium tracking-wide text-emerald-900/70 uppercase">
                        {fact.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-emerald-950">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {geographyHighlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border bg-white px-4 py-4 text-sm leading-7 text-muted-foreground shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symbols">
            <div className="grid gap-6">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="border-b bg-white/70">
                  <CardTitle className="text-2xl text-foreground">
                    {t("symbols")}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`${contentTextClass} p-6 sm:p-8`}>
                  <p>
                    Kabupaten Malang menetapkan Burung Cucak Ijo sebagai
                    identitas fauna daerah, sedangkan Apel Manalagi ditetapkan
                    sebagai identitas flora daerah.
                  </p>
                  <p>
                    Penetapan maskot ini dimaksudkan untuk pengenalan,
                    pelestarian, pendidikan, dan promosi kepariwisataan
                    Kabupaten Malang.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader className="border-b bg-white/70">
                  <CardTitle className="text-2xl text-foreground">
                    Arti Lambang
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <ul className="text-muted-foreground list-disc space-y-3 pl-5 text-base leading-8">
                    {symbolItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
