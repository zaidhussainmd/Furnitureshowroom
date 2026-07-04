# Maison & Co — Master Project Tracker

## Project Overview
- **Project Name**: Maison & Co — Luxury Furniture Website Demo
- **Status**: Planning Phase
- **Overall Progress**: 100%
- **Target OS**: macOS (Development)
- **Local Dev URL**: `http://localhost:3000`

---

## Phase Status Summary

- [x] **Phase 0: Mandatory Project Planning & Documentation** (Complete)
- [x] **Phase 1: API Keys Documentation** (Complete)
- [x] **Phase 2: Supabase Setup** (Complete)
- [x] **Phase 3: Project Setup** (Complete)
- [x] **Phase 4: Navbar and Footer** (Complete)
- [x] **Phase 5: Home Page** (Complete)
- [x] **Phase 6: Catalogue Page + Filters** (Complete)
- [x] **Phase 7: Product Detail Page** (Complete)
- [x] **Phase 8: About Page** (Complete)
- [x] **Phase 9: Contact Page** (Complete)
- [x] **Phase 10: Notifications System** (Complete)
- [x] **Phase 11: Hidden Admin Panel** (Complete)
- [x] **Phase 12: Responsive & Performance Optimization** (Complete)
- [x] **Phase 13: Final Checks** (Complete)

---

## Detailed Task Checklist

### Phase 0 — Mandatory Project Planning & Documentation
- [x] Create `maison-and-co/` folder structure
- [x] Create `docs/PRD.md`
- [x] Create `docs/TRD.md`
- [x] Create `docs/UserFlows.md`
- [x] Create `docs/Design.md`
- [x] Create `docs/Schema.md`
- [x] Create `docs/ImplementationPlan.md`
- [x] Create `docs/AgentRules.md`
- [x] Create `TRACKER.md`
- [x] Review documentation alignment (FilterState interface, breakpoints, admin hidden details)
- [x] Obtain planning approval

### Phase 1 — API Keys Documentation
- [x] Create `maison-and-co/API_KEYS_GUIDE.md` with required variables and line numbers
- [x] Confirm file is in place and excluded from production git tracking

### Phase 2 — Supabase Setup
- [x] Create database tables `furniture_items` and `enquiries` in Supabase Postgres
- [x] Seed 20 items in `furniture_items` across 5 categories
- [x] Mark 4 items as featured
- [x] Enable Row Level Security (RLS) on both tables and set policy permissions

### Phase 3 — Project Setup
- [x] Scaffold Next.js 14 App Router project inside `maison-and-co/`
- [x] Install dependencies (`tailwindcss`, `lucide-react`, `@supabase/supabase-js`, `resend`, `twilio`)
- [x] Configure typography (Cormorant Garamond + Inter)
- [x] Build `globals.css` with luxury dark/gold color palette
- [x] Create `.env.local` config file

### Phase 4 — Navbar and Footer
- [x] Implement `Navbar.tsx` (sticky blur, Cormorant Garamond title, small-caps links, mobile menu)
- [x] Implement `Footer.tsx` (Banjara Hills address, socials, no admin references)
- [x] Run codebase checks to verify zero occurrences of `/admin` in Navbar or Footer

### Phase 5 — Home Page
- [x] Implement `/app/page.tsx`
- [x] Hero section with glass overlay and slow fade animation
- [x] Featured Collection section (fetching 4 featured items)
- [x] Category cards section
- [x] About Strip and Enquiry CTA

### Phase 6 — Catalogue Page + Filters
- [x] Implement `/app/catalogue/page.tsx`
- [x] Persistent left sidebar for Desktop (1024px+)
- [x] Collapsing horizontal dropdown bar for Tablet (768px)
- [x] Floating mobile button sliding up a full-screen drawer at 375px
- [x] Custom CSS+JS dual-handle price range slider
- [x] Client-side state filtering & dynamic count renders
- [x] Build `ProductCard.tsx` with gold border transition and image scale effects

### Phase 7 — Product Detail Page
- [x] Implement `/app/catalogue/[slug]/page.tsx` slug routing details
- [x] Build dynamic page resolver and 404 page fallback
- [x] Implement `ProductGallery.tsx` thumbnail switcher
- [x] Build specifications layout section
- [x] Create `EnquiryForm.tsx` (with validation, pre-filled values, status triggers)

### Phase 8 — About Page
- [x] Implement `/app/about/page.tsx`
- [x] Create story sections, values cards, and showroom timing table

### Phase 9 — Contact Page
- [x] Implement `/app/contact/page.tsx`
- [x] Place Banjara Hills showroom details, WhatsApp/Instagram CTAs, maps frame, and general enquiry form

### Phase 10 — Notifications System
- [x] Create `/lib/notifications.ts` utility file
- [x] Create route handler `/api/send-notifications`
- [x] Configure Twilio WhatsApp formatting templates
- [x] Create Resend HTML layouts (admin copy and customer copy)

### Phase 11 — Hidden Admin Panel
- [x] Create `/admin/login` page with Supabase authentication
- [x] Add route redirect handling in `/admin`
- [x] Create dashboard home `/admin/dashboard` showing enquiry statistics
- [x] Create enquiries list page `/admin/enquiries` with status update logic and CSV exporter
- [x] Create catalog edit page `/admin/catalogue` with product CRUD operations
- [x] Run codebase checks to confirm absolute zero links to admin portal from public components

### Phase 12 — Responsive & Performance Optimization
- [x] Test layout at 375px (no overflows, slide drawer works, touch targets >= 44px, inputs >= 16px)
- [x] Test layout at 768px (2-col grid, horizontal navigation selectors)
- [x] Test layout at 1440px (3-col grid, sidebar layout)
- [x] Optimize images: replace all `<img />` tags with Next.js `<Image />`
- [x] Verify Lighthouse scores (Mobile >= 80, Desktop >= 90)
- [x] Audit meta tags and SEO dynamic page headers

### Phase 13 — Final Checks
- [x] Verify environment file rules and git exclusions
- [x] Test all system features (filtering, submissions, email delivery, admin portal actions)
- [x] Verify build compiles cleanly with zero errors or service role key leaks
- [x] Finalize documentation logs and verify `localhost:3000` execution

---

## Change Log
- **2026-07-04**: Created initial planning documentation folder, PRD, TRD, UserFlows, Design, Schema, ImplementationPlan, AgentRules, and Master Tracker (Phase 0 in progress).
