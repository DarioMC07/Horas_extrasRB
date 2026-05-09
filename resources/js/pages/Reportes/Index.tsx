import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { FiltrosReporte } from '@/components/reportes/FiltrosReporte';
import { ReporteTable } from '@/components/reportes/ReporteTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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

interface ReporteIndexProps {
    horasExtras: HoraExtra[];
    filters: {
        fechaDesde: string;
        fechaHasta: string;
        empleado: string;
        estado: string;
    };
    totals: {
        totalHoras: number;
        totalRegistros: number;
    };
}

export default function ReportesIndex() {
    const { horasExtras, filters, totals } = usePage<any>().props as ReporteIndexProps;
    const [localFilters, setLocalFilters] = useState(filters);

    return (
        <AppLayout title="Reportes">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-wise-black">Reportes</h1>
                    <p className="text-sm text-wise-gray">Reporte de horas extras con filtros avanzados</p>
                </div>
                <Button
                    asChild
                    variant="outline"
                    className="border-wise-green text-wise-green hover:bg-wise-green hover:text-wise-black"
                >
                    <a href={route('reportes.exportar', localFilters)}>
                        <Download size={16} className="mr-2" />
                        Exportar CSV
                    </a>
                </Button>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <FiltrosReporte filters={localFilters} onFilterChange={setLocalFilters} />
                    <ReporteTable horasExtras={horasExtras?.data || horasExtras || []} totals={totals} />
                </div>
            </div>
        </AppLayout>
    );
}
