"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t("info.address"),
      value: t("info.addressContent"),
    },
    {
      icon: Phone,
      label: t("info.phone"),
      value: t("info.phoneContent"),
    },
    {
      icon: Mail,
      label: t("info.email"),
      value: t("info.emailContent"),
    },
    {
      icon: Clock,
      label: t("info.hours"),
      value: t("info.hoursContent"),
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-700 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Phone className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      {item.label}
                    </p>
                    <p className="font-medium whitespace-pre-line text-slate-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-200">
                <div className="flex h-full items-center justify-center text-slate-400">
                  <MapPin className="mr-2 h-6 w-6" />
                  Google Maps Embed
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
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
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {t("form.name")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("form.namePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {t("form.email")}
                    </label>
                    <Input
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {t("form.subject")}
                    </label>
                    <select
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      required
                    >
                      <option value="">{t("form.subjectPlaceholder")}</option>
                      <option value="general">
                        {t("form.subjects.general")}
                      </option>
                      <option value="support">
                        {t("form.subjects.support")}
                      </option>
                      <option value="feedback">
                        {t("form.subjects.feedback")}
                      </option>
                      <option value="partnership">
                        {t("form.subjects.partnership")}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {t("form.message")}
                    </label>
                    <Textarea
                      placeholder={t("form.messagePlaceholder")}
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {t("form.submit")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
