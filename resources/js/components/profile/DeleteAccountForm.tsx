import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

export function DeleteAccountForm() {
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();
    const { data, setData, errors } = useForm({
        password: '',
    });

    function handleConfirm() {
        destroy(route('profile.destroy'), {
            data: { password: data.password },
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    }

    return (
        <div className="space-y-2">
            <p className="text-sm text-wise-gray">
                Esta acción es permanente. Todos tus datos serán eliminados permanentemente.
            </p>
            <Button
                variant="destructive"
                onClick={() => setIsOpen(true)}
            >
                <AlertTriangle size={16} className="mr-2" />
                Eliminar mi cuenta
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>¿Eliminar cuenta?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-wise-gray">
                        Tu cuenta y todos tus datos serán eliminados permanentemente. Esta acción no se puede deshacer.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="password">Confirmar Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Ingresa tu contraseña"
                        />
                        {errors.password && <p className="text-xs text-wise-danger">{errors.password}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={processing}
                        >
                            {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
