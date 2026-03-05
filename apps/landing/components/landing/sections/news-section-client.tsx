"use client";
import { useState, useEffect } from "react";

import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { NewsArticle } from "@/lib/news-data";
import Link from "next/link";

interface NewsSectionClientProps {
  newsArticles: NewsArticle[];
}

export function NewsSectionClient({
  newsArticles,
}: NewsSectionClientProps) {
  const t = useTranslations("News");
  const locale = useLocale();
  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      // Parse YYYY-MM-DD from ISO string to be timezone-independent
      const parts = dateStr.substring(0, 10).split('-');
      if (parts.length !== 3) return dateStr;

      const year = parseInt(parts[0] || "0", 10);
      const month = parseInt(parts[1] || "0", 10);
      const day = parseInt(parts[2] || "0", 10);

      const date = new Date(year, month - 1, day);

      return new Intl.DateTimeFormat(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      console.error("Format date error:", e);
      return dateStr;
    }
  };

  return (
    <section className="bg-background py-16 md:py-20" id="berita">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <span className="bg-info-light text-info mb-4 inline-block rounded-full px-4 py-2 text-sm font-semibold">
              {t("label")}
            </span>
            <h2 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
              {t("description")}
            </p>
          </div>
          <Link
            href="/informasi-publik/berita-terkini"
            className="group text-primary hover:text-primary-hover hidden items-center gap-2 font-semibold transition-colors md:inline-flex"
          >
            {t("viewAll")}
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Featured News */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Main Featured */}
          {newsArticles[0] && (
            <NewsCard article={newsArticles[0]} featured tRead={t("read")} formatDate={formatDate} />
          )}

          {/* Secondary News */}
          <div className="space-y-6">
            {newsArticles.slice(1, 4).map((article) => (
              <NewsCardCompact key={article.id} article={article} formatDate={formatDate} />
            ))}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="text-center md:hidden">
          <Link
            href="/informasi-publik/berita-terkini"
            className="group text-primary hover:text-primary-hover inline-flex items-center gap-2 font-semibold transition-colors"
          >
            {t("viewAllMobile")}
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
  tRead?: string;
  formatDate: (date: string) => string;
}

function NewsCard({ article, tRead, formatDate }: NewsCardProps) {
  return (
    <Link
      href={`/informasi-publik/berita-terkini/${article.slug}`}
      className="group border-border bg-card block overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="from-primary-light relative h-64 overflow-hidden bg-gradient-to-br to-blue-100">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="from-primary absolute inset-0 bg-gradient-to-br to-blue-500 opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/80">
                <Calendar size={48} className="mx-auto mb-2" />
                <p className="text-sm">Gambar Berita</p>
              </div>
            </div>
          </>
        )}
        <div className="absolute top-4 left-4">
          <span className="text-primary rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="group-hover:text-primary text-foreground mb-3 line-clamp-2 text-xl font-bold transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
          {article.excerpt}
        </p>

        <div className="border-border text-muted-foreground flex items-center justify-between border-t pt-4 text-xs">
          <div className="flex items-center gap-4">
            <span suppressHydrationWarning className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
          </div>
          <span className="text-primary font-semibold opacity-0 transition-opacity group-hover:opacity-100">
            {tRead} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsCardCompact({ article, formatDate }: { article: NewsArticle, formatDate: (date: string) => string }) {
  return (
    <Link
      href={`/informasi-publik/berita-terkini/${article.slug}`}
      className="group hover:border-primary/30 border-border bg-card flex gap-4 rounded-xl border p-4 transition-all duration-300 hover:shadow-lg"
    >
      <div className="from-primary-light relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br to-blue-100">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <>
            <div className="from-primary absolute inset-0 bg-gradient-to-br to-blue-500 opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar size={24} className="text-white/60" />
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="bg-info-light text-info mb-2 inline-block rounded px-2 py-1 text-xs font-semibold">
          {article.category}
        </span>
        <h4 className="group-hover:text-primary text-foreground mb-2 line-clamp-2 font-bold transition-colors">
          {article.title}
        </h4>
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span suppressHydrationWarning>{formatDate(article.date)}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
