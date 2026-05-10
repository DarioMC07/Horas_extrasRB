import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

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

interface UsuariosTableProps {
    usuarios: Usuario[];
    onEditRol: (usuario: Usuario) => void;
    currentUserId: number;
}

export function UsuariosTable({ usuarios, onEditRol, currentUserId }: UsuariosTableProps) {
    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'supervisor':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'supervisor':
                return 'Supervisor';
            default:
                return 'Empleado';
        }
    };

    if (!usuarios || usuarios.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-wise-gray">
                <p>No hay usuarios registrados.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Empleado Asociado</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.name}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                            <Badge variant={getRoleBadgeVariant(usuario.role)}>
                                {getRoleLabel(usuario.role)}
                            </Badge>
                        </TableCell>
                        <TableCell>{usuario.empleado?.nombre_completo || 'Sin asociar'}</TableCell>
                        <TableCell>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEditRol(usuario)}
                                disabled={usuario.id === currentUserId}
                            >
                                <Settings size={16} />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
