import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token?: string;
    email?: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('password.store'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Restablecer Contraseña</h1>
                <p className="mt-1 text-sm text-wise-gray">Ingresa tu nueva contraseña</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="token" value={data.token} />

                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        readonly
                        className="bg-wise-light"
                    />
                    {errors.email && <p className="text-xs text-wise-danger">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
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

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                    {errors.password_confirmation && (
                        <p className="text-xs text-wise-danger">{errors.password_confirmation}</p>
                    )}
                </div>

                <Button type="submit" className="w-full bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </Button>
            </form>
        </AuthLayout>
    );
}
