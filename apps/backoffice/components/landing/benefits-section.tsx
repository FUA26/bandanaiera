import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUp01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  SecuredNetworkIcon,
  Time01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const metrics = [
  {
    icon: ArrowUp01Icon,
    value: "70%",
    label: "Faster Implementation",
    description: "Go from zero to production in days, not months",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: SecuredNetworkIcon,
    value: "50%",
    label: "Reduction in Security Incidents",
    description: "Proactive threat detection and automated responses",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Time01Icon,
    value: "99.99%",
    label: "Uptime SLA",
    description: "Enterprise-grade reliability with global edge deployment",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const comparisonItems = [
  {
    feature: "SSO & MFA",
    traditional: "Basic support, limited providers",
    naiera: "10+ identity providers, customizable policies",
  },
  {
    feature: "Audit Logs",
    traditional: "Limited retention, basic search",
    naiera: "Unlimited retention, advanced filters, exports",
  },
  {
    feature: "Compliance",
    traditional: "Manual reporting, time-consuming",
    naiera: "Automated reports, SOC 2/HIPAA/GDPR ready",
  },
  {
    feature: "API Access",
    traditional: "REST API, basic documentation",
    naiera: "REST + GraphQL, SDKs, extensive docs",
  },
  {
    feature: "Support",
    traditional: "Email support, 48-hour response",
    naiera: "24/7 chat, phone, dedicated success manager",
  },
  {
    feature: "Integrations",
    traditional: "15+ integrations",
    naiera: "50+ integrations, webhook support, custom apps",
  },
];

export function BenefitsSection() {
  return (
    <section className="border-b bg-muted/20">
      <div className="container px-6 py-24">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why Leading Enterprises Choose Naiera
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Measurable results that transform your security posture and operational efficiency.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div
                      className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${metric.bgColor}`}
                    >
                      <HugeiconsIcon icon={Icon} className={`h-8 w-8 ${metric.color}`} />
                    </div>
                    <CardTitle className="text-4xl font-bold">{metric.value}</CardTitle>
                    <CardDescription className="text-base font-medium">
                      {metric.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-semibold mb-2">Naiera vs Traditional Solutions</h3>
              <p className="text-muted-foreground">
                See how we compare to legacy identity management systems
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Feature</TableHead>
                        <TableHead className="w-[35%]">Traditional IAM</TableHead>
                        <TableHead className="w-[35%]">Naiera</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.feature}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.traditional}
                          </TableCell>
                          <TableCell className="text-foreground">{item.naiera}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5 text-muted-foreground/50" />
                <span className="text-muted-foreground">Traditional limitations</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                <span className="font-medium">Naiera advantages</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mx-auto text-center max-w-2xl">
            <p className="text-lg text-muted-foreground">
              Ready to see these results in your organization?{" "}
              <a href="/demo" className="font-medium text-primary hover:underline">
                Schedule a personalized demo
              </a>{" "}
              to learn how Naiera can transform your identity management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
