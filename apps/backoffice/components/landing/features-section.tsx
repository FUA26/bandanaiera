import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CloudUploadIcon,
  ConnectIcon,
  FileEditIcon,
  FingerPrintIcon,
  Group01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const features = [
  {
    icon: FingerPrintIcon,
    title: "Advanced Authentication",
    description:
      "Enterprise SSO, MFA, SAML 2.0, and OIDC support. Integrate with your existing identity providers seamlessly.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Group01Icon,
    title: "Role-Based Access Control",
    description:
      "Granular permissions management with hierarchical roles, dynamic policies, and just-in-time access provisioning.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: FileEditIcon,
    title: "Audit & Compliance",
    description:
      "Comprehensive audit logs, compliance reports, and real-time monitoring. SOC 2, GDPR, and HIPAA ready.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield01Icon,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, threat detection, anomaly monitoring, and automated security incident response.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: CloudUploadIcon,
    title: "Seamless Integration",
    description:
      "RESTful API, webhooks, and pre-built integrations with Auth0, Okta, Azure AD, and 50+ other platforms.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: ConnectIcon,
    title: "Scalable Infrastructure",
    description:
      "Built for scale with 99.99% uptime SLA, global edge deployment, and automatic load balancing.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b bg-muted/20">
      <div className="container px-6 py-24">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Powerful Features for Modern Enterprises
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Everything you need to secure your applications, manage access, and maintain
              compliance at scale.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <CardHeader>
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                    >
                      <HugeiconsIcon icon={Icon} className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mx-auto text-center">
            <p className="text-muted-foreground">
              Want to see all features?{" "}
              <a href="/features" className="font-medium text-primary hover:underline">
                Explore our complete feature set
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
