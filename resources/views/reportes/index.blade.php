@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Reportes y Análisis</h1>
        <p class="page-subtitle">Consulta y exportación de registros de horas extras</p>
    </div>
</div>

<div class="card">
    <form action="{{ route('reportes.index') }}" method="GET"
          style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">

        <div class="form-group" style="margin-bottom: 0; min-width: 160px;">
            <label for="mes">Período</label>
            <input type="month" id="mes" name="mes" value="{{ request('mes', date('Y-m')) }}">
        </div>

        <div class="form-group" style="margin-bottom: 0; min-width: 160px;">
            <label for="estado">Estado</label>
            <select name="estado" id="estado">
                <option value="">— Todos —</option>
                <option value="aprobado"  {{ request('estado') === 'aprobado'  ? 'selected' : '' }}>Aprobadas</option>
                <option value="pendiente" {{ request('estado') === 'pendiente' ? 'selected' : '' }}>Pendientes</option>
                <option value="rechazado" {{ request('estado') === 'rechazado' ? 'selected' : '' }}>Rechazadas</option>
            </select>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; padding-bottom: 0.05rem;">
            <button type="submit" class="btn btn-primary">Aplicar Filtros</button>
            <a href="{{ route('reportes.index') }}" class="btn btn-ghost">Limpiar</a>
        </div>

        <div style="margin-left: auto; padding-bottom: 0.05rem;">
            <a href="{{ route('reportes.exportar', request()->all()) }}" class="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Exportar a CSV
            </a>
        </div>
    </form>
</div>

<div class="card">
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Cédula / Cargo</th>
                    <th>Fecha</th>
                    <th>Horas</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Evaluado Por</th>
                </tr>
            </thead>
            <tbody>
                @forelse($horasExtras as $he)
                <tr>
                    <td><strong>{{ $he->empleado->nombre_completo ?? 'N/A' }}</strong></td>
                    <td>
                        <span class="text-sm" style="color: var(--color-muted);">
                            {{ $he->empleado->cedula ?? '' }}<br>
                            {{ $he->empleado->cargo ?? '' }}
                        </span>
                    </td>
                    <td>{{ $he->fecha->format('d/m/Y') }}</td>
                    <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                    <td><span class="text-sm">{{ $he->tipo_hora_label }}</span></td>
                    <td><span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span></td>
                    <td>
                        <span class="text-sm text-muted">
                            {{ $he->aprobado_por ? $he->aprobadoPor->name : '—' }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            <p>No hay datos para el criterio seleccionado.</p>
                        </div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $horasExtras->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
    </div>
</div>

@endsection
