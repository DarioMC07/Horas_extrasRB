import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface LogoProps {
    compact?: boolean;
    className?: string;
    showText?: boolean;
}

export default function Logo({ compact = false, className, showText = true }: LogoProps) {
    return (
        <Link href={route('dashboard')} className={cn('inline-flex items-center gap-3 flex-shrink-0', className)}>
            <img
                src="/images/logo_full.png"
                alt="Logo"
                className={cn(
                    'object-contain',
                    compact ? 'h-8 w-auto' : 'h-10 w-auto'
                )}
            />
            {showText && (
                <div>
                    <h1 className="text-lg font-bold text-wise-black leading-tight">Horas Extras</h1>
                    <p className="text-xs text-wise-gray leading-tight">Sistema de gestión</p>
                </div>
            )}
        </Link>
    );
}
