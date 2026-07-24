# Track Desk — Ticket & Order Management SaaS

A modern, premium ticket and order management platform with a black, white, and neon-lime design.

> **Live Demo**: [https://trackdesk.vercel.app](https://trackdesk.vercel.app) <!-- Replace with your actual Vercel URL -->

![Track Desk](public/og.png)

---

## Features

- **Dashboard** — Real-time KPI cards (total tickets, open, ready, delivered, today's tickets), weekly bar chart, status distribution pie chart, monthly revenue, recent activity feed
- **Ticket Management** — Full CRUD with 10-status workflow (Received → Diagnosing → ... → Delivered → Closed), closing workflow with final cost + payment tracking, timeline history, file attachments with image previews
- **Customer Management** — Profiles with ticket history, debounced search, inline customer creation during ticket creation
- **QR Tracking** — Public tracking page (no login required) with status progress bar
- **Print** — Printable ticket pages with QR codes
- **Responsive** — Desktop sidebar always visible, tablet collapsible, mobile drawer with hamburger button
- **Dark Mode** — Full theme support with toggle
- **Notifications** — Bell icon with unread badge, dropdown list, mark-all-as-read

## Status Workflow

`Received` → `Diagnosing` → `Waiting for Approval` → `Waiting for Parts` → `Repair in Progress` → `Quality Check` → `Ready for Pickup` → `Delivered` → `Closed`

`Cancelled` is available at any stage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | JWT with bcryptjs |
| Charts | Recharts |
| QR Code | qrcode.react |
| Validation | Zod |
| Icons | Lucide React |
| Notifications | react-hot-toast |

## Color Palette

- **Primary Accent**: `#B9FF66` (neon lime)
- **Accent Hover**: `#A3F53D`
- **Dark**: `#191A23`
- **Background**: `#F5F5F5`
- **Cards**: `#FFFFFF`
- **Borders**: `#D9D9D9`
- **Primary Text**: `#191A23`
- **Secondary Text**: `#666666`

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or [Neon](https://neon.tech))

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/SagarXD-bit/TrackDesk.git
cd TrackDesk
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `NEXT_PUBLIC_APP_URL` | Application URL (e.g. `http://localhost:3000`) |
| `UPLOAD_DIR` | Local upload directory (default: `uploads`) |

### 3. Set up the database

```bash
npx prisma db push
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trackdesk.com | admin123 |
| Employee | alice@trackdesk.com | admin123 |
| Employee | bob@trackdesk.com | admin123 |
| Employee | carol@trackdesk.com | admin123 |
| Employee | dave@trackdesk.com | admin123 |
| Employee | eve@trackdesk.com | admin123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── (dashboard)/          # Dashboard layout + pages
│   │   ├── dashboard/        # KPI cards, charts, activity
│   │   ├── tickets/          # List, detail (with timeline/attachments/payments/closing)
│   │   ├── customers/        # List, detail, form
│   │   └── settings/         # User management
│   ├── print/[id]/           # Printable ticket with QR code
│   ├── track/[id]/           # Public tracking (no auth)
│   └── api/                  # REST API routes
├── components/
│   ├── layout/               # Sidebar, Navbar, Footer, Logo, ThemeProvider
│   └── ui/                   # Button, Card, Modal, Input, Badge, DataTable, etc.
├── lib/                      # Prisma client, auth, validations, utils
└── types/                    # TypeScript types, status labels, colors
prisma/
├── schema.prisma             # User, Customer, Ticket, Timeline, Attachment, Notification
└── seed.ts                   # 50 customers, 5 employees, 150 tickets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Tickets
- `GET /api/tickets` — List tickets (search, filter, paginate)
- `POST /api/tickets` — Create ticket
- `GET /api/tickets/:id` — Get ticket with timeline, attachments, payments
- `PATCH /api/tickets/:id` — Update ticket (including status change + closing)
- `DELETE /api/tickets/:id` — Delete ticket

### Customers
- `GET /api/customers` — List customers (search, paginate)
- `POST /api/customers` — Create customer
- `GET /api/customers/:id` — Get customer with tickets
- `PATCH /api/customers/:id` — Update customer
- `DELETE /api/customers/:id` — Delete customer

### Dashboard
- `GET /api/dashboard` — All KPI stats from real SQL

### Notifications
- `GET /api/notifications` — List + unread count
- `PATCH /api/notifications` — Mark all as read
- `GET /api/notifications/count` — Unread count only

### Attachments
- `POST /api/attachments` — Upload file (JPG, PNG, WEBP, PDF, DOCX)

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables:
   - `DATABASE_URL` — Use [Neon](https://neon.tech) for serverless PostgreSQL
   - `JWT_SECRET` — Generate a random 64-character string
   - `NEXT_PUBLIC_APP_URL` — Your Vercel domain (e.g. `https://trackdesk.vercel.app`)
   - `UPLOAD_DIR` — `uploads`
4. Deploy

---

## Credits

Built with ❤️ by **[Sagar Rawat](https://sagar-rawat.vercel.app/)** — Full-stack developer specializing in modern web applications.

---

## License

MIT
