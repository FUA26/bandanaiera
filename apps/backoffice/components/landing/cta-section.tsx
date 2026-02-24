import { Button } from "@/components/ui/button";
import { AiMailIcon, AiPhone01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="container px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Transform Your Access Management?
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Join 500+ enterprises who trust Naiera to secure their applications and streamline
                compliance. Start your free trial today—no credit card required.
              </p>
            </div>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 py-4">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                <span className="font-medium">500+ enterprises</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                <span className="font-medium">99.99% uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                <span className="font-medium">SOC 2 Type II certified</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-base px-8">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8">
                <Link href="/demo">Schedule Demo</Link>
              </Button>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-6 pt-8 border-t">
              <div className="space-y-2">
                <h3 className="font-semibold">Have questions?</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is here to help you find the right solution for your organization.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="mailto:sales@naiera.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon icon={AiMailIcon} className="h-4 w-4" />
                  sales@naiera.com
                </a>
                <a
                  href="tel:+18001234567"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon icon={AiPhone01Icon} className="h-4 w-4" />
                  1-800-123-4567
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                <span>✓ 14-day free trial</span>
                <span>✓ No credit card required</span>
                <span>✓ Setup in &lt;5 minutes</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 opacity-70">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold">
                  SOC 2
                </div>
                <span className="text-sm font-medium">Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold">
                  GDPR
                </div>
                <span className="text-sm font-medium">Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold">
                  ISO
                </div>
                <span className="text-sm font-medium">27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
