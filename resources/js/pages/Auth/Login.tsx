import { useForm } from '@inertiajs/react';
import { FormEvent, type ReactNode } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginProps {
    canResetPassword?: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('login'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Bienvenido</h1>
                <p className="mt-1 text-sm text-wise-gray">Ingrese sus credenciales para continuar</p>
            </div>

            {status && (
                <div className="mb-4 rounded-md bg-wise-mint p-3 text-sm text-wise-positive">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.email && (
                    <div className="rounded-md bg-wise-danger/10 p-3 text-sm text-wise-danger">
                        Credenciales incorrectas. Intente nuevamente.
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autofocus
                        placeholder="correo@rosabetania.com"
                    />
                    {errors.email && (
                        <p className="text-xs text-wise-danger">{errors.email}</p>
                    )}
                </div>

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
                    {errors.password && (
                        <p className="text-xs text-wise-danger">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-wise-gray text-wise-green focus:ring-wise-green"
                    />
                    <Label htmlFor="remember" className="cursor-pointer font-medium text-wise-gray">
                        Recordar sesión
                    </Label>
                </div>

                <Button type="submit" className="w-full bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Ingresando...' : 'Ingresar al Sistema'}
                </Button>

                {canResetPassword && (
                    <div className="text-center">
                        <a href={route('password.request')} className="text-sm text-wise-green hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
