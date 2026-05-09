import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { LightweightChart } from '@/components/dashboard/LightweightChart';
import { DonutRing } from '@/components/dashboard/DonutRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, XCircle, TrendingUp, ClipboardList } from 'lucide-react';

interface KpiData {
    mis_horas_mes: number;
    mis_pendientes: number;
    mis_rechazadas: number;
}

interface HistorialItem {
    id: number;
    fecha: string;
    cantidad_horas: number;
    motivo: string;
    estado: string;
    badge_class: string;
}

interface ChartData {
    time: string;
    value: number;
    label?: string;
}

interface DistribucionEstado {
    estado: string;
    label: string;
    total: number;
}

interface EmpleadoDashboardProps {
    kpis: KpiData;
    miHistorial: HistorialItem[];
    miTendencia: ChartData[];
    miDistribucionEstado: DistribucionEstado[];
}

const STATUS_COLORS: Record<string, string> = {
    aprobado: '#9fe870',
    rechazado: '#d03238',
    pendiente: '#ffd11a',
};

export default function EmpleadoDashboard() {
    const { kpis, miHistorial, miTendencia, miDistribucionEstado } =
        usePage<any>().props as EmpleadoDashboardProps;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'aprobado': return 'success';
            case 'pendiente': return 'warning';
            case 'rechazado': return 'destructive';
            default: return 'secondary';
        }
    };

    const donutSegments = miDistribucionEstado.map((d) => ({
        label: d.label,
        value: d.total,
        color: STATUS_COLORS[d.estado] || '#868685',
    }));

    return (
        <AppLayout title="Mi Tablero">
            <div className="space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-wise-black sm:text-2xl">Mi Tablero</h1>
                        <p className="text-sm text-wise-gray">Resumen de tus horas extras registradas</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={route('horas-extras.index')}>
                                <ClipboardList size={14} className="mr-1.5" />
                                Mi Historial
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                            <Link href={route('horas-extras.create')}>
                                <Clock size={14} className="mr-1.5" />
                                Registrar Horas
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <KpiCard
                        label="Horas Aprobadas (Mes)"
                        value={`${Number(kpis.mis_horas_mes).toFixed(1)}h`}
                        trend="Autorizadas en el período actual"
                        variant="success"
                        icon={BarChart3}
                        highlight
                    />
                    <KpiCard
                        label="Pendientes"
                        value={kpis.mis_pendientes}
                        trend="En espera de aprobación"
                        variant="warning"
                        icon={Clock}
                    />
                    <KpiCard
                        label="Rechazadas (Mes)"
                        value={kpis.mis_rechazadas}
                        trend="Solicitudes no autorizadas"
                        variant="danger"
                        icon={XCircle}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="wise-card lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-0">
                            <div>
                                <CardTitle className="text-sm font-semibold">Tendencia de Horas Aprobadas</CardTitle>
                                <p className="mt-0.5 text-xs text-wise-gray">Últimos 6 meses</p>
                            </div>
                            <TrendingUp size={16} className="text-wise-green" />
                        </CardHeader>
                        <CardContent>
                            <LightweightChart type="area" data={miTendencia} height={260} />
                        </CardContent>
                    </Card>

                    <Card className="wise-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Estado de Solicitudes</CardTitle>
                            <p className="mt-0.5 text-xs text-wise-gray">Distribución del mes actual</p>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center pt-0">
                            <DonutRing
                                segments={donutSegments}
                                centerLabel="Total"
                                size={160}
                                thickness={20}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card className="wise-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Historial Reciente</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="gap-1 text-wise-gray hover:text-wise-black">
                            <Link href={route('horas-extras.index')}>
                                Ver historial completo
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {miHistorial && miHistorial.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-center">Horas</TableHead>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {miHistorial.map((he) => (
                                        <TableRow key={he.id} className="transition-colors hover:bg-wise-bg/50">
                                            <TableCell className="text-wise-gray">{formatDate(he.fecha)}</TableCell>
                                            <TableCell className="text-center font-semibold tabular-nums">{he.cantidad_horas}h</TableCell>
                                            <TableCell className="max-w-[200px] truncate text-wise-gray">
                                                {he.motivo || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(he.estado)}>
                                                    {he.estado.charAt(0).toUpperCase() + he.estado.slice(1)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-wise-gray">
                                <ClipboardList size={32} className="opacity-30" />
                                <p className="mt-3 text-sm">No tienes horas extras registradas recientemente.</p>
                                <Button asChild size="sm" variant="secondary" className="mt-3">
                                    <Link href={route('horas-extras.create')}>Registrar ahora</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
