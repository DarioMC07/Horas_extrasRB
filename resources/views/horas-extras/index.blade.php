@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Horas Extras</h1>
    <a href="{{ route('horas-extras.create') }}" class="btn btn-primary">Registrar Nueva Solicitud</a>
</div>

<div class="card">
    <form method="GET" action="{{ route('horas-extras.index') }}" style="margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: flex-end;">
        <div style="flex: 1;">
            <label for="estado">Filtrar por Estado</label>
            <select name="estado" id="estado" onchange="this.form.submit()">
                <option value="">-- Todos --</option>
                <option value="pendiente" {{ request('estado') === 'pendiente' ? 'selected' : '' }}>Pendientes</option>
                <option value="aprobado" {{ request('estado') === 'aprobado' ? 'selected' : '' }}>Aprobadas</option>
                <option value="rechazado" {{ request('estado') === 'rechazado' ? 'selected' : '' }}>Rechazadas</option>
            </select>
        </div>
        <div style="flex: 2;"></div> <!-- spacer -->
    </form>

    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    @if(auth()->user()->isAdmin())
                        <th>Empleado</th>
                    @endif
                    <th>Turno Relacionado</th>
                    <th>Horas</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Aprobador</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                @forelse($horasExtras as $he)
                <tr>
                    <td>{{ $he->fecha->format('Y-m-d') }}</td>
                    @if(auth()->user()->isAdmin())
                        <td>{{ $he->empleado->nombre_completo ?? 'N/A' }}</td>
                    @endif
                    <td>
                        @if($he->turno)
                            {{ $he->turno->hora_inicio }} - {{ $he->turno->hora_fin }}
                        @else
                            <span style="color: var(--color-muted);">Sin turno</span>
                        @endif
                    </td>
                    <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                    <td>{{ $he->tipo_hora_label }}</td>
                    <td><span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span></td>
                    <td>{{ $he->aprobado_por ? $he->aprobadoPor->name : '-' }}</td>
                    <td>
                        <a href="{{ route('horas-extras.show', $he->id) }}" class="btn btn-secondary">Detalles</a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="{{ auth()->user()->isAdmin() ? 8 : 7 }}" style="text-align: center; padding: 2rem;">No se encontraron registros.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 1rem;">
        {{ $horasExtras->links('pagination::bootstrap-4') }}
    </div>
</div>
@endsection
