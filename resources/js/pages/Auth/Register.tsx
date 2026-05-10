import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Link } from '@inertiajs/react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('register'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Crear Cuenta</h1>
                <p className="mt-1 text-sm text-wise-gray">Ingrese sus datos para registrarse</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autofocus
                        placeholder="Juan Pérez"
                    />
                    {errors.name && <p className="text-xs text-wise-danger">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="correo@rosabetania.com"
                    />
                    {errors.email && <p className="text-xs text-wise-danger">{errors.email}</p>}
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
                    {processing ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>

                <div className="text-center text-sm text-wise-gray">
                    ¿Ya tienes cuenta?{' '}
                    <Link href={route('login')} className="text-wise-green hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
