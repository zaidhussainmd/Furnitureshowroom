# Maison & Co — Technical Requirement Document (TRD)

## 1. System Overview
Maison & Co is built as a modern, high-performance web application utilizing the Next.js App Router. It interfaces with Supabase for data persistence and authentication, and handles notifications via Twilio (WhatsApp) and Resend (Email).

## 2. Architecture Overview

```mermaid
graph TD
    %% Public User Flows
    User[Customer Browser] -->|Browse / Home / About / Contact| NextJS[Next.js App Router]
    User -->|Catalogue Page / Filter| ClientFilters[Client-Side Filter State]
    User -->|Submit Quote Request| EnquiryForm[Product Enquiry Form]

    %% Admin User Flows
    Admin[Showroom Owner] -->|Direct URL Entry /admin| AuthCheck{Supabase Auth}
    AuthCheck -->|Authenticated| AdminDash[Admin Dashboard]
    AuthCheck -->|Unauthenticated| LoginRedirect[/admin/login]

    %% NextJS Routes / APIs
    EnquiryForm -->|POST /api/submit-enquiry| DBStore[Supabase Postgres]
    EnquiryForm -->|POST /api/send-notifications| NotifyAPI[Notification Service Router]
    NotifyAPI -->|Send WhatsApp| TwilioAPI[Twilio WhatsApp API]
    NotifyAPI -->|Send Email| ResendAPI[Resend Email API]

    %% Admin Operations
    AdminDash -->|Manage Products| ProductsCRUD[DB Product CRUD]
    AdminDash -->|View & Update Enquiries| EnquiriesCRUD[DB Enquiry Status Update]
```

### Architectural Policy
> [!IMPORTANT]
> The admin panel at /admin is intentionally hidden from all public navigation. There is no link, button, or reference to /admin anywhere in the public-facing site. It is accessed only by directly typing the URL. The route is protected by Supabase Auth — unauthenticated visits redirect to /admin/login.

## 3. Technology Choices
- **Framework**: Next.js 14 (App Router) for Server Component rendering (SEO, speed) combined with interactive Client Components.
- **Styling**: Tailwind CSS for building a highly customized luxury design system without bloating the application bundle.
- **Database**: Supabase Postgres for reliable structured query support, Row Level Security (RLS), and fast connection times.
- **Auth**: Supabase Auth handles user sessions securely.
- **Notifications**: Twilio (WhatsApp Business integration) and Resend (for rich, responsive HTML emails).
- **Icons**: `lucide-react` for clean, lightweight vectors.

## 4. Frontend Requirements
- Dark mode primary palette centered around black (`#0d0d0d`) and deep brown-black (`#1a1612`), with gold highlights (`#c9a84c`).
- Sharp edges on all cards (no rounded corners).
- Layout optimization for desktop (1440px), tablet (768px), and mobile (375px) displays.

## 5. State Management & Filter Logic
To ensure instant, fluid filtering with no layout shifts or loaders:
- Fetch the entire furniture items list once on load.
- Filter the array locally on the client using React state.

### Filter State Interface
```typescript
interface FilterState {
  room: string | null;
  material: string | null;
  priceMin: number;
  priceMax: number;
}
```

## 6. Security Requirements
- **Admin Access Control**: All routes under `/admin/dashboard`, `/admin/enquiries`, and `/admin/catalogue` must run an authentication check. Unauthenticated users are redirected to `/admin/login`.
- **Database Rules**: Enable Row Level Security (RLS) on both `furniture_items` and `enquiries` tables.
  - Public can `SELECT` from `furniture_items`.
  - Public can `INSERT` into `enquiries`.
  - Admin (authenticated users) can read, insert, update, and delete on both tables.
- **Sensitive Key Protection**: Do not expose `SUPABASE_SERVICE_ROLE_KEY` or Twilio/Resend write secrets in the client-side bundle.

## 7. Performance Requirements
- Use Next.js `<Image>` component with specified dimensions, lazy loading, and explicit alt attributes. Only the hero background image on the homepage will use `priority={true}`.
- Optimize fonts using `next/font/google` for Cormorant Garamond and Inter, with `font-display: swap`.
- Limit imports of external modules to prevent large bundle sizes.

## 8. API Strategy
Create standard Next.js route handlers for operations:
1. `POST /api/submit-enquiry`: Saves customer query details and generates a unique ID (e.g., `MC1005`).
2. `POST /api/send-notifications`: Triggers Twilio WhatsApp notification + Resend email notifications.
3. `POST /api/admin/update-enquiry-status`: Allows authenticated admins to update enquiry state (`new`, `contacted`, `closed`).

## 9. Authentication Strategy
Use Supabase Auth. Since this is a demo site with a single admin owner:
- Login via `/admin/login` using email and password.
- No public registrations.
- Redirect successfully logged-in administrators to the dashboard.

## 10. Deployment Strategy
- Deploy the frontend to Vercel.
- Configure all production secrets (.env variables) in the Vercel Dashboard.

## 11. Testing Strategy
- **Manual testing**: Validate layouts at exactly 375px, 768px, and 1440px.
- **Link Check**: Run automated verification or thorough codebase grep tests to guarantee `/admin` is never linked.
- **Workflow verification**: Submit test entries and verify output in Supabase, email, and console notifications.
