import { usePage, Link } from '@inertiajs/react';
import Logo from './Logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';

interface TopbarProps {
    title?: string;
    onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
    const { auth } = usePage().props as any;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Gerente';
            case 'supervisor':
                return 'Supervisor';
            default:
                return 'Empleado';
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-wise-light bg-wise-surface px-4 lg:px-6">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-wise-gray hover:bg-wise-light hover:text-wise-black lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} />
                </button>

                <Logo compact showText={false} className="lg:hidden flex-shrink-0" />

                <div className="min-w-0">
                    <h1 className="text-base sm:text-lg font-semibold text-wise-black truncate">
                        {title}
                    </h1>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-3 rounded-lg p-1.5 sm:p-2 hover:bg-wise-light flex-shrink-0">
                    <div className="hidden text-right lg:block">
                        <div className="text-sm font-medium text-wise-black">{auth?.user?.name}</div>
                        <div className="text-xs text-wise-gray">{getRoleLabel(auth?.user?.role)}</div>
                    </div>
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 bg-wise-green text-wise-black">
                        <AvatarFallback>{getInitials(auth?.user?.name || 'U')}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 lg:hidden">
                        <div className="text-sm font-medium">{auth?.user?.name}</div>
                        <div className="text-xs text-wise-gray">{getRoleLabel(auth?.user?.role)}</div>
                    </div>
                    <DropdownMenuSeparator className="lg:hidden" />
                    <DropdownMenuItem asChild>
                        <Link href={route('profile.edit')}>Editar Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full cursor-pointer text-wise-danger"
                        >
                            Cerrar Sesión
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
