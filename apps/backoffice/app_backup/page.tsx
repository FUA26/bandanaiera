/**
 * Naiera Next - Landing Page
 *
 * Production-ready landing page showcasing the boilerplate features
 * with distinctive editorial aesthetic and micro-animations.
 */

import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  FileCode,
  Lock,
  Rocket,
  Shield,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const IconComponent = ({ icon: Icon, className }: { icon: LucideIcon; className: string }) => (
  <Icon className={className} />
);

export const metadata = {
  title: "Naiera Next - Enterprise Starter Kit",
  description: "Production-ready Next.js 16 boilerplate with authentication, RBAC, and testing.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Grain overlay for texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded" />
            <span className="text-xl font-bold tracking-tight">naiera</span>
            <span className="text-neutral-500 text-sm">next</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-orange-500 transition-colors">
              Features
            </a>
            <a href="#stack" className="hover:text-orange-500 transition-colors">
              Stack
            </a>
            <Link
              href="/docs"
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-all hover:border-orange-500/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50/50 to-white">
        {/* Animated background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.08), transparent)",
            animation: "float 20s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-full mb-8 shadow-sm"
            style={{ animation: "slideDown 0.8s ease-out" }}
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm">Enterprise Ready • Production Grade • TypeScript</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6"
            style={{
              fontFamily: "var(--font-display)",
              animation: "slideUp 1s ease-out 0.2s both",
            }}
          >
            Ship faster with
            <span className="block text-orange-500"> confidence</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ animation: "slideUp 1s ease-out 0.4s both" }}
          >
            Production-ready Next.js 16 boilerplate with authentication, RBAC, testing, and
            deployment. Start building your enterprise tool in minutes.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: "slideUp 1s ease-out 0.6s both" }}
          >
            <Link
              href="/docs"
              className="group px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2 hover:gap-3 hover:scale-105 shadow-sm"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/your-repo/naiera-next"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-400 rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <Code2 className="w-5 h-5" />
              View Source
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            style={{ animation: "slideUp 1s ease-out 0.8s both" }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">16</div>
              <div className="text-sm text-neutral-600">Next.js Version</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">10+</div>
              <div className="text-sm text-neutral-600">Features Included</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">100%</div>
              <div className="text-sm text-neutral-600">TypeScript</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500"
          style={{ animation: "fadeIn 1s ease-out 1s both" }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-neutral-500 to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything you need to ship
              <span className="text-orange-500"> fast</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Enterprise-grade features out of the box. No setup required.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 bg-white border border-neutral-200 rounded-2xl hover:border-orange-500/30 transition-all duration-500 shadow-sm hover:shadow-md"
                style={{
                  animation: `slideUp 0.8s ease-out ${0.1 * index}s both`,
                }}
              >
                <div className="mb-6 p-3 bg-neutral-100 rounded-xl w-fit group-hover:bg-orange-50 transition-colors">
                  <IconComponent icon={feature.icon} className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section id="stack" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built with modern
              <span className="text-orange-500"> technologies</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Latest versions, best practices, future-ready architecture.
            </p>
          </div>

          {/* Tech stack grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stack.map((item, index) => (
              <div
                key={item.name}
                className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-orange-500/30 transition-all group"
                style={{
                  animation: `slideUp 0.6s ease-out ${0.05 * index}s both`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent icon={item.icon} className="w-6 h-6 text-orange-500" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <p className="text-sm text-neutral-600">{item.version}</p>
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="mt-16 p-6 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-mono text-neutral-400">package.json</span>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded">
                  dependencies
                </span>
              </div>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="text-neutral-300">
                {`{
  "name": "naiera-next",
  "version": "0.1.0",
  "dependencies": {
    "next": "16.1.6",
    "react": "^19.2.3",
    "@tanstack/react-query": "^5.90.21"
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-orange-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to build something
            <span className="text-orange-500"> amazing?</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-12">
            Get started in seconds with our production-ready boilerplate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2 hover:scale-105 shadow-sm"
            >
              <Rocket className="w-5 h-5" />
              Start Building
            </Link>
            <a
              href="https://github.com/your-repo/naiera-next"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-400 rounded-lg transition-all shadow-sm"
            >
              Star on GitHub ⭐
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded" />
            <span className="font-semibold">naiera next</span>
          </div>
          <p className="text-sm text-neutral-600">
            MIT License • Built with Next.js 16 • {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0,
            transform: translateY(-20px);
          }
          to {
            opacity: 1,
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0,
            transform: translateY(20px);
          }
          to {
            opacity: 1,
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        * {
          animation-delay: calc(var(--stagger) * 0.1s);
        }
      `}</style>
    </div>
  );
}

// Feature data
const features = [
  {
    icon: Shield,
    title: "Authentication System",
    description:
      "Complete user authentication with NextAuth.js. Login, logout, session management, and protected routes ready to use.",
    highlights: [
      "NextAuth.js integration",
      "Protected API routes",
      "Session management",
      "OAuth providers ready",
    ],
  },
  {
    icon: Lock,
    title: "RBAC System",
    description:
      "Role-Based Access Control with granular permissions. Manage users, roles, and permissions with ease.",
    highlights: [
      "User & Role management",
      "Permission-based APIs",
      "Protected routes",
      "In-memory caching",
    ],
  },
  {
    icon: Terminal,
    title: "E2E Testing",
    description:
      "Comprehensive E2E tests with Playwright. 54 test cases covering all critical user flows.",
    highlights: [
      "54 test cases included",
      "Playwright configured",
      "Authentication tests",
      "CRUD operation tests",
    ],
  },
  {
    icon: FileCode,
    title: "Form Handling",
    description:
      "React Hook Form + Zod validation. Type-safe forms with automatic validation and error handling.",
    highlights: ["React Hook Form", "Zod schemas", "Type-safe validation", "Error handling"],
  },
  {
    icon: Zap,
    title: "State Management",
    description:
      "Jotai for client state and TanStack Query for server state. Efficient data fetching and caching.",
    highlights: ["Jotai atoms", "React Query", "Optimistic updates", "Cache management"],
  },
  {
    icon: Cpu,
    title: "Docker Ready",
    description:
      "Production Docker configuration included. Deploy to any cloud platform with ease.",
    highlights: [
      "Multi-stage Dockerfile",
      "Optimized build",
      "CI/CD workflows",
      "Environment config",
    ],
  },
];

// Tech stack data
const stack = [
  { name: "Next.js", version: "16.1.6", icon: Code2 },
  { name: "React", version: "19.2.3", icon: Cpu },
  { name: "TypeScript", version: "5", icon: Terminal },
  { name: "Tailwind", version: "4.0", icon: Zap },
  { name: "shadcn/ui", version: "Latest", icon: Shield },
  { name: "Playwright", version: "1.58", icon: Check },
  { name: "Prisma", version: "6.19", icon: Lock },
  { name: "NextAuth", version: "Latest", icon: FileCode },
];
