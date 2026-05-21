export type Product = {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock_qty: number;
    reorder_level: number;
    price: number;
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
    is_active: boolean;
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
    product: string;
    type: StockMovementType;
    qty: number;
    reference: string | null;
    user: string;
    date: string;
};

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export type Order = {
    id: number;
    order_number: string;
    customer: string;
    status: OrderStatus;
    total: number;
    items: number;
    date: string;
};

export type LineItem = {
    id: string;
    product_id: string;
    product_name: string;
    qty: number;
    unit_price: number;
};
