# Product

## Register

product

## Users

Inventory managers and staff handling daily stock operations. Admin users configure the system and manage staff. Staff users execute operational tasks: viewing products, recording stock movements, creating orders. Both roles work through a browser-based dashboard during business hours.

Primary users are detail-oriented and efficiency-driven — they need to find products, check stock, and record movements in seconds, not clicks.

## Product Purpose

An inventory management system that tracks products, stock movements, orders, suppliers, and customers. It gives inventory managers real-time visibility into stock levels, low-stock alerts, order fulfillment, and catalog management. Staff handle daily operations without risking data integrity.

Success looks like: a manager can open the dashboard, see stock health at a glance, drill into a low-stock product, record a movement, and get back to work — all within a single session with no friction.

## Brand Personality

Calm, capable, instrumental. The interface stays out of the way — it's a tool, not a destination. Green conveys stock health and stability. No personality for personality's sake.

## Anti-references

- SaaS cream/blue dashboards that all look the same (HubSpot, Salesforce)
- Over-designed admin templates with decorative gradients, glassmorphism, or busy sidebars
- Consumer-style landing pages or marketing flair inside the app
- "Enterprise" heaviness (too many borders, too much chrome, too many columns)

## Design Principles

- **Efficiency over decoration**: Every element serves a workflow. If it doesn't help the user find or act on data, it doesn't belong.
- **Inventory visible at every level**: From KPI cards to product rows to movement history — stock status is always glanceable.
- **Progressive disclosure for complexity**: Simple entities (categories, suppliers, customers) use inline Sheets. Complex entities (products, orders) get dedicated pages with full form layouts.
- **Safety without friction**: Destructive actions confirm. Staff can't delete. Stock adjustments validate. But confirmation fatigue is avoided — only truly irreversible actions prompt.

## Accessibility & Inclusion

- WCAG 2.1 AA minimum
- Color is never the sole differentiator for status (stock badges use icon + text + color)
- Existing dark mode support via shadcn theme toggle
