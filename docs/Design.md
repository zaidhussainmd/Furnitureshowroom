# Maison & Co — Design Documentation

This document specifies the typography, layout guidelines, color system, and UI components representing the dark, moody luxury aesthetic of Maison & Co.

## 1. Color Palette

| Token | Hex Value | Role | CSS Variable |
| :--- | :--- | :--- | :--- |
| **Near Black (Background)** | `#0d0d0d` | Main page background | `--color-bg` |
| **Warm Dark Brown-Black** | `#1a1612` | Card and component surfaces | `--color-surface` |
| **Slightly Lighter Surface** | `#242018` | Active states, hover surfaces | `--color-surface-light` |
| **Primary Gold Accent** | `#c9a84c` | Accent borders, main headers, primary gold text | `--color-accent-gold` |
| **Highlight Gold** | `#e8c96a` | Hover text highlight, focus glow effects | `--color-accent-gold-light` |
| **Warm Off-White** | `#f5f0e8` | Primary body text | `--color-text` |
| **Warm Muted Brown-Grey** | `#8a8070` | Muted descriptions, secondary labels | `--color-muted` |
| **Subtle Dark Border** | `#2e2820` | Gridlines, input borders, structural dividers | `--color-border` |

## 2. Typography
- **Headings**: `Cormorant Garamond` (Google Font).
  - Editorial serif font.
  - Sizing: Hero title `text-6xl` to `text-8xl` (96px on large desktop).
  - Letter-spacing: `letter-spacing: 0.3em` or `0.4em`.
  - Transform: Uppercase for primary sections and navigation headers.
- **Body & Controls**: `Inter` (Google Font).
  - High legibility sans-serif.
  - Sizing: `text-sm` (14px) and `text-base` (16px).
  - Transform: Normal or small-caps for utility links.

## 3. Layout Principles
- **Container Limit**: Maximum width of `1440px` (`max-w-7xl`).
- **Whitespace**: Editorial margins (e.g., `py-24`, `gap-16`) to create breathing room.
- **Sharp Edges**: Cards and form inputs must use `rounded-none`. No rounded corners.

## 4. Responsive Strategy

### Mobile (375px)
- **Catalogue Grid**: Single column list.
- **Filters**: Collapsed into a floating/fixed "Filter" button at the top/bottom. Clicking opens a full-screen bottom drawer (`FilterDrawer`) that slides up smoothly.
- **Inputs & Touch Targets**: Minimum height `44px` for interactive nodes, inputs set to at least `16px` font size to prevent automatic iOS zoom.

### Tablet (768px)
- **Catalogue Grid**: Two columns.
- **Filters**: Displayed as a horizontal row of dropdown selectors directly above the product listings.

### Desktop (1024px+)
- **Catalogue Grid**: Three columns.
- **Filters**: Persistent left-side sidebar panel (`FilterSidebar`), `260px` wide.

## 5. Component Inventory
- **HeroSection**: Implements a full-viewport luxury interior showcase with title glow and CTA transitions.
- **FilterSidebar**: Left column panel for Room, Material, and Price range filtering.
- **FilterDrawer**: Bottom overlay sheet for mobile responsive filtering.
- **ProductCard**: Individual furniture preview displaying name, category, price, and hover border highlights.
- **ProductGallery**: Double column detail component containing a main viewport and scrollable thumbnail row.
- **EnquiryForm**: Custom data entry form pre-filled with the active product. Includes contact method selectors.
- **AdminEnquiryTable**: Clean administrative matrix for tracking and sorting incoming quote requests.
- **AdminProductForm**: Data modal for product listing generation and modifications.

## 6. Interaction Guidelines
- **Gold Hover States**: Buttons feature a primary gold border and gold text. On hover, the button fills with primary gold and flips text to near-black with a 300ms transition.
- **Card Hover Borders**: Product card borders are invisible or dark grey (`--color-border`). On hover, they transition to a solid gold accent line.
- **Image Hover Zoom**: Category and product card images scale up by 3% (`scale-103`) on hover inside overflow-hidden parent wrappers.
- **Form Fields**: On focus, fields show a distinct gold border and a subtle golden box-shadow glow.

## 7. Animation Guidelines
- **Hero Text**: Fades in and slides up on mount using standard CSS keyframes.
- **Catalogue Items**: Staggered fade transition on loading and rendering.
- **Filter Results**: Smooth `opacity` fade when active product arrays update.
