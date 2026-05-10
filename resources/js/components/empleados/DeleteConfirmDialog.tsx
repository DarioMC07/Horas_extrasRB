import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';

interface Empleado {
    id: number;
    nombre_completo: string;
}

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    empleado: Empleado | null;
}

export function DeleteConfirmDialog({ isOpen, onClose, empleado }: DeleteConfirmDialogProps) {
    const { delete: destroy, processing } = useForm();

    function handleConfirm() {
        if (!empleado) return;
        destroy(route('empleados.destroy', empleado.id), {
            onSuccess: () => {
                onClose();
            },
        });
    }

    if (!empleado) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>¿Eliminar empleado?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-wise-gray">
                    <span className="font-medium text-wise-black">{empleado.nombre_completo}</span> será marcado como inactivo.
                    Esta acción no se puede deshacer.
                </p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
