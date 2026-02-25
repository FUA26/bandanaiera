"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, HelpCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  const t = useTranslations("Faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");

  const categories = ["general", "account", "services", "payment"] as const;
  const faqItems = ["q1", "q2", "q3", "q4", "q5"] as const;

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((key) => {
      const question = t(`items.${key}.question`).toLowerCase();
      const answer = t(`items.${key}.answer`).toLowerCase();
      return (
        question.includes(searchQuery.toLowerCase()) ||
        answer.includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, t]);

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-emerald-700 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              {t("subtitle")}
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-xl border-0 bg-white pl-12 text-slate-900 shadow-lg placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container mx-auto px-4 py-12">
          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <TabsList className="mx-auto flex w-full max-w-2xl flex-wrap justify-center gap-2 bg-transparent">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full border border-slate-200 bg-white px-6 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {t(`categories.${cat}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Accordion */}
          <div className="mx-auto max-w-3xl">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((key) => (
                  <AccordionItem
                    key={key}
                    value={key}
                    className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm"
                  >
                    <AccordionTrigger className="py-5 text-left font-semibold text-slate-800 hover:no-underline">
                      {t(`items.${key}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-slate-600">
                      {t(`items.${key}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <p className="text-slate-500">{t("notFound")}</p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mx-auto mt-12 max-w-xl rounded-2xl bg-primary-lighter p-8 text-center">
            <p className="mb-4 text-lg font-medium text-slate-800">
              {t("contactCta")}
            </p>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {t("contactLink")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
