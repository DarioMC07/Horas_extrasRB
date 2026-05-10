import { usePage, Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { EmpleadoForm } from '@/components/empleados/EmpleadoForm';

interface EditEmpleadoProps {
    empleado: {
        id: number;
        cedula: string;
        nombre: string;
        apellido: string;
        cargo: string;
        departamento: string;
        telefono?: string;
        email?: string;
        fecha_ingreso: string;
        activo: boolean;
    };
}

export default function EditEmpleado({ empleado }: EditEmpleadoProps) {
    return (
        <AppLayout title="Editar Empleado">
            <div className="mb-6 flex items-center gap-4">
                <Link href={route('empleados.index')} className="text-wise-gray hover:text-wise-black">
                    ← Volver
                </Link>
                <h1 className="text-2xl font-bold text-wise-black">Editar Empleado</h1>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <EmpleadoForm empleado={empleado} onSuccess={() => router.get(route('empleados.index'))} />
                </div>
            </div>
        </AppLayout>
    );
}
