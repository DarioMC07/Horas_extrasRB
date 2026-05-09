import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function UpdatePasswordForm() {
    const { data, setData, post, processing, errors } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current_password">Contraseña Actual</Label>
                <Input
                    id="current_password"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    required
                />
                {errors.current_password && <p className="text-xs text-wise-danger">{errors.current_password}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <p className="text-xs text-wise-danger">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    {errors.password_confirmation && <p className="text-xs text-wise-danger">{errors.password_confirmation}</p>}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
            </div>
        </form>
    );
}
