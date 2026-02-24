import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const techStack = [
  {
    name: "Next.js 16",
    description: "Latest React framework with App Router",
    icon: CodeIcon,
    color: "text-black dark:text-white",
  },
  {
    name: "React 19",
    description: "Most recent React with concurrent features",
    icon: CodeIcon,
    color: "text-blue-500",
  },
  {
    name: "TypeScript",
    description: "Type-safe development at scale",
    icon: CodeIcon,
    color: "text-blue-600",
  },
];

const integrations = [
  { name: "Auth0", category: "Authentication" },
  { name: "Okta", category: "Authentication" },
  { name: "Azure AD", category: "Identity" },
  { name: "Google Workspace", category: "Identity" },
  { name: "Slack", category: "Notifications" },
  { name: "PagerDuty", category: "Monitoring" },
];

export function TechSection() {
  return (
    <section className="border-b bg-muted/20">
      <div className="container px-6 py-24">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Built on Modern, Proven Technology
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              We leverage the latest frameworks and integrate seamlessly with your existing stack.
            </p>
          </div>

          {/* Tech Stack + Code Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Tech Stack Cards */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold">Core Technology</h3>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {techStack.map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <HugeiconsIcon icon={Icon} className={`h-6 w-6 ${tech.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{tech.name}</CardTitle>
                          <CardDescription>{tech.description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Code Example */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold">Simple Integration</h3>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted/50 p-6">
                    <pre className="overflow-x-auto text-sm">
                      <code>{`// Initialize Naiera client
import { Naiera } from '@naiera/sdk';

const client = new Naiera({
  apiKey: process.env.NAIERA_API_KEY,
  environment: 'production'
});

// Verify user access
const hasAccess = await client.permissions.check({
  userId: 'user_123',
  resource: 'api/admin',
  action: 'read'
});`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground">
                Get started in minutes with our comprehensive SDKs for JavaScript, Python, Go, and
                more.
              </p>
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="flex flex-col gap-8">
            <div className="mx-auto text-center">
              <h3 className="text-2xl font-semibold mb-2">Seamless Integrations</h3>
              <p className="text-muted-foreground">Connect with the tools you already use</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {integration.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.category}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                Plus 50+ more integrations.{" "}
                <a href="/integrations" className="font-medium text-primary hover:underline">
                  View all integrations
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
