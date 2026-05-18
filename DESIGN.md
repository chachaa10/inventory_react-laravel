---
name: Inventory Management System
description: Dual-role inventory dashboard for stock, orders, and catalog management
colors:
    primary: oklch(0.527 0.154 150.069)
    primary-foreground: oklch(0.982 0.018 155.826)
    secondary: oklch(0.967 0.001 286.375)
    secondary-foreground: oklch(0.21 0.006 285.885)
    muted: oklch(0.966 0.005 106.5)
    muted-foreground: oklch(0.58 0.031 107.3)
    accent: oklch(0.966 0.005 106.5)
    accent-foreground: oklch(0.228 0.013 107.4)
    destructive: oklch(0.577 0.245 27.325)
    destructive-foreground: oklch(0.577 0.245 27.325)
    background: oklch(1 0 0)
    foreground: oklch(0.153 0.006 107.1)
    border: oklch(0.93 0.007 106.5)
    input: oklch(0.93 0.007 106.5)
    ring: oklch(0.737 0.021 106.9)
    chart-1: oklch(0.871 0.15 154.449)
    chart-2: oklch(0.723 0.219 149.579)
    chart-3: oklch(0.627 0.194 149.214)
    chart-4: oklch(0.527 0.154 150.069)
    chart-5: oklch(0.448 0.119 151.328)
    sidebar: oklch(0.988 0.003 106.5)
    sidebar-foreground: oklch(0.153 0.006 107.1)
    sidebar-primary: oklch(0.627 0.194 149.214)
    sidebar-primary-foreground: oklch(0.982 0.018 155.826)
    sidebar-accent: oklch(0.966 0.005 106.5)
    sidebar-accent-foreground: oklch(0.228 0.013 107.4)
    sidebar-border: oklch(0.93 0.007 106.5)
    sidebar-ring: oklch(0.737 0.021 106.9)
typography:
    body:
        fontFamily: Inter Variable, ui-sans-serif, system-ui, sans-serif
        fontSize: 0.875rem
        fontWeight: 400
        lineHeight: 1.5
    label:
        fontFamily: Inter Variable, ui-sans-serif, system-ui, sans-serif
        fontSize: 0.8125rem
        fontWeight: 500
        lineHeight: 1.25
        letterSpacing: 0.01em
rounded:
    sm: 0.375rem
    md: 0.5rem
    lg: 0.625rem
    xl: 0.875rem
    xxl: 1.125rem
spacing:
    xs: 0.5rem
    sm: 0.75rem
    md: 1rem
    lg: 1.5rem
    xl: 2rem
components:
    button-primary:
        backgroundColor: oklch(0.627 0.194 149.214)
        textColor: oklch(0.982 0.018 155.826)
        rounded: 0.5rem
        padding: 0.5rem 1rem
        height: 2.5rem
    button-ghost:
        backgroundColor: transparent
        textColor: oklch(0.58 0.031 107.3)
        rounded: 0.5rem
        padding: 0.5rem 1rem
        height: 2.5rem
    input:
        backgroundColor: oklch(1 0 0)
        textColor: oklch(0.153 0.006 107.1)
        rounded: 0.5rem
        borderColor: oklch(0.93 0.007 106.5)
        padding: 0.5rem 0.75rem
        height: 2.5rem
    card:
        backgroundColor: oklch(1 0 0)
        textColor: oklch(0.153 0.006 107.1)
        rounded: 0.625rem
        borderColor: oklch(0.93 0.007 106.5)
        padding: 1.5rem
---

# Design System: Inventory Management System

## 1. Overview

**Creative North Star: "The Ledger"**

A tool that reveals information density on demand. The sidebar provides persistent orientation; the content area is where the work happens — scanning product rows, checking stock levels, recording movements. Every screen prioritizes glanceable data over visual ceremony.

The system rejects SaaS-cream monotony and over-designed admin templates. No decorative gradients, no glassmorphism, no hero-metric clichés. The visual language is restrained and green-tinted — green signals stock health, not brand personality.

**Key Characteristics:**

- Dense and efficient — tool-like, not app-like
- Green accent as a functional signal (stock status), not decoration
- Sidebar-anchored navigation with grouped sections
- Data density over whitespace padding

## 2. Colors: The Green Ledger Palette

A restrained palette anchored by a green primary that doubles as stock-health signaling. All neutrals are tinted toward a warm olive hue (chroma 0.005–0.01 at full lightness) to avoid sterile gray.

### Light Mode

- **Primary Green** (`oklch(0.527 0.154 150.069)`): Buttons, active nav items, interactive elements. Also maps to "In Stock" status.
- **Primary Foreground** (`oklch(0.982 0.018 155.826)`): Text on primary surfaces.
- **Background** (`oklch(1 0 0)`): Page and card backgrounds — not pure white, tinted toward warm olive (chroma 0).
- **Foreground** (`oklch(0.153 0.006 107.1)`): Primary body text.
- **Muted** (`oklch(0.966 0.005 106.5)`) / **Muted Foreground** (`oklch(0.58 0.031 107.3)`): Secondary surfaces and subdued text (secondary actions, metadata, table cells).
- **Border** (`oklch(0.93 0.007 106.5)`): Subtle container borders, table row separators.
- **Destructive** (`oklch(0.577 0.245 27.325)`): Delete buttons, destructive actions, error states.
- **Sidebar** (`oklch(0.988 0.003 106.5)`): Slightly tinted sidebar background distinguishing it from the main content area.
- **Sidebar Primary** (`oklch(0.627 0.194 149.214)`): Active nav item background in sidebar.

### Dark Mode

Dark mode inverts the light palette while preserving the green accent at reduced chroma. Backgrounds shift to warm dark olive (`oklch(0.153 0.006 107.1)` text on surfaces, `oklch(0.228 0.013 107.4)` for elevated surfaces). Primary green deepens to `oklch(0.448 0.119 151.328)`.

### Status Colors

Stock status badges use the following semantic colors:

- **In Stock**: Primary Green (chart-2 range)
- **Low Stock**: Amber (`oklch(0.8 0.15 80)`) — not in the token set; added at usage.
- **Out of Stock**: Destructive red

### Named Rules

**The Functional Accent Rule.** Green is a signal, not a decorative flourish. It appears on interactive elements and stock-status badges. Never use green for purely decorative purposes.

## 3. Typography

**Body Font:** Inter Variable (with fallback to ui-sans-serif, system-ui, sans-serif)

**Character:** Clean, technical, space-efficient. Inter's tall x-height and open counters keep dense data tables readable at small sizes. The variable axis enables precise weight contrast without font swapping.

### Hierarchy

- **Body** (400, 0.875rem / 14px, 1.5 line-height): Page text, table cells, form labels. Max line length 75ch on detail pages.
- **Label** (500, 0.8125rem / 13px, 1.25 line-height, +0.01em letter-spacing): Small headings, sidebar items, status badges, metric labels.
- **Title** (600, 0.9375rem / 15px, 1.4 line-height): Section headings, card titles, sidebar group labels.
- **Headline** (600, 1.25rem / 20px, 1.3 line-height): Page titles, dialog headers, KPI card values.
- **Display** (600, 1.5rem / 24px, 1.2 line-height): Dashboard hero metrics only.

### Named Rules

**The Compact Rule.** Never use line-height greater than 1.5 for body text. Data density is the priority; generous line-height wastes vertical space in tables and lists.

## 4. Elevation

Flat by default. The system uses tonal layering (background color changes, not shadows) to distinguish surfaces. Shadows appear only as a response to interaction state.

### Shadow Vocabulary

- **Dropdown** (`0 4px 6px -1px oklch(0 0 0 / 0.08)`): Dropdown menus, popovers, select options.
- **Dialog** (`0 10px 15px -3px oklch(0 0 0 / 0.08)`): Modal dialogs, sheets.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on elevated interactive containers (dropdowns, modals) that must visually separate from the page.

## 5. Components

### Buttons

- **Shape:** Gently curved edges (0.5rem / 8px radius).
- **Primary:** Green background (`sidebar-primary`), white text, 2.5rem height, 0.5rem 1rem padding. Hover lightens the green.
- **Ghost:** Transparent background, muted foreground text. Hover adds a subtle muted background. Used for secondary actions.
- **Destructive:** Red background (`destructive`), white text. Matches primary button shape.
- **Icon buttons:** 2.5rem square, ghost variant as default.

### Cards / Containers

- **Corner Style:** Standard rounded (0.625rem / 10px radius).
- **Background:** Background color (`oklch(1 0 0)`), matching the page.
- **Shadow Strategy:** None at rest. Cards are differentiated by border and internal spacing.
- **Border:** 1px border-border.
- **Internal Padding:** 1.5rem.
- **Usage:** Dashboard KPI cards only. Lists use table rows, not cards.

### Inputs / Fields

- **Style:** 1px stroke in border color on background surface. 0.5rem 0.75rem padding, 2.5rem height.
- **Focus:** Ring (`2px solid ring color`) replaces stroke on focus.
- **Error:** Destructive red stroke on error state. Red foreground for error message text below.
- **Disabled:** 50% opacity with muted background.

### Navigation (Sidebar)

- **Style:** Collapsible sidebar (icon/collapsed mode supported), background in sidebar color.
- **Typography:** Label weight (500) at 0.8125rem.
- **Active state:** Sidebar-primary background for active nav items. Icon + label.
- **Group labels:** Muted-foreground text, uppercase, small letter-spacing.
- **Mobile:** Sidebar collapses to a sheet overlay.

### DataGrid

- **Style:** Full-width table with minimal chrome. 0.75rem row padding vertically, 1rem horizontally.
- **Header row:** Label-weight text, border-bottom separator.
- **Body rows:** Alternating stripe optional. Hover highlights row.
- **Sort indicator:** Arrow icon on header click.

### Badge (StatusBadge)

- **Shape:** Small pill (full rounded, ~1.25rem height).
- **Variants:** Green dot + "In Stock" / Amber dot + "Low Stock" / Red dot + "Out of Stock".
- **Text:** Label weight, 0.75rem.

### SearchBar

- **Style:** Matches input fields. Can be prepended with a search icon.
- **Behavior:** Debounced 300ms, syncs with Inertia URL query params.
- **Placeholder:** Descriptive ("Search by name or SKU...").

### EmptyState

- **Style:** Centered layout with icon (48px), title (headline weight), description (body), and optional CTA button.
- **Usage:** When a filtered list returns zero results or a module has no data yet.

## 6. Do's and Don'ts

### Do:

- **Do** use green as a functional stock-status signal — not as decoration.
- **Do** keep data tables dense and scrollable with minimal chrome.
- **Do** use Sheets for simple entity CRUD (categories, suppliers, customers).
- **Do** use dedicated pages for complex forms (products, orders).
- **Do** use 75ch max line-width on detail pages for readability.
- **Do** use tonal layering (background shifts) over shadows for surface hierarchy.

### Don't:

- **Don't** use side-stripe borders (border-left/right > 1px as colored accent on cards or items).
- **Don't** use gradient text (`background-clip: text`). Single solid color for all text.
- **Don't** use glassmorphism or decorative blur effects.
- **Don't** use the hero-metric template (big number + small label + gradient accent).
- **Don't** use cards for list items — use table rows.
- **Don't** nest cards.
- **Don't** use modals as a first thought — prefer inline Sheets or dedicated pages.
- **Don't** use em dashes in copy. Use commas, colons, semi-colons, or periods.
- **Don't** add decorative patterns, illustrations, or visual flair to the sidebar or header.
