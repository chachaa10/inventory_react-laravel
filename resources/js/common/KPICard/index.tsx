import type { LucideIcon } from 'lucide-react';

type KPICardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        direction: 'up' | 'down';
        label: string;
    };
};

export function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
    return (
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                    {title}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <span className="text-2xl font-semibold text-foreground">
                {value}
            </span>
            {trend && (
                <span className="text-xs text-muted-foreground">
                    {trend.label}
                </span>
            )}
        </div>
    );
}
