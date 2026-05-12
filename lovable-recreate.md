# grabthebeans — Full Project Blueprint for Lovable Recreation

> **IMPORTANT:** This document is designed to be fed into Lovable so the entire UI/UX and architecture can be recreated faithfully. We have a custom logo file (`grabthebeans-logo.png`) that we will provide alongside this prompt. **DO NOT generate a placeholder logo.** Use our provided logo everywhere the logo is referenced.

---

## 1. End Goal of the Application

**grabthebeans** is a coffee-shop loyalty web application. The mission is simple:

- **For customers:** Walk into a coffee shop, scan a QR code with their iPhone camera (no app install needed), and collect virtual "beans." Beans accumulate on an Apple Wallet pass. Once they hit the shop's reward threshold, they get a free coffee.
- **For coffee shop owners:** Register their shop, get a web dashboard to print/ display a QR code, approve bean requests from customers in one click, track loyal customers, buy bean packs or subscribe for recurring beans, and set their own reward threshold.
- **Core value:** A lightweight, Apple Wallet-native loyalty system for independent cafés.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via `better-sqlite3` |
| ORM | Prisma 7 |
| Auth | Custom JWT-based session (cookie `isar-session`) using `jose` + `bcryptjs` |
| Payments | Stripe (optional — demo mode works without it) |
| Wallet | Apple Wallet PassKit (`passkit-generator`), with graceful JSON demo fallback |
| Maps | Leaflet + `react-leaflet` |
| QR Codes | `qrcode` package |
| Icons | `lucide-react` (standard) + inline emoji icons (custom to our design) |

---

## 3. Design System & Visual Identity

### Brand Colors (CSS custom properties)

```css
:root {
  --background: #fdf6ee;
  --foreground: #3b1a08;
  --coffee-50: #fdf6ee;
  --coffee-100: #f5e6d0;
  --coffee-200: #e8c9a0;
  --coffee-300: #d4a56a;
  --coffee-400: #c08040;
  --coffee-500: #a0622a;
  --coffee-600: #7d4a1e;
  --coffee-700: #5c3316;
  --coffee-800: #3b1f0d;
  --coffee-900: #1e0d05;
}
```

### Custom Utility Classes

```css
.coffee-gradient {
  background: linear-gradient(135deg, #5c3316 0%, #a0622a 50%, #d4a56a 100%);
}

.bean-card {
  background: white;
  border: 2px solid #e8c9a0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(92, 51, 22, 0.12);
}
```

### Typography
- **Body font:** `Arial, Helvetica, sans-serif`
- **Base background:** `#fdf6ee` (warm cream)
- **Base text color:** `#3b1a08` (dark coffee)

### UI Language
- We use **emoji icons inline** for visual delight (e.g., `☕`, `🫘`, `📊`, `✅`, `👥`, `📅`, `⚙️`, `🍎`) rather than purely monochrome icon sets.
- Forms use rounded-lg inputs with a `border-2 border-amber-200` default that turns `border-amber-500` on focus.
- Buttons are rounded-xl or rounded-full, depending on context.

---

## 4. Pages, Routes & UI Details

### 4.1 Landing Page (`/`)

A long single-page layout with warm coffee tones.

**Navigation Bar (sticky top, bg `#5c3316`, text white):**
- Left: logo image + "grabthebeans" wordmark.
- Right links: "How it works", "Find shops", "Shop Login", and a "Register Shop" pill button (bg-amber-400, text `#3b1a08`, rounded-full).

**Hero Section (`.coffee-gradient`, white text, py-24):**
- Large centered logo image above headline.
- Headline: "Collect Beans.<br/><span class='text-amber-200'>Earn Free Coffee.</span>"
- Subline: "grabthebeans is the loyalty app for coffee shops. Scan a QR code, collect beans, and your rewards live right in your Apple Wallet."
- Two CTA buttons (stacked on mobile, side-by-side on desktop):
  1. "🫘 How it works" — amber pill button.
  2. "Register your shop + 50 free beans" — transparent white-bordered pill.

**Stats Bar (bg `#5c3316`, 3-column grid):**
- "50" / "Free beans on signup"
- "🍎" / "Apple Wallet powered"
- "QR" / "Instant scan & collect"

**How It Works Section (id=`how-it works`):**
- Section title + subline.
- 3-column card grid (`.bean-card`) on desktop:
  1. Step 1 — "📱 Scan the QR" — "Use your iPhone camera to scan the grabthebeans QR code at your favourite coffee shop. No app needed."
  2. Step 2 — "☕ Show your code" — "A unique coffee-themed code appears in your Apple Wallet card. Show it to the barista. They approve your bean in seconds."
  3. Step 3 — "🎁 Earn rewards" — "Beans stack up in your Wallet card. Reach the shop threshold and claim your free coffee or discount!"

**For Shop Owners Section (bg `#f5e6d0`):**
- Two-column layout:
  - Left: checklist of features with `✓` checkmarks.
  - Right: Subscription preview card (`.bean-card`) showing "Starter" and "Pro" plans stacked, with a "Popular" badge on Pro.

**Map Section (id=`map`):**
- Title: "🗺 Find grabthebeans Shops"
- Subline: "Discover which coffee shops accept grabthebeans right now"
- Embedded Leaflet map (450px height, rounded-2xl, shadow, amber border).

**Sign-up CTA Section (`.coffee-gradient`):**
- Title: "Sign up & get 50 free beans"
- Subline + large amber CTA button.

**Footer (bg `#3b1f0d`, text amber-200):**
- Centered wordmark + tagline.
- Links: Shop Login, Register, Scan QR.

---

### 4.2 Shop Login (`/auth/login`)

- Full-screen centered card over `#fdf6ee` background.
- Top: logo image + "grabthebeans" + "Coffee shop login".
- `.bean-card` containing:
  - Error banner (red-50) if login fails.
  - Email input, Password input.
  - "Sign in ☕" button (bg `#5c3316`, white text, rounded-lg).
  - Link to Register.

---

### 4.3 Shop Registration (`/auth/register`)

- Full-screen centered card over `#fdf6ee` background.
- Top: logo image + "grabthebeans" + "Register your coffee shop".
- `.bean-card` containing:
  - Promotional banner inside: "🎉 Get 50 free beans when you sign up!"
  - Inputs: Shop name *, Email *, Password * (min 6), Shop address (optional).
  - "Create account + get 50 beans ☕" button.
  - Link to Login.

---

### 4.4 Customer Scan / Collect (`/scan?shop=SHOP_ID`)

- Full-screen centered card over `#fdf6ee`.
- Top: small logo.

**Step 1 — Form inside `.bean-card`:**
- Heading: "Collect your bean!" with large ☕ emoji.
- Optional name & email inputs.
- "🫘 Request my bean" rounded-full button.
- Error banner if invalid/expired.

**Step 2 — Result:**
- Large status emoji: ✅ or ⏳.
- H1: "Bean requested!" / "Already pending!"
- **Wallet Card Preview** (critical visual element): a dark gradient card `.coffee-gradient` with white text inside showing:
  - grabthebeans label + shop name.
  - Progress bar (bg-amber-900/50, filled amber-400).
  - "X / Y" beans and "% to free coffee".
  - Unique code block (font-mono, bg-amber-900/40, rounded-xl).
- Barista code card (`.bean-card`): "Show this code to the barista:" with the unique code in large font-mono.
- "Add to Apple Wallet" button (black bg, rounded-2xl, with 🍎 icon).
- Demo-mode note text.

---

### 4.5 Dashboard Layout (`/dashboard/*`)

**Global dashboard shell — CRITICAL:**
- Full-screen flex layout, bg `#fdf6ee`.
- **Fixed Sidebar (w-64, bg `#5c3316`, text white):**
  - Top: logo + "grabthebeans" + shop name + shop email.
  - Bean balance chip (bg-amber-800): large number in amber-300 + "beans balance" label.
  - Nav items with emoji icons:
    - 📊 Overview (`/dashboard`)
    - ✅ Approvals (`/dashboard/approvals`)
    - 👥 Customers (`/dashboard/customers`)
    - 🫘 Buy Beans (`/dashboard/beans`)
    - 📅 Subscriptions (`/dashboard/subscriptions`)
    - ⚙️ Settings (`/dashboard/settings`)
  - Active nav item gets bg `#7d4a1e` and font-semibold.
  - Bottom: "Sign out →" button.
- **Main Content Area:** `ml-64`, padded with `p-8`.

---

### 4.6 Dashboard Overview (`/dashboard`)

This is the default landing after login.

- Greeting: "Good morning, [Shop Name] ☕"

**Three stat cards (`.bean-card`, grid cols-3):**
1. Beans balance (🫘, big number, "Buy more →" link).
2. Pending approvals count (✅, big number, "Review now →" link if > 0).
3. Loyal customers count (👥, big number).

**Two-column grid below:**
- **QR Code Card:** "Your Shop QR Code" + description. Shows generated QR image (200px, rounded-xl, amber border) + URL text underneath.
- **Pending Approvals Card:** "Pending Approvals" with "View all" link. Lists up to 3 pending items. Each item shows the unique code, customer name/device, and two action buttons:
  - "✓ Approve" (green-600, rounded-lg).
  - "✗ Reject" (red-100 bg, red text, rounded-lg).

**Recent Customer Activity (conditional):**
- Table inside `.bean-card`: Customer name | Beans | Progress bar (w-24 amber bar) | Code.

---

### 4.7 Dashboard — Approvals (`/dashboard/approvals`)

- Title: "Bean Approvals ✅"
- **Toast notifications** (fixed top-right, green/red).
- List of pending approval cards (`.bean-card`).
- Each card:
  - Left: a `bg-amber-100` rounded-2xl square with the unique code.
  - Middle: customer name, "Requesting X bean(s)", timestamp.
  - Right: "✓ Approve bean" (green-600) + "✗ Reject" (red-50 outline).
- Disabled states during processing.
- Empty state: "All caught up! 🎉"

---

### 4.8 Dashboard — Buy Beans (`/dashboard/beans`)

- Title: "Buy Beans 🫘"
- Toast notifications.
- **Current balance row** (`.bean-card`, flex): icon + big number + label.
- **4-column grid of bean packs** (`.bean-card`, hover:border-amber-400):
  - Espresso Pack — 10 beans — €5
  - Cappuccino Pack — 50 beans — €20
  - Barista Pack — 100 beans — €35
  - Roaster Pack — 250 beans — €75
  - Each has a "Buy now" / "Add (demo)" button at the bottom.
- **Info banner** (bg-amber-50) about demo mode vs Stripe.

---

### 4.9 Dashboard — Customers (`/dashboard/customers`)

- Title: "Customers 👥"
- Toast notifications.
- List of customer cards (`.bean-card`).
- Each card:
  - Avatar circle (bg-amber-100, first letter).
  - Name + unique code + "X / Y beans" + progress bar + percent.
  - Right: number input (1–50) + "🫘 Gift beans" button.
- Empty state: "No customers yet ☕"

---

### 4.10 Dashboard — Subscriptions (`/dashboard/subscriptions`)

- Title: "Subscriptions 📅"
- Toast notifications.
- **2-column grid of plan cards** (max-w-3xl):
  - **Starter:** ☕, 50 beans/day, €50/mo, checklist of features.
  - **Pro:** 🫘, 100 beans/day, €100/mo, "Most Popular" floating badge above the card.
- Popular card uses darker border and shadow.
- Subscribe buttons: popular card gets solid dark button; starter gets outline button.
- Info banner about Stripe setup.

---

### 4.11 Dashboard — Settings (`/dashboard/settings`)

- Title: "Settings ⚙️"
- Toast notifications.
- Form inside stacked `.bean-card` sections:
  1. **Shop details:** name, description textarea, address, lat/lng inputs (2-col grid).
  2. **Reward configuration:**
     - Range slider (min 5, max 50) for reward threshold.
     - Live-updating amber badge showing the number.
     - Explanatory text: "Customers need X beans to earn a free coffee..."
- Full-width "Save settings ✓" button at the bottom.

---

## 5. Reusable Components

### 5.1 `bean-card`
This is the foundational card style used everywhere on dashboard pages and some landing page sections. NOT a React component; it's a CSS utility class. Make sure all equivalent card elements in Lovable use:
- `background: white`
- `border: 2px solid #e8c9a0`
- `border-radius: 16px`
- `box-shadow: 0 4px 24px rgba(92, 51, 22, 0.12)`

### 5.2 `ShopsMapWrapper` (`/src/components/ShopsMapWrapper.tsx`)
- SSR-safe dynamic import wrapper around `ShopsMap`.

### 5.3 `ShopsMap` (`/src/components/ShopsMap.tsx`)
- Client-only Leaflet map.
- Default center: `[48.1374, 11.5755]` (Munich).
- Default zoom: 13.
- Uses OpenStreetMap tiles.
- Fetches shops from `/api/shops/map`.
- Markers show popup with shop name, address, description, and reward threshold.

---

## 6. Backend & API Endpoints

All API routes live under `src/app/api` as Next.js 16 Route Handlers.

### Auth & Session
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/shop/register` | Create shop, hash password with bcrypt, set cookie session, grant 50 free beans. |
| POST | `/api/shop/login` | Verify credentials, set JWT cookie (`isar-session`, 7 days). |
| POST | `/api/shop/logout` | Clear session cookie. |
| GET | `/api/shop/me` | Fetch current shop profile. |
| PATCH | `/api/shop/me` | Update shop name, address, lat, lng, rewardThreshold, description. |

### Shop Operations
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/shop/qr` | Generate a branded QR code (dark `#5c3316`, light `#fdf6ee`, 300px) linking to `/scan?shop=SHOP_ID`. |
| GET | `/api/shop/customers` | List wallet cards + customers for this shop. |
| POST | `/api/shop/beans` | Gift beans from shop balance to a specific customer’s wallet card. |
| PUT | `/api/shop/beans` | Add beans to the shop’s own balance (demo purchase). |

### Customer / Approval Flow
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/approvals/request` | Customer scans QR → creates or finds customer by deviceId, finds/creates wallet card for shop+customer, checks duplicate pending requests, creates a `BeanApproval` in `pending` status. |
| GET | `/api/approvals/pending` | List pending approvals for the authenticated shop. |
| POST | `/api/approvals/approve` | Approve or reject a pending approval. On approve: deduct shop beans, increment wallet card beans, mark approval as approved (all in Prisma transaction). |

### Public / Wallet
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/shops/map` | Return all shops with lat/lng for the public map. |
| GET | `/api/wallet/pass` | Generate Apple Wallet `.pkpass` file if certs are configured; otherwise return demo JSON. |

### Subscriptions & Payments
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/subscriptions/create` | If Stripe is configured, creates a Checkout Session and returns redirect URL. Otherwise creates a `Subscription` record directly (demo mode). |
| POST | `/api/stripe/webhook` | Handles Stripe subscription webhooks (not fully detailed in source). |

---

## 7. Database Schema (Prisma → SQLite)

```prisma
model Shop {
  id              String    @id @default(cuid())
  name            String
  address         String?
  lat             Float?
  lng             Float?
  email           String    @unique
  passwordHash    String
  logoUrl         String?
  beansBalance    Int       @default(0)
  rewardThreshold Int       @default(10)
  description     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  approvals       BeanApproval[]
  subscriptions   Subscription[]
  walletCards     WalletCard[]
}

model Customer {
  id          String   @id @default(cuid())
  name        String?
  email       String?  @unique
  phone       String?
  deviceId    String?  @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  walletCards WalletCard[]
  approvals   BeanApproval[]
}

model WalletCard {
  id              String   @id @default(cuid())
  serialNumber    String   @unique @default(cuid())
  authToken       String   @default(cuid())
  beansCount      Int      @default(0)
  uniqueCode      String   @unique
  passTypeId      String   @default("pass.com.isarbeans.loyalty")
  updatedAt       DateTime @updatedAt
  createdAt       DateTime @default(now())
  shopId          String
  shop            Shop     @relation(fields: [shopId], references: [id])
  customerId      String
  customer        Customer @relation(fields: [customerId], references: [id])
  @@unique([shopId, customerId])
}

model BeanApproval {
  id          String   @id @default(cuid())
  status      String   @default("pending")
  beansAmount Int      @default(1)
  uniqueCode  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  shopId      String
  shop        Shop     @relation(fields: [shopId], references: [id])
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
}

model Subscription {
  id          String   @id @default(cuid())
  plan        String
  beansPerDay Int
  priceEur    Int
  status      String   @default("active")
  stripeSubId String?
  startDate   DateTime @default(now())
  endDate     DateTime?
  createdAt   DateTime @default(now())
  shopId      String
  shop        Shop     @relation(fields: [shopId], references: [id])
}
```

---

## 8. Integrations & Add-ons

### 8.1 Apple Wallet / PassKit
- Generates `PKPass` files via `passkit-generator` when Apple certificates are provided via environment variables.
- Graceful fallback: outputs a `.json` file named `isarbeans-pass-demo.json` so dev/demo users can inspect the pass structure.
- Pass design (dark coffee gradient theme):
  - `backgroundColor: rgb(92,51,23)`
  - `foregroundColor: rgb(255,222,173)`
  - `labelColor: rgb(255,200,120)`
  - Fields: Beans Collected, Coffee Shop, Progress %, Unique Code.
  - Barcode: QR code of the unique code.
- Unique codes are generated from coffee-themed words (e.g., `espresso-latte-4821`).

### 8.2 Stripe
- Optional. If `STRIPE_SECRET_KEY` and price IDs are missing, the app works in demo mode.
- Supports subscription checkout sessions for "Starter" and "Pro" plans.
- Webhook endpoint handles successful subscription events.

### 8.3 Leaflet Map
- Public map showing registered shops.
- Shown on landing page and used in settings for lat/lng entry.

---

## 9. Assets & Logos

We have a **custom logo** at:
- **Path in project:** `public/grabthebeans-logo.png`
- **Usages:**
  - Navbar (h-8 or h-12 depending on page).
  - Hero section (h-24).
  - Auth pages top center (h-12).
  - Scan page top center (h-8).
  - Dashboard sidebar (h-7).
  - Favicon / Apple touch icon.
  - OpenGraph image.

> **When recreating in Lovable, use our provided `grabthebeans-logo.png` file.** Do not generate or use a different logo.

---

## 10. Key UX Behaviors for Lovable to Preserve

1. **Warm coffee aesthetic everywhere.** No cold grays; always lean toward amber, cream, and deep brown.
2. **Emoji accents are intentional.** They add personality. Do not strip them for icon libraries unless explicitly asked.
3. **QR code is central to the loop.** The shop dashboard must prominently show the shop’s QR code.
4. **Apple Wallet card preview** on the scan result page is a core visual — it shows customers exactly what they get.
5. **Progress bars** appear in:
   - Scan result wallet preview.
   - Dashboard recent customers table.
   - Dashboard customers page.
   - Use `bg-amber-100` track + `bg-amber-500` fill + rounded-full.
6. **Loading states** use simple text like "Loading... ☕"
7. **Empty states** use friendly emoji and copy (e.g., "All caught up! 🎉", "No customers yet ☕").
8. **Toast notifications** are fixed top-right, rounded-xl, colored green (success) or red (error).
9. **All forms** have the same input style: `border-2 border-amber-200 rounded-lg px-4 py-3` with `focus:border-amber-500`.
10. **Rounded aesthetic:** Cards are rounded-2xl (`16px`), buttons are rounded-xl or rounded-full. No sharp corners.

---

## 11. Deployment Context

- Next.js is configured for **standalone** output (self-contained, no Vercel dependency).
- The production start command runs the standalone build on port `3002` by default.
- SQLite file path is controlled via `DATABASE_URL`.

---

## 12. Summary for Lovable Prompt

> Recreate **grabthebeans**, a coffee shop loyalty app. Use the provided `grabthebeans-logo.png` as the logo everywhere. The design is warm coffee-themed: cream backgrounds (`#fdf6ee`), dark brown text (`#3b1a08`), amber accents, and a custom `.coffee-gradient` (135deg from `#5c3316` to `#a0622a` to `#d4a56a`). Build a sticky landing page with hero, how-it-works cards, subscription preview, and an embedded Leaflet map. Build auth pages (login/register) with centered cards. Build a shop dashboard with a fixed dark sidebar (bg `#5c3316`) containing navigation, bean balance chip, and sign-out. The main dashboard area has: overview with stats + QR code + pending approvals + recent customers table; approvals list with approve/reject actions; buy-beans pack grid; customers list with gifting; subscription cards (Starter & Pro); and settings with reward threshold slider. Use `.bean-card` styling (white, amber border, rounded-2xl, soft shadow) for all dashboard cards. Include emoji icons inline throughout. The customer-facing scan flow shows a wallet card preview and an "Add to Apple Wallet" button.
