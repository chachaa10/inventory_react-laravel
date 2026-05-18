import { Head } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Package,
    ShoppingCart,
    TrendingUp,
    TriangleAlert,
} from 'lucide-react';

import { KPICard } from '@/common/KPICard';
import { StatusBadge } from '@/common/StatusBadge';

const kpis = [
    { title: 'Total Products', value: 142, icon: Package },
    { title: 'Low Stock Items', value: 8, icon: TriangleAlert },
    { title: 'Recent Orders', value: 24, icon: ShoppingCart },
    { title: 'Total Revenue', value: '$48,290', icon: TrendingUp },
];

const stockByCategory = [
    { category: 'Electronics', count: 45 },
    { category: 'Clothing', count: 32 },
    { category: 'Food & Beverage', count: 28 },
    { category: 'Office Supplies', count: 22 },
    { category: 'Hardware', count: 15 },
];

const recentMovements = [
    {
        id: 1,
        product: 'Wireless Mouse',
        type: 'out',
        qty: 5,
        date: '2 hours ago',
    },
    { id: 2, product: 'USB-C Cable', type: 'in', qty: 50, date: '4 hours ago' },
    {
        id: 3,
        product: 'Desk Lamp',
        type: 'adjustment',
        qty: -2,
        date: '1 day ago',
    },
    { id: 4, product: 'Notebook A5', type: 'out', qty: 20, date: '1 day ago' },
    {
        id: 5,
        product: 'Mechanical Keyboard',
        type: 'in',
        qty: 15,
        date: '2 days ago',
    },
];

const lowStockAlerts = [
    { id: 1, name: 'Wireless Mouse', stock: 3, reorder: 10 },
    { id: 2, name: 'HDMI Cable 2m', stock: 2, reorder: 15 },
    { id: 3, name: 'Monitor Stand', stock: 1, reorder: 5 },
];

const maxCount = Math.max(...stockByCategory.map((c) => c.count));

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-foreground">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your inventory and recent activity.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <KPICard
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                    />
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border p-5">
                    <h2 className="mb-4 text-sm font-semibold text-foreground">
                        Stock by Category
                    </h2>
                    <div className="space-y-3">
                        {stockByCategory.map((item) => (
                            <div key={item.category} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-foreground">
                                        {item.category}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {item.count}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{
                                            width: `${(item.count / maxCount) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border p-5">
                    <h2 className="mb-4 text-sm font-semibold text-foreground">
                        Low Stock Alerts
                    </h2>
                    <div className="space-y-3">
                        {lowStockAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-center justify-between rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20"
                            >
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {alert.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {alert.stock} in stock · reorder at{' '}
                                        {alert.reorder}
                                    </p>
                                </div>
                                <StatusBadge
                                    stockQty={alert.stock}
                                    reorderLevel={alert.reorder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-border p-5">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Recent Stock Movements
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Product
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Type
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Qty
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMovements.map((m) => (
                                <tr
                                    key={m.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/50"
                                >
                                    <td className="h-10 px-4 text-foreground">
                                        {m.product}
                                    </td>
                                    <td className="h-10 px-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                m.type === 'in'
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                                    : m.type === 'out'
                                                      ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                            }`}
                                        >
                                            <ArrowLeftRight className="h-3 w-3" />
                                            {m.type}
                                        </span>
                                    </td>
                                    <td className="h-10 px-4 text-foreground">
                                        {m.qty}
                                    </td>
                                    <td className="h-10 px-4 text-muted-foreground">
                                        {m.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
