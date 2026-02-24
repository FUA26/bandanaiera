"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

const pricingTiers = {
  monthly: [
    {
      name: "Starter",
      price: 49,
      description: "Perfect for small teams getting started",
      popular: false,
      features: [
        "Up to 1,000 users",
        "Basic SSO & MFA",
        "Standard audit logs (30-day retention)",
        "Email support",
        "5 integrations",
        "Community access",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: 199,
      description: "For growing companies with advanced needs",
      popular: true,
      features: [
        "Up to 10,000 users",
        "Advanced SSO, MFA, SAML 2.0",
        "Unlimited audit logs & exports",
        "Priority email & chat support",
        "25 integrations",
        "Custom roles & permissions",
        "API access (100K requests/mo)",
        "Compliance reports (SOC 2, GDPR)",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: null,
      description: "For large organizations with custom requirements",
      popular: false,
      features: [
        "Unlimited users",
        "Everything in Professional, plus:",
        "Unlimited integrations",
        "Unlimited API access",
        "Dedicated success manager",
        "24/7 phone support",
        "Custom SLA (up to 99.999%)",
        "On-premise deployment option",
        "Advanced security features",
        "Custom contracts & billing",
      ],
      cta: "Contact Sales",
    },
  ],
  annual: [
    {
      name: "Starter",
      price: 39,
      description: "Perfect for small teams getting started",
      popular: false,
      features: [
        "Up to 1,000 users",
        "Basic SSO & MFA",
        "Standard audit logs (30-day retention)",
        "Email support",
        "5 integrations",
        "Community access",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      price: 159,
      description: "For growing companies with advanced needs",
      popular: true,
      features: [
        "Up to 10,000 users",
        "Advanced SSO, MFA, SAML 2.0",
        "Unlimited audit logs & exports",
        "Priority email & chat support",
        "25 integrations",
        "Custom roles & permissions",
        "API access (100K requests/mo)",
        "Compliance reports (SOC 2, GDPR)",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: null,
      description: "For large organizations with custom requirements",
      popular: false,
      features: [
        "Unlimited users",
        "Everything in Professional, plus:",
        "Unlimited integrations",
        "Unlimited API access",
        "Dedicated success manager",
        "24/7 phone support",
        "Custom SLA (up to 99.999%)",
        "On-premise deployment option",
        "Advanced security features",
        "Custom contracts & billing",
      ],
      cta: "Contact Sales",
    },
  ],
};

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const tiers = annual ? pricingTiers.annual : pricingTiers.monthly;

  return (
    <section className="border-b bg-muted/20">
      <div className="container px-6 py-24">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Choose the plan that fits your needs. All plans include a 14-day free trial with no
              credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center gap-4">
              <span className={`text-sm ${!annual ? "font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch
                checked={annual}
                onCheckedChange={setAnnual}
                aria-label="Toggle annual billing"
              />
              <span className={`text-sm ${annual ? "font-medium" : "text-muted-foreground"}`}>
                Annual
              </span>
              <Badge variant="secondary" className="ml-2">
                Save 20%
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative flex flex-col ${
                  tier.popular ? "border-2 border-primary shadow-xl scale-105" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="flex-1">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-base">{tier.description}</CardDescription>

                  <div className="mt-4 flex items-baseline gap-2">
                    {tier.price !== null ? (
                      <>
                        <span className="text-4xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">Custom</span>
                    )}
                  </div>

                  {tier.price !== null && annual && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed annually (${tier.price * 12}/year)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="h-5 w-5 shrink-0 text-primary mt-0.5"
                        />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                  >
                    <a href={tier.name === "Enterprise" ? "/contact-sales" : "/signup"}>
                      {tier.cta}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mx-auto text-center max-w-2xl space-y-4">
            <p className="text-sm text-muted-foreground">
              All plans include core security features, SSL encryption, and regular security
              updates. Need a custom solution?{" "}
              <a href="/contact-sales" className="font-medium text-primary hover:underline">
                Contact our sales team
              </a>
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <span>✓ 14-day free trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 support (Pro+)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
