import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface HoraExtra {
    id: number;
    fecha: string;
    cantidad_horas: number;
    tipo_hora: string;
    tipo_hora_label: string;
    estado: string;
    empleado: {
        nombre_completo: string;
        cedula: string;
        departamento: string;
    };
}

interface ReporteTableProps {
    horasExtras: HoraExtra[];
    totals: {
        totalHoras: number;
        totalRegistros: number;
    };
}

export function ReporteTable({ horasExtras, totals }: ReporteTableProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getEstadoBadgeVariant = (estado: string) => {
        switch (estado) {
            case 'aprobado':
                return 'success';
            case 'pendiente':
                return 'warning';
            case 'rechazado':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    if (!horasExtras || horasExtras.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-wise-gray">
                <p>No hay resultados para los filtros seleccionados.</p>
                <p className="mt-1 text-xs">Amplía el rango de fechas</p>
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {horasExtras.map((he) => (
                        <TableRow key={he.id}>
                            <TableCell className="font-medium">{he.empleado?.nombre_completo}</TableCell>
                            <TableCell>{he.empleado?.departamento}</TableCell>
                            <TableCell>{formatDate(he.fecha)}</TableCell>
                            <TableCell>{Number(he.cantidad_horas).toFixed(1)}h</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{he.tipo_hora_label}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getEstadoBadgeVariant(he.estado)}>
                                    {he.estado.charAt(0).toUpperCase() + he.estado.slice(1)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-end gap-8 border-t border-wise-light pt-4">
                <div className="text-right">
                    <p className="text-sm text-wise-gray">Total Horas</p>
                    <p className="text-lg font-bold text-wise-black">{Number(totals.totalHoras).toFixed(1)}h</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-wise-gray">Total Registros</p>
                    <p className="text-lg font-bold text-wise-black">{totals.totalRegistros}</p>
                </div>
            </div>
        </>
    );
}
