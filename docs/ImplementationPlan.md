# Maison & Co — Implementation Plan

This implementation plan details the phases, tasks, risks, and verification procedures required for building the luxury furniture site.

## 1. Project Management Task Board

| Task ID | Phase / Description | Priority | Dependency | Complexity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-001** | **Phase 1**: Create API keys setup guide `API_KEYS_GUIDE.md` | P0 | None | Low | Pending |
| **TSK-002** | **Phase 2**: Scaffold database tables and seed 20 items in Supabase | P0 | TSK-001 | Medium | Pending |
| **TSK-003** | **Phase 2**: Enable Row Level Security (RLS) policies on Postgres tables | P0 | TSK-002 | Medium | Pending |
| **TSK-004** | **Phase 3**: Scaffold Next.js 14 project, install dependencies | P0 | TSK-003 | Medium | Pending |
| **TSK-005** | **Phase 3**: Configure fonts, styling variables, folder structures | P0 | TSK-004 | Low | Pending |
| **TSK-006** | **Phase 4**: Build global `Navbar.tsx` and `Footer.tsx` (confirm NO admin link) | P0 | TSK-005 | Low | Pending |
| **TSK-007** | **Phase 5**: Build Landing Homepage (`/app/page.tsx`) with Featured products | P0 | TSK-006 | Medium | Pending |
| **TSK-008** | **Phase 6**: Build catalogue route and client-side multi-filter interface | P0 | TSK-007 | High | Pending |
| **TSK-009** | **Phase 6**: Create custom JS+CSS dual-handle price range slider control | P0 | TSK-008 | Medium | Pending |
| **TSK-010** | **Phase 7**: Build slug product detail route (`/catalogue/[slug]`) & product gallery | P0 | TSK-008 | Medium | Pending |
| **TSK-011** | **Phase 7**: Integrate `EnquiryForm.tsx` (product pre-fill, validation, submit API) | P0 | TSK-010 | High | Pending |
| **TSK-012** | **Phase 8**: Build Static Editorial `/about` Story page | P1 | TSK-006 | Low | Pending |
| **TSK-013** | **Phase 9**: Build Contact page (`/contact`) with Maps and general enquiry form | P1 | TSK-006 | Medium | Pending |
| **TSK-014** | **Phase 10**: Build email (Resend) and WhatsApp (Twilio) notification services | P0 | TSK-011, TSK-013 | High | Pending |
| **TSK-015** | **Phase 11**: Build auth protected admin login (`/admin/login`) | P0 | TSK-005 | Medium | Pending |
| **TSK-016** | **Phase 11**: Create admin dashboard with statistics summaries | P0 | TSK-015 | Medium | Pending |
| **TSK-017** | **Phase 11**: Create admin enquiries tracker with state changes and CSV export | P0 | TSK-016 | High | Pending |
| **TSK-018** | **Phase 11**: Create catalogue management table with modal form CRUD options | P0 | TSK-016 | High | Pending |
| **TSK-019** | **Phase 12**: QA check: Grep codebase to verify "/admin" navigation references are ZERO | P0 | TSK-018 | Low | Pending |
| **TSK-020** | **Phase 12**: QA check: Perform visual validation at 375px, 768px, and 1440px breakpoints | P0 | TSK-006 to TSK-018 | Medium | Pending |
| **TSK-021** | **Phase 12**: Performance audit (Next.js Image tags, lazy loading, Google Fonts) | P0 | TSK-020 | Medium | Pending |
| **TSK-022** | **Phase 13**: Final functionality test, local dev review and confirmation check | P0 | All | Medium | Pending |

## 2. Risk Mitigation

### Risk 1: Filter Performance Lag
- **Description**: As the catalogue grows, filtering or search requests might stutter if they hit databases continuously.
- **Mitigation**: Fetch all active items into the client-side state once on page mount. Perform local array mutations and renders instantaneously.

### Risk 2: Admin URL Discovery
- **Description**: Users discovering the custom dashboard endpoint and gaining access to sales leads.
- **Mitigation**: Maintain absolute separation. Do not place any visible buttons, references, or text indicators pointing to `/admin` in the user bundle. Enforce rigid server-side redirect routines in Next.js middleware and React auth hooks checking user session tokens.

## 3. Verification Plan

### Automated Checks
- Codebase grep searching commands to isolate exposure of security role keys or admin routing path variables.
- Next.js development build and compile testing command (`npm run build`).

### Manual QA Checklist
- **Three-Breakpoint Responsive Testing**:
  - **375px (Mobile)**: Drawer slides up smoothly on filter select, no horizontal layout overflow, tap targets are minimum 44px, and inputs feature minimum 16px font sizes.
  - **768px (Tablet)**: Verify the filter collapses to a top horizontal select dropdown row, and products arrange into a clean 2-column grid.
  - **1440px (Desktop)**: Check the 3-column product matrix alongside the left-anchored filter panel.
- **Security Check**:
  - Test visiting `/admin` in private/incognito mode to guarantee immediate redirection to `/admin/login` occurs.
- **Notification Verification**:
  - Trigger form submits to ensure webhook responses map successfully into logs, sending out customer confirmation notifications and admin alerts.
