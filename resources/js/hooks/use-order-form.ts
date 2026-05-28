import { useCallback, useMemo, useState } from 'react';

type ProductOption = {
    id: number;
    name: string;
    stock_qty: number;
    reorder_level: number;
    price: number;
};

export type LineItemEntry = {
    id: string;
    product_id: number | '';
    product_name: string;
    qty: number;
    unit_price: number;
};

function createEmptyLineItem(): LineItemEntry {
    return {
        id: String(Date.now()),
        product_id: '',
        product_name: '',
        qty: 1,
        unit_price: 0,
    };
}

export function useOrderForm(products: ProductOption[]) {
    const [lineItems, setLineItems] = useState<LineItemEntry[]>([
        createEmptyLineItem(),
    ]);

    const addLine = useCallback(() => {
        setLineItems((prev) => [...prev, createEmptyLineItem()]);
    }, []);

    const removeLine = useCallback((id: string) => {
        setLineItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const selectProduct = useCallback(
        (lineId: string, productId: number) => {
            const product = products.find((p) => p.id === productId);

            if (!product) {
                return;
            }

            setLineItems((prev) =>
                prev.map((item) =>
                    item.id === lineId
                        ? {
                              ...item,
                              product_id: product.id,
                              product_name: product.name,
                              unit_price: product.price,
                          }
                        : item,
                ),
            );
        },
        [products],
    );

    const updateQty = useCallback((lineId: string, qty: number) => {
        setLineItems((prev) =>
            prev.map((item) =>
                item.id === lineId ? { ...item, qty: Math.max(1, qty) } : item,
            ),
        );
    }, []);

    const total = useMemo(
        () =>
            lineItems.reduce(
                (sum, item) => sum + item.qty * item.unit_price,
                0,
            ),
        [lineItems],
    );

    const serializeItems = useCallback((): string => {
        return JSON.stringify(
            lineItems
                .filter((item) => item.product_id !== '')
                .map((item) => ({
                    product_id: item.product_id,
                    qty: item.qty,
                })),
        );
    }, [lineItems]);

    const hasValidItems = useMemo(
        () =>
            lineItems.length > 0 &&
            lineItems.every((item) => item.product_id !== ''),
        [lineItems],
    );

    return {
        lineItems,
        addLine,
        removeLine,
        selectProduct,
        updateQty,
        total,
        serializeItems,
        hasValidItems,
    };
}
