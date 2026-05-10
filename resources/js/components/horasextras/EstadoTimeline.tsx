import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
    estado: string;
    fecha: string;
    usuario?: string;
    comentario?: string;
}

interface EstadoTimelineProps {
    events: TimelineEvent[];
}

export function EstadoTimeline({ events }: EstadoTimelineProps) {
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-wise-warning text-wise-black';
            case 'pre-aprobado':
                return 'bg-blue-500 text-white';
            case 'aprobado':
                return 'bg-wise-green text-wise-black';
            case 'rechazado':
                return 'bg-wise-danger text-white';
            default:
                return 'bg-wise-gray text-white';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!events || events.length === 0) {
        return (
            <div className="py-4 text-center text-sm text-wise-gray">
                No hay cambios de estado registrados.
            </div>
        );
    }

    return (
        <div className="relative pl-6">
            <div className="absolute left-2 top-0 h-full w-0.5 bg-wise-light" />
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="relative">
                        <div className={`absolute -left-2 top-1 h-4 w-4 rounded-full ${getEstadoColor(event.estado)}`} />
                        <div className="pl-4">
                            <div className="flex items-center gap-2">
                                <Badge className={getEstadoColor(event.estado)}>
                                    {event.estado.charAt(0).toUpperCase() + event.estado.slice(1)}
                                </Badge>
                                <span className="text-xs text-wise-gray">
                                    {formatDate(event.fecha)}
                                </span>
                            </div>
                            {event.usuario && (
                                <p className="mt-1 text-xs text-wise-gray">
                                    Por: {event.usuario}
                                </p>
                            )}
                            {event.comentario && (
                                <p className="mt-1 text-sm text-wise-black">
                                    "{event.comentario}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
