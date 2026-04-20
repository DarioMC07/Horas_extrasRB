@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Horas Extras</h1>
        <p class="page-subtitle">Registro y seguimiento de solicitudes</p>
    </div>
    @if(!auth()->user()->isAdmin())
        <a href="{{ route('horas-extras.create') }}" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Registrar Nueva Solicitud
        </a>
    @endif
</div>

<div class="card">
    <form method="GET" action="{{ route('horas-extras.index') }}"
          style="display: flex; gap: 1rem; align-items: flex-end; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <div style="min-width: 180px;">
            <label for="estado">Filtrar por Estado</label>
            <select name="estado" id="estado" onchange="this.form.submit()">
                <option value="">— Todos los estados —</option>
                <option value="pendiente" {{ request('estado') === 'pendiente' ? 'selected' : '' }}>Pendientes</option>
                <option value="aprobado"  {{ request('estado') === 'aprobado'  ? 'selected' : '' }}>Aprobadas</option>
                <option value="rechazado" {{ request('estado') === 'rechazado' ? 'selected' : '' }}>Rechazadas</option>
            </select>
        </div>

        @if(request('estado'))
            <a href="{{ route('horas-extras.index') }}" class="btn btn-ghost" style="align-self: flex-end;">
                Limpiar filtro
            </a>
        @endif
    </form>

    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    @if(auth()->user()->isAdmin())
                        <th>Empleado</th>
                    @endif
                    <th>Turno</th>
                    <th>Horas</th>
                    <th>Estado</th>
                    <th>Aprobador</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse($horasExtras as $he)
                <tr>
                    <td>{{ $he->fecha->format('d/m/Y') }}</td>
                    @if(auth()->user()->isAdmin())
                        <td><strong>{{ $he->empleado->nombre_completo ?? 'N/A' }}</strong></td>
                    @endif
                    <td>
                        @if($he->turno)
                            <span style="font-size: 0.8rem;">
                                {{ $he->turno->hora_inicio }} — {{ $he->turno->hora_fin }}
                            </span>
                        @else
                            <span class="text-muted text-xs">Sin turno</span>
                        @endif
                    </td>
                    <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                    <td><span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span></td>
                    <td>
                        <span class="text-muted text-sm">
                            {{ $he->aprobado_por ? $he->aprobadoPor->name : '—' }}
                        </span>
                    </td>
                    <td>
                        <a href="{{ route('horas-extras.show', $he->id) }}" class="btn btn-sm btn-secondary">
                            Detalles
                        </a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="{{ auth()->user()->isAdmin() ? 8 : 7 }}">
                        <div class="empty-state">
                            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <p>No se encontraron registros.</p>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $horasExtras->links('pagination::bootstrap-4') }}
    </div>
</div>

@endsection
