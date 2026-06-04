import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    Tags,
    ArrowLeftRight,
    Truck,
    ShoppingCart,
    Users,
} from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { NavMain, NavGroupSection } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const inventoryGroup: NavGroup = {
    label: 'Inventory',
    items: [
        { title: 'Products', href: '/products', icon: Package },
        { title: 'Categories', href: '/categories', icon: Tags },
        {
            title: 'Stock Movements',
            href: '/stock-movements',
            icon: ArrowLeftRight,
        },
    ],
};

const purchasingGroup: NavGroup = {
    label: 'Purchasing',
    items: [{ title: 'Suppliers', href: '/suppliers', icon: Truck }],
};

const salesGroup: NavGroup = {
    label: 'Sales',
    items: [{ title: 'Orders', href: '/orders', icon: ShoppingCart }],
};

const administrationGroup: NavGroup = {
    label: 'Administration',
    items: [{ title: 'Staff Management', href: '/staff', icon: Users }],
};

export function AppSidebar() {
    const userRole = usePage().props.auth.user.role;
    const canManageStaff = userRole === 'superadmin' || userRole === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavGroupSection group={inventoryGroup} />
                <NavGroupSection group={purchasingGroup} />
                <NavGroupSection group={salesGroup} />
                {canManageStaff && (
                    <NavGroupSection group={administrationGroup} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
