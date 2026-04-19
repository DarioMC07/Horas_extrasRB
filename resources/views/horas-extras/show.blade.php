@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Detalles de Solicitud #{{ $horasExtra->id }}</h1>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-secondary">Regresar</a>
</div>

<div class="grid-cols-2">
    <div class="card">
        <h3>Información General</h3>
        <hr style="border-color: var(--color-border); margin: 1rem 0;">
        
        <p><strong>Empleado:</strong> {{ $horasExtra->empleado->nombre_completo ?? 'N/A' }}</p>
        <p><strong>Departamento:</strong> {{ $horasExtra->empleado->departamento ?? 'N/A' }}</p>
        <p><strong>Fecha Ejecución:</strong> {{ $horasExtra->fecha->format('Y-m-d') }}</p>
        <p><strong>Horas Solicitadas:</strong> {{ $horasExtra->cantidad_horas }} horas</p>
        <p><strong>Tipo Tarifa:</strong> {{ $horasExtra->tipo_hora_label }}</p>
        
        <div style="margin-top: 1rem;">
            <strong>Motivo:</strong>
            <p style="background-color: var(--color-bg); padding: 1rem; border-radius: var(--radius-md); margin-top: 0.5rem;">
                {{ $horasExtra->motivo }}
            </p>
        </div>
    </div>

    <div class="card">
        <h3>Estado de Aprobación</h3>
        <hr style="border-color: var(--color-border); margin: 1rem 0;">
        
        <div style="margin-bottom: 2rem;">
            Actual: <span class="badge {{ $horasExtra->badge_class }}" style="font-size: 1rem;">{{ ucfirst($horasExtra->estado) }}</span>
        </div>

        @if($horasExtra->estado !== 'pendiente')
            <p><strong>Evaluado Por:</strong> {{ $horasExtra->aprobadoPor->name ?? 'N/A' }}</p>
            <p><strong>Fecha Decisión:</strong> {{ $horasExtra->fecha_aprobacion->format('Y-m-d H:i') }}</p>
            @if($horasExtra->observaciones_admin)
                <div style="margin-top: 1rem;">
                    <strong>Observaciones:</strong>
                    <p style="background-color: var(--color-bg); padding: 1rem; border-radius: var(--radius-md); margin-top: 0.5rem; color: var(--color-danger);">
                        {{ $horasExtra->observaciones_admin }}
                    </p>
                </div>
            @endif
        @endif

        @if(auth()->user()->isAdmin() && $horasExtra->estado === 'pendiente')
            <form action="{{ route('horas-extras.estado', $horasExtra->id) }}" method="POST" style="margin-top: 1.5rem; background-color: var(--color-bg); padding: 1rem; border-radius: var(--radius-md);">
                @csrf
                @method('PATCH')
                
                <div class="form-group">
                    <label for="estado">Acción de Gerencia</label>
                    <select name="estado" id="estado" required>
                        <option value="aprobado">Aprobar Solicitud</option>
                        <option value="rechazado">Rechazar Solicitud</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="observaciones_admin">Observaciones / Motivo de Rechazo (Opcional)</label>
                    <textarea name="observaciones_admin" id="observaciones_admin" rows="2"></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%;">Procesar Solicitud</button>
            </form>
        @endif
        
        @if(auth()->user()->isAdmin() || (auth()->user()->isEmpleado() && $horasExtra->estado === 'pendiente'))
            <form action="{{ route('horas-extras.destroy', $horasExtra->id) }}" method="POST" style="margin-top: 1rem; text-align: center;" onsubmit="return confirm('¿Seguro que deseas eliminar esta solicitud por completo?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger" style="width: 100%;">Borrar Registro</button>
            </form>
        @endif
    </div>
</div>
@endsection
