import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesPage() {
  return (
    <div className="container py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to build production-ready applications
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Secure authentication with NextAuth.js v5 and credentials provider
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription>
              Type-safe database access with Prisma ORM and PostgreSQL
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
            <CardDescription>
              Beautiful, accessible components with shadcn/ui and Tailwind CSS
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>State Management</CardTitle>
            <CardDescription>Atomic state management with Jotai for React 19</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Form Validation</CardTitle>
            <CardDescription>Type-safe forms with React Hook Form and Zod schemas</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Modern Stack</CardTitle>
            <CardDescription>
              Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
