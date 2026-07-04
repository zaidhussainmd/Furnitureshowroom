# Maison & Co — Product Requirement Document (PRD)

## 1. Problem Statement
High-end furniture businesses in Hyderabad (e.g., in Banjara Hills) operate on a highly tactile and consultative sales model. Traditional e-commerce models with standard carts and checkouts do not fit their operations, as items require customization, space matching, and white-glove delivery coordination. Currently, these businesses lack a premium, dark-mode, editorial-style digital showroom that allows local elite clients to browse their curated collection online and request quotes directly, with instant notification routes to the showroom owners.

## 2. Vision
To build a stunning, production-ready demo showcase ("Maison & Co") that represents a high-end luxury furniture brand in Hyderabad. The site will serve as an editorial catalogue that drives qualified leads via automated WhatsApp and email notifications, while maintaining a completely hidden, authenticated admin dashboard for lead and catalogue management.

## 3. Goals & Success Metrics
- **Aesthetic Excellence**: Create a premium luxury feel with custom gold-accented typography and dark surfaces that wows prospective clients.
- **Conversion Rate**: Facilitate high-value lead submissions through structured enquiry forms.
- **System Speed**: Deliver a frictionless user experience with near-instant client-side filtering.
- **Lighthouse Performance**: Achieve a Mobile score of >= 80 and Desktop score of >= 90.

## 4. Target Users & Personas
- **High-Net-Worth Individuals (HNWIs) / Luxury Homeowners**: Looking for bespoke, artisanal furniture for their villas and luxury apartments in Hyderabad.
- **Interior Designers**: Sourcing elite furniture pieces for their clients' projects.
- **Showroom Owner / Admin**: Needs an efficient, private dashboard to view leads and keep the online catalogue up to date.

## 5. User Stories
- **As a customer**, I want to browse a highly premium catalogue of furniture and apply multiple filters (room, material, price range) simultaneously to find pieces that fit my aesthetic.
- **As a customer**, I want to view detailed specifications, multiple images, and dimensions for a piece of interest.
- **As a customer**, I want to submit a request for a quote for a specific piece and receive an immediate email confirmation with a reference number.
- **As a showroom owner**, I want to receive instant WhatsApp and email notifications as soon as an enquiry is submitted, so that I can call or message the client right away.
- **As a showroom owner**, I want to access a hidden admin panel to view all enquiries, change their status, and manage the items in the catalogue.

## 6. Core Features
- **Editorial Homepage**: Hero showcase, featured collection grid, room category links, craftsmanship story, and general contact entry.
- **Advanced Catalogue**: Fully client-side multi-filter system (room, material, price range) with a custom dual-handle price range slider.
- **Product Detail Pages**: High-quality product galleries, detailed specifications, and customized enquiry forms.
- **Hidden Admin Panel**: Auth-protected `/admin` route for lead tracking (with status updates and CSV export) and CRUD management of the catalogue.
- **Automated Notifications**: Integrations with Twilio (WhatsApp) and Resend (email) to send real-time alerts.

## 7. Out of Scope
- Online payments, cart page, or checkout system.
- Public customer accounts or order history portals.
- Dynamic delivery tracking.

## 8. Functional Requirements
- **FR-001**: Catalogue filters must work by room type, material, and price range simultaneously (all three can be active at once).
- **FR-002**: Filtering must happen client-side (no page reload) with smooth transition.
- **FR-003**: Each furniture item has its own detail page showing multiple images, full specs, materials, dimensions.
- **FR-004**: Enquiry form on each product page allows customer to request a quote — fields: name, phone, email, product name (pre-filled), message, preferred contact method (WhatsApp / Call / Email).
- **FR-005**: All enquiries must save to Supabase with status 'new'.
- **FR-006**: On enquiry submission — trigger WhatsApp notification to owner + email notification to owner + confirmation email to customer.
- **FR-007**: Admin panel is hidden — no public link, no navbar item, no footer link. Only accessible by directly visiting `/admin`.
- **FR-008**: Admin can view all enquiries sorted by newest first, filter by status, mark enquiries as 'contacted' or 'closed'.
- **FR-009**: Admin can add, edit, and delete furniture items from the catalogue.
- **FR-010**: Price range filter must use a dual-handle slider (min and max price).

## 9. Non-Functional Requirements
- **NFR-001 (Performance)**: Lighthouse mobile score >= 80, desktop score >= 90.
- **NFR-002 (Responsiveness)**: Tailored layout styles for Mobile (375px), Tablet (768px), and Desktop (1440px) breakpoints are mandatory.
- **NFR-003 (Resource Optimization)**: All images lazy-loaded except for the home/page hero images.
- **NFR-004 (Visual Stability)**: Zero layout shift (CLS) when applying filters or switching views.
- **NFR-005 (Security)**: The admin panel must be fully protected by Supabase Auth — unauthenticated visits must redirect to `/admin/login`. No public route or component should refer to "/admin".

## 10. Risks & Assumptions
- **Assumption**: The showroom owner will configure Twilio and Resend API keys correctly in their environment.
- **Risk**: Unprotected API routes could be targeted by spam.
  - *Mitigation*: Ensure validation is enforced on client and server sides. Rate limit or check origins if necessary.
- **Risk**: Finding the hidden admin URL.
  - *Mitigation*: Ensure there are zero public links to `/admin`, and the route is strictly gatekept by Supabase Auth middleware.
