import { Link, usePage } from '@inertiajs/react';
import Logo from './Logo';
import { Grid, Clock, Users, Calendar, BarChart, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const currentRoute = usePage().url;

    const isActive = (href: string) => {
        if (href === route('dashboard') && currentRoute === '/dashboard') return true;
        if (href !== route('dashboard') && currentRoute.startsWith(href)) return true;
        return false;
    };

    const mainNav = [
        { name: 'Dashboard', href: route('dashboard'), icon: Grid },
        { name: 'Horas Extras', href: route('horas-extras.index'), icon: Clock },
    ];

    const adminNav = [
        { name: 'Empleados', href: route('empleados.index'), icon: Users },
        { name: 'Turnos', href: route('turnos.index'), icon: Calendar },
        { name: 'Reportes', href: route('reportes.index'), icon: BarChart },
        { name: 'Usuarios', href: route('usuarios.index'), icon: Settings },
    ];

    const linkClass = (href: string) =>
        cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive(href)
                ? 'bg-wise-mint text-wise-green'
                : 'text-wise-black hover:bg-wise-mint hover:text-wise-green'
        );

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform bg-wise-surface shadow-sm transition-transform duration-200',
                    'lg:static lg:inset-y-auto lg:left-auto lg:z-auto lg:translate-x-0 lg:shadow-none',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col border-r border-wise-light">
                    <div className="flex items-center justify-between p-4">
                        <Logo className="flex-shrink-0" />
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-wise-gray hover:bg-wise-light hover:text-wise-black lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-6 overflow-y-auto p-4">
                        <div className="space-y-1">
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-wise-gray">
                                Principal
                            </p>
                            {mainNav.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.name} href={item.href} className={linkClass(item.href)}>
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {isAdmin && (
                            <div className="space-y-1">
                                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-wise-gray">
                                    Administración
                                </p>
                                {adminNav.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link key={item.name} href={item.href} className={linkClass(item.href)}>
                                            <Icon size={20} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </nav>

                    <div className="border-t border-wise-light p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wise-green text-xs font-bold text-wise-black">
                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-wise-black">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-wise-gray">
                                    {auth?.user?.role === 'admin'
                                        ? 'Gerente'
                                        : auth?.user?.role === 'supervisor'
                                            ? 'Supervisor'
                                            : 'Empleado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
