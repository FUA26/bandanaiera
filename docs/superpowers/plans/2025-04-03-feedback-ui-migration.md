# Feedback UI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate UI system from feedback project to bandanaiera backoffice, creating new @workspace/feedback-ui package while preserving existing @workspace/ui for landing.

**Architecture:** Create isolated feedback-ui package with design tokens and components from feedback project, then integrate into backoffice app via new (dashboard) route group with sidebar layout.

**Tech Stack:** Tailwind CSS v4, Radix UI, Lucide icons, Next.js 16, TypeScript

---

## File Structure

### New Files Created
- `packages/feedback-ui/package.json` - Package configuration
- `packages/feedback-ui/src/index.ts` - Main export file
- `packages/feedback-ui/src/lib/utils.ts` - Utility functions
- `packages/feedback-ui/styles/globals.css` - Design tokens from feedback
- `packages/feedback-ui/src/ui/*.tsx` - 25+ UI components from feedback
- `apps/backoffice/app/(dashboard)/layout.tsx` - New dashboard layout
- `apps/backoffice/app/(dashboard)/page.tsx` - Adapted dashboard
- `apps/backoffice/app/(dashboard)/settings/profile/page.tsx` - Settings page
- `apps/backoffice/app/(dashboard)/settings/change-password/page.tsx` - Settings page

### Modified Files
- `apps/backoffice/app/globals.css` - Import from @workspace/feedback-ui/styles
- `packages/utils/src/index.ts` - Add cn() if missing
- `pnpm-workspace.yaml` - Add feedback-ui to workspace

---

## Task 1: Create feedback-ui Package Structure

**Files:**
- Create: `packages/feedback-ui/package.json`
- Create: `packages/feedback-ui/src/index.ts`
- Create: `packages/feedback-ui/tsconfig.json`

- [ ] **Step 1: Create package.json for feedback-ui**

Create file `packages/feedback-ui/package.json`:

```json
{
  "name": "@workspace/feedback-ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    "./styles": "./styles/globals.css"
  },
  "scripts": {
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-direction": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "next": "16.1.6",
    "react": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "vaul": "^1.1.2"
  },
  "devDependencies": {
    "@repo/tailwind-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "typescript": "5"
  }
}
```

- [ ] **Step 2: Create main index.ts export**

Create file `packages/feedback-ui/src/index.ts`:

```typescript
// Placeholder - will be updated in later tasks
export {}
```

- [ ] **Step 3: Create TypeScript config**

Create file `packages/feedback-ui/tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create directory structure**

Run:

```bash
mkdir -p packages/feedback-ui/src/ui
mkdir -p packages/feedback-ui/src/lib
mkdir -p packages/feedback-ui/styles
```

- [ ] **Step 5: Commit**

```bash
git add packages/feedback-ui
git commit -m "feat: create feedback-ui package structure"
```

---

## Task 2: Migrate Design Tokens

**Files:**
- Create: `packages/feedback-ui/styles/globals.css`
- Modify: `apps/backoffice/app/globals.css`

- [ ] **Step 1: Copy design tokens from feedback**

Create file `packages/feedback-ui/styles/globals.css` with content from `/home/acn/code/feedback/app/globals.css` (lines 1-100 only - design tokens section):

Run:

```bash
head -100 /home/acn/code/feedback/app/globals.css > packages/feedback-ui/styles/globals.css
```

Expected: File created with CSS variables for colors, spacing, typography

- [ ] **Step 2: Verify globals.css was created correctly**

Run:

```bash
head -20 packages/feedback-ui/styles/globals.css
```

Expected output should include:

```css
@layer base, components, utilities;

@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  /* Brand and palette tokens - Primary scale based on brand color #1B53D9 */
  --brand: #1b53d9;
  --primary-50: #e8f0fe;
  ...
```

- [ ] **Step 3: Update backoffice globals.css to import feedback-ui styles**

Read current `apps/backoffice/app/globals.css`:

```bash
cat apps/backoffice/app/globals.css
```

Replace entire content of `apps/backoffice/app/globals.css` with:

```css
/* Import feedback-ui design tokens */
@import "@workspace/feedback-ui/styles";

/* Backoffice-specific font overrides */
@theme inline {
  --font-display: "Inter", sans-serif;
  --font-sans: "Inter", sans-serif;
  --font-mono: "Fira Code", monospace;
}
```

- [ ] **Step 4: Verify backoffice globals.css was updated**

Run:

```bash
cat apps/backoffice/app/globals.css
```

Expected: File contains `@import "@workspace/feedback-ui/styles";`

- [ ] **Step 5: Commit**

```bash
git add packages/feedback-ui/styles apps/backoffice/app/globals.css
git commit -m "feat: migrate design tokens from feedback"
```

---

## Task 3: Check and Add Utilities

**Files:**
- Check: `packages/utils/src/index.ts`
- Modify: `packages/feedback-ui/src/lib/utils.ts`

- [ ] **Step 1: Check if cn() exists in utils package**

Run:

```bash
grep -r "function cn" packages/utils/src/ || echo "NOT_FOUND"
```

Expected: Either finds the function or prints "NOT_FOUND"

- [ ] **Step 2: Create utils.ts in feedback-ui package**

Create file `packages/feedback-ui/src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Update feedback-ui index.ts to export utils**

Replace content of `packages/feedback-ui/src/index.ts` with:

```typescript
export { cn } from './lib/utils'
```

- [ ] **Step 4: Verify utils can be imported**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add packages/feedback-ui/src/lib packages/feedback-ui/src/index.ts
git commit -m "feat: add utils to feedback-ui package"
```

---

## Task 4: Migrate Base UI Components (Batch 1 - Form Components)

**Files:**
- Create: `packages/feedback-ui/src/ui/button.tsx`
- Create: `packages/feedback-ui/src/ui/input.tsx`
- Create: `packages/feedback-ui/src/ui/textarea.tsx`
- Create: `packages/feedback-ui/src/ui/label.tsx`
- Create: `packages/feedback-ui/src/ui/checkbox.tsx`
- Create: `packages/feedback-ui/src/ui/select.tsx`

- [ ] **Step 1: Copy button component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/button.tsx packages/feedback-ui/src/ui/button.tsx
```

- [ ] **Step 2: Update button imports**

Edit `packages/feedback-ui/src/ui/button.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

Replace any `@/components` imports with appropriate replacements

- [ ] **Step 3: Copy input component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/input.tsx packages/feedback-ui/src/ui/input.tsx
```

- [ ] **Step 4: Update input imports**

Edit `packages/feedback-ui/src/ui/input.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 5: Copy textarea component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/textarea.tsx packages/feedback-ui/src/ui/textarea.tsx
```

- [ ] **Step 6: Update textarea imports**

Edit `packages/feedback-ui/src/ui/textarea.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 7: Copy label component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/label.tsx packages/feedback-ui/src/ui/label.tsx
```

- [ ] **Step 8: Update label imports**

Edit `packages/feedback-ui/src/ui/label.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 9: Copy checkbox component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/checkbox.tsx packages/feedback-ui/src/ui/checkbox.tsx
```

- [ ] **Step 10: Update checkbox imports**

Edit `packages/feedback-ui/src/ui/checkbox.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 11: Copy select component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/select.tsx packages/feedback-ui/src/ui/select.tsx
```

- [ ] **Step 12: Update select imports**

Edit `packages/feedback-ui/src/ui/select.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 13: Update index.ts exports**

Edit `packages/feedback-ui/src/index.ts`:

```typescript
export { cn } from './lib/utils'

export { Button } from './ui/button'
export { Input } from './ui/input'
export { Textarea } from './ui/textarea'
export { Label } from './ui/label'
export { Checkbox } from './ui/checkbox'
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from './ui/select'
```

- [ ] **Step 14: Verify TypeScript**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 15: Commit**

```bash
git add packages/feedback-ui/src/ui
git commit -m "feat: migrate form components (button, input, textarea, label, checkbox, select)"
```

---

## Task 5: Migrate Base UI Components (Batch 2 - Display & Feedback)

**Files:**
- Create: `packages/feedback-ui/src/ui/card.tsx`
- Create: `packages/feedback-ui/src/ui/badge.tsx`
- Create: `packages/feedback-ui/src/ui/avatar.tsx`
- Create: `packages/feedback-ui/src/ui/alert.tsx`
- Create: `packages/feedback-ui/src/ui/skeleton.tsx`
- Create: `packages/feedback-ui/src/ui/sonner.tsx`

- [ ] **Step 1: Copy card component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/card.tsx packages/feedback-ui/src/ui/card.tsx
```

- [ ] **Step 2: Update card imports**

Edit `packages/feedback-ui/src/ui/card.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 3: Copy badge component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/badge.tsx packages/feedback-ui/src/ui/badge.tsx
```

- [ ] **Step 4: Update badge imports**

Edit `packages/feedback-ui/src/ui/badge.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 5: Copy avatar component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/avatar.tsx packages/feedback-ui/src/ui/avatar.tsx
```

- [ ] **Step 6: Update avatar imports**

Edit `packages/feedback-ui/src/ui/avatar.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 7: Copy alert component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/alert.tsx packages/feedback-ui/src/ui/alert.tsx
```

- [ ] **Step 8: Update alert imports**

Edit `packages/feedback-ui/src/ui/alert.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

Replace: `from "lucide-react"`
With: `from "lucide-react"` (already correct)

- [ ] **Step 9: Copy skeleton component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/skeleton.tsx packages/feedback-ui/src/ui/skeleton.tsx
```

- [ ] **Step 10: Update skeleton imports**

Edit `packages/feedback-ui/src/ui/skeleton.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 11: Copy sonner component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/sonner.tsx packages/feedback-ui/src/ui/sonner.tsx
```

- [ ] **Step 12: Update sonner imports**

Edit `packages/feedback-ui/src/ui/sonner.tsx`:

Replace: `import { cn } from "@/lib/utils"`
With: `import { cn } from "@workspace/utils"`

- [ ] **Step 13: Update index.ts exports**

Edit `packages/feedback-ui/src/index.ts`:

Add after existing exports:

```typescript
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
export { Badge, badgeVariants } from './ui/badge'
export { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
export { Alert, AlertTitle, AlertDescription } from './ui/alert'
export { Skeleton } from './ui/skeleton'
export { Toaster } from './ui/sonner'
```

- [ ] **Step 14: Verify TypeScript**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 15: Commit**

```bash
git add packages/feedback-ui/src/ui packages/feedback-ui/src/index.ts
git commit -m "feat: migrate display and feedback components"
```

---

## Task 6: Migrate Base UI Components (Batch 3 - Navigation & Overlays)

**Files:**
- Create: `packages/feedback-ui/src/ui/dialog.tsx`
- Create: `packages/feedback-ui/src/ui/dropdown-menu.tsx`
- Create: `packages/feedback-ui/src/ui/popover.tsx`
- Create: `packages/feedback-ui/src/ui/separator.tsx`
- Create: `packages/feedback-ui/src/ui/tabs.tsx`
- Create: `packages/feedback-ui/src/ui/sheet.tsx`
- Create: `packages/feedback-ui/src/ui/drawer.tsx`

- [ ] **Step 1: Copy all navigation components**

Run:

```bash
cp /home/acn/code/feedback/components/ui/dialog.tsx packages/feedback-ui/src/ui/dialog.tsx
cp /home/acn/code/feedback/components/ui/dropdown-menu.tsx packages/feedback-ui/src/ui/dropdown-menu.tsx
cp /home/acn/code/feedback/components/ui/popover.tsx packages/feedback-ui/src/ui/popover.tsx
cp /home/acn/code/feedback/components/ui/separator.tsx packages/feedback-ui/src/ui/separator.tsx
cp /home/acn/code/feedback/components/ui/tabs.tsx packages/feedback-ui/src/ui/tabs.tsx
cp /home/acn/code/feedback/components/ui/sheet.tsx packages/feedback-ui/src/ui/sheet.tsx
cp /home/coded/feedback/components/ui/drawer.tsx packages/feedback-ui/src/ui/drawer.tsx
```

- [ ] **Step 2: Update imports in all copied files**

Run this script to update all files:

```bash
for file in packages/feedback-ui/src/ui/*.tsx; do
  sed -i 's|from "@/lib/utils"|from "@workspace/utils"|g' "$file"
  sed -i 's|from "@/components|from "@workspace/feedback-ui/src/ui|g' "$file"
done
```

- [ ] **Step 3: Fix self-referencing imports**

Run:

```bash
for file in packages/feedback-ui/src/ui/*.tsx; do
  sed -i 's|from "@workspace/feedback-ui/src/ui|from "./|g' "$file"
done
```

- [ ] **Step 4: Update index.ts exports**

Edit `packages/feedback-ui/src/index.ts`:

Add:

```typescript
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from './ui/dropdown-menu'
export { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
export { Separator } from './ui/separator'
export { Tabs, TabsTrigger, TabsContent } from './ui/tabs'
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/sheet'
export { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from './ui/drawer'
```

- [ ] **Step 5: Verify TypeScript**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors (or fix any issues)

- [ ] **Step 6: Commit**

```bash
git add packages/feedback-ui/src/ui packages/feedback-ui/src/index.ts
git commit -m "feat: migrate navigation and overlay components"
```

---

## Task 7: Migrate Data Components

**Files:**
- Create: `packages/feedback-ui/src/ui/table.tsx`
- Create: `packages/feedback-ui/src/ui/calendar.tsx`
- Create: `packages/feedback-ui/src/ui/chart.tsx`
- Create: `packages/feedback-ui/src/ui/form.tsx`

- [ ] **Step 1: Copy data components**

Run:

```bash
cp /home/acn/code/feedback/components/ui/table.tsx packages/feedback-ui/src/ui/table.tsx
cp /home/acn/code/feedback/components/ui/calendar.tsx packages/feedback-ui/src/ui/calendar.tsx
cp /home/acn/code/feedback/components/ui/chart.tsx packages/feedback-ui/src/ui/chart.tsx
cp /home/acn/code/feedback/components/ui/form.tsx packages/feedback-ui/src/ui/form.tsx
```

- [ ] **Step 2: Update imports**

Run:

```bash
for file in packages/feedback-ui/src/ui/table.tsx packages/feedback-ui/src/ui/calendar.tsx packages/feedback-ui/src/ui/chart.tsx packages/feedback-ui/src/ui/form.tsx; do
  sed -i 's|from "@/lib/utils"|from "@workspace/utils"|g' "$file"
  sed -i 's|from "@/components|from "@workspace/feedback-ui/src/ui|g' "$file"
  sed -i 's|from "@workspace/feedback-ui/src/ui|from "./|g' "$file"
done
```

- [ ] **Step 3: Update index.ts exports**

Edit `packages/feedback-ui/src/index.ts`:

Add:

```typescript
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from './ui/table'
export { Calendar } from './ui/calendar'
export { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from './ui/form'
```

- [ ] **Step 4: Verify TypeScript**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add packages/feedback-ui/src/ui packages/feedback-ui/src/index.ts
git commit -m "feat: migrate data components (table, calendar, chart, form)"
```

---

## Task 8: Migrate Layout Components (Sidebar & Header)

**Files:**
- Create: `packages/feedback-ui/src/ui/sidebar.tsx`
- Create: `packages/feedback-ui/src/ui/header.tsx`

- [ ] **Step 1: Copy sidebar component**

Run:

```bash
cp /home/acn/code/feedback/components/ui/sidebar.tsx packages/feedback-ui/src/ui/sidebar.tsx
```

- [ ] **Step 2: Update sidebar imports**

Edit `packages/feedback-ui/src/ui/sidebar.tsx`:

Run:

```bash
sed -i 's|from "@/lib/utils"|from "@workspace/utils"|g' packages/feedback-ui/src/ui/sidebar.tsx
sed -i 's|from "@/components|from "@workspace/feedback-ui/src/ui|g' packages/feedback-ui/src/ui/sidebar.tsx
sed -i 's|from "@workspace/feedback-ui/src/ui|from "./|g' packages/feedback-ui/src/ui/sidebar.tsx
```

- [ ] **Step 3: Copy header component**

Run:

```bash
cp /home/acn/code/feedback/components/header.tsx packages/feedback-ui/src/ui/header.tsx
```

- [ ] **Step 4: Update header imports**

Edit `packages/feedback-ui/src/ui/header.tsx`:

Run:

```bash
sed -i 's|from "@/lib/utils"|from "@workspace/utils"|g' packages/feedback-ui/src/ui/header.tsx
sed -i 's|from "@/components|from "@workspace/feedback-ui/src/ui|g' packages/feedback-ui/src/ui/header.tsx
sed -i 's|from "@workspace/feedback-ui/src/ui|from "./|g' packages/feedback-ui/src/ui/header.tsx
```

- [ ] **Step 5: Update icon imports to use lucide-react**

Edit `packages/feedback-ui/src/ui/sidebar.tsx` and `packages/feedback-ui/src/ui/header.tsx`:

Replace all: `from "@tabler/icons-react"`
With: `from "lucide-react"`

Then manually map any Tabler icons that don't exist in Lucide. Common mappings:
- `IconChevronLeft` → `ChevronLeft`
- `IconChevronRight` → `ChevronRight`
- `IconX` → `X`
- `IconMenu` → `Menu`

- [ ] **Step 6: Update index.ts exports**

Edit `packages/feedback-ui/src/index.ts`:

Add:

```typescript
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from './ui/sidebar'
export { Header } from './ui/header'
```

- [ ] **Step 7: Verify TypeScript**

Run:

```bash
cd packages/feedback-ui && npx tsc --noEmit
```

Expected: No TypeScript errors (may need to fix icon names)

- [ ] **Step 8: Commit**

```bash
git add packages/feedback-ui/src/ui packages/feedback-ui/src/index.ts
git commit -m "feat: migrate layout components (sidebar, header)"
```

---

## Task 9: Update Workspace Configuration

**Files:**
- Check: `pnpm-workspace.yaml`

- [ ] **Step 1: Check current workspace configuration**

Run:

```bash
cat pnpm-workspace.yaml
```

Expected: Lists packages directory

- [ ] **Step 2: Verify feedback-ui is in workspace**

Run:

```bash
grep "feedback-ui" pnpm-workspace.yaml || echo "NOT_FOUND"
```

If "NOT_FOUND", the workspace should automatically include it if using `packages/*` pattern

- [ ] **Step 3: Install dependencies**

Run:

```bash
pnpm install
```

Expected: All dependencies installed, including @workspace/feedback-ui

- [ ] **Step 4: Verify package is available**

Run:

```bash
pnpm list @workspace/feedback-ui
```

Expected: Shows @workspace/feedback-ui in list

- [ ] **Step 5: Commit**

```bash
git add pnpm-lock.yaml
git commit -m "chore: install feedback-ui dependencies"
```

---

## Task 10: Create Dashboard Layout

**Files:**
- Create: `apps/backoffice/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create dashboard directory structure**

Run:

```bash
mkdir -p "apps/backoffice/app/(dashboard)"
```

- [ ] **Step 2: Create dashboard layout**

Create file `apps/backoffice/app/(dashboard)/layout.tsx`:

```tsx
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, Header, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/feedback-ui"
import { Home, Settings2, Tags, Building2, MapPin, Image } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <a href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Home className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Backoffice</span>
                      <span className="text-xs">Dashboard</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/admin/tags">
                    <Tags />
                    <span>Tags</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/admin/facilities">
                    <Building2 />
                    <span>Facilities</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/admin/destinations">
                    <MapPin />
                    <span>Destinations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/admin/galleries">
                    <Image />
                    <span>Galleries</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings/profile">
                    <Settings2 />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <Header>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

Run:

```bash
cd apps/backoffice && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/layout.tsx
git commit -m "feat: create dashboard layout with sidebar"
```

---

## Task 11: Move Existing Pages to Dashboard Route Group

**Files:**
- Move: `apps/backoffice/app/(dashboard)/*`

- [ ] **Step 1: Check current admin pages**

Run:

```bash
ls -la apps/backoffice/app/\(dashboard\)/admin/ 2>/dev/null || echo "Admin directory not found"
```

- [ ] **Step 2: Create admin directory in dashboard route**

Run:

```bash
mkdir -p "apps/backoffice/app/(dashboard)/admin"
```

- [ ] **Step 3: Check existing pages in root**

Run:

```bash
find apps/backoffice/app -maxdepth 2 -name "page.tsx" -not -path "*/(dashboard)/*" -not -path "*/node_modules/*"
```

- [ ] **Step 4: Move admin pages to dashboard route group**

If admin pages exist in `(dashboard)` already, skip this step.

Otherwise, run:

```bash
# Move each admin page if it exists
if [ -d "apps/backoffice/app/admin" ]; then
  mv apps/backoffice/app/admin "apps/backoffice/app/(dashboard)/"
fi
```

- [ ] **Step 5: Verify structure**

Run:

```bash
ls -la "apps/backoffice/app/(dashboard)/"
```

Expected: Should show admin/, layout.tsx, and page.tsx

- [ ] **Step 6: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)
git commit -m "feat: organize admin pages under dashboard route group"
```

---

## Task 12: Create Dashboard Home Page

**Files:**
- Create: `apps/backoffice/app/(dashboard)/page.tsx`

- [ ] **Step 1: Check existing dashboard**

Run:

```bash
cat "apps/backoffice/app/(dashboard)/page.tsx" 2>/dev/null || echo "File does not exist"
```

- [ ] **Step 2: Create simple dashboard page**

Create file `apps/backoffice/app/(dashboard)/page.tsx`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/feedback-ui"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your backoffice dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tags</CardTitle>
            <CardDescription>Content tags in system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
            <CardDescription>Facility locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinations</CardTitle>
            <CardDescription>Tourist destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Galleries</CardTitle>
            <CardDescription>Image galleries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

Run:

```bash
cd apps/backoffice && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/page.tsx
git commit -m "feat: create dashboard home page"
```

---

## Task 13: Create Settings Pages

**Files:**
- Create: `apps/backoffice/app/(dashboard)/settings/profile/page.tsx`
- Create: `apps/backoffice/app/(dashboard)/settings/change-password/page.tsx`

- [ ] **Step 1: Create settings directories**

Run:

```bash
mkdir -p "apps/backoffice/app/(dashboard)/settings/profile"
mkdir -p "apps/backoffice/app/(dashboard)/settings/change-password"
```

- [ ] **Step 2: Create profile page**

Create file `apps/backoffice/app/(dashboard)/settings/profile/page.tsx`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/feedback-ui"
import { Input } from "@workspace/feedback-ui"
import { Label } from "@workspace/feedback-ui"
import { Button } from "@workspace/feedback-ui"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Create change password page**

Create file `apps/backoffice/app/(dashboard)/settings/change-password/page.tsx`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/feedback-ui"
import { Input } from "@workspace/feedback-ui"
import { Label } from "@workspace/feedback-ui"
import { Button } from "@workspace/feedback-ui"

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground">
          Update your password
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input id="new" type="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" />
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript**

Run:

```bash
cd apps/backoffice && npx tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add apps/backoffice/app/\(dashboard\)/settings
git commit -m "feat: add settings pages (profile, change-password)"
```

---

## Task 14: Build and Test

**Files:**
- Test: All backoffice pages

- [ ] **Step 1: Build backoffice**

Run:

```bash
cd apps/backoffice && pnpm build
```

Expected: Build succeeds without errors

- [ ] **Step 2: Start dev server**

Run:

```bash
cd apps/backoffice && pnpm dev
```

Expected: Server starts on port 3001

- [ ] **Step 3: Test dashboard in browser**

Open browser to: `http://localhost:3001/dashboard`

Expected:
- Sidebar visible with navigation
- Header with breadcrumbs
- Dashboard page with stat cards
- Primary color is #1B53D9

- [ ] **Step 4: Test navigation**

Click through menu items:
- Dashboard
- Admin sections (Tags, Facilities, Destinations, Galleries)
- Settings (Profile, Change Password)

Expected: All pages load correctly

- [ ] **Step 5: Test responsive design**

Resize browser to mobile width (< 768px)

Expected:
- Sidebar collapses to icon-only
- Drawer/sheet works on mobile

- [ ] **Step 6: Test dark mode**

Toggle dark mode (if theme toggle available)

Expected: Colors adapt correctly for dark mode

- [ ] **Step 7: Run type check**

Run:

```bash
cd apps/backoffice && pnpm check-types
```

Expected: No TypeScript errors

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "test: verify UI migration complete"
```

---

## Task 15: Final Verification

**Files:**
- Check: All apps still work

- [ ] **Step 1: Verify landing app still uses @workspace/ui**

Run:

```bash
grep -r "@workspace/ui" apps/landing/app/ | head -5
```

Expected: Landing app still imports from @workspace/ui

- [ ] **Step 2: Verify backoffice uses @workspace/feedback-ui**

Run:

```bash
grep -r "@workspace/feedback-ui" apps/backoffice/app/ | head -5
```

Expected: Backoffice imports from @workspace/feedback-ui

- [ ] **Step 3: Run linting**

Run:

```bash
pnpm lint
```

Expected: No linting errors

- [ ] **Step 4: Create summary documentation**

Create file `docs/feedback-ui-migration-summary.md`:

```markdown
# Feedback UI Migration Summary

**Completed:** 2025-04-03

## What Was Done

1. Created new `@workspace/feedback-ui` package
2. Migrated design tokens from feedback project (#1B53D9 primary color)
3. Migrated 25+ UI components (button, card, input, dialog, sidebar, etc.)
4. Created dashboard layout with collapsible sidebar
5. Added settings pages (profile, change-password)

## Package Structure

```
packages/
├── ui/                    # Landing app (unchanged)
└── feedback-ui/          # Backoffice app (new)
    └── src/
        ├── ui/           # Components
        ├── lib/          # Utilities
        └── index.ts      # Exports
```

## Import Strategy

- **Backoffice:** `import { Button } from "@workspace/feedback-ui"`
- **Landing:** `import { Button } from "@workspace/ui"`

## Testing

- ✅ Dashboard layout working
- ✅ Sidebar navigation functional
- ✅ Responsive design
- ✅ Dark mode support
- ✅ TypeScript errors resolved
- ✅ Landing app unaffected
```

- [ ] **Step 5: Commit final documentation**

```bash
git add docs/feedback-ui-migration-summary.md
git commit -m "docs: add UI migration summary"
```

---

## Success Criteria Checklist

- [ ] @workspace/feedback-ui package created
- [ ] All UI components migrated (25+ components)
- [ ] Design tokens applied (#1B53D9 primary color)
- [ ] Dashboard layout with sidebar working
- [ ] Settings pages created
- [ ] Backoffice imports from @workspace/feedback-ui
- [ ] Landing still imports from @workspace/ui
- [ ] TypeScript builds without errors
- [ ] Dev server runs successfully
- [ ] Navigation works correctly
- [ ] Responsive design functional
- [ ] Dark mode working
- [ ] No broken imports

## Rollback Plan

If issues arise:

1. Delete `packages/feedback-ui/` directory
2. Restore `apps/backoffice/app/globals.css` to previous version
3. Delete `apps/backoffice/app/(dashboard)/` directory
4. Run: `git reset --hard HEAD~N` (where N is number of commits to rollback)
