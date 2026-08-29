# Junetara Glam · जुनेतारा ग्ल्याम

**Nepal's first integrated beauty ecosystem — one platform from classroom to client.**

Training · Salon & home services · B2C/B2B marketplace · Careers & QR-verified certification · Vendor onboarding

> Web implementation of the *Junetara Glam Comprehensive Master Plan v1.0* (April 2026),
> prepared by **B Polytechnic Institute Pvt. Ltd. (BPI)** — Strategic Consulting Division.

---

## The ecosystem in one app

| Layer | What it does here |
| --- | --- |
| **Discovery** | Cross-vertical search console (courses → services → products → careers), GPS-ready venue cards, live ecosystem ticker |
| **Transaction** | Enrollment engine with installment plans, 3-step booking engine (salon + home), cart/checkout — all through eSewa · Khalti · Fonepay gateway flows |
| **Fulfillment** | Booking confirmations with SMS-reminder messaging, slot-hold logic, order tracking in *My Space* |
| **Talent system** | Internship/job board with applications, verified trainer database, **QR certificate verification** (`JG-2026-0147` works — try it) |
| **Intelligence** | Multi-dimensional ratings, vendor matching weights (proximity 40 / rating 25 / price 20 / availability 10 / response 5) |

State (cart, wishlist, enrollments, bookings, orders, applications, certificates, partner leads)
persists in `localStorage`, so the whole user journey survives a refresh.

## Content baked in from the master plan

- 8 CTEVT-aligned courses across the four standardized tiers (Basic → Master Specialist, NPR 15K–2L)
- 10 services with Nepali names, 6 verified venues (Thamel, Lazimpat, Lakeside…), 6 artists
- USD 1.5–2B market breakdown with segment CAGRs, growth drivers, urban/rural matrix
- Business model: commission table, LTV/CAC 10–27×, break-even model, Year-1 revenue mix
- 90-day MVP roadmap (5 sprints), partner ROI calculator, SDG + Digital Nepal alignment

## Tech stack

React 18 · TypeScript · Vite 6 · Tailwind CSS 4 · date-fns — zero backend required (static SPA).
Type: Fraunces (display) + Mukta (body, Devanagari-capable).
Palette: royal navy `#1a3b8b` / `#2b52e1`, ice `#f4f6fc`, coral `#ff7a68` / `#ea5240`, star gold `#ffb800`.

## Run locally

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
```

Requires Node 20 (`.nvmrc` included).

## Deploy: GitHub → Vercel

**Fastest — one command:**

```bash
bash deploy.sh      # macOS / Linux / Git Bash on Windows
deploy.bat          # Windows Command Prompt
```

The script commits the project, walks you through creating the repo
(pre-filled link: `https://github.com/new?name=junetara-glam`), and pushes it.

**Manual alternative:**

```bash
git init
git add .
git commit -m "feat: Junetara Glam — integrated beauty ecosystem (web MVP)"
git branch -M main
git remote add origin https://github.com/<your-username>/junetara-glam.git
git push -u origin main
```

**Then connect on Vercel** (auto-deploys on every push):

1. [vercel.com](https://vercel.com) → **Add New… → Project** → import the GitHub repo
2. Preset auto-detects **Vite** — build `npm run build`, output `dist` (already pinned in `vercel.json`)
3. Click **Deploy** → live at `junetara-glam.vercel.app`

*Or via CLI:* `npm i -g vercel && vercel --prod`

Then add `junetaraglam.com` / `bto.com.np` under **Settings → Domains**.
No environment variables needed.

## Project map

```
src/
├── App.tsx                  # shell, views, footer, live ticker, error boundary
├── context.tsx              # global store: cart, bookings, enrollments, certs, toasts (persisted)
├── data.ts                  # all master-plan content: courses, services, venues, products, talent
└── components/
    ├── Home.tsx             # discovery console, 5-layer system, market data, impact
    ├── Training.tsx         # course catalog + enrollment flow
    ├── Services.tsx         # salon/home booking engine
    ├── Market.tsx           # B2C + B2B marketplace
    ├── CareersPartner.tsx   # talent board, QR verify, vendor onboarding + ROI calc
    ├── Dashboard.tsx        # My Space — progress, certificates, bookings, orders
    ├── CartDrawer.tsx       # bag + gateway checkout
    ├── Nav.tsx · ui.tsx · Icons.tsx
```

## Credits

Strategy & master plan — **BPI Strategic Consulting**, President: *Heera Bohara Bhandari*
(Dhangadhi-1, Kailali · Sukedhara-4, Kathmandu) · [heerabohara80@gmail.com](mailto:heerabohara80@gmail.com)
