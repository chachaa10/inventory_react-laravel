import { Head } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Package,
    ShoppingCart,
    TrendingUp,
    TriangleAlert,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { ChartCard } from '@/common/ChartCard';
import { KPICard } from '@/common/KPICard';
import { StatusBadge } from '@/common/StatusBadge';
import type { DashboardData } from '@/types';

const CHART_COLORS: string[] = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
];

function getChartColor(index: number): string {
    return CHART_COLORS[index % CHART_COLORS.length] ?? '#2563eb';
}

export default function Dashboard({
    totalProducts,
    lowStockCount,
    recentOrdersCount,
    totalRevenue,
    stockByCategory,
    monthlyRevenue,
    monthlyOrders,
    ordersByStatus,
    topSellingProducts,
    supplierDistribution,
    stockLevelDistribution,
    stockMovementsTrend,
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

            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Revenue & Orders
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard title="Revenue over Time">
                        {monthlyRevenue.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={monthlyRevenue}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No revenue data yet.
                            </p>
                        )}
                    </ChartCard>

                    <ChartCard title="Orders per Month">
                        {monthlyOrders.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={monthlyOrders}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#2563eb"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        )}
                    </ChartCard>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Distributions
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ChartCard title="Stock by Category">
                        {stockByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={stockByCategory}
                                        dataKey="count"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ payload, percent }) =>
                                            `${payload['category']} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {stockByCategory.map((item, index) => (
                                            <Cell
                                                key={item['category']}
                                                fill={getChartColor(index)}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No products yet.
                            </p>
                        )}
                    </ChartCard>

                    <ChartCard title="Orders by Status">
                        {ordersByStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={ordersByStatus}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        label={({ payload, percent }) =>
                                            `${payload['status']} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {ordersByStatus.map((item, index) => (
                                            <Cell
                                                key={item['status']}
                                                fill={getChartColor(index)}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No orders yet.
                            </p>
                        )}
                    </ChartCard>

                    <ChartCard title="Supplier Distribution">
                        {supplierDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={supplierDistribution}
                                        dataKey="count"
                                        nameKey="supplier"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ payload, percent }) =>
                                            `${payload['supplier']} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {supplierDistribution.map(
                                            (item, index) => (
                                                <Cell
                                                    key={item['supplier']}
                                                    fill={getChartColor(index)}
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No suppliers yet.
                            </p>
                        )}
                    </ChartCard>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Inventory Analysis
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard title="Top Selling Products">
                        {topSellingProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={topSellingProducts}
                                    layout="vertical"
                                    margin={{ left: 100 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        type="number"
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip />
                                    <Bar
                                        dataKey="qty"
                                        fill="#10b981"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No sales data yet.
                            </p>
                        )}
                    </ChartCard>

                    <ChartCard title="Stock Level Distribution">
                        {stockLevelDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stockLevelDistribution}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="range"
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis className="text-muted-foreground" />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No products yet.
                            </p>
                        )}
                    </ChartCard>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Stock Movement Trend
                </h2>
                <ChartCard title="">
                    {stockMovementsTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stockMovementsTrend}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    className="text-muted-foreground"
                                />
                                <YAxis className="text-muted-foreground" />
                                <Tooltip />
                                <Bar
                                    dataKey="in"
                                    fill="#10b981"
                                    radius={[2, 2, 0, 0]}
                                    name="In"
                                />
                                <Bar
                                    dataKey="out"
                                    fill="#ef4444"
                                    radius={[2, 2, 0, 0]}
                                    name="Out"
                                />
                                <Bar
                                    dataKey="adjustment"
                                    fill="#f59e0b"
                                    radius={[2, 2, 0, 0]}
                                    name="Adjustment"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No stock movements yet.
                        </p>
                    )}
                </ChartCard>
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-2">
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
            </div>
        </>
    );
}
