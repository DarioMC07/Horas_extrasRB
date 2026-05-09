import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { TurnosTable } from '@/components/turnos/TurnosTable';
import { TurnoForm } from '@/components/turnos/TurnoForm';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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

export default function TurnosIndex() {
    const { turnos, empleados } = usePage<any>().props;
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <AppLayout title="Turnos">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-wise-black">Turnos</h1>
                    <p className="text-sm text-wise-gray">Gestión de turnos de trabajo</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                    Nuevo Turno
                </Button>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <TurnosTable turnos={turnos?.data || turnos || []} />
                </div>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nuevo Turno</DialogTitle>
                    </DialogHeader>
                    <TurnoForm empleados={empleados} onSuccess={() => setCreateOpen(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
