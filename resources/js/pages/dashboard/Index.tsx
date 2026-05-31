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
import type { DashboardData } from '@/types';

export default function Dashboard({
    totalProducts,
    lowStockCount,
    recentOrdersCount,
    totalRevenue,
    stockByCategory,
    recentMovements,
    lowStockAlerts,
}: DashboardData) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="mb-8">
                <h1 className="text-xl font-semibold text-foreground">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your inventory and recent activity.
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '0ms' }}
                >
                    <KPICard
                        title="Total Products"
                        value={totalProducts}
                        icon={Package}
                    />
                </div>
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '80ms' }}
                >
                    <KPICard
                        title="Low Stock Items"
                        value={lowStockCount}
                        icon={TriangleAlert}
                    />
                </div>
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '160ms' }}
                >
                    <KPICard
                        title="Recent Orders"
                        value={recentOrdersCount}
                        icon={ShoppingCart}
                    />
                </div>
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '240ms' }}
                >
                    <KPICard
                        title="Total Revenue"
                        value={totalRevenue}
                        icon={TrendingUp}
                    />
                </div>
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <div
                    className="animate-fade-in-up rounded-xl border border-border bg-background p-5"
                    style={{ animationDelay: '320ms' }}
                >
                    <h2 className="mb-4 text-sm font-semibold text-foreground">
                        Stock by Category
                    </h2>
                    {stockByCategory.length > 0 ? (
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
                                            className="h-full rounded-full bg-primary transition-all duration-500 ease-out-quart"
                                            style={{
                                                width: `${(item.count / Math.max(...stockByCategory.map((c) => c.count))) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No products yet.
                        </p>
                    )}
                </div>

                <div
                    className="animate-fade-in-up rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/30 dark:bg-amber-950/10"
                    style={{ animationDelay: '400ms' }}
                >
                    <h2 className="mb-4 text-sm font-semibold text-foreground">
                        Low Stock Alerts
                    </h2>
                    {lowStockAlerts.length > 0 ? (
                        <div className="space-y-2">
                            {lowStockAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-center justify-between rounded-lg bg-background p-3 shadow-sm"
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
                    ) : (
                        <div className="flex items-center gap-3 rounded-lg bg-background p-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <Package className="h-4 w-4" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                All products are well-stocked.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="animate-fade-in-up rounded-xl border border-border bg-background"
                style={{ animationDelay: '480ms' }}
            >
                <div className="border-b border-border px-5 py-4">
                    <h2 className="text-sm font-semibold text-foreground">
                        Recent Stock Movements
                    </h2>
                </div>
                {recentMovements.length > 0 ? (
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
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.type === 'in' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : m.type === 'out' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'}`}
                                            >
                                                <ArrowLeftRight className="h-3 w-3" />
                                                {m.type}
                                            </span>
                                        </td>
                                        <td className="h-10 px-4 text-foreground">
                                            {m.qty}
                                        </td>
                                        <td className="h-10 px-4 text-muted-foreground">
                                            {new Date(
                                                m.date,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-5">
                        <p className="text-sm text-muted-foreground">
                            No stock movements yet.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
