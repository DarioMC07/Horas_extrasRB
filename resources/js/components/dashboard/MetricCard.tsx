import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    gradient?: boolean;
}

export function MetricCard({ title, value, subtitle, gradient = false }: MetricCardProps) {
    return (
        <Card className={gradient ? 'bg-gradient-to-br from-wise-green to-wise-dark-green text-white' : 'wise-card'}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-80">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
                {subtitle && <p className="mt-1 text-xs opacity-70">{subtitle}</p>}
            </CardContent>
        </Card>
    );
}
