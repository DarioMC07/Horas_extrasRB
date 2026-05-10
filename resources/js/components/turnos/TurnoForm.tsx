import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Empleado {
    id: number;
    nombre_completo: string;
}

interface TurnoFormProps {
    empleados: Empleado[];
    turno?: {
        id: number;
        empleado_id: number;
        fecha: string;
        hora_inicio: string;
        hora_fin: string;
        tipo: string;
        observaciones?: string;
    };
    onSuccess?: () => void;
}

export function TurnoForm({ empleados, turno, onSuccess }: TurnoFormProps) {
    const isEditing = !!turno;
    const { data, setData, post, put, processing, errors } = useForm({
        empleado_id: turno?.empleado_id?.toString() || '',
        fecha: turno?.fecha || '',
        hora_inicio: turno?.hora_inicio || '',
        hora_fin: turno?.hora_fin || '',
        tipo: turno?.tipo || 'normal',
        observaciones: turno?.observaciones || '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isEditing) {
            put(route('turnos.update', turno.id), {
                onSuccess,
            });
        } else {
            post(route('turnos.store'), {
                onSuccess,
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="empleado_id">Empleado</Label>
                <Select value={data.empleado_id} onValueChange={(v) => setData('empleado_id', v)}>
                    <SelectTrigger id="empleado_id">
                        <SelectValue placeholder="Seleccionar empleado..." />
                    </SelectTrigger>
                    <SelectContent>
                        {empleados.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.nombre_completo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.empleado_id && <p className="text-xs text-wise-danger">{errors.empleado_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                    id="fecha"
                    type="date"
                    value={data.fecha}
                    onChange={(e) => setData('fecha', e.target.value)}
                    required
                />
                {errors.fecha && <p className="text-xs text-wise-danger">{errors.fecha}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="hora_inicio">Hora Inicio</Label>
                    <Input
                        id="hora_inicio"
                        type="time"
                        value={data.hora_inicio}
                        onChange={(e) => setData('hora_inicio', e.target.value)}
                        required
                    />
                    {errors.hora_inicio && <p className="text-xs text-wise-danger">{errors.hora_inicio}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hora_fin">Hora Fin</Label>
                    <Input
                        id="hora_fin"
                        type="time"
                        value={data.hora_fin}
                        onChange={(e) => setData('hora_fin', e.target.value)}
                        required
                    />
                    {errors.hora_fin && <p className="text-xs text-wise-danger">{errors.hora_fin}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={data.tipo} onValueChange={(v) => setData('tipo', v)}>
                    <SelectTrigger id="tipo">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="nocturno">Nocturno</SelectItem>
                        <SelectItem value="feriado">Feriado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                    id="observaciones"
                    value={data.observaciones}
                    onChange={(e) => setData('observaciones', e.target.value)}
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}
