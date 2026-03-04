"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  FileX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { NewsArticle } from "@/lib/news-data";

// Renders a Next.js Image that falls back to null on error (let parent show placeholder)
interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function ImageWithFallback({ src, alt, fill, className, sizes, priority }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}

interface BeritaTerkiniClientProps {
  allNews: NewsArticle[];
  categories: string[];
}

const ITEMS_PER_PAGE = 6;

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function BeritaTerkiniClient({
  allNews,
  categories,
}: BeritaTerkiniClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // All categories including "Semua"
  const allCategories = ["Semua", ...categories];

  // Featured: prioritize articles with featured=true; fill remaining with latest
  const featuredNews = useMemo(() => {
    const featured = allNews.filter((a) => a.featured)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // If we have 2+ featured, use top 2
    if (featured.length >= 2) {
      return featured.slice(0, 2);
    }

    // If we have 1 featured, add 1 latest non-featured
    if (featured.length === 1) {
      const latest = [...allNews]
        .filter((a) => !a.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 1);
      return [...featured, ...latest];
    }

    // No featured, use 2 latest
    return [...allNews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);
  }, [allNews]);

  // Filtered news based on search and category
  const filteredNews = useMemo(() => {
    return allNews.filter((article) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allNews, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Slice for current page
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  // Popular articles sidebar
  const popularArticles = useMemo(() => {
    return [...allNews]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [allNews]);

  // Build page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <main className="bg-muted">
      {/* ── Hero ── */}
      <section className="from-primary to-primary-hover bg-gradient-to-br py-12 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <nav className="text-primary-lighter mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight size={14} />
            <Link href="/informasi-publik" className="hover:text-white">Informasi Publik</Link>
            <ChevronRight size={14} />
            <span className="text-white">Berita Terkini</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Newspaper size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Berita Terkini</h1>
              <p className="text-primary-lighter">
                Informasi terbaru seputar pemerintahan dan pembangunan daerah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured News ── */}
      {featuredNews.length > 0 && (
        <section className="border-border bg-card border-b py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              <h2 className="text-lg font-bold text-foreground">Berita Utama</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/informasi-publik/berita-terkini/${article.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900"
                >
                  <div className="aspect-[16/9] w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {!article.image && (
                      <div className="from-primary to-primary-hover absolute inset-0 flex items-center justify-center bg-gradient-to-br">
                        <Newspaper className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <span className="bg-info-light text-info mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                      {article.category}
                    </span>
                    <h3 className="group-hover:text-primary-lighter mb-2 text-xl font-bold text-white transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Search & Filter ── */}
      <section className="border-border bg-card border-b py-4">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── News Grid + Sidebar ── */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Main Content */}
            <div className="lg:col-span-2">
              <p className="text-muted-foreground mb-4 text-sm">
                {filteredNews.length === 0
                  ? "Tidak ada berita yang ditemukan"
                  : `Menampilkan ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredNews.length)} dari ${filteredNews.length} berita`}
              </p>

              {/* Article List */}
              {paginatedNews.length > 0 ? (
                <div className="space-y-4">
                  {paginatedNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/informasi-publik/berita-terkini/${article.slug}`}
                      className="group hover:border-primary/30 border-border bg-card flex gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-lighter to-primary-light">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                        {!article.image && (
                          <div className="flex h-full w-full items-center justify-center">
                            <Newspaper className="text-primary/60 h-9 w-9" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-muted-foreground text-xs flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(article.date)}
                          </span>
                        </div>
                        <h3 className="group-hover:text-primary mb-1.5 line-clamp-2 font-bold text-foreground transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
                          <Clock size={11} />
                          {article.readTime}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border-border bg-card rounded-2xl border py-16 text-center">
                  <FileX size={56} className="text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-foreground mb-2 font-semibold">Berita Tidak Ditemukan</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
                  </p>
                  <button
                    onClick={() => { handleSearch(""); handleCategory("Semua"); }}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg px-5 py-2 text-sm font-medium transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Halaman sebelumnya"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* Page numbers */}
                  {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground text-sm select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        aria-label={`Halaman ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Halaman selanjutnya"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              {/* Popular Articles */}
              <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
                <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
                  <TrendingUp className="text-primary" size={18} />
                  Berita Terbaru
                </h3>
                <div className="divide-border divide-y">
                  {popularArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/informasi-publik/berita-terkini/${article.slug}`}
                      className="group flex gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="bg-primary-lighter text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="group-hover:text-primary line-clamp-2 text-sm font-medium text-foreground transition-colors">
                          {article.title}
                        </h4>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(article.date)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="from-primary to-primary-hover rounded-2xl bg-gradient-to-br p-6 text-white">
                <h3 className="mb-2 font-bold">Berlangganan Newsletter</h3>
                <p className="text-primary-lighter mb-4 text-sm">
                  Dapatkan berita terbaru langsung ke email Anda
                </p>
                <Input
                  type="email"
                  placeholder="Alamat email Anda"
                  className="placeholder:text-white/60 mb-3 border-white/20 bg-white/15 text-white focus-visible:ring-white/40"
                />
                <button className="text-primary hover:bg-primary-lighter w-full rounded-lg bg-white py-2 text-sm font-semibold transition-colors">
                  Berlangganan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

