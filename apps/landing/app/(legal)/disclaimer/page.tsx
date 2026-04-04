"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisclaimerPage() {
  const t = useTranslations("Disclaimer");

  return (
    <>
      <main className="bg-muted min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-600 to-amber-700 py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-amber-100">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            {/* General Disclaimer */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  {t("general.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("general.content")}</p>
                <p className="text-sm italic">{t("general.bestEffort")}</p>
              </CardContent>
            </Card>

            {/* Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>{t("accuracy.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("accuracy.description")}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>{t("accuracy.timeliness")}</li>
                  <li>{t("accuracy.completeness")}</li>
                  <li>{t("accuracy.errors")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* No Professional Advice */}
            <Card>
              <CardHeader>
                <CardTitle>{t("advice.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("advice.description")}</p>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <p className="font-medium text-amber-800 dark:text-amber-300 text-sm">
                    {t("advice.warning")}
                  </p>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>{t("advice.legal")}</li>
                  <li>{t("advice.medical")}</li>
                  <li>{t("advice.financial")}</li>
                  <li>{t("advice.other")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* External Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  {t("external.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("external.description")}</p>
                <p className="text-sm italic">{t("external.endorsement")}</p>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle>{t("availability.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("availability.description")}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>{t("availability.maintenance")}</li>
                  <li>{t("availability.interruption")}</li>
                  <li>{t("availability.updates")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibility */}
            <Card>
              <CardHeader>
                <CardTitle>{t("responsibility.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("responsibility.description")}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>{t("responsibility.account")}</li>
                  <li>{t("responsibility.password")}</li>
                  <li>{t("responsibility.usage")}</li>
                  <li>{t("responsibility.verification")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>{t("liability.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("liability.description")}</p>
                <p className="text-sm">{t("liability.maxExtent")}</p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardHeader>
                <CardTitle>{t("indemnification.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("indemnification.description")}</p>
              </CardContent>
            </Card>

            {/* Changes to Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle>{t("changes.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("changes.description")}</p>
                <p className="text-sm">{t("changes.notification")}</p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  {t("contact.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("contact.description")}</p>
                <div className="bg-primary-lighter rounded-lg p-4">
                  <p className="font-medium text-foreground">
                    {t("contact.email")}: legal@naiera.go.id
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
