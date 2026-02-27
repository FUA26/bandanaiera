"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { MegaMenuClient } from "@/components/landing/layout/mega-menu-client";
import type { ServiceCategory } from "@/lib/services-data";
import { useSettings } from "@/components/providers";

interface HeaderProps {
  servicesByCategory?: Array<ServiceCategory & { services: any[] }>;
}

export function Header({ servicesByCategory = [] }: HeaderProps) {
  const t = useTranslations("Navigation");
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile menu items (simplified version of mega menu)
  const navItems = [
    { label: t("home"), href: "/", active: true },
    { label: t("services"), href: "/layanan", active: false },
    { label: t("about"), href: "/pemerintahan/profil", active: false },
    {
      label: t("news"),
      href: "/informasi-publik/berita-terkini",
      active: false,
    },
    { label: t("contact"), href: "/kontak", active: false },
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
          <div className="bg-card absolute top-0 right-0 h-full w-80 max-w-[85vw] shadow-2xl">
            <div className="flex h-full flex-col">
              {/* Drawer Header */}
              <div className="border-border flex items-center justify-between border-b p-6">
                <span className="text-foreground text-lg font-bold">
                  {t("menu")}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary text-muted-foreground p-2 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`border-border block border-b px-6 py-4 font-medium transition-colors ${
                      item.active
                        ? "bg-primary-lighter text-primary"
                        : "hover:text-primary text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
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
