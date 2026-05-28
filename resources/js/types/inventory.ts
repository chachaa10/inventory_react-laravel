export type Product = {
    id: number;
    name: string;
    sku: string;
    description: string | null;
    price: number;
    cost: number | null;
    unit: string;
    stock_qty: number;
    reorder_level: number;
    is_active: boolean;
    category_id: number;
    supplier_id: number | null;
    category: { id: number; name: string } | null;
    supplier: { id: number; name: string } | null;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export type ProductFilters = {
    search: string;
    category_id: string;
    stock_status: string;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
};

export type Supplier = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    products_count: number;
};

export type Customer = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    is_active: boolean;
};

export type StockMovementType = 'in' | 'out' | 'adjustment';

export type StockMovement = {
    id: number;
    product_name: string | null;
    product: { id: number; name: string } | null;
    type: StockMovementType;
    qty: number;
    before_qty: number;
    after_qty: number;
    reference: string | null;
    notes: string | null;
    user: { id: number; name: string };
    created_at: string;
};

export type ProductOption = {
    id: number;
    name: string;
    price: number;
    stock_qty: number;
    reorder_level: number;
};

export type OrderStatus = 'completed' | 'cancelled';

export type Order = {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string | null;
    status: OrderStatus;
    total: number;
    notes: string | null;
    created_at: string;
    user: { id: number; name: string };
    items_count: number;
    items?: Array<{
        id: number;
        product_id: number;
        qty: number;
        unit_price: number;
        subtotal: number;
        product: { id: number; name: string } | null;
    }>;
};

export type OrderFilters = {
    search: string;
    status: string;
};

export type LineItem = {
    id: string;
    product_id: string;
    product_name: string;
    qty: number;
    unit_price: number;
};
