import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface RechazoModalProps {
    isOpen: boolean;
    onClose: () => void;
    horaExtraId: number;
}

export function RechazoModal({ isOpen, onClose, horaExtraId }: RechazoModalProps) {
    const { data, setData, post, patch, processing, errors } = useForm({
        comentario: '',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        patch(route('horas-extras.estado', horaExtraId), {
            data: { estado: 'rechazado', comentario: data.comentario },
            onSuccess: () => {
                setData('comentario', '');
                onClose();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rechazar Solicitud</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="comentario">Motivo del Rechazo</Label>
                        <Textarea
                            id="comentario"
                            value={data.comentario}
                            onChange={(e) => setData('comentario', e.target.value)}
                            placeholder="Explica el motivo del rechazo..."
                            required
                            rows={4}
                        />
                        {errors.comentario && (
                            <p className="text-xs text-wise-danger">{errors.comentario}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing}>
                            {processing ? 'Rechazando...' : 'Confirmar Rechazo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
