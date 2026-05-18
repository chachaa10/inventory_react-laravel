import { Link, usePage } from '@inertiajs/react';
import { Box } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { home, login, register } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <Link href={home()} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                        <Box className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                        Shelf
                    </span>
                </Link>
                <nav className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={login()}>Log in</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href={register()}>Get started</Link>
                    </Button>
                </nav>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-1 px-6">
                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:py-12">
                    <div className="hidden flex-col justify-between lg:flex">
                        <div className="flex flex-1 items-center justify-center">
                            <AuthIllustration />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Inventory management that stays out of your way.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12 lg:py-0">
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <div className="flex flex-col items-start gap-1.5 text-left sm:items-center sm:text-center">
                                <h1 className="text-xl font-semibold text-foreground">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-border">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <span className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Shelf
                    </span>
                    <nav className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link href={login()} className="hover:text-foreground">
                            Log in
                        </Link>
                        <Link
                            href={register()}
                            className="hover:text-foreground"
                        >
                            Register
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

function AuthIllustration() {
    return (
        <svg
            viewBox="0 0 320 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
        >
            <rect
                x="50"
                y="30"
                width="220"
                height="200"
                rx="6"
                className="fill-muted stroke-border"
                strokeWidth="1.5"
            />
            <line
                x1="50"
                y1="95"
                x2="270"
                y2="95"
                className="stroke-border"
                strokeWidth="1.5"
            />
            <line
                x1="50"
                y1="160"
                x2="270"
                y2="160"
                className="stroke-border"
                strokeWidth="1.5"
            />
            <g className="animate-float">
                <rect
                    x="70"
                    y="45"
                    width="55"
                    height="38"
                    rx="3"
                    className="fill-primary/20 stroke-primary/40"
                    strokeWidth="1.5"
                />
                <rect
                    x="85"
                    y="58"
                    width="25"
                    height="12"
                    rx="2"
                    className="fill-primary/30"
                />
            </g>
            <rect
                x="140"
                y="48"
                width="50"
                height="35"
                rx="3"
                className="fill-green-100 stroke-green-400 dark:fill-green-950/30 dark:stroke-green-600"
                strokeWidth="1.5"
            />
            <path
                d="M152 68L158 74L168 62"
                className="animate-draw stroke-green-600 dark:stroke-green-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <g className="animate-float" style={{ animationDelay: '0.8s' }}>
                <rect
                    x="205"
                    y="50"
                    width="45"
                    height="33"
                    rx="3"
                    className="fill-amber-100 stroke-amber-300 dark:fill-amber-950/30 dark:stroke-amber-700"
                    strokeWidth="1.5"
                />
            </g>
            <rect
                x="70"
                y="110"
                width="85"
                height="38"
                rx="3"
                className="fill-primary/10 stroke-primary/25"
                strokeWidth="1.5"
            />
            <rect
                x="80"
                y="120"
                width="65"
                height="18"
                rx="2"
                className="fill-primary/20"
            />
            <line
                x1="88"
                y1="127"
                x2="137"
                y2="127"
                className="stroke-primary/40"
                strokeWidth="1.5"
            />
            <g className="animate-pulse-soft">
                <rect
                    x="170"
                    y="108"
                    width="80"
                    height="40"
                    rx="3"
                    className="fill-blue-100 stroke-blue-300 dark:fill-blue-950/30 dark:stroke-blue-700"
                    strokeWidth="1.5"
                />
                <text
                    x="210"
                    y="133"
                    textAnchor="middle"
                    className="fill-blue-600 text-[10px] dark:fill-blue-400"
                    fontSize="10"
                >
                    STOCK
                </text>
            </g>
            <rect
                x="70"
                y="175"
                width="60"
                height="40"
                rx="3"
                className="fill-green-100 stroke-green-400 dark:fill-green-950/30 dark:stroke-green-600"
                strokeWidth="1.5"
            />
            <path
                d="M85 198L92 205L105 191"
                className="animate-draw stroke-green-600 dark:stroke-green-400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <g className="animate-wiggle">
                <rect
                    x="145"
                    y="175"
                    width="55"
                    height="40"
                    rx="3"
                    className="fill-red-100 stroke-red-300 dark:fill-red-950/30 dark:stroke-red-700"
                    strokeWidth="1.5"
                />
                <line
                    x1="158"
                    y1="188"
                    x2="187"
                    y2="202"
                    className="stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    x1="187"
                    y1="188"
                    x2="158"
                    y2="202"
                    className="stroke-red-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </g>
            <rect
                x="215"
                y="178"
                width="40"
                height="37"
                rx="3"
                className="fill-primary/15 stroke-primary/30"
                strokeWidth="1.5"
            />
        </svg>
    );
}
