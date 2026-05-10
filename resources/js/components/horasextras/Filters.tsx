import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface FiltersProps {
    filters: {
        estado: string;
        fechaDesde: string;
        fechaHasta: string;
        busqueda: string;
    };
    onFilterChange: (key: string, value: string) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
    return (
        <div className="mb-4 flex flex-wrap gap-4">
            <div className="w-40">
                <Label htmlFor="estado" className="text-xs text-wise-gray">Estado</Label>
                <Select value={filters.estado} onValueChange={(v) => onFilterChange('estado', v)}>
                    <SelectTrigger id="estado">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="pre-aprobado">Pre-aprobada</SelectItem>
                        <SelectItem value="aprobado">Aprobada</SelectItem>
                        <SelectItem value="rechazado">Rechazada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-40">
                <Label htmlFor="fechaDesde" className="text-xs text-wise-gray">Desde</Label>
                <Input
                    id="fechaDesde"
                    type="date"
                    value={filters.fechaDesde}
                    onChange={(e) => onFilterChange('fechaDesde', e.target.value)}
                />
            </div>

            <div className="w-40">
                <Label htmlFor="fechaHasta" className="text-xs text-wise-gray">Hasta</Label>
                <Input
                    id="fechaHasta"
                    type="date"
                    value={filters.fechaHasta}
                    onChange={(e) => onFilterChange('fechaHasta', e.target.value)}
                />
            </div>

            <div className="flex-1">
                <Label htmlFor="busqueda" className="text-xs text-wise-gray">Buscar</Label>
                <Input
                    id="busqueda"
                    type="text"
                    placeholder="Buscar por empleado..."
                    value={filters.busqueda}
                    onChange={(e) => onFilterChange('busqueda', e.target.value)}
                />
            </div>
        </div>
    );
}
