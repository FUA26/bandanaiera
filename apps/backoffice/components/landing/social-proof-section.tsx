import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HonourStarIcon, QuotesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const clients = [
  { name: "TechCorp", logo: "TC" },
  { name: "FinanceHub", logo: "FH" },
  { name: "SecureIO", logo: "SI" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudScale", logo: "CS" },
  { name: "MedSecure", logo: "MS" },
];

const testimonials = [
  {
    content:
      "Naiera has transformed our identity management. Implementation was seamless, and we've seen a 70% reduction in access-related security incidents.",
    author: "Sarah Chen",
    title: "CTO",
    company: "TechCorp",
    rating: 5,
  },
  {
    content:
      "The most comprehensive IAM solution we've evaluated. SOC 2 compliance was a breeze with their audit logging and compliance tools.",
    author: "Michael Rodriguez",
    title: "VP of Security",
    company: "FinanceHub",
    rating: 5,
  },
  {
    content:
      "Outstanding support team and enterprise-grade reliability. Our 99.99% uptime requirement is consistently met.",
    author: "Emily Watson",
    title: "Director of Infrastructure",
    company: "DataFlow",
    rating: 5,
  },
];

export function SocialProofSection() {
  return (
    <section className="border-b bg-muted/20">
      <div className="container px-6 py-24">
        <div className="flex flex-col gap-16">
          {/* Client Logos */}
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Trusted by industry leaders worldwide
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-8 sm:grid-cols-3 md:grid-cols-6">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-center rounded-lg border bg-background/50 p-6 backdrop-blur-sm transition-all hover:scale-105 hover:bg-background hover:shadow-md"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {client.logo}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{client.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="relative">
            <Card className="border-2 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon icon={QuotesIcon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <CardTitle className="text-2xl md:text-3xl">
                      &ldquo;The gold standard for enterprise IAM&rdquo;
                    </CardTitle>
                    <CardDescription className="text-base md:text-lg">
                      After evaluating 12 different identity management platforms, Naiera stood out
                      for its comprehensive feature set, exceptional reliability, and outstanding
                      enterprise support. Our compliance audit time dropped from weeks to days.
                    </CardDescription>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <HugeiconsIcon
                            key={i}
                            icon={HonourStarIcon}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold">
                          JW
                        </div>
                        <div>
                          <div className="font-semibold">James Wilson</div>
                          <div className="text-sm text-muted-foreground">
                            Chief Security Officer, CloudScale Inc.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Decorative quote mark */}
            <div className="absolute -top-4 -right-4 text-9xl text-primary/5 font-serif">
              &rdquo;
            </div>
          </div>

          {/* Additional Testimonials */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <HugeiconsIcon
                        key={i}
                        icon={HonourStarIcon}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {testimonial.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
