import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AlignJustify, Calculator, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Expedientes',
    //     href: '/expedientes',
    //     icon: Layers,
    // },
    // {
    //     title: 'Juzgados',
    //     href: '/juzgados',
    //     icon: Scale,
    // },
    {
        title: 'Materias',
        href: '/materias',
        icon: AlignJustify,
    },
    {
        title: 'Calculadora',
        href: '/calculadora',
        icon: Calculator,
    },
    // {
    //     title: 'Datos Globales',
    //     href: '/global-config',
    //     icon: Settings,
    // },
    // {
    //     title: 'Clientes',
    //     href: '/clients',
    //     icon: Users,
    // },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
