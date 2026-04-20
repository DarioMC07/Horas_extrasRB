@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Solicitud #{{ $horasExtra->id }}</h1>
        <p class="page-subtitle">Detalle completo de la solicitud de horas extras</p>
    </div>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
        </svg>
        Regresar
    </a>
</div>

<div class="grid-cols-2">

    <!-- Información General -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">Información General</span>
        </div>
        <hr class="card-divider">

        <table style="border: none;">
            <tbody>
                <tr>
                    <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); width: 40%; font-size: 0.8125rem; font-weight: 600;">Empleado</td>
                    <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->empleado->nombre_completo ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); font-size: 0.8125rem; font-weight: 600;">Departamento</td>
                    <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->empleado->departamento ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); font-size: 0.8125rem; font-weight: 600;">Fecha de Ejecución</td>
                    <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->fecha->format('d/m/Y') }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); font-size: 0.8125rem; font-weight: 600;">Horas Solicitadas</td>
                    <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;"><strong>{{ $horasExtra->cantidad_horas }} horas</strong></td>
                </tr>
                <tr>
                    <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); font-size: 0.8125rem; font-weight: 600;">Tipo de Tarifa</td>
                    <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->tipo_hora_label }}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 1.25rem;">
            <p style="font-size: 0.8125rem; font-weight: 600; color: var(--color-muted); margin-bottom: 0.5rem;">
                Motivo o Justificación
            </p>
            <p style="background-color: var(--color-surface-2); padding: 0.875rem 1rem; border-radius: var(--radius-md);
                       font-size: 0.875rem; line-height: 1.6; border: 1px solid var(--color-border);">
                {{ $horasExtra->motivo }}
            </p>
        </div>
    </div>

    <!-- Estado de Aprobación -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">Estado de Aprobación</span>
            <span class="badge {{ $horasExtra->badge_class }}" style="font-size: 0.75rem;">
                {{ ucfirst($horasExtra->estado) }}
            </span>
        </div>
        <hr class="card-divider">

        @if($horasExtra->estado !== 'pendiente')
            <table style="border: none;">
                <tbody>
                    <tr>
                        <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); width: 45%; font-size: 0.8125rem; font-weight: 600;">Evaluado por</td>
                        <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->aprobadoPor->name ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td style="border: none; padding: 0.5rem 0; color: var(--color-muted); font-size: 0.8125rem; font-weight: 600;">Fecha de Decisión</td>
                        <td style="border: none; padding: 0.5rem 0; font-size: 0.875rem;">{{ $horasExtra->fecha_aprobacion->format('d/m/Y H:i') }}</td>
                    </tr>
                </tbody>
            </table>

            @if($horasExtra->observaciones_admin)
                <div style="margin-top: 1.25rem;">
                    <p style="font-size: 0.8125rem; font-weight: 600; color: var(--color-muted); margin-bottom: 0.5rem;">
                        Observaciones del Responsable
                    </p>
                    <p style="background-color: var(--color-danger-bg); padding: 0.875rem 1rem;
                               border-radius: var(--radius-md); font-size: 0.875rem; line-height: 1.6;
                               color: var(--color-danger); border: 1px solid rgba(220,38,38,0.15);">
                        {{ $horasExtra->observaciones_admin }}
                    </p>
                </div>
            @endif
        @else
            <p class="text-muted text-sm" style="padding: 0.5rem 0;">
                Esta solicitud aún no ha sido evaluada.
            </p>
        @endif

        @if(auth()->user()->isAdmin() && $horasExtra->estado === 'pendiente')
            <form action="{{ route('horas-extras.estado', $horasExtra->id) }}" method="POST"
                  style="margin-top: 1.5rem; background-color: var(--color-surface-2);
                         padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                @csrf
                @method('PATCH')

                <p style="font-size: 0.8125rem; font-weight: 700; color: var(--color-text); margin-bottom: 1rem;">
                    Acción Gerencial
                </p>

                <div class="form-group">
                    <label for="estado">Decisión</label>
                    <select name="estado" id="estado" required>
                        <option value="aprobado">Aprobar Solicitud</option>
                        <option value="rechazado">Rechazar Solicitud</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="observaciones_admin">Observaciones <span class="text-muted text-xs">(Opcional)</span></label>
                    <textarea name="observaciones_admin" id="observaciones_admin" rows="2"
                              placeholder="Indique el motivo en caso de rechazo..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Procesar Solicitud
                </button>
            </form>
        @endif

        @if(auth()->user()->isAdmin() || (auth()->user()->isEmpleado() && $horasExtra->estado === 'pendiente'))
            <form action="{{ route('horas-extras.destroy', $horasExtra->id) }}" method="POST"
                  style="margin-top: 1rem;"
                  onsubmit="return confirm('¿Está seguro de que desea eliminar esta solicitud? Esta acción no se puede deshacer.');">
                @csrf
                @method('DELETE')
                <button type="submit" class="btn btn-danger" style="width: 100%;">
                    Eliminar Registro
                </button>
            </form>
        @endif
    </div>

</div>
@endsection
