# London Shop - Agent Instructions

## Overview

This document provides instructions for AI agents working on the London Shop codebase. Follow these guidelines to maintain code quality and consistency.

## Before Making Changes

1. **Read the relevant files** before editing - understand existing patterns
2. **Check for existing utilities** in `lib/` before creating new ones
3. **Verify imports** use the `@/` path alias
4. **Run the build** after changes to catch errors early

## Code Patterns

### Component Structure

```tsx
// Standard component pattern
"use client" // Only if using client-side features

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ComponentProps {
  title: string
  className?: string
}

export function Component({ title, className }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {title}
    </div>
  )
}
```

### API Route Pattern

```tsx
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error message" }, { status: 500 })
  }
}
```

### Server Actions Pattern

```tsx
// lib/actions.ts
"use server"

import { cookies } from "next/headers"

export async function serverAction() {
  const cookieStore = await cookies()
  // Implementation - must be async
}
```

## Important Constraints

### DO NOT

- Modify files in `components/ui/` - these are shadcn/ui generated components
- Store secrets in code - use environment variables
- Skip TypeScript types - maintain strict typing
- Use `any` type unless absolutely necessary
- Remove existing error handling
- Add unnecessary dependencies

### DO

- Use existing utilities from `lib/utils.ts`
- Follow existing file naming conventions
- Add proper error handling for new code
- Use TypeScript interfaces for props
- Test changes with `pnpm build`
- Keep components focused and single-purpose

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `product-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `format-price.ts`)
- **Types**: `types.ts` or inline in component files
- **Tests**: `*.test.ts` or `*.test.tsx`

## State Management Rules

### Cart State
- Use `useCart()` hook - don't create parallel cart state
- Cart persists to localStorage automatically

### Server Data
- Use TanStack React Query for fetching
- Don't duplicate data in local state

### Auth State
- Use existing auth context
- Don't create new auth mechanisms

## Testing Requirements

Before submitting changes:

```bash
pnpm build      # Must pass without errors
pnpm lint       # Must pass without errors
pnpm test       # Must pass all tests
```

## Common Gotchas

### Next.js 15 Specific

1. **Server Actions must be async** - All functions with `"use server"` directive must be async
2. **cookies() returns a Promise** - Must await: `const cookieStore = await cookies()`
3. **Viewport metadata** - Use separate `viewport` export, not in `metadata`

### Supabase

1. **May not be configured** - Code must handle missing Supabase gracefully
2. **Use the existing client** - Don't create new Supabase instances

### Authentication

1. **Cookie-based auth** for admin
2. **HttpOnly cookies** can't be read from client-side JavaScript
3. **Use API routes** for auth checks from client components

## Deployment Checklist

- [ ] Build passes: `pnpm build`
- [ ] Lint passes: `pnpm lint`
- [ ] Tests pass: `pnpm test`
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] No hardcoded secrets

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Start dev server | `pnpm dev` |
| Build | `pnpm build` |
| Run tests | `pnpm test` |
| Lint | `pnpm lint` |

## Getting Help

- Check existing patterns in similar files
- Review the CLAUDE.md for project context
- Run `pnpm build` to see detailed error messages
