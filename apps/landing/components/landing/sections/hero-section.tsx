"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("Hero");
  const tServices = useTranslations("Services");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    // console.log("Searching for:", searchQuery);
  };

  const popularSearches = [
    tServices("items.ektp.name"),
    tServices("items.suratSekolah.name"),
    tServices("items.pajak.name"),
    tServices("items.izinUsaha.name"),
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Background Layers */}
      <div className="absolute inset-0 -z-10">
        {/* Base Color (Fallback) */}
        <div className="absolute inset-0 bg-slate-900" />

        {/* Background Image */}
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlay Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero Title */}
        <h1 className="animate-fade-in-up text-4xl leading-tight font-bold text-white drop-shadow-md md:text-5xl lg:text-6xl">
          {t("titlePart1")}
          <br />
          <span className="text-primary">{t("titlePart2")}</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg lg:text-xl">
          {t("subtitle")}
        </p>

        {/* Search Bar */}
        <div className="animate-fade-in-up animation-delay-400 mx-auto w-full max-w-3xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="focus:ring-primary/30 h-14 w-full rounded-full bg-white/95 pr-14 pl-5 text-base text-slate-800 shadow-2xl backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:ring-4 focus:outline-none md:h-16 md:pr-16 md:pl-6 md:text-lg"
              aria-label="Cari layanan pemerintahan"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary-hover absolute top-2 right-2 bottom-2 flex aspect-square items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95"
              aria-label="Cari"
            >
              <Search size={24} />
            </button>
          </form>

          {/* Quick Search Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-300">{t("popularSearch")}</span>
            {popularSearches.map((item) => (
              <button
                key={item}
                onClick={() => setSearchQuery(item)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="animate-fade-in-up animation-delay-600 mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 md:gap-8">
          <div className="text-center">
            <div className="text-primary text-2xl font-bold md:text-4xl">
              100+
            </div>
            <div className="mt-1 text-xs text-slate-300 md:text-sm">
              {t("stats.digitalServices")}
            </div>
          </div>
          <div className="border-x border-white/20 text-center">
            <div className="text-primary text-2xl font-bold md:text-4xl">
              50K+
            </div>
            <div className="mt-1 text-xs text-slate-300 md:text-sm">
              {t("stats.activeUsers")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-primary text-2xl font-bold md:text-4xl">
              24/7
            </div>
            <div className="mt-1 text-xs text-slate-300 md:text-sm">
              {t("stats.onlineServices")}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2">
          <div className="h-2 w-1 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
}
