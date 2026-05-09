import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface HoraExtra {
    id: number;
    fecha: string;
    cantidad_horas: number;
    tipo_hora: string;
    tipo_hora_label: string;
    estado: string;
    empleado: {
        nombre_completo: string;
    };
}

interface HorasExtrasTableProps {
    horasExtras: HoraExtra[];
    onRowClick?: (id: number) => void;
}

export function HorasExtrasTable({ horasExtras, onRowClick }: HorasExtrasTableProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getTipoBadgeVariant = (tipo: string) => {
        switch (tipo) {
            case 'normal':
                return 'success';
            case 'nocturna':
                return 'secondary';
            case 'feriado':
                return 'warning';
            default:
                return 'secondary';
        }
    };

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

    if (!horasExtras || horasExtras.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-wise-gray">
                <svg className="h-12 w-12 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <p className="mt-2">No hay solicitudes de horas extras.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {horasExtras.map((he) => (
                    <TableRow key={he.id}>
                        <TableCell>#{he.id}</TableCell>
                        <TableCell className="font-medium">{he.empleado?.nombre_completo || 'N/A'}</TableCell>
                        <TableCell>{formatDate(he.fecha)}</TableCell>
                        <TableCell className="font-medium">{Number(he.cantidad_horas).toFixed(1)}h</TableCell>
                        <TableCell>
                            <Badge variant={getTipoBadgeVariant(he.tipo_hora)}>{he.tipo_hora_label}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getEstadoBadgeVariant(he.estado)}>
                                {he.estado.charAt(0).toUpperCase() + he.estado.slice(1)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button asChild size="sm" variant="ghost">
                                <Link href={route('horas-extras.show', he.id)}>
                                    Ver
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
