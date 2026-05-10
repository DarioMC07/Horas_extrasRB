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
import { Pencil, Trash2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Turno {
    id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    tipo: string;
    observaciones?: string;
    empleado: {
        id: number;
        nombre_completo: string;
    };
}

interface TurnosTableProps {
    turnos: Turno[];
}

export function TurnosTable({ turnos }: TurnosTableProps) {
    const { delete: destroy } = useForm();

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
            case 'nocturno':
                return 'secondary';
            case 'feriado':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const handleDelete = (turnoId: number) => {
        if (confirm('¿Está seguro de eliminar este turno?')) {
            destroy(route('turnos.destroy', turnoId));
        }
    };

    if (!turnos || turnos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-wise-gray">
                <svg className="h-12 w-12 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="mt-2">No hay turnos registrados.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {turnos.map((turno) => (
                    <TableRow key={turno.id}>
                        <TableCell>{formatDate(turno.fecha)}</TableCell>
                        <TableCell className="font-medium">{turno.empleado?.nombre_completo}</TableCell>
                        <TableCell>{turno.hora_inicio}</TableCell>
                        <TableCell>{turno.hora_fin}</TableCell>
                        <TableCell>
                            <Badge variant={getTipoBadgeVariant(turno.tipo)}>
                                {turno.tipo.charAt(0).toUpperCase() + turno.tipo.slice(1)}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-wise-gray">
                            {turno.observaciones || '-'}
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(turno.id)}
                                    className="text-wise-danger hover:text-wise-danger"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
