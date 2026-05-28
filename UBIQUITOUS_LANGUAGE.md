# Ubiquitous Language

## Catalog

| Term               | Definition                                                     | Aliases to avoid         |
| ------------------ | -------------------------------------------------------------- | ------------------------ |
| **Product**        | A tracked item in inventory with a name, SKU, price, and stock | Item, Article, Good      |
| **Category**       | A named grouping that products belong to                       | Tag, Type, Group         |
| **SKU**            | A unique code that identifies a product                        | Barcode, Part Number     |
| **Stock Quantity** | The current available quantity of a Product                    | On-hand, Inventory count |
| **Reorder Level**  | The stock threshold below which a Low Stock alert fires        | Minimum stock, Trigger   |
| **Unit**           | The measurement unit for a Product (pcs, kg, box, etc.)        | UOM, Measure             |

## Parties

| Term         | Definition                                                     | Aliases to avoid         |
| ------------ | -------------------------------------------------------------- | ------------------------ |
| **Supplier** | A company or individual that provides products to the business | Vendor, Provider, Source |
| **Customer** | A person or company that places an Order (recorded inline)     | Client, Buyer, Account   |

## Inventory

| Term                 | Definition                                                                                  | Aliases to avoid      |
| -------------------- | ------------------------------------------------------------------------------------------- | --------------------- |
| **Stock Movement**   | A recorded change in a Product's stock quantity                                             | Transaction, Log      |
| **Stock Addition**   | A Stock Movement that increases stock (type: `in`)                                          | Stock-in, Receipt     |
| **Stock Reduction**  | A Stock Movement that decreases stock (type: `out`)                                         | Stock-out, Issue      |
| **Stock Adjustment** | A manual Stock Movement that corrects stock without a reference action (type: `adjustment`) | Correction, Write-off |
| **Reference**        | An optional external identifier attached to a Stock Movement (e.g., order number)           | Ref, Doc number       |

## Sales

| Term                | Definition                                                                        | Aliases to avoid        |
| ------------------- | --------------------------------------------------------------------------------- | ----------------------- |
| **Order**           | A request from a Customer to purchase one or more Products                        | Sales Order, Sale       |
| **Order Number**    | A unique identifier for an Order, format: `ORD-{YYYYMMDD}-{XXXX}`                 | Reference, Invoice No.  |
| **Order Item**      | A single line on an Order: a Product, quantity, unit price, and subtotal          | Line Item, Order Line   |
| **Order Total**     | The sum of all Order Item subtotals on an Order                                   | Grand total, Amount     |
| **Pending Order**   | An Order that has been created but not yet processed (status: `pending`)          | Draft, Open order       |
| **Completed Order** | An Order whose items have been fulfilled and stock deducted (status: `completed`) | Fulfilled, Closed order |
| **Cancelled Order** | An Order that was reversed, returning stock to inventory (status: `cancelled`)    | Voided, Reversed order  |

## People & Access

| Term      | Definition                                                                                              | Aliases to avoid    |
| --------- | ------------------------------------------------------------------------------------------------------- | ------------------- |
| **User**  | An authenticated identity in the system                                                                 | Login, Account      |
| **Admin** | A User role with full permissions (create/edit/delete all entities, manage staff)                       | Manager, Supervisor |
| **Staff** | A User role with limited permissions (view, create, update; no delete, no supplier/category management) | Operator, Employee  |

## Relationships

- A **Category** contains zero or more **Products**
- A **Supplier** provides zero or more **Products**
- A **Product** belongs to exactly one **Category** and optionally one **Supplier**
- An **Order** contains one or more **Order Items**
- An **Order Item** references exactly one **Product**
- An **Order** is created by exactly one **User**
- A **Stock Movement** references exactly one **Product** and is recorded by exactly one **User**
- A **Stock Movement** is optionally linked to a parent entity (an **Order** or a **Product**) via a polymorphic reference
- Creating a **Completed Order** generates one **Stock Reduction** per **Order Item**
- Cancelling a **Completed Order** generates one **Stock Addition** per **Order Item**

## Example dialogue

> **Dev:** "When a **Customer** places an **Order**, does it always deduct stock immediately?"
>
> **Domain expert:** "Yes — orders are created as **Completed Orders** immediately and stock is reduced right away. There's no draft or pending stage."
>
> **Dev:** "What if stock is insufficient?"
>
> **Domain expert:** "The system rejects the **Order** with an **Insufficient Stock** error. The **Staff** user must adjust stock first — either by recording a **Stock Addition** (if more arrived) or an **Adjustment** (to correct the count)."
>
> **Dev:** "And cancelling brings the stock back?"
>
> **Domain expert:** "Exactly. Cancelling a **Completed Order** reverses each **Order Item** — it records a **Stock Addition** for each product and sets the **Order** status to **Cancelled**. You cannot cancel a **Cancelled Order** twice — only **Completed Orders** can be cancelled."
>
> **Dev:** "What triggers the low-stock alert?"
>
> **Domain expert:** "After any **Stock Movement**, if the new **Stock Quantity** drops to or below the **Reorder Level**, the system fires a low-stock event. The **Admin** sees it on the dashboard and decides whether to order from the **Supplier**."

## Flagged ambiguities

- **"Item"** is used in the codebase to mean both **Product** (selecting a product) and **Order Item** (a line on an order). Prefer **Product** for catalog items and **Order Item** (or **Line Item** in the UI) for order lines.
- **"Staff"** in the role system refers to the role name, not generic employees. The two roles are `admin` and `staff` — use the term **User** for the identity and qualify by role when needed.
- **"Customer"** exists as a route/controller but has no corresponding model. Customer data is stored inline on the **Order** as `customer_name` and `customer_email`. This should be resolved: either remove the Customer controller or reintroduce a Customer entity if the business need arises.
- **"Pending"** status appears in the `OrderFactory` default and the migration comment but is not defined in the `OrderStatus` enum (which only has `Completed` and `Cancelled`). If a pending/draft state is later introduced, the enum and order lifecycle must be updated consistently.
