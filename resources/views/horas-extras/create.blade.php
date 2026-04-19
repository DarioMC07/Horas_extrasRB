@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Registrar Horas Extras</h1>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-secondary">Regresar</a>
</div>

<div class="card" style="max-width: 600px; margin: 0 auto;">
    <form action="{{ route('horas-extras.store') }}" method="POST">
        @csrf

        @if(auth()->user()->isAdmin())
            <div class="form-group">
                <label for="empleado_id">Empleado <span style="color: var(--color-danger);">*</span></label>
                <select name="empleado_id" id="empleado_id" required>
                    <option value="">-- Seleccione un Empleado --</option>
                    @foreach(\App\Models\Empleado::activos()->orderBy('apellido')->get() as $empl)
                        <option value="{{ $empl->id }}">{{ $empl->nombre_completo }}</option>
                    @endforeach
                </select>
                <small style="color: var(--color-muted);">Seleccione el empleado que realizará las horas extra.</small>
            </div>
        @endif

        <div class="form-group">
            <label for="turno_id">Turno de Trabajo (Opcional)</label>
            <select name="turno_id" id="turno_id">
                <option value="">-- Sin turno asignado --</option>
                @foreach($turnos as $turno)
                    <option value="{{ $turno->id }}">
                        {{ $turno->fecha->format('Y-m-d') }} | {{ $turno->hora_inicio }} a {{ $turno->hora_fin }} 
                        @if(auth()->user()->isAdmin()) ({{ $turno->empleado->nombre }}) @endif
                    </option>
                @endforeach
            </select>
        </div>

        <div class="grid-cols-2">
            <div class="form-group">
                <label for="fecha">Fecha de Ejecución <span style="color: var(--color-danger);">*</span></label>
                <input type="date" name="fecha" id="fecha" value="{{ date('Y-m-d') }}" required>
            </div>
            
            <div class="form-group">
                <label for="tipo_hora">Tipo de Tarifa <span style="color: var(--color-danger);">*</span></label>
                <select name="tipo_hora" id="tipo_hora" required>
                    <option value="normal">Normal (Diurna)</option>
                    <option value="nocturna">Nocturna</option>
                    <option value="feriado">Feriado o Fin de Semana</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="cantidad_horas">Cantidad de Horas <span style="color: var(--color-danger);">*</span></label>
            <input type="number" name="cantidad_horas" id="cantidad_horas" step="0.5" min="0.5" max="24" placeholder="Ej: 2.5" required>
        </div>

        <div class="form-group">
            <label for="motivo">Motivo o Justificación <span style="color: var(--color-danger);">*</span></label>
            <textarea name="motivo" id="motivo" rows="4" placeholder="Explique brevemente por qué son necesarias las horas extras..." required></textarea>
        </div>

        <div style="margin-top: 2rem;">
            <button type="submit" class="btn btn-primary" style="width: 100%;">Registrar Solicitud (Enviará a pendiente)</button>
        </div>
    </form>
</div>
@endsection
