"use client";

import { useTranslations } from "next-intl";
import { Shield, Eye, UserCheck, Cookie, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <>
      <main className="bg-muted min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-700 to-slate-800 py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200">
              {t("subtitle")}
            </p>
            <p className="mt-4 text-sm text-slate-300">
              {t("lastUpdated")}: 12 Januari 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  {t("intro.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("intro.content")}</p>
                <p>{t("intro.scope")}</p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  {t("collection.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">
                      {t("collection.personal.title")}
                    </h4>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                      <li>{t("collection.personal.name")}</li>
                      <li>{t("collection.personal.email")}</li>
                      <li>{t("collection.personal.phone")}</li>
                      <li>{t("collection.personal.address")}</li>
                      <li>{t("collection.personal.nik")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">
                      {t("collection.usage.title")}
                    </h4>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                      <li>{t("collection.usage.ip")}</li>
                      <li>{t("collection.usage.browser")}</li>
                      <li>{t("collection.usage.device")}</li>
                      <li>{t("collection.usage.cookies")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  {t("usage.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("usage.description")}</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>{t("usage.service")}</li>
                  <li>{t("usage.improvement")}</li>
                  <li>{t("usage.communication")}</li>
                  <li>{t("usage.security")}</li>
                  <li>{t("usage.legal")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-primary" />
                  {t("cookies.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("cookies.description")}</p>
                <div className="bg-muted rounded-lg p-4 text-sm">
                  <p className="font-medium text-foreground mb-2">{t("cookies.types.title")}:</p>
                  <ul className="space-y-1">
                    <li>• {t("cookies.types.essential")}</li>
                    <li>• {t("cookies.types.analytics")}</li>
                    <li>• {t("cookies.types.preference")}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>{t("sharing.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("sharing.description")}</p>
                <p className="text-sm italic">{t("sharing.note")}</p>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardHeader>
                <CardTitle>{t("rights.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t("rights.access")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t("rights.correct")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t("rights.delete")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t("rights.optout")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{t("rights.complaint")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  {t("contact.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("contact.description")}</p>
                <div className="bg-primary-lighter rounded-lg p-4">
                  <p className="font-medium text-foreground">
                    {t("contact.email")}: privacy@naiera.go.id
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
