import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { UpdateProfileForm } from '@/components/profile/UpdateProfileForm';
import { UpdatePasswordForm } from '@/components/profile/UpdatePasswordForm';
import { DeleteAccountForm } from '@/components/profile/DeleteAccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProfileEdit() {
    const { auth, user } = usePage<any>().props;

    return (
        <AppLayout title="Editar Perfil">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-wise-black">Editar Perfil</h1>
                <p className="text-sm text-wise-gray">Actualiza tu información personal</p>
            </div>

            <div className="space-y-6">
                <Card className="wise-card">
                    <CardHeader>
                        <CardTitle>Información del Perfil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileForm user={user} />
                    </CardContent>
                </Card>

                <Separator />

                <Card className="wise-card">
                    <CardHeader>
                        <CardTitle>Cambiar Contraseña</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UpdatePasswordForm />
                    </CardContent>
                </Card>

                <Separator />

                <Card className="wise-card border-wise-danger/30">
                    <CardHeader>
                        <CardTitle className="text-wise-danger">Zona de Peligro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DeleteAccountForm />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
