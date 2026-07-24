# TicketFlow - Ticket & Order Management SaaS

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Environment
- Node.js 22+, npm 11+
- PostgreSQL required
- Copy `.env.example` to `.env` and configure `DATABASE_URL`

## Architecture
- Next.js 16 App Router with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication (bcryptjs + jsonwebtoken)
- Tailwind CSS v4 for styling
- Recharts for dashboard charts
- qrcode.react for QR code generation

## Key Conventions
- Server Components by default, "use client" only when needed
- API routes use `requireAuth` and `requireAdmin` wrappers
- Zod validation on all API endpoints
- Type-safe Prisma queries throughout
- Dark/light mode via next-themes
- Modular UI components in `src/components/ui/`
