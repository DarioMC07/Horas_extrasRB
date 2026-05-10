import { useForm, usePage } from '@inertiajs/react';
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

interface HoraExtraFormProps {
    onSuccess?: () => void;
}

export function HoraExtraForm({ onSuccess }: HoraExtraFormProps) {
    const { auth } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        cantidad_horas: '',
        tipo_hora: 'normal',
        motivo: '',
        centro_costo: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('horas-extras.store'), {
            onSuccess,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                        id="fecha"
                        type="date"
                        value={data.fecha}
                        onChange={(e) => setData('fecha', e.target.value)}
                        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        required
                    />
                    {errors.fecha && <p className="text-xs text-wise-danger">{errors.fecha}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cantidad_horas">Cantidad de Horas</Label>
                    <Input
                        id="cantidad_horas"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="24"
                        value={data.cantidad_horas}
                        onChange={(e) => setData('cantidad_horas', e.target.value)}
                        placeholder="Ej: 2.5"
                        required
                    />
                    {errors.cantidad_horas && <p className="text-xs text-wise-danger">{errors.cantidad_horas}</p>}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="tipo_hora">Tipo de Hora</Label>
                    <Select value={data.tipo_hora} onValueChange={(v) => setData('tipo_hora', v)}>
                        <SelectTrigger id="tipo_hora">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="nocturna">Nocturna</SelectItem>
                            <SelectItem value="feriado">Feriado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                <Label htmlFor="motivo">Motivo</Label>
                <Textarea
                    id="motivo"
                    value={data.motivo}
                    onChange={(e) => setData('motivo', e.target.value)}
                    placeholder="Describe el motivo de las horas extras..."
                    required
                    minLength={10}
                    rows={3}
                />
                {errors.motivo && <p className="text-xs text-wise-danger">{errors.motivo}</p>}
            </div>

            {auth?.user?.role === 'admin' && (
                <div className="space-y-2">
                    <Label htmlFor="centro_costo">Centro de Costo (Opcional)</Label>
                    <Input
                        id="centro_costo"
                        type="text"
                        value={data.centro_costo}
                        onChange={(e) => setData('centro_costo', e.target.value)}
                        placeholder="Ej: Producción, Administración"
                    />
                </div>
            )}

            <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Solicitud'}
                </Button>
            </div>
        </form>
    );
}
