# Feedback UI Migration Design

**Date:** 2025-04-03
**Author:** Design Team
**Status:** Approved

## Overview

Migrate UI system from `/home/acn/code/feedback` project to bandanaiera backoffice application. This migration includes design tokens, component library, and layout system while maintaining separation between landing and backoffice UI packages.

## Goals

1. Replace backoffice UI system with feedback's design system (primary color: `#1B53D9`)
2. Create new `@workspace/feedback-ui` package for backoffice components
3. Maintain existing `@workspace/ui` package for landing application
4. Skip RBAC system migration (focus on UI components only)
5. Replace entire backoffice layout with feedback's layout (sidebar + header)
6. Adapt existing dashboard pages to work with new layout

## Architecture

### Package Structure

```
packages/
├── ui/                          # Existing (maintained for landing)
│   └── styles/
│       └── globals.css          # Existing design tokens (unchanged)
│
├── feedback-ui/                 # NEW - Backoffice component library
│   ├── src/
│   │   ├── ui/                  # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── sidebar.tsx     # Layout component (21KB)
│   │   │   ├── header.tsx      # Layout component (5.5KB)
│   │   │   ├── sheet.tsx
│   │   │   └── drawer.tsx
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── data-table/          # Reusable data table
│   │   ├── forms/               # Form components
│   │   ├── lib/                 # Utilities
│   │   │   └── utils.ts
│   │   └── index.ts             # Main export
│   ├── styles/
│   │   └── globals.css          # Design tokens from feedback
│   └── package.json
│
└── utils/                       # Existing (will be updated if needed)
    └── src/
        └── cn.ts                # Class name utility

apps/
└── backoffice/
    ├── app/
    │   ├── (auth)/              # Existing auth routes (unchanged)
    │   │
    │   ├── (dashboard)/         # NEW - Route group with feedback layout
    │   │   ├── layout.tsx       # Feedback layout (sidebar + header)
    │   │   ├── page.tsx         # Dashboard (adapted from existing)
    │   │   ├── admin/           # Existing admin pages
    │   │   │   ├── tags/
    │   │   │   ├── facilities/
    │   │   │   ├── destinations/
    │   │   │   ├── galleries/
    │   │   │   └── ...
    │   │   ├── settings/        # NEW - User settings from feedback
    │   │   │   ├── profile/
    │   │   │   └── change-password/
    │   │   └── _components/     # Page-specific components
    │   │
    │   └── globals.css          # Import from @workspace/feedback-ui/styles
    │
    └── components/
        └── ...                  # Existing components (preserved)
```

### Import Strategy

**Backoffice imports:**
```tsx
import { Button, Card, Sidebar } from "@workspace/feedback-ui"
```

**Landing imports:**
```tsx
import { Button, Card } from "@workspace/ui"
```

## Design Tokens

### Color System (from feedback)

```css
:root {
  /* Primary Scale - #1B53D9 */
  --primary-50: #e8f0fe;
  --primary-100: #d2e1fc;
  --primary-200: #a6c4f8;
  --primary-300: #7aa7f4;
  --primary-400: #4e89f0;
  --primary-500: #1b53d9;  /* Brand color */
  --primary-600: #1644b3;
  --primary-700: #11358c;
  --primary-800: #0d2666;
  --primary-900: #081840;
  --primary: #1b53d9;

  /* Secondary Scale - Coral/Terracotta */
  --secondary-50: #fef6f4;
  --secondary-100: #fce9e4;
  --secondary-200: #f8d3c9;
  --secondary-300: #f0a08f;
  --secondary-400: #e07a5f;
  --secondary-500: #d45d4a;
  --secondary-600: #b8463e;
  --secondary-700: #923635;
  --secondary-800: #722f33;
  --secondary-900: #5a2b31;
  --secondary: #e07a5f;

  /* Neutral Scale */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;

  /* Semantic Colors */
  --success: #10b981;
  --success-light: #34d399;
  --success-dark: #059669;

  --warning: #f59e0b;
  --warning-light: #fcd34d;
  --warning-dark: #d97706;

  --info: #3b82f6;
  --info-light: #60a5fa;
  --info-dark: #2563eb;

  --error: #ef4444;
  --error-light: #f87171;
  --error-dark: #dc2626;

  /* Semantic Surface Tokens */
  --background: #ffffff;
  --foreground: var(--neutral-900);
  --card: #ffffff;
  --card-foreground: var(--neutral-900);
  --popover: #ffffff;
  --popover-foreground: var(--neutral-900);
  --primary-foreground: #ffffff;
  --secondary-foreground: #ffffff;
  --muted: var(--neutral-100);
  --muted-foreground: var(--neutral-600);
  --accent: var(--primary-50);
  --accent-foreground: var(--neutral-900);
  --destructive: var(--error);
  --destructive-foreground: #ffffff;
  --border: var(--neutral-200);
  --input: var(--neutral-300);
  --ring: var(--primary-400);

  /* Sidebar Tokens */
  --sidebar: var(--primary-50);
  --sidebar-foreground: var(--primary-700);
  --sidebar-primary: var(--primary-600);
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: var(--primary-100);
  --sidebar-accent-foreground: var(--primary-800);
  --sidebar-border: var(--primary-200);
  --sidebar-ring: var(--primary-400);

  /* Radius Tokens */
  --radius-sm-token: 4px;
  --radius-token: 8px;
  --radius-md-token: 12px;
  --radius-lg-token: 16px;
  --radius-xl-token: 24px;
}
```

### Typography

- **Font Sans:** Inter
- **Font Serif:** Merriweather
- **Font Mono:** Fira Code
- **Text Scale:** xs(10px), sm(12px), base(16px), lg(18px), xl(20px), 2xl(24px), etc.

### Dark Mode

Supported via `.dark` class using next-themes (already installed).

## Components

### Migrating from Feedback

**Base UI Components (Required):**
- button, card, input, textarea, label, checkbox, select
- dialog, dropdown-menu, popover, separator, tabs
- badge, avatar, form, table, calendar, chart
- alert, skeleton, sonner

**Layout Components:**
- sidebar (collapsible with nested menus)
- header (breadcrumbs, user dropdown, theme toggle)
- sheet (mobile drawer)
- drawer

**Dashboard Components:**
- data-table (reusable table with sorting/filtering)
- stats cards
- chart components (recharts wrapper)

### Not Migrating

**RBAC-related components (skipped):**
- Users management
- Roles management
- Permissions management
- Resources management

## Layout System

### Dashboard Layout

```tsx
// apps/backoffice/app/(dashboard)/layout.tsx
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          {/* Navigation menu items */}
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header>
            {/* Breadcrumbs, user menu, theme toggle */}
          </Header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

### Sidebar Menu Structure

```
├── Dashboard
├── Admin (expandable)
│   ├── Tags
│   ├── Facilities
│   ├── Destinations
│   ├── Galleries
│   └── ...
└── Settings (expandable)
    ├── Profile
    └── Change Password
```

## Dependencies

### New Dependencies to Add

```json
// packages/feedback-ui/package.json
{
  "dependencies": {
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-direction": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tabler/icons-react": "^3.36.1",  // Only if needed
    "vaul": "^1.1.2",
    "recharts": "^2.15.4"
  }
}
```

### Already Available (No Changes)

- @radix-ui packages (avatar, checkbox, dialog, dropdown-menu, label, popover, select, separator, slot, tabs)
- @hookform/resolvers
- lucide-react (icons)
- sonner (toast)
- recharts (charts)
- next-themes
- tailwindcss, tailwind-merge, clsx, class-variance-authority

### Not Adding

- @dnd-kit (drag & drop - not needed for basic UI)
- next-intl (internationalization - not multi-language)
- react-day-picker (calendar already included)

### Icon Library Strategy

**Primary:** Use `lucide-react` (already installed)

**Secondary:** Add `@tabler/icons-react` only if specific icons don't exist in lucide

## Utilities

### Utilities from Feedback

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Integration Strategy

1. Check if `packages/utils` has `cn()` function
2. If yes: use existing
3. If no: add to `packages/utils`
4. Add `composeRefs()` if needed (from feedback/lib/compose-refs.ts)

## Implementation Plan

### Phase 1: Setup Package Structure (15 min)
- [ ] Create `packages/feedback-ui/` directory structure
- [ ] Initialize `package.json` with dependencies
- [ ] Update `pnpm-workspace.yaml` if needed

### Phase 2: Migrate Design Tokens (20 min)
- [ ] Copy `feedback/app/globals.css` → `packages/feedback-ui/styles/globals.css`
- [ ] Update `apps/backoffice/app/globals.css` to import from `@workspace/feedback-ui/styles`
- [ ] Test color rendering

### Phase 3: Migrate Utilities (10 min)
- [ ] Check `packages/utils` for `cn()` function
- [ ] Add if missing
- [ ] Copy `compose-refs.ts` if needed

### Phase 4: Migrate Base Components (60-90 min)
- [ ] Copy components from `feedback/components/ui/` to `packages/feedback-ui/src/ui/`
- [ ] Update import paths (`@/lib/utils` → `@workspace/utils`)
- [ ] Update icon imports (use lucide-react)
- [ ] Export all in `packages/feedback-ui/src/index.ts`

### Phase 5: Migrate Layout Components (45-60 min)
- [ ] Copy `sidebar.tsx`, `header.tsx`, `drawer.tsx`, `sheet.tsx`
- [ ] Update all imports
- [ ] Test collapsible sidebar functionality

### Phase 6: Setup Layout & Routes (30-45 min)
- [ ] Create `apps/backoffice/app/(dashboard)/layout.tsx`
- [ ] Move existing pages into `(dashboard)` route group
- [ ] Copy settings pages (profile, change-password) from feedback
- [ ] Update sidebar menu configuration

### Phase 7: Adapt Dashboard (30-45 min)
- [ ] Refactor dashboard page to use new components
- [ ] Update stats cards, charts for new design
- [ ] Test all dashboard functionality

### Phase 8: Testing & Fixes (30-45 min)
- [ ] Test navigation
- [ ] Test responsive (mobile drawer)
- [ ] Test dark mode
- [ ] Fix broken imports or components

**Total Estimated Time:** 4-5 hours

## Risk Mitigation

### Potential Issues

**Issue 1: Breaking Changes in Existing Pages**
- **Risk:** Admin pages may break due to layout changes
- **Mitigation:**
  - Use route group `(dashboard)` for isolation
  - Test each page after layout change
  - Easy rollback via git

**Issue 2: Icon Inconsistency**
- **Risk:** Tabler icons vs Lucide icons
- **Mitigation:**
  - Use existing lucide-react
  - Manual mapping for missing icons
  - Add @tabler/icons-react later if truly needed

**Issue 3: Styling Conflict**
- **Risk:** Feedback design tokens vs landing (packages/ui)
- **Mitigation:**
  - Complete separation: feedback-ui for backoffice, ui for landing
  - No shared design tokens

**Issue 4: Dependency Bloat**
- **Risk:** Too many new dependencies
- **Mitigation:**
  - Only add truly necessary dependencies
  - Review each dependency before adding

**Issue 5: Type Errors**
- **Risk:** TypeScript errors after migration
- **Mitigation:**
  - Run `check-types` at each phase
  - Fix errors immediately

### Rollback Plan

- Git commit at each major phase
- If issues arise, rollback to previous commit
- Package structure allows easy rollback (delete feedback-ui folder)

### Testing Strategy

1. **Unit Tests:** Not required (components tested in feedback)
2. **Integration Tests:** Manual browser testing
3. **Visual Regression:** Screenshot comparison (optional)

## Success Criteria

- [ ] All base UI components migrated and functional
- [ ] Layout (sidebar + header) working correctly
- [ ] Dashboard page adapted to new design
- [ ] All admin pages accessible via new layout
- [ ] Dark mode working
- [ ] Mobile responsive (drawer)
- [ ] No TypeScript errors
- [ ] No broken imports
- [ ] Landing app still uses `@workspace/ui` (unaffected)

## Next Steps

1. Review and approve this design document
2. Create implementation plan with detailed steps
3. Begin Phase 1: Setup Package Structure
