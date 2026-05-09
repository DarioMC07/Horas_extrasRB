import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/components/layouts/AppLayout';
import { UsuariosTable } from '@/components/usuarios/UsuariosTable';
import { EditRolModal } from '@/components/usuarios/EditRolModal';
import { Badge } from '@/components/ui/badge';

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: string;
    ultimo_acceso?: string;
    empleado?: {
        nombre_completo: string;
    };
}

export default function UsuariosIndex() {
    const { usuarios, auth } = usePage<any>().props;
    const [editOpen, setEditOpen] = useState(false);
    const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);

    const currentUserId = auth?.user?.id;

    const handleEditRol = (usuario: Usuario) => {
        setUsuarioToEdit(usuario);
        setEditOpen(true);
    };

    return (
        <AppLayout title="Usuarios">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-wise-black">Usuarios</h1>
                <p className="text-sm text-wise-gray">Gestión de usuarios y roles del sistema</p>
            </div>

            <div className="wise-card">
                <div className="p-6">
                    <UsuariosTable usuarios={usuarios?.data || usuarios || []} onEditRol={handleEditRol} currentUserId={currentUserId} />
                </div>
            </div>

            <EditRolModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                usuario={usuarioToEdit}
            />
        </AppLayout>
    );
}
