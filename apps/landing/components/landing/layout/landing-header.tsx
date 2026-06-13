"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Newspaper, Calendar, FileText, Scale, Map, Image as ImageIcon, FileSearch, BookOpen } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { MegaMenuClient } from "@/components/landing/layout/mega-menu-client";
import type { Service, ServiceCategory } from "@/lib/services-data";
import { useSettings } from "@/components/providers";

interface HeaderProps {
  servicesByCategory?: Array<ServiceCategory & { services: Service[] }>;
}

export function Header({ servicesByCategory = [] }: HeaderProps) {
  const t = useTranslations("Navigation");
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems = [
    { label: t("home"), href: "/", active: true },
    { label: t("services"), href: "/layanan", active: false },
    { label: t("about"), href: "/pemerintahan/profil", active: false },
    { label: t("news"), href: "/informasi-publik/berita-terkini", active: false },
    { label: "Perangkat Daerah", href: "/pemerintahan/perangkat-daerah", active: false },
    { label: t("contact"), href: "/kontak", active: false },
  ];

  const informationItems = [
    { label: "Berita Terkini", href: "/informasi-publik/berita-terkini", icon: Newspaper, desc: "Berita dan informasi terbaru" },
    { label: "Agenda Kegiatan", href: "/informasi-publik/agenda-kegiatan", icon: Calendar, desc: "Jadwal kegiatan dan acara resmi" },
    { label: "APBD & Keuangan", href: "/informasi-publik/apbd", icon: FileText, desc: "Transparansi anggaran daerah" },
    { label: "Peraturan Daerah", href: "/informasi-publik/peraturan-daerah", icon: Scale, desc: "Dokumen regulasi dan peraturan" },
    { label: "Destinasi Wisata", href: "/informasi-publik/destinasi-wisata", icon: Map, desc: "Panduan wisata dan event budaya" },
    { label: "Galeri Foto", href: "/informasi-publik/galeri-foto", icon: ImageIcon, desc: "Dokumentasi kegiatan daerah" },
    { label: "PPID", href: "/informasi-publik/ppid", icon: FileSearch, desc: "Layanan keterbukaan informasi" },
    { label: "Publikasi", href: "/informasi-publik/publikasi", icon: BookOpen, desc: "Dokumen dan publikasi resmi" },
  ];

  return (
    <>
      <header className="border-border bg-background/90 sticky top-0 z-50 h-20 border-b shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-card ring-border relative flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ring-1">
              {settings?.siteLogoUrl ? (
                <Image
                  src={settings.siteLogoUrl}
                  alt={settings.siteName || "Naiera"}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <Image
                  src="/naiera.png"
                  alt="Naiera"
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-xl font-bold">
                {settings?.siteName || t("brandName")}
              </span>
              <span className="text-muted-foreground hidden text-xs sm:block">
                {settings?.siteSubtitle || t("brandSubtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <MegaMenuClient servicesByCategory={servicesByCategory} />
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover hidden items-center justify-center rounded-lg px-6 py-2 font-medium shadow-lg transition-all duration-300 sm:inline-flex"
            >
              {t("login")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-primary text-muted-foreground p-2 transition-colors md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="bg-background/50 absolute inset-0 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="bg-card absolute top-0 right-0 h-full w-[92vw] max-w-sm shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Drawer Header */}
              <div className="border-border flex items-center justify-between border-b p-6">
                <div>
                  <span className="text-foreground block text-lg font-bold">
                    {t("menu")}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs">
                    Navigasi cepat layanan dan informasi
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary text-muted-foreground p-2 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground px-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Menu Utama
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80 shadow-sm">
                      {primaryNavItems.map((item, index) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-4 font-medium transition-colors ${item.active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-accent hover:text-primary"
                            } ${index > 0 ? "border-t border-border/60" : ""} ${index === primaryNavItems.length - 1 ? "rounded-b-2xl" : ""}`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-muted-foreground px-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Informasi Publik
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {informationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="border-border/70 bg-background/80 hover:border-primary/30 hover:bg-accent flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-all"
                          >
                            <span className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                              <Icon size={16} />
                            </span>
                            <span className="min-w-0">
                              <span className="text-foreground block text-sm font-semibold">
                                {item.label}
                              </span>
                              <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                                {item.desc}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="border-border border-t p-6">
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover block w-full rounded-lg px-6 py-3 text-center font-medium shadow-lg transition-all"
                >
                  {t("login")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
