import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { LightweightChart, ChartSkeleton } from '@/components/dashboard/LightweightChart';
import { DonutRing } from '@/components/dashboard/DonutRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, Users, Trophy, TrendingUp, ChevronRight } from 'lucide-react';

interface KpiData {
    total_horas_aprobadas: number;
    solicitudes_pendientes: number;
    empleados_activos: number;
}

interface ChartData {
    time: string;
    value: number;
    label?: string;
    color?: string;
}

interface PendingRequest {
    id: number;
    fecha: string;
    cantidad_horas: number;
    tipo_hora_label: string;
    empleado: { nombre_completo: string };
}

interface DistribucionTipo {
    tipo: string;
    label: string;
    total: number;
}

interface AdminDashboardProps {
    kpis: KpiData;
    chartTendencia: ChartData[];
    topEmpleados: Record<string, number>;
    chartHistogram: ChartData[];
    ultimasPendientes: PendingRequest[];
    distribucionPorTipo: DistribucionTipo[];
}

const DONUT_COLORS = ['#9fe870', '#163300', '#ffc091'];

export default function AdminDashboard() {
    const { kpis, chartTendencia, topEmpleados, chartHistogram, ultimasPendientes, distribucionPorTipo } =
        usePage<any>().props as AdminDashboardProps;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const leaderboardEntries = Object.entries(topEmpleados)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);
    const maxValue = leaderboardEntries.length > 0 ? leaderboardEntries[0][1] : 1;

    const donutSegments = distribucionPorTipo.map((d, i) => ({
        label: d.label,
        value: d.total,
        color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-wise-black sm:text-2xl">Panel de Control</h1>
                        <p className="text-sm text-wise-gray">Resumen general de horas extras</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`${route('horas-extras.index')}?estado=pendiente`}>
                                Revisar Pendientes
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                            <Link href={route('horas-extras.index')}>
                                <TrendingUp size={14} className="mr-1.5" />
                                Todas las Solicitudes
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <KpiCard
                        label="Horas Aprobadas (Mes)"
                        value={`${Number(kpis.total_horas_aprobadas).toFixed(1)}h`}
                        trend="Total autorizado en el período actual"
                        variant="success"
                        icon={BarChart3}
                        highlight
                    />
                    <KpiCard
                        label="Solicitudes Pendientes"
                        value={kpis.solicitudes_pendientes}
                        trend="Requieren revisión gerencial"
                        variant="warning"
                        icon={Clock}
                    />
                    <KpiCard
                        label="Empleados Activos"
                        value={kpis.empleados_activos}
                        trend="Personal registrado"
                        icon={Users}
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
                            <LightweightChart type="area" data={chartTendencia} height={260} />
                        </CardContent>
                    </Card>

                    <Card className="wise-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Distribución por Tipo</CardTitle>
                            <p className="mt-0.5 text-xs text-wise-gray">Horas aprobadas este mes</p>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center pt-0">
                            <DonutRing
                                segments={donutSegments}
                                centerLabel="Total Horas"
                                size={170}
                                thickness={20}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="wise-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <Trophy size={16} className="text-wise-warning" />
                                Top Empleados del Mes
                            </CardTitle>
                            <p className="mt-0.5 text-xs text-wise-gray">Más horas aprobadas</p>
                        </CardHeader>
                        <CardContent>
                            {leaderboardEntries.length > 0 ? (
                                <div className="space-y-3">
                                    {leaderboardEntries.map(([name, value], i) => {
                                        const pct = Math.max((value / maxValue) * 100, 4);
                                        return (
                                            <div key={name} className="group">
                                                <div className="mb-1 flex items-center justify-between text-sm">
                                                    <span className="flex items-center gap-2 font-medium text-wise-black truncate mr-2">
                                                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                                                            i === 0 ? 'bg-wise-warning text-wise-black' :
                                                            i === 1 ? 'bg-wise-gray/30 text-wise-gray' :
                                                            i === 2 ? 'bg-wise-orange/50 text-wise-warm-dark' :
                                                            'bg-wise-light text-wise-gray'
                                                        }`}>
                                                            {i + 1}
                                                        </span>
                                                        {name}
                                                    </span>
                                                    <span className="flex-shrink-0 text-xs font-medium text-wise-gray tabular-nums">
                                                        {value.toFixed(1)}h
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-wise-light">
                                                    <div
                                                        className="h-full rounded-full bg-wise-green transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-wise-gray">
                                    <Trophy size={32} className="opacity-30" />
                                    <p className="mt-2 text-sm">Sin datos del período actual</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="wise-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-0">
                            <div>
                                <CardTitle className="text-sm font-semibold">Distribución Semanal</CardTitle>
                                <p className="mt-0.5 text-xs text-wise-gray">Últimas 6 semanas</p>
                            </div>
                            <BarChart3 size={16} className="text-wise-green" />
                        </CardHeader>
                        <CardContent>
                            <LightweightChart type="bar" data={chartHistogram} height={240} />
                        </CardContent>
                    </Card>
                </div>

                <Card className="wise-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold">Últimas Solicitudes Pendientes</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="gap-1 text-wise-gray hover:text-wise-black">
                            <Link href={`${route('horas-extras.index')}?estado=pendiente`}>
                                Ver todas <ChevronRight size={14} />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {ultimasPendientes && ultimasPendientes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Empleado</TableHead>
                                        <TableHead className="text-center">Horas</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ultimasPendientes.map((he) => (
                                        <TableRow key={he.id} className="transition-colors hover:bg-wise-bg/50">
                                            <TableCell className="text-wise-gray">{formatDate(he.fecha)}</TableCell>
                                            <TableCell className="font-medium">{he.empleado?.nombre_completo || 'N/A'}</TableCell>
                                            <TableCell className="text-center font-semibold tabular-nums">{he.cantidad_horas}h</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{he.tipo_hora_label}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={route('horas-extras.show', he.id)}>Revisar</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-wise-gray">
                                <svg className="h-10 w-10 opacity-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <p className="mt-3 text-sm">No hay solicitudes pendientes de aprobación.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
