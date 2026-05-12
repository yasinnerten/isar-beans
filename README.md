# grabthebeans

A coffee-shop loyalty app built with Next.js. Customers scan a QR code, collect "beans", and track rewards via Apple Wallet. Shop owners manage approvals, buy beans, and handle subscriptions through a web dashboard.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build & Run (Standalone)

This project is configured for standalone output (no Vercel required).

```bash
# Build for production
npm run build

# Start the standalone server
npm run start:prod
```

The standalone server will be available at `http://localhost:3002`.

## Useful Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start:prod` — Run the standalone production server
- `npm run migrate` — Generate Prisma client and run migrations
- `npm run db:studio` — Open Prisma Studio

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Prisma + SQLite (`better-sqlite3`)
- Next-Auth v5
- Stripe
- Apple Wallet (`passkit-generator`)
- Leaflet Maps
