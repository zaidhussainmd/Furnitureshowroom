# Maison & Co — User Flow Documentation

This document maps out user interactions across the platform using Mermaid diagrams.

## 1. Customer Browse Flow
This flow tracks the customer journey from the homepage, through browsing and filtering the catalogue, to product detail and quote enquiry submission.

```mermaid
graph TD
    Home[Home Page] -->|Click Explore Collection| Cat[Catalogue Page]
    Cat -->|Select Room / Material / Adjust Price| Filter[Apply Client-Side Filters]
    Filter -->|List Updated Instantly| Cat
    Cat -->|Click View Details / Card| Detail[Product Detail Page]
    Detail -->|Fill out Request a Quote Form| Submit{Submit Enquiry}
    Submit -->|Valid Form Inputs| PostAPI[POST /api/submit-enquiry]
    PostAPI -->|Save to DB & Trigger Notifications| Success[Show Success State & Ref MC####]
```

## 2. Admin Flow
Showroom owner enters the administration system via direct URL entry.

```mermaid
graph TD
    Direct[Direct Access to /admin] --> AuthCheck{Is Admin Authenticated?}
    AuthCheck -->|No| Login[Show Login Form /admin/login]
    Login -->|Enter Correct Credentials| Dash[Redirect to Admin Dashboard]
    AuthCheck -->|Yes| Dash
    
    Dash -->|Click Enquiries| Enquiries[Enquiries Dashboard]
    Enquiries -->|Click Row| Details[Expand Enquiry Details]
    Details -->|Update Status Dropdown| SaveStatus[Save to DB & Refresh]
    Enquiries -->|Click Export| CSV[Export Enquiries to CSV]

    Dash -->|Click Catalogue| ManageCat[Catalogue Management]
    ManageCat -->|Click Add New Item| Modal[Open Add Form Modal]
    ManageCat -->|Click Edit| EditModal[Open Edit Modal with Prefilled Data]
    ManageCat -->|Click Delete| ConfirmDelete{Confirm Delete?}
    ConfirmDelete -->|Yes| RemoveDB[Delete from DB]
```

## 3. Error Flow: Enquiry Form Validation Fails
Tracks the customer error correction flow on the product detail page.

```mermaid
graph TD
    Detail[Product Detail Page] -->|Click Submit Enquiry| Validate{Client-Side Validation}
    Validate -->|Phone number not 10 digits OR Required fields empty| ShowError[Highlight Input Fields in Red/Gold + Show Validation Message]
    ShowError -->|User Corrects Input| Validate
    Validate -->|Valid Inputs| PostDB[Send POST Request]
    PostDB -->|Server Error / Database Timeout| ServerErr[Show 'Submission failed. Please try again later.']
```

## 4. Error Flow: Unauthenticated Admin Redirect
Ensures protected admin routes are secure.

```mermaid
graph TD
    AdminPath[Access /admin/dashboard or /admin/enquiries] --> Middleware{Supabase Session Check}
    Middleware -->|Session Null| Redirect[Redirect to /admin/login]
    Middleware -->|Session Valid| Display[Render Admin Route Content]
```

## 5. Edge Case: Empty Filter Results
Handles the case when a customer filters items too strictly.

```mermaid
graph TD
    Filter[User Adjusts Filters] --> Apply[Apply Filters Client-Side]
    Apply -->|Zero Items Match State| ShowEmpty[Display Empty State Card]
    ShowEmpty -->|Shows 'No pieces match your selection'| CTA[Display 'Clear Filters' Button]
    CTA -->|Click Clear| Reset[Reset FilterState to Defaults]
    Reset -->|Instantly Show All 20 items| Grid[Render Catalogue Grid]
```
