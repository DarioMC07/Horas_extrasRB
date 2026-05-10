import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { HorasExtrasTable } from '@/components/horasextras/HorasExtrasTable';
import { Filters } from '@/components/horasextras/Filters';
import { Button } from '@/components/ui/button';

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

export default function HorasExtrasIndex() {
    const { auth, horasExtras } = usePage<any>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const [filters, setFilters] = useState({
        estado: 'todos',
        fechaDesde: '',
        fechaHasta: '',
        busqueda: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredData = (horasExtras?.data || horasExtras || []).filter((he) => {
        if (filters.estado !== 'todos' && he.estado !== filters.estado) return false;
        if (filters.busqueda && !he.empleado?.nombre_completo?.toLowerCase().includes(filters.busqueda.toLowerCase())) return false;
        if (filters.fechaDesde && he.fecha < filters.fechaDesde) return false;
        if (filters.fechaHasta && he.fecha > filters.fechaHasta) return false;
        return true;
    });

    return (
        <AppLayout title="Horas Extras">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-wise-black">Horas Extras</h1>
                    <p className="text-sm text-wise-gray">Gestión de solicitudes de horas extras</p>
                </div>
                <Button asChild className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                    <Link href={route('horas-extras.create')}>
                        Nueva Solicitud
                    </Link>
                </Button>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <Filters filters={filters} onFilterChange={handleFilterChange} />
                    <HorasExtrasTable horasExtras={filteredData} />
                </div>
            </div>
        </AppLayout>
    );
}
