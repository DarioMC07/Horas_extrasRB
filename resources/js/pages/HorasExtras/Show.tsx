import { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { EstadoTimeline } from '@/components/horasextras/EstadoTimeline';
import { RechazoModal } from '@/components/horasextras/RechazoModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface HoraExtraDetail {
    id: number;
    fecha: string;
    cantidad_horas: number;
    hora_inicio: string;
    hora_fin: string;
    tipo_hora: string;
    tipo_hora_label: string;
    estado: string;
    motivo: string;
    centro_costo?: string;
    created_at: string;
    empleado: {
        id: number;
        nombre_completo: string;
        cedula: string;
    };
    historial: Array<{
        estado: string;
        fecha: string;
        usuario?: string;
        comentario?: string;
    }>;
}

export default function HorasExtrasShow() {
    const { auth, horaExtra } = usePage<any>().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [rechazoOpen, setRechazoOpen] = useState(false);

    const he = horaExtra as HoraExtraDetail;

    const getEstadoBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'aprobado':
                return 'success';
            case 'pendiente':
                return 'warning';
            case 'pre-aprobado':
                return 'secondary';
            case 'rechazado':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const canPreAprobar = he.estado === 'pendiente';
    const canAprobar = (he.estado === 'pendiente' || he.estado === 'pre-aprobado') && isAdmin;

    return (
        <AppLayout title={`Solicitud #${he.id}`}>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('horas-extras.index')} className="text-wise-gray hover:text-wise-black">
                        ← Volver
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-wise-black">Solicitud #{he.id}</h1>
                            <Badge variant={getEstadoBadgeVariant(he.estado)}>
                                {he.estado.charAt(0).toUpperCase() + he.estado.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-sm text-wise-gray">
                            Registrada el {formatDate(he.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="wise-card">
                        <CardHeader>
                            <CardTitle>Detalles de la Solicitud</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-wise-gray">Empleado</p>
                                    <p className="font-medium">{he.empleado?.nombre_completo}</p>
                                    <p className="text-xs text-wise-gray">Cédula: {he.empleado?.cedula}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-wise-gray">Fecha</p>
                                    <p className="font-medium">{formatDate(he.fecha)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-wise-gray">Horas</p>
                                    <p className="font-medium">{Number(he.cantidad_horas).toFixed(1)}h</p>
                                </div>
                                <div>
                                    <p className="text-sm text-wise-gray">Tipo</p>
                                    <Badge variant="secondary">{he.tipo_hora_label}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-wise-gray">Horario</p>
                                    <p className="font-medium">{he.hora_inicio} - {he.hora_fin}</p>
                                </div>
                                {he.centro_costo && (
                                    <div>
                                        <p className="text-sm text-wise-gray">Centro de Costo</p>
                                        <p className="font-medium">{he.centro_costo}</p>
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-wise-gray">Motivo</p>
                                <p className="mt-1">{he.motivo}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="wise-card">
                        <CardHeader>
                            <CardTitle>Historial de Cambios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EstadoTimeline events={he.historial || []} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {(canPreAprobar || canAprobar) && (
                        <Card className="wise-card">
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {canPreAprobar && (
                                    <button
                                        type="button"
                                        onClick={() => router.patch(route('horas-extras.estado', he.id), { estado: 'pre-aprobado' })}
                                        className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    >
                                        Pre-aprobar
                                    </button>
                                )}
                                {canAprobar && (
                                    <button
                                        type="button"
                                        onClick={() => router.patch(route('horas-extras.estado', he.id), { estado: 'aprobado' })}
                                        className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors bg-wise-green text-wise-black hover:bg-wise-green/90"
                                    >
                                        Aprobar
                                    </button>
                                )}
                                {(canPreAprobar || canAprobar) && (
                                    <Button onClick={() => setRechazoOpen(true)} variant="destructive" className="w-full">
                                        Rechazar
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <RechazoModal
                        isOpen={rechazoOpen}
                        onClose={() => setRechazoOpen(false)}
                        horaExtraId={he.id}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
