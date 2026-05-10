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
import { Pencil, Trash2 } from 'lucide-react';

interface Empleado {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    nombre_completo: string;
    cargo: string;
    departamento: string;
    telefono?: string;
    fecha_ingreso: string;
    activo: boolean;
}

interface EmpleadosTableProps {
    empleados: Empleado[];
    onDelete: (empleado: Empleado) => void;
}

export function EmpleadosTable({ empleados, onDelete }: EmpleadosTableProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (!empleados || empleados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-wise-gray">
                <svg className="h-12 w-12 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p className="mt-2">No hay empleados registrados.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {empleados.map((emp) => (
                    <TableRow key={emp.id}>
                        <TableCell>{emp.cedula}</TableCell>
                        <TableCell className="font-medium">{emp.nombre_completo}</TableCell>
                        <TableCell>{emp.cargo}</TableCell>
                        <TableCell>{emp.departamento}</TableCell>
                        <TableCell>{emp.telefono || '-'}</TableCell>
                        <TableCell>{formatDate(emp.fecha_ingreso)}</TableCell>
                        <TableCell>
                            <Badge variant={emp.activo ? 'success' : 'secondary'}>
                                {emp.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild size="sm" variant="ghost">
                                    <Link href={route('empleados.edit', emp.id)}>
                                        <Pencil size={16} />
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onDelete(emp)}
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
