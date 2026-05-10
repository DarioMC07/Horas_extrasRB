import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FiltrosReporteProps {
    filters: {
        fechaDesde: string;
        fechaHasta: string;
        empleado: string;
        estado: string;
    };
    onFilterChange: (filters: any) => void;
}

export function FiltrosReporte({ filters, onFilterChange }: FiltrosReporteProps) {
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onFilterChange(filters);
        }} className="mb-6 flex flex-wrap items-end gap-4">
            <div className="w-40 space-y-1">
                <Label htmlFor="fechaDesde" className="text-xs">Fecha Desde</Label>
                <Input
                    id="fechaDesde"
                    type="date"
                    value={filters.fechaDesde}
                    onChange={(e) => onFilterChange({ ...filters, fechaDesde: e.target.value })}
                />
            </div>

            <div className="w-40 space-y-1">
                <Label htmlFor="fechaHasta" className="text-xs">Fecha Hasta</Label>
                <Input
                    id="fechaHasta"
                    type="date"
                    value={filters.fechaHasta}
                    onChange={(e) => onFilterChange({ ...filters, fechaHasta: e.target.value })}
                />
            </div>

            <div className="w-40 space-y-1">
                <Label htmlFor="estado" className="text-xs">Estado</Label>
                <Select value={filters.estado} onValueChange={(v) => onFilterChange({ ...filters, estado: v })}>
                    <SelectTrigger id="estado">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="aprobado">Aprobado</SelectItem>
                        <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90">
                    Aplicar Filtros
                </Button>
            </div>
        </form>
    );
}
