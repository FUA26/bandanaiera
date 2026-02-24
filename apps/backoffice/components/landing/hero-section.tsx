import { Button } from "@/components/ui/button";
import {
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/20 to-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-muted/20 to-background" />
      </div>

      <div className="container px-6 py-24 md:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col items-start gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-4 w-4 text-primary" />
              <span className="font-medium">SOC 2 Type II Certified</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Enterprise-Grade Identity & Access Management
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground md:text-xl lg:text-2xl max-w-2xl">
              Secure your applications with advanced authentication, role-based access control, and
              comprehensive audit logging. Trusted by security teams worldwide.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-base">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/demo">Schedule Demo</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col gap-6 pt-4">
              {/* Key Stats */}
              <div className="flex flex-wrap gap-8 sm:gap-12">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">99.99%</span>
                    <span className="text-sm text-muted-foreground">Uptime SLA</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">SOC 2</span>
                    <span className="text-sm text-muted-foreground">Compliant</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">500+</span>
                    <span className="text-sm text-muted-foreground">Enterprises</span>
                  </div>
                </div>
              </div>

              {/* Trusted By */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Trusted by security teams at</p>
                <div className="flex flex-wrap items-center gap-8 opacity-60 grayscale">
                  {/* Placeholder logos - in production, replace with actual company logos */}
                  <div className="text-xl font-bold tracking-tight">TechCorp</div>
                  <div className="text-xl font-bold tracking-tight">FinanceHub</div>
                  <div className="text-xl font-bold tracking-tight">SecureIO</div>
                  <div className="text-xl font-bold tracking-tight">DataFlow</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative flex items-center justify-center">
            {/* Placeholder for hero image/illustration */}
            <div className="relative w-full max-w-lg aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-2xl">
              {/* Dashboard preview mockup */}
              <div className="h-full w-full rounded-xl bg-background/90 backdrop-blur border shadow-lg p-6 flex flex-col gap-4">
                {/* Mockup header */}
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <HugeiconsIcon icon={Shield01Icon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-muted rounded mb-2" />
                    <div className="h-2 w-16 bg-muted/50 rounded" />
                  </div>
                </div>

                {/* Mockup content */}
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-3/4 bg-muted/70 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-16 bg-muted/30 rounded-lg" />
                        <div className="h-2 w-full bg-muted/50 rounded" />
                        <div className="h-2 w-2/3 bg-muted/30 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-5/6 bg-muted/70 rounded" />
                    <div className="h-2 w-4/6 bg-muted/50 rounded" />
                  </div>
                </div>

                {/* Mockup stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="space-y-1">
                    <div className="h-6 text-2xl font-bold text-primary">98.5%</div>
                    <div className="h-2 w-20 bg-muted/50 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 text-2xl font-bold text-primary">24/7</div>
                    <div className="h-2 w-16 bg-muted/50 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
