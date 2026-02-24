import { Separator } from "@/components/ui/separator";
import { AiMailIcon, Call02Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/integrations", label: "Integrations" },
      { href: "/changelog", label: "Changelog" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/blog", label: "Blog" },
      { href: "/press", label: "Press" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/api", label: "API Reference" },
      { href: "/help", label: "Help Center" },
      { href: "/community", label: "Community" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Security" },
      { href: "/compliance", label: "Compliance" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

const socialLinks = [
  { href: "https://linkedin.com/company/naiera", label: "LinkedIn" },
  { href: "https://twitter.com/naiera", label: "Twitter" },
  { href: "https://github.com/naiera", label: "GitHub" },
];

const certifications = [
  { name: "SOC 2 Type II", description: "Certified" },
  { name: "GDPR", description: "Compliant" },
  { name: "ISO 27001", description: "Certified" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container px-6 py-16">
        <div className="flex flex-col gap-12">
          {/* Main Footer Content */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Naiera</span>
              </Link>

              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Enterprise-grade identity and access management for modern organizations. Secure,
                compliant, and scalable.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
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
                  <HugeiconsIcon icon={Call02Icon} className="h-4 w-4" />
                  1-800-123-4567
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted-foreground/10 transition-colors text-sm font-medium"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator />

          {/* Bottom Bar */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Copyright */}
            <div className="flex flex-col gap-4 md:gap-2">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Naiera, Inc. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap items-center gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-2 rounded-lg border bg-background/50 px-3 py-2"
                >
                  <HugeiconsIcon icon={Shield01Icon} className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{cert.name}</span>
                    <span className="text-[10px] text-muted-foreground">{cert.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
