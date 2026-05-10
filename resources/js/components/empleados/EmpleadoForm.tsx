import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface EmpleadoFormProps {
    empleado?: {
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
    onSuccess?: () => void;
}

export function EmpleadoForm({ empleado, onSuccess }: EmpleadoFormProps) {
    const isEditing = !!empleado;
    const { data, setData, post, put, processing, errors } = useForm({
        cedula: empleado?.cedula || '',
        nombre: empleado?.nombre || '',
        apellido: empleado?.apellido || '',
        cargo: empleado?.cargo || '',
        departamento: empleado?.departamento || '',
        telefono: empleado?.telefono || '',
        email: empleado?.email || '',
        fecha_ingreso: empleado?.fecha_ingreso || '',
        activo: empleado?.activo ?? true,
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isEditing) {
            put(route('empleados.update', empleado.id), {
                onSuccess,
            });
        } else {
            post(route('empleados.store'), {
                onSuccess,
            });
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                        id="cedula"
                        value={data.cedula}
                        onChange={(e) => setData('cedula', e.target.value)}
                        required
                    />
                    {errors.cedula && <p className="text-xs text-wise-danger">{errors.cedula}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                    <Input
                        id="fecha_ingreso"
                        type="date"
                        value={data.fecha_ingreso}
                        onChange={(e) => setData('fecha_ingreso', e.target.value)}
                        required
                    />
                    {errors.fecha_ingreso && <p className="text-xs text-wise-danger">{errors.fecha_ingreso}</p>}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                        id="nombre"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        required
                    />
                    {errors.nombre && <p className="text-xs text-wise-danger">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                        id="apellido"
                        value={data.apellido}
                        onChange={(e) => setData('apellido', e.target.value)}
                        required
                    />
                    {errors.apellido && <p className="text-xs text-wise-danger">{errors.apellido}</p>}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                        id="cargo"
                        value={data.cargo}
                        onChange={(e) => setData('cargo', e.target.value)}
                        required
                    />
                    {errors.cargo && <p className="text-xs text-wise-danger">{errors.cargo}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                        id="departamento"
                        value={data.departamento}
                        onChange={(e) => setData('departamento', e.target.value)}
                        required
                    />
                    {errors.departamento && <p className="text-xs text-wise-danger">{errors.departamento}</p>}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                        id="telefono"
                        type="tel"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="activo"
                    checked={data.activo}
                    onChange={(e) => setData('activo', e.target.checked)}
                    className="h-4 w-4 rounded border-wise-gray text-wise-green focus:ring-wise-green"
                />
                <Label htmlFor="activo" className="cursor-pointer">
                    Empleado Activo
                </Label>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
}
