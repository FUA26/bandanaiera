"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronRight,
  Newspaper,
  Calendar,
  FileText,
  FileSearch,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { MegaMenuClient } from "@/components/landing/layout/mega-menu-client";
import type { Service, ServiceCategory } from "@/lib/services-data";
import { useSettings } from "@/components/providers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface HeaderProps {
  servicesByCategory?: Array<ServiceCategory & { services: Service[] }>;
}

export function Header({ servicesByCategory = [] }: HeaderProps) {
  const t = useTranslations("Navigation");
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { label: t("home"), href: "/" },
    { label: t("services"), href: "/layanan" },
    { label: t("news"), href: "/informasi-publik/berita-terkini" },
    { label: t("contact"), href: "/kontak" },
  ];

  const informationItems = [
    { label: "Berita Terkini", href: "/informasi-publik/berita-terkini", icon: Newspaper },
    { label: "Agenda Kegiatan", href: "/informasi-publik/agenda-kegiatan", icon: Calendar },
    { label: "APBD & Keuangan", href: "/informasi-publik/apbd", icon: FileText },
    { label: "PPID", href: "/informasi-publik/ppid", icon: FileSearch },
  ];

  return (
    <>
      <header className="border-border bg-background/90 sticky top-0 z-50 border-b shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex min-h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="bg-card ring-border relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 sm:h-10 sm:w-10">
              {settings?.siteLogoUrl ? (
                <Image
                  src={settings.siteLogoUrl}
                  alt={settings.siteName || "Malang Digital Government"}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <Image
                  src="/naiera.png"
                  alt="Malang Digital Government"
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-base font-bold leading-tight sm:text-lg md:text-xl">
                {settings?.siteName || t("brandName")}
              </span>
              <span className="text-muted-foreground hidden text-xs leading-tight sm:block">
                {settings?.siteSubtitle || t("brandSubtitle")}
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <MegaMenuClient servicesByCategory={servicesByCategory} />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover hidden items-center justify-center rounded-lg px-6 py-2 font-medium shadow-lg transition-all duration-300 sm:inline-flex"
            >
              {t("login")}
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="hover:text-primary text-muted-foreground inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden"
                  aria-label="Toggle menu"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[88vw] max-w-sm gap-0 overflow-y-auto p-0 sm:w-[24rem]"
              >
                <div className="flex min-h-full flex-col">
                  <SheetHeader className="border-border border-b px-5 py-6 text-left">
                    <SheetTitle className="text-left text-lg">
                      {t("menu")}
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Menu singkat untuk mobile
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 px-4 py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground px-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                          Menu Utama
                        </p>
                        <div className="space-y-1">
                          {mainNavItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-foreground hover:bg-accent flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3 text-sm font-medium transition-colors"
                            >
                              <span className="min-w-0 truncate">{item.label}</span>
                              <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <Accordion type="multiple" defaultValue={["layanan", "informasi"]} className="space-y-3">
                        <AccordionItem value="layanan" className="rounded-2xl border border-border/70 bg-background/80 px-4 shadow-sm">
                          <AccordionTrigger className="py-4 text-sm font-semibold no-underline hover:no-underline">
                            Layanan
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="space-y-3">
                              <Link
                                href="/layanan"
                                onClick={() => setMobileMenuOpen(false)}
                                className="bg-primary/10 text-primary flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium"
                              >
                                <span>Lihat semua layanan</span>
                                <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                              </Link>
                              <div className="space-y-2">
                                {servicesByCategory.slice(0, 2).map((category) => (
                                  <div key={category.slug} className="rounded-2xl border border-border/60 bg-background/90 p-3">
                                    <p className="text-foreground px-1 text-sm font-semibold">
                                      {category.name}
                                    </p>
                                    <div className="mt-2 space-y-1">
                                      {category.services.slice(0, 2).map((service) => (
                                        <Link
                                          key={service.slug}
                                          href={`/layanan/${service.slug}`}
                                          onClick={() => setMobileMenuOpen(false)}
                                          className="text-muted-foreground hover:text-primary hover:bg-accent flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
                                        >
                                          <span className="min-w-0 truncate">{service.name}</span>
                                          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="informasi" className="rounded-2xl border border-border/70 bg-background/80 px-4 shadow-sm">
                          <AccordionTrigger className="py-4 text-sm font-semibold no-underline hover:no-underline">
                            Informasi
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="space-y-1">
                              {informationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-foreground hover:bg-accent flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3 text-sm font-medium transition-colors"
                                  >
                                    <span className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-xl">
                                      <Icon size={14} />
                                    </span>
                                    <span className="min-w-0 truncate">{item.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>

                  <div className="border-border border-t p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="sm:hidden">
                        <LanguageSwitcher />
                      </div>
                      <Link
                        href="/login"
                        className="bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary-hover block w-full rounded-lg px-6 py-3 text-center font-medium shadow-lg transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("login")}
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
