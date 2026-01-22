# London Shop

A modern e-commerce application for London-themed merchandise built with Next.js 15, React 19, and TypeScript.

## Features

- **Product Catalog**: Browse hoodies, t-shirts, memory games, and mugs
- **Shopping Cart**: Persistent cart with localStorage
- **Product Search**: Search across all products
- **Admin Dashboard**: Manage customers and feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.1.0 (App Router) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui, Radix UI |
| Styling | Tailwind CSS 3.4 |
| State Management | React Context, TanStack React Query |
| Database | Supabase (optional) |
| Forms | React Hook Form + Zod |
| Testing | Vitest, React Testing Library |
| Animation | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd london-shop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables)).

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |

## Project Structure

```
london-shop/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin authentication
│   │   ├── customers/     # Customer data
│   │   └── feedback/      # Feedback data
│   ├── admin/             # Admin dashboard
│   ├── shop/              # Product catalog
│   │   ├── hoodies/
│   │   ├── t-shirts/
│   │   ├── memory-games/
│   │   └── mugs/
│   └── ...                # Static pages
├── components/            # React components
│   ├── ui/               # shadcn/ui (don't edit)
│   ├── admin/            # Admin components
│   └── product/          # Product components
├── lib/                  # Utilities & helpers
├── context/              # Cart context
├── contexts/             # Auth context
├── hooks/                # Custom hooks
└── public/               # Static assets
```

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Supabase Configuration (optional - app works without these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Credentials (change these in production!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**Note**: The app functions without Supabase - it will return empty arrays for database queries.

## Admin Dashboard

Access the admin dashboard at `/admin`. Features include:

- Customer management
- Feedback management
- Settings configuration

## Development

### Code Style

- TypeScript with strict mode
- ESLint for code quality
- Prettier for formatting (via ESLint)

### Component Guidelines

- Use the `cn()` utility from `lib/utils.ts` for conditional classes
- Don't modify files in `components/ui/` (shadcn/ui generated)
- Use `@/` path alias for imports

### Testing

Tests are co-located with source files using `.test.ts` or `.test.tsx` extensions.

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

### Deployment Checklist

- [ ] Build passes without errors
- [ ] Lint passes without warnings
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Admin credentials changed from defaults

## Contributing

1. Follow the existing code patterns
2. Ensure all tests pass
3. Run lint before committing
4. Update documentation as needed

For AI agents working on this codebase, see `CLAUDE.md` and `AGENT.md` for detailed instructions.

## License

Private - All rights reserved.
