"use client";

import { useTranslations } from "next-intl";
import { FileText, Scale, AlertCircle, Ban, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <>
      <main className="bg-muted min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-700 to-blue-800 py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              {t("subtitle")}
            </p>
            <p className="mt-4 text-sm text-blue-200">
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
                <CardTitle>{t("intro.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("intro.content")}</p>
                <p className="text-sm italic">{t("intro.agreement")}</p>
              </CardContent>
            </Card>

            {/* User Account */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t("account.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">{t("account.registration.title")}</h4>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                      <li>{t("account.registration truthful")}</li>
                      <li>{t("account.registration accurate")}</li>
                      <li>{t("account.registration current")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">{t("account.security.title")}</h4>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                      <li>{t("account.security.password")}</li>
                      <li>{t("account.security.confidentiality")}</li>
                      <li>{t("account.security.notify")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">{t("account.responsibility.title")}</h4>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5">
                      <li>{t("account.responsibility.activities")}</li>
                      <li>{t("account.responsibility.devices")}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  {t("acceptableUse.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-3 font-semibold text-foreground">{t("acceptableUse.permitted.title")}</h4>
                  <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                    <li>{t("acceptableUse.permitted.personal")}</li>
                    <li>{t("acceptableUse.permitted.commercial")}</li>
                    <li>{t("acceptableUse.permitted.compliance")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-foreground">{t("acceptableUse.prohibited.title")}</h4>
                  <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                    <li>{t("acceptableUse.prohibited.illegal")}</li>
                    <li>{t("acceptableUse.prohibited.harmful")}</li>
                    <li>{t("acceptableUse.prohibited.infringement")}</li>
                    <li>{t("acceptableUse.prohibited.interference")}</li>
                    <li>{t("acceptableUse.prohibited.malware")}</li>
                    <li>{t("acceptableUse.prohibited.spam")}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  {t("intellectual.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("intellectual.description")}</p>
                <p className="text-sm">{t("intellectual.userContent")}</p>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ban className="h-5 w-5 text-primary" />
                  {t("prohibited.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span className="text-sm">{t("prohibited.fake")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span className="text-sm">{t("prohibited.impersonation")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span className="text-sm">{t("prohibited.data")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span className="text-sm">{t("prohibited.breach")}</span>
                  </li>
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
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>{t("liability.interruption")}</li>
                  <li>{t("liability.errors")}</li>
                  <li>{t("liability.thirdParty")}</li>
                  <li>{t("liability.unavailability")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>{t("termination.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("termination.description")}</p>
                <p className="text-sm">{t("termination.effect")}</p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>{t("governing.title")}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{t("governing.description")}</p>
                <p className="text-sm">{t("governing.jurisdiction")}</p>
              </CardContent>
            </Card>

            {/* Changes */}
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
                <CardTitle>{t("contact.title")}</CardTitle>
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
