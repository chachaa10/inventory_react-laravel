import type { ReactNode } from 'react';

type ChartCardProps = {
    title: string;
    children: ReactNode;
    className?: string;
};

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
    return (
        <div
            className={`animate-fade-in-up rounded-xl border border-border bg-background p-5 ${className}`}
        >
            <h3 className="mb-4 text-sm font-semibold text-foreground">
                {title}
            </h3>
            {children}
        </div>
    );
}
