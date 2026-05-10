import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface EditRolModalProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario | null;
}

export function EditRolModal({ isOpen, onClose, usuario }: EditRolModalProps) {
    const { data, setData, put, processing, errors } = useForm({
        role: usuario?.role || 'empleado',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!usuario) return;
        put(route('usuarios.update', usuario.id), {
            onSuccess: () => {
                onClose();
            },
        });
    }

    if (!usuario) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Usuario: {usuario.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="empleado">Empleado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-wise-green text-wise-black hover:bg-wise-green/90" disabled={processing}>
                            {processing ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
