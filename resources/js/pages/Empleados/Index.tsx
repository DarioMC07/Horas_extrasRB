import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { EmpleadosTable } from '@/components/empleados/EmpleadosTable';
import { EmpleadoForm } from '@/components/empleados/EmpleadoForm';
import { DeleteConfirmDialog } from '@/components/empleados/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

export default function EmpleadosIndex() {
    const { empleados } = usePage<any>().props;
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [empleadoToDelete, setEmpleadoToDelete] = useState<Empleado | null>(null);

    const handleDelete = (empleado: Empleado) => {
        setEmpleadoToDelete(empleado);
        setDeleteOpen(true);
    };

    return (
        <AppLayout title="Empleados">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-wise-black">Empleados</h1>
                    <p className="text-sm text-wise-gray">Gestión de empleados registrados</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                    Nuevo Empleado
                </Button>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <EmpleadosTable empleados={empleados?.data || empleados || []} onDelete={handleDelete} />
                </div>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nuevo Empleado</DialogTitle>
                    </DialogHeader>
                    <EmpleadoForm onSuccess={() => setCreateOpen(false)} />
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                empleado={empleadoToDelete}
            />
        </AppLayout>
    );
}
