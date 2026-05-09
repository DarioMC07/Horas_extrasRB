import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm({});

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('verification.send'));
    }

    return (
        <AuthLayout>
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-wise-black">Verifica tu Email</h1>
                <p className="mt-1 text-sm text-wise-gray">
                    Hemos enviado un enlace de verificación a tu correo electrónico.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-md bg-wise-mint p-3 text-sm text-wise-positive">
                    Se ha enviado un nuevo enlace de verificación a tu correo.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Button type="submit" className="w-full bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Enviando...' : 'Reenviar Enlace de Verificación'}
                </Button>
            </form>

            <div className="mt-4 text-center text-sm text-wise-gray">
                <Link href={route('logout')} method="post" className="text-wise-green hover:underline">
                    Cerrar Sesión
                </Link>
            </div>
        </AuthLayout>
    );
}
