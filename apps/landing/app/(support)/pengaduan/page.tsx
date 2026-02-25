"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MessageSquareWarning,
  Send,
  Upload,
  CheckCircle,
  FileCheck,
  Search,
  BadgeCheck,
  PartyPopper,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ComplaintPage() {
  const t = useTranslations("Complaint");
  const [submitted, setSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const processSteps = [
    { key: "submit", icon: Send },
    { key: "verify", icon: Search },
    { key: "action", icon: FileCheck },
    { key: "done", icon: PartyPopper },
  ];

  const categories = [
    "infrastructure",
    "admin",
    "social",
    "health",
    "education",
    "environment",
    "other",
  ] as const;

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <MessageSquareWarning className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl rounded-xl bg-orange-50 p-6 text-center">
            <p className="text-slate-700">{t("intro")}</p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="container mx-auto px-4 pb-8">
          <h2 className="mb-6 text-center text-xl font-bold text-slate-800">
            {t("process.title")}
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={step.key}
                className="relative flex flex-col items-center rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <p className="text-center text-sm font-medium text-slate-800">
                  {t(`process.steps.${step.key}.title`)}
                </p>
                <p className="mt-1 text-center text-xs text-slate-500">
                  {t(`process.steps.${step.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Complaint Form */}
        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              {t("form.title")}
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="mb-4 h-16 w-16 text-primary" />
                <p className="text-lg font-medium text-slate-800">
                  {t("form.success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("form.category")}
                  </label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    required
                  >
                    <option value="">{t("form.categoryPlaceholder")}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`form.categories.${cat}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("form.location")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("form.locationPlaceholder")}
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("form.date")}
                  </label>
                  <Input type="date" required />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("form.description")}
                  </label>
                  <Textarea
                    placeholder={t("form.descriptionPlaceholder")}
                    rows={5}
                    required
                  />
                </div>

                {/* Evidence */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("form.evidence")}
                  </label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <div>
                      <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                      <p className="text-sm text-slate-500">
                        {t("form.evidenceHint")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <label
                      htmlFor="anonymous"
                      className="font-medium text-slate-700"
                    >
                      {t("form.anonymous")}
                    </label>
                    <p className="text-sm text-slate-500">
                      {t("form.anonymousHint")}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {t("form.submit")}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
