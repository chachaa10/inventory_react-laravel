import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Box,
    ClipboardCheck,
    Package,
    TrendingUp,
    Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Home({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Shelf" />

            <div className="flex min-h-screen flex-col bg-background">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                            <Box className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                            Shelf
                        </span>
                    </div>
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Button size="sm" type="button" asChild>
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    asChild
                                >
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                {canRegister && (
                                    <Button size="sm" type="button" asChild>
                                        <Link href={register()}>
                                            Get started
                                        </Link>
                                    </Button>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
                    <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-foreground lg:text-5xl">
                                Inventory management
                                <br />
                                <span className="text-primary">
                                    that stays out of your way
                                </span>
                            </h1>
                            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                                Track stock, manage orders, and keep your
                                catalog organized — without the clutter. Shelf
                                is a lean inventory system built for efficiency.
                            </p>
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Button size="lg" type="button" asChild>
                                        <Link href={dashboard()}>
                                            Go to Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="lg" type="button" asChild>
                                            <Link href={register()}>
                                                Get started free
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            type="button"
                                            asChild
                                        >
                                            <Link href={login()}>Log in</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <ShelfIllustration />
                        </div>
                    </section>

                    <section className="border-t border-border py-16">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((f) => (
                                <div key={f.title} className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <f.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            {f.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            {f.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                        <span className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Shelf
                        </span>
                        <nav className="flex items-center gap-4 text-xs text-muted-foreground">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={login()}
                                        className="hover:text-foreground"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="hover:text-foreground"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}

const features = [
    {
        title: 'Real-time stock tracking',
        description:
            'Every movement updates instantly. Know exactly what you have, where it is, and when to reorder.',
        icon: Package,
    },
    {
        title: 'Smart order fulfillment',
        description:
            'Create orders with line items, automatic stock deduction, and one-click cancellation with restoration.',
        icon: ClipboardCheck,
    },
    {
        title: 'Category & supplier management',
        description:
            'Organize products by category and track suppliers — all with inline editing and search.',
        icon: Truck,
    },
    {
        title: 'Dashboard at a glance',
        description:
            'KPI cards, stock-by-category charts, and low-stock alerts on a single screen.',
        icon: BarChart3,
    },
    {
        title: 'Stock movement audit trail',
        description:
            'Every in, out, and adjustment is logged with reference, user, and timestamp.',
        icon: TrendingUp,
    },
    {
        title: 'Role-based access',
        description:
            'Admin and staff roles with granular permissions. Staff handle operations; admins configure the system.',
        icon: Box,
    },
];

function ShelfIllustration() {
    return (
        <svg
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
        >
            {/* Background plane */}
            <rect
                x="40"
                y="50"
                width="420"
                height="300"
                rx="12"
                className="fill-muted/50"
            />

            {/* Left shelf unit */}
            <rect
                x="65"
                y="75"
                width="160"
                height="250"
                rx="4"
                className="fill-muted stroke-border"
                strokeWidth="1.5"
            />

            {/* Left shelf dividers */}
            <line
                x1="65"
                y1="155"
                x2="225"
                y2="155"
                className="stroke-border"
                strokeWidth="1.5"
            />
            <line
                x1="65"
                y1="235"
                x2="225"
                y2="235"
                className="stroke-border"
                strokeWidth="1.5"
            />

            {/* Box A1 */}
            <g className="animate-float">
                <rect
                    x="80"
                    y="90"
                    width="60"
                    height="50"
                    rx="3"
                    className="fill-primary/20 stroke-primary/40"
                    strokeWidth="1.5"
                />
                <rect
                    x="95"
                    y="105"
                    width="30"
                    height="20"
                    rx="2"
                    className="fill-primary/30"
                />
            </g>

            {/* Box A2 */}
            <g className="animate-float" style={{ animationDelay: '1s' }}>
                <rect
                    x="150"
                    y="95"
                    width="55"
                    height="45"
                    rx="3"
                    className="fill-amber-100 stroke-amber-300 dark:fill-amber-950/30 dark:stroke-amber-700"
                    strokeWidth="1.5"
                />
                <text
                    x="177"
                    y="120"
                    textAnchor="middle"
                    className="fill-amber-600 text-[10px] dark:fill-amber-400"
                    fontSize="10"
                >
                    24
                </text>
            </g>

            {/* Box B1 */}
            <rect
                x="80"
                y="170"
                width="55"
                height="50"
                rx="3"
                className="fill-green-100 stroke-green-400 dark:fill-green-950/30 dark:stroke-green-600"
                strokeWidth="1.5"
            />
            <path
                d="M93 197L100 204L112 190"
                className="animate-draw stroke-green-600 dark:stroke-green-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Box B2 */}
            <rect
                x="145"
                y="165"
                width="60"
                height="55"
                rx="3"
                className="fill-primary/15 stroke-primary/30"
                strokeWidth="1.5"
            />
            <rect
                x="158"
                y="178"
                width="34"
                height="8"
                rx="2"
                className="fill-primary/40"
            />
            <rect
                x="158"
                y="192"
                width="28"
                height="6"
                rx="2"
                className="fill-primary/30"
            />
            <rect
                x="158"
                y="204"
                width="22"
                height="6"
                rx="2"
                className="fill-primary/20"
            />

            {/* Bottom shelf boxes */}
            <g className="animate-pulse-soft">
                <rect
                    x="80"
                    y="250"
                    width="130"
                    height="55"
                    rx="3"
                    className="fill-blue-100 stroke-blue-300 dark:fill-blue-950/30 dark:stroke-blue-700"
                    strokeWidth="1.5"
                />
                <text
                    x="145"
                    y="280"
                    textAnchor="middle"
                    className="fill-blue-600 text-[11px] dark:fill-blue-400"
                    fontSize="11"
                >
                    REORDER
                </text>
            </g>

            {/* Right shelf unit */}
            <rect
                x="275"
                y="75"
                width="160"
                height="250"
                rx="4"
                className="fill-muted stroke-border"
                strokeWidth="1.5"
            />

            {/* Right shelf dividers */}
            <line
                x1="275"
                y1="155"
                x2="435"
                y2="155"
                className="stroke-border"
                strokeWidth="1.5"
            />
            <line
                x1="275"
                y1="235"
                x2="435"
                y2="235"
                className="stroke-border"
                strokeWidth="1.5"
            />

            {/* Top right box */}
            <rect
                x="290"
                y="88"
                width="130"
                height="55"
                rx="3"
                className="fill-primary/10 stroke-primary/25"
                strokeWidth="1.5"
            />
            <rect
                x="305"
                y="100"
                width="100"
                height="30"
                rx="2"
                className="fill-primary/20"
            />
            <line
                x1="315"
                y1="110"
                x2="395"
                y2="110"
                className="stroke-primary/40"
                strokeWidth="1.5"
            />
            <line
                x1="315"
                y1="120"
                x2="375"
                y2="120"
                className="stroke-primary/30"
                strokeWidth="1.5"
            />

            {/* Middle right - clipboard */}
            <rect
                x="300"
                y="170"
                width="110"
                height="55"
                rx="3"
                className="fill-white stroke-border dark:fill-neutral-800 dark:stroke-neutral-600"
                strokeWidth="1.5"
            />
            <rect
                x="340"
                y="170"
                width="30"
                height="8"
                rx="2"
                className="fill-primary"
            />
            <rect
                x="315"
                y="188"
                width="80"
                height="3"
                rx="1.5"
                className="animate-fade-in fill-muted-foreground/30"
                style={{ animationDelay: '0.2s' }}
            />
            <rect
                x="315"
                y="198"
                width="65"
                height="3"
                rx="1.5"
                className="animate-fade-in fill-muted-foreground/30"
                style={{ animationDelay: '0.4s' }}
            />
            <rect
                x="315"
                y="208"
                width="72"
                height="3"
                rx="1.5"
                className="animate-fade-in fill-muted-foreground/30"
                style={{ animationDelay: '0.6s' }}
            />

            {/* Bottom right boxes */}
            <rect
                x="290"
                y="250"
                width="55"
                height="55"
                rx="3"
                className="fill-green-100 stroke-green-400 dark:fill-green-950/30 dark:stroke-green-600"
                strokeWidth="1.5"
            />
            <path
                d="M305 280 L312 287 L325 273"
                className="animate-draw stroke-green-600 dark:stroke-green-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            <g className="animate-wiggle">
                <rect
                    x="355"
                    y="250"
                    width="55"
                    height="55"
                    rx="3"
                    className="fill-red-100 stroke-red-300 dark:fill-red-950/30 dark:stroke-red-700"
                    strokeWidth="1.5"
                />
                <line
                    x1="368"
                    y1="265"
                    x2="397"
                    y2="294"
                    className="stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    x1="397"
                    y1="265"
                    x2="368"
                    y2="294"
                    className="stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>

            {/* Chart on top */}
            <rect
                x="280"
                y="25"
                width="140"
                height="38"
                rx="6"
                className="fill-background stroke-border"
                strokeWidth="1"
            />
            <rect
                x="295"
                y="35"
                width="16"
                height="18"
                rx="2"
                className="animate-bar-grow fill-primary/40"
                style={{ animationDelay: '0s' }}
            />
            <rect
                x="318"
                y="30"
                width="16"
                height="23"
                rx="2"
                className="animate-bar-grow fill-primary/60"
                style={{ animationDelay: '0.15s' }}
            />
            <rect
                x="341"
                y="38"
                width="16"
                height="15"
                rx="2"
                className="animate-bar-grow fill-primary/30"
                style={{ animationDelay: '0.3s' }}
            />
            <rect
                x="364"
                y="33"
                width="16"
                height="20"
                rx="2"
                className="animate-bar-grow fill-primary/50"
                style={{ animationDelay: '0.45s' }}
            />
            <rect
                x="387"
                y="36"
                width="16"
                height="17"
                rx="2"
                className="animate-bar-grow fill-primary/20"
                style={{ animationDelay: '0.6s' }}
            />
        </svg>
    );
}
