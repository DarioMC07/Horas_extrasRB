import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UpdateProfileFormProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
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
                />
                {errors.email && <p className="text-xs text-wise-danger">{errors.email}</p>}
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    );
}
