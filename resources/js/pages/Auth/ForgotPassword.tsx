import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Link } from '@inertiajs/react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('password.email'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Recuperar Contraseña</h1>
                <p className="mt-1 text-sm text-wise-gray">
                    ¿Olvidaste tu contraseña? Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-md bg-wise-mint p-3 text-sm text-wise-positive">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {errors.email && <p className="text-xs text-wise-danger">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </Button>

                <div className="text-center text-sm text-wise-gray">
                    <Link href={route('login')} className="text-wise-green hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
