import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Smartphone,
  Building2,
  FileText,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="from-primary-hover to-primary-active text-primary-foreground bg-gradient-to-b">
      {/* Main Footer */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-12">
          {/* Brand Section - Spans 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 shadow-sm ring-1 ring-white/20">
                <Image
                  src="/naiera.png"
                  alt="Naiera Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t("brandName")}
                </h3>
                <p className="text-primary-foreground/70 text-sm">
                  {t("brandSubtitle")}
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              {t("brandDescription")}
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <p className="mb-3 text-sm font-semibold text-white">
                {t("followUs")}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#facebook"
                  className="group hover:bg-primary flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                </a>
                <a
                  href="#twitter"
                  className="group hover:bg-primary flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                </a>
                <a
                  href="#instagram"
                  className="group hover:bg-primary flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                </a>
                <a
                  href="#youtube"
                  className="group hover:bg-primary flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all duration-300"
                  aria-label="Youtube"
                >
                  <Youtube
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Layanan - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Building2 size={20} className="text-blue-400" />
              {t("services.title")}
            </h3>
            <ul className="space-y-3">
              {[
                { key: "population", slug: "/layanan/e-ktp" },
                { key: "health", slug: "/layanan/bpjs-kesehatan" },
                { key: "education", slug: "/layanan/ppdb" },
                { key: "economy", slug: "/layanan/pajak-daerah" },
                { key: "manpower", slug: "/layanan/kartu-kuning" },
                { key: "tourism", slug: "/informasi-publik/destinasi-wisata" },
                { key: "infrastructure", slug: "/layanan/imb" },
                { key: "social", slug: "/layanan/bansos" },
              ].map(({ key, slug }) => (
                <li key={key}>
                  <a
                    href={slug}
                    className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    {t(`services.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tentang - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Info size={20} className="text-blue-400" />
              {t("about.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/pemerintahan/profil"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.aboutUs")}
                </a>
              </li>
              <li>
                <a
                  href="/pemerintahan/profil"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.visionMission")}
                </a>
              </li>
              <li>
                <a
                  href="/pemerintahan/struktur"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.structure")}
                </a>
              </li>
              <li>
                <a
                  href="/informasi-publik/berita-terkini"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.news")}
                </a>
              </li>
              <li>
                <a
                  href="/informasi-publik/agenda-kegiatan"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.events")}
                </a>
              </li>
              <li>
                <a
                  href="/informasi-publik/pengumuman"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("about.careers")}
                </a>
              </li>
            </ul>
          </div>

          {/* Bantuan - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <FileText size={20} className="text-blue-400" />
              {t("help.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/faq"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("help.faq")}
                </a>
              </li>
              <li>
                <a
                  href="/panduan"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("help.guide")}
                </a>
              </li>
              <li>
                <a
                  href="/kontak"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("help.contactUs")}
                </a>
              </li>
              <li>
                <a
                  href="/pengaduan"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  {t("help.complaints")}
                </a>
              </li>
              <li>
                <a
                  href="/panduan"
                  className="group inline-flex items-center gap-2 text-blue-100/80 transition-colors hover:text-white"
                >
                  <Smartphone size={14} className="text-blue-400" />
                  {t("help.downloadApp")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Phone size={20} className="text-blue-400" />
              {t("contact.title")}
            </h3>
            <ul className="space-y-4">
              <li className="group flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    {t("contact.address")}
                  </p>
                  <div className="text-sm leading-relaxed whitespace-pre-line text-blue-100/80">
                    {t("contact.addressContent")}
                  </div>
                </div>
              </li>
              <li className="group flex items-start gap-3">
                <Phone size={18} className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    {t("contact.phone")}
                  </p>
                  <a
                    href="tel:+622112345678"
                    className="text-sm text-blue-100/80 transition-colors hover:text-white"
                  >
                    (021) 1234-5678
                  </a>
                  <br />
                  <a
                    href="tel:+622198765432"
                    className="text-sm text-blue-100/80 transition-colors hover:text-white"
                  >
                    (021) 9876-5432
                  </a>
                </div>
              </li>
              <li className="group flex items-start gap-3">
                <Mail size={18} className="mt-1 shrink-0 text-blue-400" />
                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    {t("contact.email")}
                  </p>
                  <a
                    href="mailto:info@naiera.go.id"
                    className="text-sm text-blue-100/80 transition-colors hover:text-white"
                  >
                    info@naiera.go.id
                  </a>
                  <br />
                  <a
                    href="mailto:layanan@naiera.go.id"
                    className="text-sm text-blue-100/80 transition-colors hover:text-white"
                  >
                    layanan@naiera.go.id
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links / Important Links */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h4 className="mb-4 font-semibold text-white">{t("relatedLinks")}</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Kemendagri", url: "https://www.kemendagri.go.id" },
              { name: "KOMINFO", url: "https://www.kominfo.go.id" },
              { name: "BPS", url: "https://www.bps.go.id" },
              { name: "LKPP", url: "https://www.lkpp.go.id" },
              { name: "OSS", url: "https://oss.go.id" },
              { name: "PPID", url: "/informasi-publik/ppid" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm text-blue-200 transition-colors hover:text-white"
              >
                <ExternalLink size={14} className="shrink-0" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-blue-950/50">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-center text-sm text-blue-200/70 md:text-left">
              {t("copyright", { year: currentYear })}
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a
                href="/kebijakan-privasi"
                className="text-blue-200/70 transition-colors hover:text-white"
              >
                {t("legal.privacy")}
              </a>
              <span className="text-blue-400/50">|</span>
              <a
                href="/syarat-ketentuan"
                className="text-blue-200/70 transition-colors hover:text-white"
              >
                {t("legal.terms")}
              </a>
              <span className="text-blue-400/50">|</span>
              <a
                href="/disclaimer"
                className="text-blue-200/70 transition-colors hover:text-white"
              >
                {t("legal.disclaimer")}
              </a>
              <span className="text-blue-400/50">|</span>
              <a
                href="/sitemap"
                className="text-blue-200/70 transition-colors hover:text-white"
              >
                {t("legal.sitemap")}
              </a>
            </div>
          </div>

          {/* Version & Build Info */}
          <div className="mt-4 border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-blue-200/50">
              {t("brandName")} v1.0.0 | Build: 2026.01.06 | {t("version")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
