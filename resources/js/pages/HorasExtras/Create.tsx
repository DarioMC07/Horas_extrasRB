import { router } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { HoraExtraForm } from '@/components/horasextras/HoraExtraForm';

export default function HorasExtrasCreate() {
    function handleSuccess() {
        router.get(route('horas-extras.index'));
    }

    return (
        <AppLayout title="Nueva Solicitud">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-wise-black">Nueva Solicitud de Horas Extras</h1>
                <p className="text-sm text-wise-gray">Completa el formulario para registrar tus horas extras</p>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <HoraExtraForm onSuccess={handleSuccess} />
                </div>
            </div>
        </AppLayout>
    );
}
