"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  UserPlus,
  Receipt,
  FileText,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const guideIcons: Record<string, React.ElementType> = {
  register: UserPlus,
  tax: Receipt,
  document: FileText,
  complaint: MessageSquare,
};

export default function GuidePage() {
  const t = useTranslations("Guide");

  const guideKeys = ["register", "tax", "document", "complaint"] as const;

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {guideKeys.map((key) => {
              const Icon = guideIcons[key] || BookOpen;
              return (
                <Card
                  key={key}
                  className="group overflow-hidden border-slate-200 transition-all hover:shadow-lg"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-slate-800">
                      {t(`items.${key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-slate-600">
                      {t(`items.${key}.desc`)}
                    </p>

                    {/* Steps Preview */}
                    <div className="mb-4 space-y-2">
                      {(t.raw(`items.${key}.steps`) as string[])
                        .slice(0, 3)
                        .map((step: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-slate-500"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">
                              {idx + 1}
                            </span>
                            {step}
                          </div>
                        ))}
                      {(t.raw(`items.${key}.steps`) as string[]).length > 3 && (
                        <p className="pl-9 text-sm text-slate-400">
                          +
                          {(t.raw(`items.${key}.steps`) as string[]).length - 3}{" "}
                          langkah lagi...
                        </p>
                      )}
                    </div>

                    <Link
                      href={`#guide-${key}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      {t("readGuide")}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
