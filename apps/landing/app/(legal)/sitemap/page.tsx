"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Home,
  FileText,
  Building2,
  Landmark,
  Newspaper,
  Calendar,
  HelpCircle,
  Phone,
  BookOpen,
  ChevronRight,
  Scale,
  Shield,
  AlertTriangle,
  Map,
  Users,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SiteMapItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
  children?: SiteMapItem[];
}

export default function SiteMapPage() {
  const t = useTranslations("Sitemap");

  const siteMapData: SiteMapItem[] = [
    {
      title: t("home.title"),
      href: "/",
      description: t("home.description"),
      icon: Home,
    },
    {
      title: t("services.title"),
      href: "/layanan",
      description: t("services.description"),
      icon: FileText,
      children: [
        {
          title: t("services.categories.population"),
          href: "/layanan?category=kependudukan",
        },
        {
          title: t("services.categories.health"),
          href: "/layanan?category=kesehatan",
        },
        {
          title: t("services.categories.education"),
          href: "/layanan?category=pendidikan",
        },
        {
          title: t("services.categories.business"),
          href: "/layanan?category=perizinan",
        },
      ],
    },
    {
      title: t("government.title"),
      href: "/pemerintahan",
      description: t("government.description"),
      icon: Building2,
      children: [
        {
          title: t("government.profile"),
          href: "/pemerintahan/profil",
          icon: Landmark,
        },
        {
          title: t("government.structure"),
          href: "/pemerintahan/struktur",
        },
        {
          title: t("government.agencies"),
          href: "/pemerintahan/perangkat-daerah",
        },
        {
          title: t("government.dprd"),
          href: "/pemerintahan/dprd",
        },
        {
          title: t("government.districts"),
          href: "/pemerintahan/kecamatan-desa",
          icon: Map,
        },
      ],
    },
    {
      title: t("information.title"),
      href: "/informasi-publik",
      description: t("information.description"),
      icon: Newspaper,
      children: [
        {
          title: t("information.news"),
          href: "/informasi-publik/berita-terkini",
        },
        {
          title: t("information.events"),
          href: "/informasi-publik/agenda-kegiatan",
          icon: Calendar,
        },
        {
          title: t("information.regulations"),
          href: "/informasi-publik/peraturan-daerah",
          icon: Scale,
        },
        {
          title: t("information.apbd"),
          href: "/informasi-publik/apbd",
        },
        {
          title: t("information.gallery"),
          href: "/informasi-publik/galeri-foto",
        },
        {
          title: t("information.destinations"),
          href: "/informasi-publik/destinasi-wisata",
        },
        {
          title: t("information.ppid"),
          href: "/informasi-publik/ppid",
        },
        {
          title: t("information.publications"),
          href: "/informasi-publik/publikasi",
        },
      ],
    },
    {
      title: t("support.title"),
      href: "/",
      description: t("support.description"),
      icon: HelpCircle,
      children: [
        {
          title: t("support.faq"),
          href: "/faq",
        },
        {
          title: t("support.guide"),
          href: "/panduan",
          icon: BookOpen,
        },
        {
          title: t("support.contact"),
          href: "/kontak",
          icon: Phone,
        },
        {
          title: t("support.complaint"),
          href: "/pengaduan",
        },
      ],
    },
    {
      title: t("legal.title"),
      href: "/",
      description: t("legal.description"),
      icon: Scale,
      children: [
        {
          title: t("legal.privacy"),
          href: "/kebijakan-privasi",
          icon: Shield,
        },
        {
          title: t("legal.terms"),
          href: "/syarat-ketentuan",
        },
        {
          title: t("legal.disclaimer"),
          href: "/disclaimer",
          icon: AlertTriangle,
        },
        {
          title: t("legal.sitemap"),
          href: "/sitemap",
          icon: Map,
        },
      ],
    },
  ];

  function SiteMapCard({ item, depth = 0 }: { item: SiteMapItem; depth?: number }) {
    const Icon = item.icon;
    const isMain = depth === 0;

    return (
      <div className={isMain ? "" : "ml-4 mt-4"}>
        <Link
          href={item.href}
          className={`group block rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md ${
            isMain ? "hover:-translate-y-1" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-lighter text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 group-hover:text-primary">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.description}
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {item.children && item.children.length > 0 && (
          <div className="mt-3 space-y-2">
            {item.children.map((child, idx) => (
              <Link
                key={idx}
                href={child.href}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-all hover:border-primary hover:bg-white"
              >
                {child.icon && <child.icon className="h-4 w-4 text-primary" />}
                <span className="font-medium text-slate-700">{child.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <main className="bg-muted min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-700 to-purple-800 py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Map className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-purple-100">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Site Map Content */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            {siteMapData.map((item, idx) => (
              <SiteMapCard key={idx} item={item} />
            ))}
          </div>

          {/* Quick Stats */}
          <Card className="mt-12 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("stats.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-primary-light text-sm">{t("stats.services")}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">20+</p>
                  <p className="text-primary-light text-sm">{t("stats.agencies")}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">100+</p>
                  <p className="text-primary-light text-sm">{t("stats.documents")}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-primary-light text-sm">{t("stats.support")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
