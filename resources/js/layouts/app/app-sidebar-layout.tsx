import { usePage } from '@inertiajs/react';

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { EMPTY_BREADCRUMBS } from '@/types/defaults';

export default function AppSidebarLayout({
    children,
    breadcrumbs = EMPTY_BREADCRUMBS,
}: AppLayoutProps) {
    const { component } = usePage();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div
                    key={component}
                    className="animate-page-enter px-6 pt-6 pb-8"
                >
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
