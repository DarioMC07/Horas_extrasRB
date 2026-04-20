@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Registrar Horas Extras</h1>
        <p class="page-subtitle">Complete el formulario para enviar una nueva solicitud</p>
    </div>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
        </svg>
        Regresar
    </a>
</div>

<div class="card" style="max-width: 640px; margin: 0 auto;">
    <form action="{{ route('horas-extras.store') }}" method="POST">
        @csrf

        @if(auth()->user()->isAdmin())
            <div class="form-group">
                <label for="empleado_id">
                    Empleado
                    <span style="color: var(--color-danger);">*</span>
                </label>
                <select name="empleado_id" id="empleado_id" required>
                    <option value="">— Seleccione un empleado —</option>
                    @foreach(\App\Models\Empleado::activos()->orderBy('apellido')->get() as $empl)
                        <option value="{{ $empl->id }}">{{ $empl->nombre_completo }}</option>
                    @endforeach
                </select>
                <p class="field-hint">Seleccione el empleado que ejecutó las horas extra.</p>
            </div>
        @endif

        <div class="form-group">
            <label for="turno_id">Turno de Trabajo <span class="text-muted text-xs">(Opcional)</span></label>
            <select name="turno_id" id="turno_id">
                <option value="">— Sin turno asignado —</option>
                @foreach($turnos as $turno)
                    <option value="{{ $turno->id }}">
                        {{ substr($turno->hora_inicio, 0, 5) }} — {{ substr($turno->hora_fin, 0, 5) }}
                        @if(auth()->user()->isAdmin()) · {{ $turno->empleado->nombre }} @endif
                    </option>
                @endforeach
            </select>
        </div>

        <hr class="card-divider">

        @if(auth()->user()->isAdmin())
            <div class="grid-cols-2">
                <div class="form-group">
                    <label for="fecha">
                        Fecha de Ejecución
                        <span style="color: var(--color-danger);">*</span>
                    </label>
                    <input type="date" name="fecha" id="fecha"
                           value="{{ date('Y-m-d') }}" required>
                </div>

                <div class="form-group">
                    <label for="tipo_hora">
                        Tipo de Tarifa
                        <span style="color: var(--color-danger);">*</span>
                    </label>
                    <select name="tipo_hora" id="tipo_hora" required>
                        <option value="normal">Normal (Diurna)</option>
                        <option value="nocturna">Nocturna</option>
                        <option value="feriado">Feriado o Fin de Semana</option>
                    </select>
                </div>
            </div>
        @else
            <div class="form-group">
                <label for="fecha">
                    Fecha de Ejecución
                    <span style="color: var(--color-danger);">*</span>
                </label>
                <input type="date" name="fecha" id="fecha"
                       value="{{ date('Y-m-d') }}" required>
                {{-- El tipo se asigna por defecto como "normal" --}}
                <input type="hidden" name="tipo_hora" value="normal">
            </div>
        @endif

        <div class="form-group">
            <label for="cantidad_horas">
                Cantidad de Horas
                <span style="color: var(--color-danger);">*</span>
            </label>
            <input type="number" name="cantidad_horas" id="cantidad_horas"
                   step="0.5" min="0.5" max="24"
                   placeholder="Ej: 2.5" required>
            <p class="field-hint">Ingrese la cantidad en intervalos de 0.5 horas (máx. 24h).</p>
        </div>

        <div class="form-group">
            <label for="motivo">
                Motivo o Justificación
                <span style="color: var(--color-danger);">*</span>
            </label>
            <textarea name="motivo" id="motivo" rows="4"
                      placeholder="Describa brevemente por qué son necesarias las horas extras..."
                      required></textarea>
        </div>

        <div style="margin-top: 1.75rem;">
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.7rem;">
                Enviar Solicitud
            </button>
            <p class="field-hint text-center mt-2">
                La solicitud quedará en estado <strong>Pendiente</strong> hasta la aprobación gerencial.
            </p>
        </div>
    </form>
</div>

@endsection
