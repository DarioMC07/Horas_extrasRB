import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('password.confirm'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Confirmar Contraseña</h1>
                <p className="mt-1 text-sm text-wise-gray">
                    Para continuar, por favor confirma tu contraseña.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-xs text-wise-danger">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Confirmando...' : 'Confirmar'}
                </Button>
            </form>
        </AuthLayout>
    );
}
