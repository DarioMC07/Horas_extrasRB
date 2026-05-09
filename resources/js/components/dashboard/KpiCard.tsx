import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, CheckCircle2, AlertTriangle, XCircle, BarChart3, Users, type LucideIcon } from 'lucide-react';

type KpiVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface KpiCardProps {
    label: string;
    value: string | number;
    trend?: string;
    variant?: KpiVariant;
    icon?: LucideIcon;
    highlight?: boolean;
}

const variantStyles: Record<KpiVariant, { value: string; icon: string; bg: string; accent: string }> = {
    default: { value: 'text-wise-black', icon: 'text-wise-green', bg: 'bg-wise-mint', accent: 'bg-wise-green' },
    success: { value: 'text-wise-positive', icon: 'text-wise-positive', bg: 'bg-wise-mint', accent: 'bg-wise-positive' },
    warning: { value: 'text-wise-warm-dark', icon: 'text-wise-warning', bg: 'bg-wise-orange/30', accent: 'bg-wise-warning' },
    danger:  { value: 'text-wise-danger', icon: 'text-wise-danger', bg: 'bg-wise-danger/10', accent: 'bg-wise-danger' },
    info:    { value: 'text-wise-black', icon: 'text-wise-green', bg: 'bg-wise-pastel/40', accent: 'bg-wise-green' },
};

export function KpiCard({ label, value, trend, variant = 'default', icon: Icon, highlight = false }: KpiCardProps) {
    const styles = variantStyles[variant];

    return (
        <Card className={`wise-card relative overflow-hidden transition-shadow hover:shadow-md ${highlight ? 'ring-2 ring-wise-green/30' : ''}`}>
            {highlight && (
                <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-wise-green/10" />
            )}
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-wise-bg">
                {Icon ? (
                    <Icon size={16} className={styles.icon} />
                ) : (
                    <div className={`h-1.5 w-1.5 rounded-full ${styles.accent}`} />
                )}
            </div>
            <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-wise-gray">{label}</p>
                <p className={`mt-1.5 text-3xl font-bold tabular-nums ${styles.value}`}>
                    {value}
                </p>
                {trend && (
                    <p className="mt-1.5 text-xs text-wise-gray">{trend}</p>
                )}
            </CardContent>
        </Card>
    );
}

export function KpiCardSkeleton() {
    return (
        <Card className="wise-card">
            <CardContent className="p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-1.5 h-3 w-28" />
            </CardContent>
        </Card>
    );
}
